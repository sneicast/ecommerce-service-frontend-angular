import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { User, UpdateUserRequest } from '../../interfaces/user.interface';

@Component({
  selector: 'app-update-user-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './update-user-form.component.html',
  styleUrl: './update-user-form.component.scss'
})
export class UpdateUserFormComponent implements OnInit, OnChanges {
  @Input() userId: string = '';
  @Output() userUpdated = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  user: UpdateUserRequest = {
    firstName: '',
    lastName: '',
    email: '',
    status: true
  };

  isLoading: boolean = false;
  errorMessage: string = '';
  isInitializing: boolean = true;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    // No cargar aquí, esperar a que userId cambie
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Cuando cambia el userId, limpiar y cargar nuevos datos
    if (changes['userId'] && changes['userId'].currentValue) {
      this.resetForm();
      this.loadUserDetails();
    }
  }

  resetForm(): void {
    // Limpiar completamente el formulario
    this.user = {
      firstName: '',
      lastName: '',
      email: '',
      status: true
    };
    this.errorMessage = '';
    this.isInitializing = true;
    this.isLoading = false;
  }

  loadUserDetails(): void {
    if (!this.userId) {
      this.isInitializing = false;
      return;
    }

    this.isInitializing = true;
    this.errorMessage = '';

    this.usersService.getUserById(this.userId).subscribe({
      next: (user) => {
        // Solo cargar los campos que requiere el endpoint de actualizar
        this.user = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          status: user.status
        };
        this.isInitializing = false;
      },
      error: (error) => {
        console.error('Error al cargar detalles del usuario:', error);
        this.errorMessage = 'Error al cargar los detalles del usuario.';
        this.isInitializing = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.usersService.updateUser(this.userId, this.user).subscribe({
      next: (updatedUser) => {
        this.isLoading = false;
        this.userUpdated.emit(updatedUser);
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
        this.errorMessage = 'Error al actualizar el usuario.';
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.resetForm();
    this.cancel.emit();
  }

  private validateForm(): boolean {
    if (!this.user.firstName?.trim()) {
      this.errorMessage = 'El nombre es requerido.';
      return false;
    }
    if (!this.user.lastName?.trim()) {
      this.errorMessage = 'El apellido es requerido.';
      return false;
    }
    if (!this.user.email?.trim()) {
      this.errorMessage = 'El email es requerido.';
      return false;
    }
    if (!this.isValidEmail(this.user.email)) {
      this.errorMessage = 'El email no es válido.';
      return false;
    }
    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
} 