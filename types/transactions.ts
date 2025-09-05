export type SimpleTransaction = {
  id: number;
  date: Date;
  amount: number;
  description: string;
};

export type CSVTransaction = Omit<SimpleTransaction, 'id'>;

export type TempAddTransaction = CSVTransaction;

export type TempEditTransaction = CSVTransaction & {
  transactionId: number;
};

export type TempUnmatchedTransaction = {
  transactionId: number;
};
