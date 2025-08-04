import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { Order, CreateOrderRequest } from '../interfaces/order.interface';

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
}
