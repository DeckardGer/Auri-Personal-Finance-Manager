type Subcategory = {
  id: number;
  name: string;
};

export type Category = {
  id: number;
  name: string;
  subcategories?: Subcategory[];
};

export type CategoryWithDetails = {
  categoryId: number;
  categoryName: string;
  totalAmount: number;
  transactions: number;
};

export type SubcategoryWithDetails = Subcategory & {
  totalAmount: number;
  transactions: number;
  categoryId: number;
  categoryName: string;
};
