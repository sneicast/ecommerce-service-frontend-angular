import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersService } from '../../services/customers.service';
import { Customer } from '../../interfaces/customer.interface';
import { CreateCustomerFormComponent } from '../../components/create-customer-form/create-customer-form.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-customers-page',
  imports: [CommonModule, CreateCustomerFormComponent, ModalComponent],
  templateUrl: './customers-page.html',
  styleUrl: './customers-page.scss'
})
export class CustomersPage implements OnInit {
  customers: Customer[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  showCreateModal: boolean = false;

  constructor(private customersService: CustomersService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.customersService.getCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        this.errorMessage = 'Error al cargar los clientes.';
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

  onCustomerCreated(customer: Customer): void {
    // Cerrar modal y recargar lista desde API
    this.closeCreateModal();
    this.loadCustomers();
  }

  getFullName(customer: Customer | null | undefined): string {
    if (!customer) return 'Cliente sin nombre';
    const firstName = customer.firstName || '';
    const lastName = customer.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'Cliente sin nombre';
  }

  getInitials(customer: Customer | null | undefined): string {
    if (!customer) return '?';
    const firstName = customer.firstName || '';
    const lastName = customer.lastName || '';
    const firstInitial = firstName.charAt(0) || '';
    const lastInitial = lastName.charAt(0) || '';
    return `${firstInitial}${lastInitial}` || '?';
  }
}
