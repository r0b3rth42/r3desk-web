import { Component, inject, input, signal } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {

  readonly toastService = inject(ToastService);

  protected getIcon(type: string): string {

    switch (type) {

      case 'success':
        return '✓';

      case 'error':
        return '✕';

      case 'warning':
        return '⚠';

      default:
        return 'ℹ';

    }
  }

}
