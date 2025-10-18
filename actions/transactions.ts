'use server';

import { z } from 'zod';
import type {
  SimpleTransaction,
  CSVTransaction,
  TempAddTransaction,
  TempEditTransaction,
  TempUnmatchedTransaction,
  UploadTransaction,
} from '@/types/transactions';
import { jaroWinkler, preprocessText } from '@/lib/stringComparison';
import { openai, zodTextFormat } from '@/lib/openai';
import { prisma } from '@/lib/prisma';

type TransactionTempId = CSVTransaction & {
  tempId: number;
};

type ProcessTransactionsResponse = { status: 'success' } | { status: 'error'; message: string };

export const preProcessTransactions = async (file: File): Promise<ProcessTransactionsResponse> => {
  try {
    // Delete previous temporary transactions
    await prisma.$transaction([
      prisma.tempAddTransaction.deleteMany(),
      prisma.tempEditTransaction.deleteMany(),
      prisma.tempUnmatchedTransaction.deleteMany(),
    ]);

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

const BATCH_SIZE = 300;

type CategoryIds = {
  subcategoryId: number;
  categoryId: number;
};

export const processTransactions = async () => {
  try {
    // Get the transactions uploaded to be categorised and extract important info for AI
    const transactions = await prisma.tempAddTransaction.findMany();
    if (transactions.length === 0) return;

    const transactionById = new Map(transactions.map((t) => [t.id, t]));

    const cleanedTransactions = transactions.map((transaction) => ({
      id: transaction.id,
      description: transaction.description,
      amount: transaction.amount,
    }));

    // Get the possible merchants and categories (names used to guide AI, ids used for DB mapping)
    const merchants = await prisma.merchant.findMany({ select: { name: true } });
    const categories = await prisma.category.findMany({
      select: { id: true, name: true, subcategories: { select: { id: true, name: true } } },
    });

    // Build a lookup map from "Category - Subcategory" -> subcategoryId
    const categoryLabelToId = new Map<string, CategoryIds>();
    for (const category of categories) {
      for (const subcategory of category.subcategories) {
        categoryLabelToId.set(`${category.name} - ${subcategory.name}`, {
          subcategoryId: subcategory.id,
          categoryId: category.id,
        });
      }
    }

    const resolveCategoryIds = (label: string): CategoryIds | null => {
      const finalLabel = label.trim();
      if (finalLabel === 'Uncategorised') return null;

      const found = categoryLabelToId.get(finalLabel);
      if (found !== undefined) return found;

      console.warn("Unknown category label from AI, 'Uncategorised' not used either.", label);
      return null;
    };

    // Transaction returned by AI
    const Transaction = z.object({
      id: z.number(),
      merchant: z.string(),
      category: z.enum([
        ...categories.flatMap((c) => c.subcategories.map((s) => `${c.name} - ${s.name}`)),
        'Uncategorised',
      ]),
    });

    // List of transactions returned by AI
    const TransactionsList = z.object({
      transactions: z.array(Transaction),
    });

    // Process in batches to respect token and rate constraints
    for (let start = 0; start < cleanedTransactions.length; start += BATCH_SIZE) {
      const batch = cleanedTransactions.slice(start, start + BATCH_SIZE);

      const response = await openai.responses.parse({
        model: 'gpt-5-mini',
        reasoning: {
          effort: 'low',
        },
        input: [
          {
            role: 'system',
            content: `You are a transaction categoriser. Your task is to extract the merchant name and a category/subcategory pair from each provided list of transaction descriptions.

Instructions:
Id:
- Always return the id of the transaction.
Merchant:
- If the transaction clearly matches one of the known merchants, use that exact name.
- If it does not match any known merchant, return a new merchant string.
- Only list the merchant name if 100% sure you can extract the merchant from the description. If not, return "Unknown".
Category:
- Always return in the format "<Primary Category> - <Subcategory>"
- Only list the category if 100% sure you can extract the category from the description. If not, return "Uncategorised".

Examples:
- Given the description "WOOLWORTHS/NICHOLSON RD &CANNINGVAL", return {merchant: "Woolworths", category: "Food & Dining - Groceries"}
- Given the description "BP Australia BPme", return {merchant: "BP", category: "Transportation - Fuel / Petrol"}

Here is the list of known merchants: ${merchants.map((merchant) => merchant.name).join(', ')}`,
          },
          {
            role: 'user',
            content: `Classify these transactions: ${JSON.stringify(batch)}`,
          },
        ],
        text: {
          format: zodTextFormat(TransactionsList, 'transactions'),
        },
      });

      // Extract parsed output from AI response
      const parsed = TransactionsList.parse(response.output_parsed);

      // Normalise merchants and collect unique names for this batch
      const batchResults = parsed.transactions.map((t) => ({
        id: t.id,
        merchant: t.merchant.trim(),
        category: t.category.trim(),
      }));

      const merchantNames = Array.from(new Set(batchResults.map((r) => r.merchant)));

      // Find or create merchants for this batch
      const existingMerchants = await prisma.merchant.findMany({
        where: { name: { in: merchantNames } },
      });

      const merchantNameToId = new Map(
        existingMerchants.map((merchant) => [merchant.name, merchant.id])
      );
      const merchantsToCreate = merchantNames.filter(
        (name) => !merchantNameToId.has(name) && name !== 'Unknown'
      );

      if (merchantsToCreate.length > 0) {
        await prisma.merchant.createMany({ data: merchantsToCreate.map((name) => ({ name })) });

        const created = await prisma.merchant.findMany({
          where: { name: { in: merchantsToCreate } },
        });

        for (const merchant of created) {
          merchantNameToId.set(merchant.name, merchant.id);
        }
      }

      // Prepare final transaction records to insert
      const transactionsToInsert: UploadTransaction[] = [];

      const insertedIds: number[] = [];

      for (const result of batchResults) {
        // Get the original transaction temporarily added from the upload
        const original = transactionById.get(result.id);

        if (!original) {
          // TODO: Add error handling
          console.warn('Skipping missing TempAddTransaction id', result.id);
          continue;
        }

        // The merchantId can be undefined if the merchant is unknown
        const merchantId = merchantNameToId.get(result.merchant);

        const subcategoryId = resolveCategoryIds(result.category);
        transactionsToInsert.push({
          description: original.description,
          amount: original.amount,
          date: original.date,
          merchantId,
          categoryId: subcategoryId?.categoryId,
          subcategoryId: subcategoryId?.subcategoryId,
        });
        insertedIds.push(result.id);
      }

      const processedIds = insertedIds;
      if (transactionsToInsert.length > 0 || processedIds.length > 0) {
        await prisma.$transaction([
          ...(transactionsToInsert.length > 0
            ? [prisma.transaction.createMany({ data: transactionsToInsert })]
            : []),
          prisma.tempAddTransaction.deleteMany({ where: { id: { in: processedIds } } }),
        ]);
      }
    }
  } catch (error) {
    console.error(error);
  }
};
