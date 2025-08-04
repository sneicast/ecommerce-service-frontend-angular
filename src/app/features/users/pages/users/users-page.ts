import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/users.service';
import { User } from '../../interfaces/user.interface';
import { CreateUserFormComponent } from '../../components/create-user-form/create-user-form.component';
import { UpdateUserFormComponent } from '../../components/update-user-form/update-user-form.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-users-page',
  imports: [CommonModule, CreateUserFormComponent, UpdateUserFormComponent, ModalComponent],
  templateUrl: './users-page.html',
  styleUrl: './users-page.scss'
})
export class UsersPage implements OnInit {
  users: User[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  showCreateModal: boolean = false;
  showUpdateModal: boolean = false;
  selectedUserId: string = '';
  deletingUserId: string | null = null;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.errorMessage = 'Error al cargar los usuarios.';
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

  openUpdateModal(userId: string | undefined): void {
    if (!userId) return;
    
    // Limpiar estado anterior y establecer nuevo ID
    this.selectedUserId = '';
    this.showUpdateModal = false;
    
    // Usar setTimeout para asegurar que el componente se reinicialice
    setTimeout(() => {
      this.selectedUserId = userId;
      this.showUpdateModal = true;
    }, 0);
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    // Limpiar el ID después de cerrar el modal
    setTimeout(() => {
      this.selectedUserId = '';
    }, 100);
  }

  onUserCreated(user: User): void {
    // Cerrar modal y recargar lista desde API
    this.closeCreateModal();
    this.loadUsers();
  }

  onUserUpdated(updatedUser: User): void {
    // Cerrar modal y recargar lista desde API
    this.closeUpdateModal();
    this.loadUsers();
  }

  deleteUser(userId: string | undefined): void {
    if (!userId) return;
    
    if (confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
      this.deletingUserId = userId;
      
      this.usersService.deleteUser(userId).subscribe({
        next: () => {
          console.log('Usuario eliminado exitosamente');
          // Recargar lista desde API después de eliminar
          this.loadUsers();
          this.deletingUserId = null;
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          this.errorMessage = 'Error al eliminar el usuario.';
          this.deletingUserId = null;
        }
      });
    }
  }

  isDeleting(userId: string | undefined): boolean {
    return this.deletingUserId === userId;
  }

  getStatusText(status: boolean | undefined): string {
    return status ? 'Activo' : 'Inactivo';
  }

  getStatusClass(status: boolean | undefined): string {
    return status 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  }

  getFullName(user: User | null | undefined): string {
    if (!user) return 'Usuario sin nombre';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'Usuario sin nombre';
  }

  getInitials(user: User | null | undefined): string {
    if (!user) return '?';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const firstInitial = firstName.charAt(0) || '';
    const lastInitial = lastName.charAt(0) || '';
    return `${firstInitial}${lastInitial}` || '?';
  }
}
