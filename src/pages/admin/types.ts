import { Product } from '../../types';

export type AdminProduct = Product;

export interface NewProductForm {
  name: string;
  productCode: string;
  description: string;
  price: string;
  inStock: boolean;
  images: string[];
  category: string;
}

export interface ProductEditDraft {
  name: string;
  productCode: string;
  description: string;
  price: string;
  inStock: boolean;
  category: string;
}

export interface CategoryOption {
  id: string;
  name: string;
  coverImage?: string;
}
