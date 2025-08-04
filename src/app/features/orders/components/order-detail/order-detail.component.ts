import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../interfaces/order.interface';

@Component({
  selector: 'app-order-detail',
  imports: [CommonModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent implements OnInit, OnChanges {
  @Input() orderId: number = 0;
  @Output() close = new EventEmitter<void>();

  order: Order | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    // No cargar aquí, esperar a que orderId cambie
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['orderId'] && changes['orderId'].currentValue) {
      this.loadOrderDetail();
    }
  }

  loadOrderDetail(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.ordersService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar detalle de orden:', error);
        this.errorMessage = 'Error al cargar el detalle de la orden.';
        this.isLoading = false;
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatPrice(price: number | null): string {
    if (price === null) return 'Pendiente';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  }

  calculateSubtotal(): number {
    if (!this.order?.items) return 0;
    return this.order.items.reduce((total, item) => {
      return total + (item.unitPrice || 0) * item.quantity;
    }, 0);
  }

  calculateTotal(): number {
    if (!this.order) return this.calculateSubtotal();
    return this.order.finalAmount || this.calculateSubtotal();
  }

  calculateDiscountPercentage(): number {
    if (!this.order || !this.order.totalAmount || this.order.totalAmount === 0) return 0;
    return Math.round((this.order.discountAmount / this.order.totalAmount) * 100);
  }

  getCustomerInitials(): string {
    if (!this.order?.customerName) return 'C';
    return this.order.customerName.charAt(0).toUpperCase();
  }

  getCreatedByInitials(): string {
    if (!this.order?.createdByName) return 'A';
    return this.order.createdByName.charAt(0).toUpperCase();
  }
} 