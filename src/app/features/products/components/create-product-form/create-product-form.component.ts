import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-create-product-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-product-form.component.html',
  styleUrl: './create-product-form.component.scss'
})
export class CreateProductFormComponent {
  @Output() productCreated = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter<void>();

  product: Omit<Product, 'id'> = {
    title: '',
    description: '',
    imageUrl: '',
    price: 0,
    available: true,
    stockQuantity: 0
  };

  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private productsService: ProductsService) {}

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.productsService.createProduct(this.product).subscribe({
      next: (createdProduct) => {
        this.isLoading = false;
        this.productCreated.emit(createdProduct);
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al crear producto:', error);
        this.errorMessage = 'Error al crear el producto.';
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private validateForm(): boolean {
    if (!this.product.title.trim()) {
      this.errorMessage = 'El título es requerido.';
      return false;
    }
    if (!this.product.description.trim()) {
      this.errorMessage = 'La descripción es requerida.';
      return false;
    }
    if (this.product.price <= 0) {
      this.errorMessage = 'El precio debe ser mayor a 0.';
      return false;
    }
    if (this.product.stockQuantity < 0) {
      this.errorMessage = 'El stock no puede ser negativo.';
      return false;
    }
    return true;
  }

  private resetForm(): void {
    this.product = {
      title: '',
      description: '',
      imageUrl: '',
      price: 0,
      available: true,
      stockQuantity: 0
    };
    this.errorMessage = '';
  }
} 