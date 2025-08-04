import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { User, CreateUserRequest } from '../../interfaces/user.interface';

@Component({
  selector: 'app-create-user-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-user-form.component.html',
  styleUrl: './create-user-form.component.scss'
})
export class CreateUserFormComponent {
  @Output() userCreated = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  user: CreateUserRequest = {
    firstName: '',
    lastName: '',
    email: '',
    status: true,
    password: ''
  };

  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private usersService: UsersService) {}

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.usersService.createUser(this.user).subscribe({
      next: (createdUser) => {
        this.isLoading = false;
        this.userCreated.emit(createdUser);
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al crear usuario:', error);
        this.errorMessage = 'Error al crear el usuario.';
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private validateForm(): boolean {
    // Validar que firstName no sea null, undefined o vacío
    if (!this.user.firstName || !this.user.firstName.trim()) {
      this.errorMessage = 'El nombre es requerido.';
      return false;
    }

    // Validar que lastName no sea null, undefined o vacío
    if (!this.user.lastName || !this.user.lastName.trim()) {
      this.errorMessage = 'El apellido es requerido.';
      return false;
    }

    // Validar que email no sea null, undefined o vacío
    if (!this.user.email || !this.user.email.trim()) {
      this.errorMessage = 'El email es requerido.';
      return false;
    }

    // Validar formato de email
    if (!this.isValidEmail(this.user.email)) {
      this.errorMessage = 'El email no es válido.';
      return false;
    }

    // Validar que password no sea null, undefined o vacío
    if (!this.user.password || !this.user.password.trim()) {
      this.errorMessage = 'La contraseña es requerida.';
      return false;
    }

    // Validar longitud mínima de contraseña
    if (this.user.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') {
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private resetForm(): void {
    this.user = {
      firstName: '',
      lastName: '',
      email: '',
      status: true,
      password: ''
    };
    this.errorMessage = '';
  }
} 