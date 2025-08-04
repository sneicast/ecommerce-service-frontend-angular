export interface Product {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  stockQuantity: number;
  available: boolean;
}

export interface ProductsResponse {
  products: Product[];
} 