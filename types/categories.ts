export type Subcategory = {
  id: number;
  name: string;
};

export type Category = {
  id: number;
  name: string;
  subcategories: Subcategory[];
};
