import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';
  @Output() closeModal = new EventEmitter<void>();

  get modalSizeClass(): string {
    switch (this.size) {
      case 'sm':
        return 'sm:max-w-sm';
      case 'md':
        return 'sm:max-w-md';
      case 'lg':
        return 'sm:max-w-lg';
      case 'xl':
        return 'sm:max-w-xl';
      case 'full':
        return 'sm:max-w-7xl';
      default:
        return 'sm:max-w-md';
    }
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeModal.emit();
    }
  }

  onCloseClick(): void {
    this.closeModal.emit();
  }
} 