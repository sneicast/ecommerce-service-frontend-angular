import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/product.interface';
import { CreateProductFormComponent } from '../../components/create-product-form/create-product-form.component';
import { UpdateProductFormComponent } from '../../components/update-product-form/update-product-form.component';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-products-page',
  imports: [CommonModule, CreateProductFormComponent, UpdateProductFormComponent, ModalComponent],
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss'
})
export class ProductsPage implements OnInit {
  products: Product[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  showCreateModal: boolean = false;
  showUpdateModal: boolean = false;
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
    // Limpiar estado anterior y establecer nuevo ID
    this.selectedProductId = 0;
    this.showUpdateModal = false;
    
    // Usar setTimeout para asegurar que el componente se reinicialice
    setTimeout(() => {
      this.selectedProductId = productId;
      this.showUpdateModal = true;
    }, 0);
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
    // Limpiar el ID después de cerrar el modal
    setTimeout(() => {
      this.selectedProductId = 0;
    }, 100);
  }

  onProductCreated(product: Product): void {
    // Agregar el nuevo producto a la lista
    this.products.unshift(product);
    this.closeCreateModal();
  }

  onProductUpdated(updatedProduct: Product): void {
    // Actualizar el producto en la lista
    const index = this.products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      this.products[index] = updatedProduct;
    }
    this.closeUpdateModal();
  }

  deleteProduct(productId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
      this.deletingProductId = productId;
      
      this.productsService.deleteProduct(productId).subscribe({
        next: () => {
          console.log('Producto eliminado exitosamente');
          // Remover el producto de la lista
          this.products = this.products.filter(product => product.id !== productId);
          this.deletingProductId = null;
        },
        error: (error) => {
          console.error('Error al eliminar producto:', error);
          this.errorMessage = 'Error al eliminar el producto.';
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
