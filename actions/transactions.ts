'use server';

import { jaroWinkler, preprocessText } from '@/lib/stringComparison';
import { prisma } from '@/lib/prisma';
import type {
  SimpleTransaction,
  CSVTransaction,
  TempAddTransaction,
  TempEditTransaction,
  TempUnmatchedTransaction,
} from '@/types/transactions';

type TransactionTempId = CSVTransaction & {
  tempId: number;
};

type ProcessTransactionsResponse = { status: 'success' } | { status: 'error'; message: string };

export const processTransactions = async (file: File): Promise<ProcessTransactionsResponse> => {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const text = buffer.toString('utf-8');

    const userSettings = await prisma.userSettings.findFirst();
    if (!userSettings) return { status: 'error', message: 'User settings not found' };

    const firstRow = text.split('\n')[0].trim().split(',');
    const dateColumn =
      userSettings.dateColumnIndex ??
      firstRow.findIndex((column) => column.toLowerCase() === 'date');
    const amountColumn =
      userSettings.amountColumnIndex ??
      firstRow.findIndex((column) => column.toLowerCase() === 'amount');
    const descriptionColumn =
      userSettings.descriptionColumnIndex ??
      firstRow.findIndex((column) => column.toLowerCase() === 'description');

    if (dateColumn === -1 || amountColumn === -1 || descriptionColumn === -1) {
      return { status: 'error', message: 'Date, amount, or description column not found' };
    }

    if (text.split('\n').length < 2) {
      return { status: 'error', message: 'No transactions found' };
    }

    const uploadedCSVTransactions: CSVTransaction[] = text
      .split('\n')
      .slice(1)
      .filter((line) => line.trim() !== '')
      .map((line, index) => {
        try {
          const transaction = line.split(',');

          if (
            transaction[dateColumn] === undefined ||
            transaction[amountColumn] === undefined ||
            transaction[descriptionColumn] === undefined
          ) {
            throw new Error(`Missing required column in row ${index + 2}`);
          }

          const date = new Date(transaction[dateColumn].trim());
          if (isNaN(date.getTime())) {
            throw new Error(
              `Invalid date format in row ${index + 2}: "${transaction[dateColumn]}"`
            );
          }

          const amount = Number(transaction[amountColumn].trim().replace(/[^0-9.-]+/g, ''));
          if (isNaN(amount)) {
            throw new Error(`Invalid amount in row ${index + 2}: "${transaction[amountColumn]}"`);
          }

          const description = transaction[descriptionColumn].trim();
          return { date, amount, description };
        } catch (error) {
          const message = error instanceof Error ? error.message : `Error in row ${index + 2}`;
          throw new Error(message);
        }
      });

    const newTransactions: TempAddTransaction[] = [];
    const changedTransactions: TempEditTransaction[] = [];
    const unmatchedTransactions: TempUnmatchedTransaction[] = [];

    // Get saved transactions
    const currentTransactions: SimpleTransaction[] = await prisma.transaction.findMany({
      orderBy: {
        date: 'desc',
      },
      select: {
        id: true,
        amount: true,
        description: true,
        date: true,
      },
    });

    if (currentTransactions.length !== 0) {
      const csvTransactions: TransactionTempId[] = uploadedCSVTransactions.map(
        (transaction, index) => {
          return {
            ...transaction,
            tempId: index,
          };
        }
      );

      // Cutoff date for possible pending transactions
      const pendingTransactionCutoffDate = new Date(
        currentTransactions[0].date.getTime() - userSettings.pendingDaysBuffer * 24 * 60 * 60 * 1000
      );

      // Create a key for each transaction
      const createKey = (transaction: SimpleTransaction | TransactionTempId) =>
        `${transaction.description}|${transaction.amount}|${transaction.date.getTime()}`;

      // Create a map of all existing transactions for O(1) lookup (Duplicate transactions are included)
      const transactionsMap = new Map<string, number>();
      for (const transaction of currentTransactions) {
        const key = createKey(transaction);
        if (transactionsMap.has(key)) {
          transactionsMap.set(key, transactionsMap.get(key)! + 1);
        } else {
          transactionsMap.set(key, 1);
        }
      }

      // Get all transactions before the pending cutoff date
      const csvTransactionsPriorPending = csvTransactions.filter(
        (transaction) => transaction.date.getTime() < pendingTransactionCutoffDate.getTime()
      );

      // Mark a transaction as new if not found in the transactions map
      for (const transaction of csvTransactionsPriorPending) {
        const numInstances = transactionsMap.get(createKey(transaction));
        if (numInstances !== undefined && numInstances > 0) {
          transactionsMap.set(createKey(transaction), numInstances - 1);
        } else {
          newTransactions.push(transaction);
        }
      }

      // Get all transactions that were possibly recorded as pending
      const possiblePendingTransactions = currentTransactions.filter(
        (transaction) => transaction.date.getTime() >= pendingTransactionCutoffDate.getTime()
      );

      // Get all transactions after the pending cutoff date
      const csvTransactionsAfterPending = csvTransactions.filter(
        (transaction) => transaction.date.getTime() >= pendingTransactionCutoffDate.getTime()
      );

      // List of temp transaction IDs used to know if they've been matched to an existing transaction
      const foundIds: number[] = [];

      // Link existing possible pending transactions to transactions uploaded in the CSV
      for (const transaction of possiblePendingTransactions) {
        let isMatched = false;

        // Get transactions after the pending cutoff date that are within the pending days check
        const checkTransactions = csvTransactionsAfterPending.filter(
          (csvTransaction) =>
            csvTransaction.date.getTime() <
              transaction.date.getTime() + userSettings.pendingDaysBuffer * 24 * 60 * 60 * 1000 &&
            !foundIds.includes(csvTransaction.tempId)
        );

        // Initial check for exact match
        for (const checkTransaction of checkTransactions) {
          if (
            checkTransaction.description === transaction.description &&
            checkTransaction.amount === transaction.amount &&
            checkTransaction.date.getTime() === transaction.date.getTime()
          ) {
            isMatched = true;
            foundIds.push(checkTransaction.tempId);
            break;
          }
        }

        // If no match, check for exact amount match + fuzzy description match
        if (!isMatched) {
          for (const checkTransaction of checkTransactions) {
            if (checkTransaction.amount !== transaction.amount) continue;

            const checkTransactionDescription = preprocessText(checkTransaction.description);
            const transactionDescription = preprocessText(transaction.description);

            const jaroWinklerDistance = jaroWinkler(
              checkTransactionDescription,
              transactionDescription
            );

            if (jaroWinklerDistance > 0.8) {
              changedTransactions.push({
                date: checkTransaction.date,
                amount: checkTransaction.amount,
                description: checkTransaction.description,
                transactionId: transaction.id,
              });
              isMatched = true;
              foundIds.push(checkTransaction.tempId);
              break;
            }
          }
        }

        // If no match, check for fuzzy amount + fuzzy description match
        if (!isMatched) {
          for (const checkTransaction of checkTransactions) {
            if (Math.abs(checkTransaction.amount - transaction.amount) > 1) continue;

            const checkTransactionDescription = preprocessText(checkTransaction.description);
            const transactionDescription = preprocessText(transaction.description);

            const jaroWinklerDistance = jaroWinkler(
              checkTransactionDescription,
              transactionDescription
            );

            if (jaroWinklerDistance > 0.8) {
              changedTransactions.push({
                date: checkTransaction.date,
                amount: checkTransaction.amount,
                description: checkTransaction.description,
                transactionId: transaction.id,
              });
              isMatched = true;
              foundIds.push(checkTransaction.tempId);
              break;
            }
          }
        }

        // If still no match, add to unmatched transactions
        if (!isMatched) {
          unmatchedTransactions.push({
            transactionId: transaction.id,
          });
        }
      }

      // Add remaining transactions to new transactions
      const remainingTransactions = csvTransactionsAfterPending.filter(
        (transaction) => !foundIds.includes(transaction.tempId)
      );

      newTransactions.push(...remainingTransactions);
    } else {
      newTransactions.push(...uploadedCSVTransactions);
    }

    for (const tx of newTransactions) {
      if (!(tx.date instanceof Date) || isNaN(tx.date.getTime())) {
        console.error('Invalid date:', tx.date, tx.description);
      }
    }

    await prisma.$transaction([
      prisma.tempAddTransaction.createMany({
        data: newTransactions,
      }),
      prisma.tempEditTransaction.createMany({
        data: changedTransactions,
      }),
      prisma.tempUnmatchedTransaction.createMany({
        data: unmatchedTransactions,
      }),
    ]);
    return { status: 'success' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to process transactions';
    return { status: 'error', message };
  }
};
