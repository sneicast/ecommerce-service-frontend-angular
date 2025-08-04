import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-increment-stock-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './increment-stock-form.component.html',
  styleUrl: './increment-stock-form.component.scss'
})
export class IncrementStockFormComponent implements OnInit, OnChanges {
  @Input() productId: number = 0;
  @Output() stockIncremented = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter<void>();

  product: Product | null = null;
  quantity: number = 1;
  isLoading: boolean = false;
  isLoadingProduct: boolean = false;
  errorMessage: string = '';

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    // No cargar aquí, esperar a que productId cambie
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productId'] && changes['productId'].currentValue) {
      this.loadProductDetails();
    }
  }

  loadProductDetails(): void {
    this.isLoadingProduct = true;
    this.errorMessage = '';

    this.productsService.getProductById(this.productId).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoadingProduct = false;
      },
      error: (error) => {
        console.error('Error al cargar detalles del producto:', error);
        this.errorMessage = 'Error al cargar los detalles del producto.';
        this.isLoadingProduct = false;
      }
    });
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.productsService.incrementStock(this.productId, this.quantity).subscribe({
      next: (updatedProduct) => {
        this.isLoading = false;
        this.stockIncremented.emit(updatedProduct);
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al incrementar stock:', error);
        this.errorMessage = 'Error al incrementar el stock del producto.';
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  getNewStockTotal(): number {
    if (!this.product) return 0;
    return this.product.stockQuantity + this.quantity;
  }

  private validateForm(): boolean {
    if (this.quantity <= 0) {
      this.errorMessage = 'La cantidad debe ser mayor a 0.';
      return false;
    }

    if (this.quantity > 1000) {
      this.errorMessage = 'La cantidad no puede ser mayor a 1000.';
      return false;
    }

    return true;
  }

  private resetForm(): void {
    this.quantity = 1;
    this.errorMessage = '';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  }
} 