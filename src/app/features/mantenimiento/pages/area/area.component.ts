import { Component, inject, signal } from '@angular/core';

import { AreaService } from '../../../../core/services/area.service';
import { Area } from '../../../../core/models/area';

import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import {
  DynamicFormComponent
} from '../../../../shared/components/dynamic-form/dynamic-form.component';
import { FormField } from '../../../../shared/model/form-field.model';
import { ToastService } from '../../../../shared/services/toast.service';



@Component({
  selector: 'app-area',
  standalone: true,
  imports: [
    ModalComponent,
    DynamicFormComponent
  ],
  templateUrl: './area.component.html',
  styleUrl: './area.component.css'
})
export class AreaComponent {

  private toast = inject(ToastService);

  private readonly areaService = inject(AreaService);

  readonly areas = signal<Area[]>([]);

  readonly modalOpen = signal(false);

  readonly selectedArea =
    signal<Area | null>(null);

  //eliminar
  readonly deleteModalOpen = signal(false);
  readonly areaToDelete = signal<Area | null>(null);    

  readonly fields: FormField[] = [
    {
      key: 'nombre',
      label: 'Nombre',
      type: 'text',
      required: true,
      placeholder: 'Ingrese nombre del área'
    }
  ];

  constructor() {
    this.loadAreas();
  }

  loadAreas(): void {

    this.areaService
      .list()
      .subscribe(data => {
        this.areas.set(data);
      });
  }

  create(): void {

    this.selectedArea.set(null);

    this.modalOpen.set(true);
  }

  edit(area: Area): void {

    this.selectedArea.set(area);

    this.modalOpen.set(true);
  }

  closeModal(): void {

    this.modalOpen.set(false);
  }

  save(formData: Record<string, any>): void {

    const area: Area = {
      nombre: formData['nombre']
    };
  
    if (this.selectedArea()) {
      area.id = this.selectedArea()!.id;
    }
  
    const request =
      this.selectedArea()
        ? this.areaService.update(area)
        : this.areaService.register(area);
  
    request.subscribe(() => {
      this.notify();
      this.loadAreas();
      this.closeModal();
    });
  }

  delete(area: Area): void {

    area.status=2;
    this.areaToDelete.set(area);
  
    this.deleteModalOpen.set(true);
  
  }
  cancelDelete(): void {

    this.deleteModalOpen.set(false);
  
    this.areaToDelete.set(null);
  
  }
  confirmDelete(): void {

    const grupo = this.areaToDelete();
  
    if (!grupo) {
      return;
    }
  
    this.areaService
        .update(grupo)
        .subscribe(() => {
  
          this.toast.show(
            'Grupo eliminado',
            'El grupo fue eliminado correctamente.',
            'success'
          );
  
          this.loadAreas();
  
          this.cancelDelete();
  
        });
  
  }
  notify(){
    this.toast.show(
      'Area Created',
      `El area se creo exitosamente`,
      'success'
    );
  }
}