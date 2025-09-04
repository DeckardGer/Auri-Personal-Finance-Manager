'use server';

import { jaroWinkler, preprocessText } from '@/lib/stringComparison';

type CSVTransaction = {
  date: Date;
  amount: number;
  description: string;
};

type CSVTransactionTempId = CSVTransaction & {
  tempId: number;
};

type DBTransaction = {
  id: string;
  date: Date;
  amount: number;
  description: string;
};

export const processTransactions = async (file: File) => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const text = buffer.toString('utf-8');

  const uploadedCSVTransactions: CSVTransaction[] = text
    .split('\n')
    .slice(1)
    .map((line) => {
      const transaction = line.split(',');
      return {
        date: new Date(transaction[0]),
        amount: Number(transaction[1]),
        description: transaction[5],
      };
    });

  const PENDING_DAYS_CHECK = 14;
  const newTransactions: CSVTransaction[] = [];
  const changedTransactions: CSVTransaction[] = [];
  const unmatchedTransactions: CSVTransaction[] = [];

  const csvTransactions: CSVTransactionTempId[] = uploadedCSVTransactions.map(
    (transaction, index) => {
      return {
        ...transaction,
        tempId: index,
      };
    }
  );

  // Get saved transactions
  const currentTransactions: DBTransaction[] = [
    {
      id: '1',
      date: new Date('2025-05-25T16:00:00.000Z'),
      amount: -5,
      description: 'V7525 23/05 DISCORD* SPIRITEMBERS DISCORD.CO 24492165143',
    },
  ];

  // Cutoff date for possible pending transactions
  const pendingTransactionCutoffDate = new Date(
    currentTransactions[0].date.getTime() - PENDING_DAYS_CHECK * 24 * 60 * 60 * 1000
  );

  // Create a key for each transaction
  const createKey = (transaction: CSVTransaction | DBTransaction) =>
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
          transaction.date.getTime() + PENDING_DAYS_CHECK * 24 * 60 * 60 * 1000 &&
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
          changedTransactions.push(checkTransaction);
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
          changedTransactions.push(checkTransaction);
          isMatched = true;
          foundIds.push(checkTransaction.tempId);
          break;
        }
      }
    }

    // If still no match, add to unmatched transactions
    if (!isMatched) unmatchedTransactions.push(transaction);
  }

  // Add remaining transactions to new transactions
  const remainingTransactions = csvTransactionsAfterPending.filter(
    (transaction) => !foundIds.includes(transaction.tempId)
  );

  newTransactions.push(...remainingTransactions);
};
