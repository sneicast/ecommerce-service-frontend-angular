import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/product.interface';
import { CreateProductFormComponent } from '../../components/create-product-form/create-product-form.component';
import { UpdateProductFormComponent } from '../../components/update-product-form/update-product-form.component';
import { IncrementStockFormComponent } from '../../components/increment-stock-form/increment-stock-form.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-products-page',
  imports: [CommonModule, CreateProductFormComponent, UpdateProductFormComponent, IncrementStockFormComponent, ModalComponent],
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss'
})
export class ProductsPage implements OnInit {
  products: Product[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  showCreateModal: boolean = false;
  showUpdateModal: boolean = false;
  showIncrementStockModal: boolean = false;
  selectedProductId: number = 0;
  deletingProductId: number | null = null;

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.errorMessage = 'Error al cargar los productos.';
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

  openUpdateModal(productId: number): void {
    this.selectedProductId = productId;
    this.showUpdateModal = true;
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    this.selectedProductId = 0;
  }

  openIncrementStockModal(productId: number): void {
    this.selectedProductId = productId;
    this.showIncrementStockModal = true;
  }

  closeIncrementStockModal(): void {
    this.showIncrementStockModal = false;
    this.selectedProductId = 0;
  }

  onProductCreated(product: Product): void {
    // Cerrar modal y recargar lista desde API
    this.closeCreateModal();
    this.loadProducts();
  }

  onProductUpdated(updatedProduct: Product): void {
    // Cerrar modal y recargar lista desde API
    this.closeUpdateModal();
    this.loadProducts();
  }

  onStockIncremented(updatedProduct: Product): void {
    // Cerrar modal y recargar lista desde API
    this.closeIncrementStockModal();
    this.loadProducts();
  }

  deleteProduct(productId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.deletingProductId = productId;
      
      this.productsService.deleteProduct(productId).subscribe({
        next: () => {
          this.deletingProductId = null;
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error al eliminar producto:', error);
          this.deletingProductId = null;
        }
      });
    }
  }

  isDeleting(productId: number): boolean {
    return this.deletingProductId === productId;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(price);
  }

  getAvailabilityStatus(available: boolean): string {
    return available ? 'Disponible' : 'No disponible';
  }

  getAvailabilityClass(available: boolean): string {
    return available 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  }
}
