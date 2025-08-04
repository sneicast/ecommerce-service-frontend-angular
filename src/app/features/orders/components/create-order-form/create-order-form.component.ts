import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersService } from '../../services/orders.service';
import { CustomersService } from '../../../customers/services/customers.service';
import { ProductsService } from '../../../products/services/products.service';
import { Order, CreateOrderRequest, CreateOrderItem } from '../../interfaces/order.interface';
import { Customer } from '../../../customers/interfaces/customer.interface';
import { Product } from '../../../products/interfaces/product.interface';

@Component({
  selector: 'app-create-order-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-order-form.component.html',
  styleUrl: './create-order-form.component.scss'
})
export class CreateOrderFormComponent implements OnInit {
  @Output() orderCreated = new EventEmitter<Order>();
  @Output() cancel = new EventEmitter<void>();

  customers: Customer[] = [];
  products: Product[] = [];
  selectedCustomerId: string = '';
  selectedItems: { [productId: number]: number } = {};

  isLoading: boolean = false;
  isLoadingCustomers: boolean = false;
  isLoadingProducts: boolean = false;
  errorMessage: string = '';

  constructor(
    private ordersService: OrdersService,
    private customersService: CustomersService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
    this.loadProducts();
  }

  loadCustomers(): void {
    this.isLoadingCustomers = true;
    this.customersService.getCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        this.isLoadingCustomers = false;
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        this.errorMessage = 'Error al cargar los clientes.';
        this.isLoadingCustomers = false;
      }
    });
  }

  loadProducts(): void {
    this.isLoadingProducts = true;
    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoadingProducts = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.errorMessage = 'Error al cargar los productos.';
        this.isLoadingProducts = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const items: CreateOrderItem[] = Object.entries(this.selectedItems)
      .filter(([_, quantity]) => quantity > 0)
      .map(([productId, quantity]) => ({
        productId: parseInt(productId),
        quantity: quantity
      }));

    const order: CreateOrderRequest = {
      customerId: this.selectedCustomerId,
      items: items
    };

    this.ordersService.createOrder(order).subscribe({
      next: (createdOrder) => {
        this.isLoading = false;
        this.orderCreated.emit(createdOrder);
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al crear orden:', error);
        this.errorMessage = 'Error al crear la orden.';
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onQuantityChange(productId: number, quantity: number): void {
    if (quantity > 0) {
      this.selectedItems[productId] = quantity;
    } else {
      delete this.selectedItems[productId];
    }
  }

  getSelectedItemsCount(): number {
    return Object.values(this.selectedItems).filter(quantity => quantity > 0).length;
  }

  getTotalAmount(): number {
    let total = 0;
    Object.entries(this.selectedItems).forEach(([productId, quantity]) => {
      if (quantity > 0) {
        const product = this.products.find(p => p.id === parseInt(productId));
        if (product) {
          total += product.price * quantity;
        }
      }
    });
    return total;
  }

  private validateForm(): boolean {
    if (!this.selectedCustomerId) {
      this.errorMessage = 'Debe seleccionar un cliente.';
      return false;
    }

    const hasItems = Object.values(this.selectedItems).some(quantity => quantity > 0);
    if (!hasItems) {
      this.errorMessage = 'Debe seleccionar al menos un producto con cantidad mayor a 0.';
      return false;
    }

    return true;
  }

  private resetForm(): void {
    this.selectedCustomerId = '';
    this.selectedItems = {};
    this.errorMessage = '';
  }

  getCustomerFullName(customer: Customer): string {
    const firstName = customer.firstName || '';
    const lastName = customer.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'Cliente sin nombre';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  }
} 