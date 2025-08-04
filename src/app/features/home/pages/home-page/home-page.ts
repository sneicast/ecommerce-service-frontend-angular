import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../../orders/services/orders.service';
import { TopProduct, TopCustomer } from '../../../orders/interfaces/report.interface';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss'
})
export class HomePage implements OnInit {
  topProducts: TopProduct[] = [];
  topCustomers: TopCustomer[] = [];
  isLoadingProducts: boolean = false;
  isLoadingCustomers: boolean = false;
  errorMessageProducts: string = '';
  errorMessageCustomers: string = '';

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.loadTopProducts();
    this.loadTopCustomers();
  }

  loadTopProducts(): void {
    this.isLoadingProducts = true;
    this.errorMessageProducts = '';

    this.ordersService.getTopProducts(5).subscribe({
      next: (products) => {
        this.topProducts = products;
        this.isLoadingProducts = false;
      },
      error: (error) => {
        console.error('Error al cargar top productos:', error);
        this.errorMessageProducts = 'Error al cargar los productos más vendidos.';
        this.isLoadingProducts = false;
      }
    });
  }

  loadTopCustomers(): void {
    this.isLoadingCustomers = true;
    this.errorMessageCustomers = '';

    this.ordersService.getTopCustomers(5).subscribe({
      next: (customers) => {
        this.topCustomers = customers;
        this.isLoadingCustomers = false;
      },
      error: (error) => {
        console.error('Error al cargar top clientes:', error);
        this.errorMessageCustomers = 'Error al cargar los clientes con más compras.';
        this.isLoadingCustomers = false;
      }
    });
  }
}
