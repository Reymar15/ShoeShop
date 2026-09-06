export interface Product {
  id: number;
  name: string;
  brand: string;
  category_id: number | null;
  description: string;
  price: number | string;
  stock: number;
  sold_quantity: number;
  image_url: string | null;
  rating: number;
  sizes: string[];
  colors: string[];
  created_at?: string;
}
