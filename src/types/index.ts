export interface Product {
  id: string;
  productCode?: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  featured: boolean;
  inStock: boolean;
  showMaterials?: boolean;
  materialsText?: string;
  showDimensions?: boolean;
  dimensionsText?: string;
  showCustomization?: boolean;
  customizationText?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}