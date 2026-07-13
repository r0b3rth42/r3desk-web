import { Injectable, signal } from '@angular/core';
import { ToastMessage, ToastType } from './toast-message';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }
  readonly toasts = signal<ToastMessage[]>([]);

  show(
    title: string,
    message: string,
    type: ToastType = 'info',
    duration = 8000
  ): void {

    const toast: ToastMessage = {
      id: crypto.randomUUID(),
      title,
      message,
      type,
      duration
    };

    this.toasts.update(current => [...current, toast]);

    setTimeout(() => {
      this.remove(toast.id);
    }, duration);
  }

  remove(id: string): void {

    this.toasts.update(current =>
      current.filter(t => t.id !== id)
    );

  }
}
