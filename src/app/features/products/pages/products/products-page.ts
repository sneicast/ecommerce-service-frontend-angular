import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService, ProductFilters } from '../../services/products.service';
import { Product } from '../../interfaces/product.interface';
import { CreateProductFormComponent } from '../../components/create-product-form/create-product-form.component';
import { UpdateProductFormComponent } from '../../components/update-product-form/update-product-form.component';
import { IncrementStockFormComponent } from '../../components/increment-stock-form/increment-stock-form.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-products-page',
  imports: [CommonModule, FormsModule, CreateProductFormComponent, UpdateProductFormComponent, IncrementStockFormComponent, ModalComponent],
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

  // Filtros
  titleFilter: string = '';
  availableFilter: boolean | null = null;
  private titleFilterSubject = new Subject<string>();

  constructor(private productsService: ProductsService) {
    // Configurar debounce para el filtro de título
    this.titleFilterSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.loadProductsWithFilters();
    });
  }

  ngOnInit(): void {
    this.loadProductsWithFilters();
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

  loadProductsWithFilters(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const filters: ProductFilters = {
      title: this.titleFilter,
      available: this.availableFilter
    };

    this.productsService.getProductsWithFilters(filters).subscribe({
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

  onTitleFilterChange(): void {
    this.titleFilterSubject.next(this.titleFilter);
  }

  onAvailableFilterChange(): void {
    this.loadProductsWithFilters();
  }

  clearFilters(): void {
    this.titleFilter = '';
    this.availableFilter = null;
    this.loadProductsWithFilters();
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
    this.loadProductsWithFilters();
  }

  onProductUpdated(updatedProduct: Product): void {
    // Cerrar modal y recargar lista desde API
    this.closeUpdateModal();
    this.loadProductsWithFilters();
  }

  onStockIncremented(updatedProduct: Product): void {
    // Cerrar modal y recargar lista desde API
    this.closeIncrementStockModal();
    this.loadProductsWithFilters();
  }

  deleteProduct(productId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.deletingProductId = productId;
      
      this.productsService.deleteProduct(productId).subscribe({
        next: () => {
          this.deletingProductId = null;
          this.loadProductsWithFilters();
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
