import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../interfaces/order.interface';
import { CreateOrderFormComponent } from '../../components/create-order-form/create-order-form.component';
import { OrderDetailComponent } from '../../components/order-detail/order-detail.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-orders-page',
  imports: [CommonModule, CreateOrderFormComponent, OrderDetailComponent, ModalComponent],
  templateUrl: './orders-page.html',
  styleUrl: './orders-page.scss'
})
export class OrdersPage implements OnInit {
  orders: Order[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  showCreateModal: boolean = false;
  showDetailModal: boolean = false;
  selectedOrderId: number = 0;

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.ordersService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar órdenes:', error);
        this.errorMessage = 'Error al cargar las órdenes.';
        this.isLoading = false;
      }
    });
  }

  openCreateModal(): void {
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  openDetailModal(orderId: number): void {
    this.selectedOrderId = orderId;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedOrderId = 0;
  }

  onOrderCreated(order: Order): void {
    // Cerrar modal y recargar lista desde API
    this.closeCreateModal();
    this.loadOrders();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
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
}
