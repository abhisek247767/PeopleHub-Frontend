import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertOptions } from './custom-alert.component';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<{
    isVisible: boolean;
    options: AlertOptions;
  }>({
    isVisible: false,
    options: {
      message: '',
      type: 'info',
      showCancelButton: false,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      showCloseButton: true
    }
  });

  public alert$: Observable<{ isVisible: boolean; options: AlertOptions }> = this.alertSubject.asObservable();

  constructor() {}

  showAlert(options: AlertOptions): Promise<boolean> {
    return new Promise((resolve) => {
      this.alertSubject.next({
        isVisible: true,
        options: {
          ...options,
          confirmButtonText: options.confirmButtonText || 'OK',
          cancelButtonText: options.cancelButtonText || 'Cancel',
          showCloseButton: options.showCloseButton !== false,
          showCancelButton: options.showCancelButton || false
        }
      });

      // Store the resolve function to be called when user responds
      (this as any).currentResolve = resolve;
    });
  }

  onConfirm() {
    if ((this as any).currentResolve) {
      (this as any).currentResolve(true);
      (this as any).currentResolve = null;
    }
    this.hideAlert();
  }

  onCancel() {
    if ((this as any).currentResolve) {
      (this as any).currentResolve(false);
      (this as any).currentResolve = null;
    }
    this.hideAlert();
  }

  onClose() {
    if ((this as any).currentResolve) {
      (this as any).currentResolve(false);
      (this as any).currentResolve = null;
    }
    this.hideAlert();
  }

  hideAlert() {
    this.alertSubject.next({
      isVisible: false,
      options: this.alertSubject.value.options
    });
  }

  // Convenience methods
  showInfo(message: string, title?: string): Promise<boolean> {
    return this.showAlert({ message, title, type: 'info' });
  }

  showSuccess(message: string, title?: string): Promise<boolean> {
    return this.showAlert({ message, title, type: 'success' });
  }

  showWarning(message: string, title?: string): Promise<boolean> {
    return this.showAlert({ message, title, type: 'warning' });
  }

  showError(message: string, title?: string): Promise<boolean> {
    return this.showAlert({ message, title, type: 'error' });
  }

  showConfirm(message: string, title?: string): Promise<boolean> {
    return this.showAlert({
      message,
      title,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    });
  }
}
