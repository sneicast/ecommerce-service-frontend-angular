import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <div 
        *ngFor="let toast of getToasts()"
        [ngClass]="getToastClasses(toast.type)"
        class="flex items-center p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ease-in-out animate-slide-in">
        
        <div class="flex-shrink-0">
          <span class="text-lg">{{ getIcon(toast.type) }}</span>
        </div>
        
        <div class="ml-3 flex-1">
          <p class="text-sm font-medium">{{ toast.message }}</p>
        </div>
        
        <div class="ml-4 flex-shrink-0">
          <button
            (click)="removeToast(toast.id)"
            class="text-white hover:text-gray-200 focus:outline-none focus:text-gray-200 transition-colors duration-200">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-slide-in {
      animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  getToasts(): Toast[] {
    return this.toastService.getToasts();
  }

  removeToast(id: string): void {
    this.toastService.remove(id);
  }

  getToastClasses(type: string): string {
    const baseClasses = 'flex items-center p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ease-in-out';
    
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-500 text-white`;
      case 'error':
        return `${baseClasses} bg-red-500 text-white`;
      case 'warning':
        return `${baseClasses} bg-yellow-500 text-white`;
      case 'info':
        return `${baseClasses} bg-blue-500 text-white`;
      default:
        return `${baseClasses} bg-gray-500 text-white`;
    }
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  }
} 