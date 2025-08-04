import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { Product } from '../interfaces/product.interface';

export interface ProductFilters {
  title?: string;
  available?: boolean | null;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private apiService: ApiService) {}

  getProducts(): Observable<Product[]> {
    return this.apiService.get<Product[]>('/api/v1/products');
  }

  getProductsWithFilters(filters: ProductFilters): Observable<Product[]> {
    let params = new URLSearchParams();
    
    if (filters.title && filters.title.trim()) {
      params.append('title', filters.title.trim());
    }
    
    if (filters.available !== undefined && filters.available !== null) {
      params.append('available', filters.available.toString());
    }
    
    const queryString = params.toString();
    const url = queryString ? `/api/v1/products?${queryString}` : '/api/v1/products';
    
    return this.apiService.get<Product[]>(url);
  }

  getProductById(id: number): Observable<Product> {
    return this.apiService.get<Product>(`/api/v1/products/${id}`);
  }

  createProduct(product: any): Observable<Product> {
    return this.apiService.post<Product>('/api/v1/products', product);
  }

  updateProduct(id: number, product: any): Observable<Product> {
    return this.apiService.put<Product>(`/api/v1/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.apiService.delete<void>(`/api/v1/products/${id}`);
  }

  incrementStock(id: number, quantity: number): Observable<Product> {
    return this.apiService.post<Product>(`/api/v1/products/${id}/increment-stock`, { quantity });
  }
}
