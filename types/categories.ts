export type Subcategory = {
  id: number;
  name: string;
};

export type Category = {
  id: number;
  name: string;
  subcategories: Subcategory[];
};

type PlainCategory = {
  id: number;
  name: string;
};

export type SubcategoryWithDetails = Subcategory & {
  totalAmount: number;
  transactions: number;
  category: PlainCategory;
};
