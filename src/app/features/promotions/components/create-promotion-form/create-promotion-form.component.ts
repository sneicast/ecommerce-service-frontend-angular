import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PromotionsService } from '../../services/promotions.service';
import { Promotion, CreatePromotionRequest } from '../../interfaces/promotion.interface';

@Component({
  selector: 'app-create-promotion-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-promotion-form.component.html',
  styleUrl: './create-promotion-form.component.scss'
})
export class CreatePromotionFormComponent {
  @Output() promotionCreated = new EventEmitter<Promotion>();
  @Output() cancel = new EventEmitter<void>();

  promotion: CreatePromotionRequest = {
    name: '',
    startDate: '',
    endDate: '',
    globalDiscountPercentage: 0,
    randomOrderDiscountPercentage: 0
  };

  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private promotionsService: PromotionsService) {}

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.promotionsService.createPromotion(this.promotion).subscribe({
      next: (createdPromotion) => {
        this.isLoading = false;
        this.promotionCreated.emit(createdPromotion);
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al crear promoción:', error);
        this.errorMessage = 'Error al crear la promoción.';
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onStartDateChange(): void {
    // Si la fecha de fin es menor que la de inicio, resetearla
    if (this.promotion.endDate && this.promotion.startDate && 
        this.promotion.endDate < this.promotion.startDate) {
      this.promotion.endDate = this.promotion.startDate;
    }
  }

  getMinDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  getMinEndDate(): string {
    return this.promotion.startDate || this.getMinDate();
  }

  private validateForm(): boolean {
    if (!this.promotion.name || !this.promotion.name.trim()) {
      this.errorMessage = 'El nombre es requerido.';
      return false;
    }

    if (!this.promotion.startDate) {
      this.errorMessage = 'La fecha de inicio es requerida.';
      return false;
    }

    if (!this.promotion.endDate) {
      this.errorMessage = 'La fecha de fin es requerida.';
      return false;
    }

    if (this.promotion.endDate < this.promotion.startDate) {
      this.errorMessage = 'La fecha de fin no puede ser menor que la fecha de inicio.';
      return false;
    }

    if (this.promotion.globalDiscountPercentage < 0 || this.promotion.globalDiscountPercentage > 100) {
      this.errorMessage = 'El descuento global debe estar entre 0 y 100.';
      return false;
    }

    if (this.promotion.randomOrderDiscountPercentage < 0 || this.promotion.randomOrderDiscountPercentage > 100) {
      this.errorMessage = 'El descuento aleatorio debe estar entre 0 y 100.';
      return false;
    }

    return true;
  }

  private resetForm(): void {
    this.promotion = {
      name: '',
      startDate: '',
      endDate: '',
      globalDiscountPercentage: 0,
      randomOrderDiscountPercentage: 0
    };
    this.errorMessage = '';
  }
} 