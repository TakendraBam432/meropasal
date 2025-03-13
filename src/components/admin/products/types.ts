
export interface Product {
  id: string;
  title: string;
  price: number;
  description: string | null;
  stock: number;
  category: string | null;
  image_url: string | null;
}

export const CATEGORIES = [
  "electronics",
  "fashion",
  "home-garden",
  "sports",
  "beauty",
  "toys",
];
