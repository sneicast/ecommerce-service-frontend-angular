import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-update-product-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './update-product-form.component.html',
  styleUrl: './update-product-form.component.scss'
})
export class UpdateProductFormComponent implements OnInit, OnChanges {
  @Input() productId: number = 0;
  @Output() productUpdated = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter<void>();

  product: Partial<Product> = {
    title: '',
    description: '',
    imageUrl: '',
    price: 0,
    available: true
  };

  isLoading: boolean = false;
  errorMessage: string = '';
  isInitializing: boolean = true;

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    // No cargar aquí, esperar a que productId cambie
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Cuando cambia el productId, limpiar y cargar nuevos datos
    if (changes['productId'] && changes['productId'].currentValue) {
      this.resetForm();
      this.loadProductDetails();
    }
  }

  resetForm(): void {
    // Limpiar completamente el formulario
    this.product = {
      title: '',
      description: '',
      imageUrl: '',
      price: 0,
      available: true
    };
    this.errorMessage = '';
    this.isInitializing = true;
    this.isLoading = false;
  }

  loadProductDetails(): void {
    if (!this.productId) {
      this.isInitializing = false;
      return;
    }

    this.isInitializing = true;
    this.errorMessage = '';

    this.productsService.getProductById(this.productId).subscribe({
      next: (product) => {
        // Solo cargar los campos que requiere el endpoint de actualizar
        this.product = {
          title: product.title,
          description: product.description,
          imageUrl: product.imageUrl,
          price: product.price,
          available: product.available
        };
        this.isInitializing = false;
      },
      error: (error) => {
        console.error('Error al cargar detalles del producto:', error);
        this.errorMessage = 'Error al cargar los detalles del producto.';
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

    this.productsService.updateProduct(this.productId, this.product).subscribe({
      next: (updatedProduct) => {
        this.isLoading = false;
        this.productUpdated.emit(updatedProduct);
      },
      error: (error) => {
        console.error('Error al actualizar producto:', error);
        this.errorMessage = 'Error al actualizar el producto.';
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.resetForm();
    this.cancel.emit();
  }

  private validateForm(): boolean {
    if (!this.product.title?.trim()) {
      this.errorMessage = 'El título es requerido.';
      return false;
    }
    if (!this.product.description?.trim()) {
      this.errorMessage = 'La descripción es requerida.';
      return false;
    }
    if (!this.product.price || this.product.price <= 0) {
      this.errorMessage = 'El precio debe ser mayor a 0.';
      return false;
    }
    return true;
  }
} 