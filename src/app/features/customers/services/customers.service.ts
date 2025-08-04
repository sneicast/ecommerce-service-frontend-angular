import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { Customer, CreateCustomerRequest } from '../interfaces/customer.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  constructor(private apiService: ApiService) {}

  getCustomers(): Observable<Customer[]> {
    return this.apiService.get<Customer[]>('/api/v1/customers');
  }

  createCustomer(customer: CreateCustomerRequest): Observable<Customer> {
    return this.apiService.post<Customer>('/api/v1/customers', customer);
  }
}
