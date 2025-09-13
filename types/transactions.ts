import type { Category, Merchant, Subcategory } from '@prisma/client';

// Simple transaction from DB
export type SimpleTransaction = {
  id: number;
  date: Date;
  amount: number;
  description: string;
};

// CSV transaction from upload
export type CSVTransaction = Omit<SimpleTransaction, 'id'>;

// Temporary transaction added from upload
export type TempAddTransaction = CSVTransaction;

// Temporary transaction edited from upload
export type TempEditTransaction = CSVTransaction & {
  transactionId: number;
};

// Temporary transaction unmatched from upload
export type TempUnmatchedTransaction = {
  transactionId: number;
};

export type UploadTransaction = {
  description: string;
  amount: number;
  date: Date;
  merchantId?: number;
  categoryId?: number;
  subcategoryId?: number;
};

export type Transaction = {
  id: number;
  date: Date;
  amount: number;
  description: string;
  merchant: Merchant | null;
  category: Category | null;
  subcategory: Subcategory | null;
};
