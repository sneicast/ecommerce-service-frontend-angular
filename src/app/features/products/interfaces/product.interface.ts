export interface Product {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  available: boolean;
  stockQuantity: number;
}

export interface ProductsResponse {
  products: Product[];
} 