import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomersService } from '../../services/customers.service';
import { Customer, CreateCustomerRequest } from '../../interfaces/customer.interface';

@Component({
  selector: 'app-create-customer-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-customer-form.component.html',
  styleUrl: './create-customer-form.component.scss'
})
export class CreateCustomerFormComponent {
  @Output() customerCreated = new EventEmitter<Customer>();
  @Output() cancel = new EventEmitter<void>();

  customer: CreateCustomerRequest = {
    firstName: '',
    lastName: '',
    address: '',
    phoneNumber: ''
  };

  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private customersService: CustomersService) {}

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.customersService.createCustomer(this.customer).subscribe({
      next: (createdCustomer) => {
        this.isLoading = false;
        this.customerCreated.emit(createdCustomer);
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al crear cliente:', error);
        this.errorMessage = 'Error al crear el cliente.';
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private validateForm(): boolean {
    // Validar que firstName no sea null, undefined o vacío
    if (!this.customer.firstName || !this.customer.firstName.trim()) {
      this.errorMessage = 'El nombre es requerido.';
      return false;
    }

    // Validar que lastName no sea null, undefined o vacío
    if (!this.customer.lastName || !this.customer.lastName.trim()) {
      this.errorMessage = 'El apellido es requerido.';
      return false;
    }

    // Validar que phoneNumber no sea null, undefined o vacío
    if (!this.customer.phoneNumber || !this.customer.phoneNumber.trim()) {
      this.errorMessage = 'El número de teléfono es requerido.';
      return false;
    }

    // Validar formato de teléfono (solo números)
    if (!this.isValidPhoneNumber(this.customer.phoneNumber)) {
      this.errorMessage = 'El número de teléfono debe contener solo números.';
      return false;
    }

    return true;
  }

  private isValidPhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^\d+$/;
    return phoneRegex.test(phoneNumber);
  }

  private resetForm(): void {
    this.customer = {
      firstName: '',
      lastName: '',
      address: '',
      phoneNumber: ''
    };
    this.errorMessage = '';
  }
} 