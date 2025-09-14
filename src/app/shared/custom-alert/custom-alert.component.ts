import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AlertOptions {
  title?: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCloseButton?: boolean;
}

@Component({
  selector: 'app-custom-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-alert.component.html',
  styleUrls: ['./custom-alert.component.css']
})
export class CustomAlertComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() options: AlertOptions = {
    message: '',
    type: 'info',
    showCancelButton: false,
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    showCloseButton: true
  };

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  ngOnInit() {
    // Add event listener for escape key
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  ngOnDestroy() {
    // Remove event listener
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isVisible) {
      this.onClose();
    }
  }

  onConfirm() {
    this.confirm.emit();
    this.isVisible = false;
  }

  onCancel() {
    this.cancel.emit();
    this.isVisible = false;
  }

  onClose() {
    this.close.emit();
    this.isVisible = false;
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  getAlertClass(): string {
    return `alert-${this.options.type}`;
  }

  getIconClass(): string {
    switch (this.options.type) {
      case 'success':
        return 'bi bi-check-circle-fill';
      case 'warning':
        return 'bi bi-exclamation-triangle-fill';
      case 'error':
        return 'bi bi-x-circle-fill';
      default:
        return 'bi bi-info-circle-fill';
    }
  }
}