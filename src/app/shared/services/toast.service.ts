import { Injectable } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: Toast[] = [];

  show(type: ToastType, message: string, duration: number = 5000): void {
    const toast: Toast = {
      id: this.generateId(),
      type,
      message,
      duration
    };

    this.toasts.push(toast);

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(toast.id);
      }, duration);
    }
  }

  showSuccess(message: string, duration?: number): void {
    this.show('success', message, duration);
  }

  showError(message: string, duration?: number): void {
    this.show('error', message, duration);
  }

  showWarning(message: string, duration?: number): void {
    this.show('warning', message, duration);
  }

  showInfo(message: string, duration?: number): void {
    this.show('info', message, duration);
  }

  remove(id: string): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  clear(): void {
    this.toasts = [];
  }

  getToasts(): Toast[] {
    return this.toasts;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
} 