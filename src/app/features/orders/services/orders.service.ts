import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { Order, CreateOrderRequest } from '../interfaces/order.interface';
import { TopProduct, TopCustomer } from '../interfaces/report.interface';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  constructor(private apiService: ApiService) {}

  getOrders(): Observable<Order[]> {
    return this.apiService.get<Order[]>('/api/v1/orders');
  }

  getOrderById(id: number): Observable<Order> {
    return this.apiService.get<Order>(`/api/v1/orders/${id}`);
  }

  createOrder(order: CreateOrderRequest): Observable<Order> {
    return this.apiService.post<Order>('/api/v1/orders', order);
  }

  getTopProducts(limit: number = 5): Observable<TopProduct[]> {
    return this.apiService.get<TopProduct[]>(`/api/v1/reports/top-products?limit=${limit}`);
  }

  getTopCustomers(limit: number = 5): Observable<TopCustomer[]> {
    return this.apiService.get<TopCustomer[]>(`/api/v1/reports/top-customers?limit=${limit}`);
  }
}
