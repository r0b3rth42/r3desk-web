import { Component, inject, signal } from '@angular/core';
import { ToastService } from '../../../../shared/services/toast.service';
import { GrupoService } from '../../../../core/services/grupo.service';
import { Grupo } from '../../../../core/models/grupo';
import { FormField } from '../../../../shared/model/form-field.model';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { DynamicFormComponent } from '../../../../shared/components/dynamic-form/dynamic-form.component';
import { AreaService } from '../../../../core/services/area.service';
import { Area } from '../../../../core/models/area';

@Component({
  selector: 'app-grupo',
  imports: [
    ModalComponent,
    DynamicFormComponent
  ],
  templateUrl: './grupo.component.html',
  styleUrl: './grupo.component.css'
})
export class GrupoComponent {

  private toast = inject(ToastService);

  private readonly grupoService = inject(GrupoService);
  private readonly areaService = inject(AreaService);

  readonly areas = signal<Area[]>([]);

  readonly grupos = signal<Grupo[]>([]);

  readonly modalOpen = signal(false);

  readonly selectedGrupo =
    signal<Grupo | null>(null);


  //eliminar
  readonly deleteModalOpen = signal(false);
  readonly grupoToDelete = signal<Grupo | null>(null);

  readonly fields = signal<FormField[]>([
    {
      key: 'nombre',
      label: 'Nombre',
      type: 'text',
      required: true,
      placeholder: 'Ingrese nombre del grupo'
    },
    {
      key: 'areaId',
      label: 'Área',
      type: 'select',
      required: true,
      options: []
    }
  ]);

  constructor() {
    this.loadAreas();
    this.loadGrupos();
  }

  loadGrupos(): void {

    this.grupoService
      .listAll()
      .subscribe(data => {
        this.grupos.set(data);
      });
  }

  create(): void {

    this.selectedGrupo.set(null);

    this.modalOpen.set(true);
  }

  edit(grupo: Grupo): void {
    console.log("edit boton")
    console.log(grupo)
    this.selectedGrupo.set(grupo);

    this.modalOpen.set(true);
  }

  closeModal(): void {

    this.modalOpen.set(false);
  }

  save(formData: Record<string, any>): void {

    let areaId = formData['areaId'];
    let area : Area = {
      nombre: '',
      id : areaId
    }

    const grupo: Grupo = {
      nombre: formData['nombre'],
      area
    };

    if (this.selectedGrupo()) {
      grupo.id = this.selectedGrupo()!.id;
    }


    const request =
      this.selectedGrupo()
        ? this.grupoService.update(grupo)
        : this.grupoService.register(grupo);

    request.subscribe(() => {
      this.notify();
      this.loadGrupos();
      this.closeModal();
    });
  }

  delete(grupo: Grupo): void {

    grupo.status=2;
    this.grupoToDelete.set(grupo);
  
    this.deleteModalOpen.set(true);
  
  }
  cancelDelete(): void {

    this.deleteModalOpen.set(false);
  
    this.grupoToDelete.set(null);
  
  }
  confirmDelete(): void {

    const grupo = this.grupoToDelete();
  
    if (!grupo) {
      return;
    }
  
    this.grupoService
        .update(grupo)
        .subscribe(() => {
  
          this.toast.show(
            'Grupo eliminado',
            'El grupo fue eliminado correctamente.',
            'success'
          );
  
          this.loadGrupos();
  
          this.cancelDelete();
  
        });
  
  }

  loadAreas(): void {

    this.areaService
      .list()
      .subscribe(areas => {

        const currentFields = this.fields();

        const updatedFields = currentFields.map(field => {

          if (field.key !== 'areaId') {
            return field;
          }

          return {
            ...field,
            options: areas.map(area => ({
              value: area.id,
              label: area.nombre
            }))
          };

        });

        this.fields.set(updatedFields);

      });

  }

  notify() {
    this.toast.show(
      'Grupo Created',
      `El grupo se creo exitosamente`,
      'success'
    );
  }
}
