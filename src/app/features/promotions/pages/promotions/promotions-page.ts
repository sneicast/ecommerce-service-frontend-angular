import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionsService } from '../../services/promotions.service';
import { Promotion } from '../../interfaces/promotion.interface';
import { CreatePromotionFormComponent } from '../../components/create-promotion-form/create-promotion-form.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-promotions-page',
  imports: [CommonModule, CreatePromotionFormComponent, ModalComponent],
  templateUrl: './promotions-page.html',
  styleUrl: './promotions-page.scss'
})
export class PromotionsPage implements OnInit {
  promotions: Promotion[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  showCreateModal: boolean = false;

  constructor(private promotionsService: PromotionsService) {}

  ngOnInit(): void {
    this.loadPromotions();
  }

  loadPromotions(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.promotionsService.getPromotions().subscribe({
      next: (promotions) => {
        this.promotions = promotions;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar promociones:', error);
        this.errorMessage = 'Error al cargar las promociones.';
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

  onPromotionCreated(promotion: Promotion): void {
    this.closeCreateModal();
    this.loadPromotions();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatDateTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatPercentage(percentage: number): string {
    return `${percentage.toFixed(2)}%`;
  }

  getStatusClass(promotion: Promotion): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetear a inicio del día
    
    const startDate = new Date(promotion.startDate + 'T00:00:00');
    const endDate = new Date(promotion.endDate + 'T23:59:59'); // Fin del día

    if (today < startDate) {
      return 'bg-yellow-100 text-yellow-800'; // Pendiente
    } else if (today >= startDate && today <= endDate) {
      return 'bg-green-100 text-green-800'; // Activa
    } else {
      return 'bg-red-100 text-red-800'; // Expirada
    }
  }

  getStatusText(promotion: Promotion): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetear a inicio del día
    
    const startDate = new Date(promotion.startDate + 'T00:00:00');
    const endDate = new Date(promotion.endDate + 'T23:59:59'); // Fin del día

    if (today < startDate) {
      return 'Pendiente';
    } else if (today >= startDate && today <= endDate) {
      return 'Activa';
    } else {
      return 'Expirada';
    }
  }

  getInitials(name: string): string {
    return name.charAt(0).toUpperCase();
  }
}
