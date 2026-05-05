import { Product } from '../../types';

export type AdminProduct = Product;

export interface NewProductForm {
  name: string;
  description: string;
  price: string;
  inStock: boolean;
  images: string[];
  category: string;
}

export interface ProductEditDraft {
  name: string;
  description: string;
  price: string;
  inStock: boolean;
  category: string;
}

export interface CategoryOption {
  id: string;
  name: string;
}
