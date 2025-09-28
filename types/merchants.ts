export type Merchant = {
  id: number;
  name: string;
};

export type MerchantWithDetails = Merchant & {
  totalAmount: number;
  transactions: number;
};
