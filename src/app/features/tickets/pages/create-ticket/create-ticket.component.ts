import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AreaService } from '../../../../core/services/area.service';
import { GrupoService } from '../../../../core/services/grupo.service';
import { Area } from '../../../../core/models/area';
import { Grupo } from '../../../../core/models/grupo';
import { Ticket } from '../../../../core/models/ticket';
import { Usuario } from '../../../../core/models/usuario';
import { TicketService } from '../../../../core/services/ticket.service';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-create-ticket',
  imports: [ReactiveFormsModule],
  templateUrl: './create-ticket.component.html',
  styleUrl: './create-ticket.component.css'
})
export class CreateTicketComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly areaService = inject(AreaService);
  private readonly grupoService = inject(GrupoService);
  private readonly ticketService = inject(TicketService);

  private toast = inject(ToastService);

  readonly areas = signal<Area[]>([]);

  readonly reviewerGroups = signal<Grupo[]>([]);
  readonly requesterGroups = signal<Grupo[]>([]);

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],

    area: ['', Validators.required],
    group: ['', Validators.required],

    requesterArea: ['', Validators.required],
    requesterGroup: ['', Validators.required],

    category: ['', Validators.required],
    priority: ['', Validators.required],
    description: ['', Validators.required]
  });

  ngOnInit(): void {
    this.loadAreas();

    this.listenAreaChanges();
  }

  private loadAreas(): void {
    this.areaService.list().subscribe({
      next: areas => this.areas.set(areas)
    });
  }

  private listenAreaChanges(): void {

    this.form.controls.area.valueChanges.subscribe(areaId => {

      this.form.controls.group.setValue('');

      if (!areaId) {
        this.reviewerGroups.set([]);
        return;
      }

      this.loadReviewerGroups(+areaId);
    });

    this.form.controls.requesterArea.valueChanges.subscribe(areaId => {

      this.form.controls.requesterGroup.setValue('');

      if (!areaId) {
        this.requesterGroups.set([]);
        return;
      }

      this.loadRequesterGroups(+areaId);
    });
  }

  private loadReviewerGroups(areaId: number): void {

    this.grupoService.list(areaId)
      .subscribe({
        next: groups => this.reviewerGroups.set(groups),
        error: console.error
      });
  }

  private loadRequesterGroups(areaId: number): void {

    this.grupoService.list(areaId)
      .subscribe({
        next: groups => this.requesterGroups.set(groups),
        error: console.error
      });
  }

  save(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  
    const formValue = this.form.getRawValue();

    let requestered : Usuario = {
      id: 1,
      username: "roberth"
    };

    let area1 : Area = {
      id: +formValue.area,
      nombre: "area1"
    }

    let area2 : Area = {
      id: +formValue.requesterArea,
      nombre: "area2"
    }

    let group1 : Grupo = {
      id: +formValue.group,
      nombre: "grupo"
    }

    let group2 : Grupo = {
      id: +formValue.requesterGroup,
      nombre: "grupo2"
    }
  
    const request: Ticket = {

      title: formValue.title,
      description: formValue.description,
      priority: formValue.priority,

      sourceArea: area2,
      sourceGroup: group2,

      targetArea: area1,
      targetGroup: group1,

      requester: requestered
  
    };
  
    this.ticketService.save(request)
      .subscribe({
  
        next: response => {
  
          this.toast.show(
            'Ticket Created',
            `Reference Number: ${response.code}`,
            'success'
          );
  
          this.form.reset();
  
          this.reviewerGroups.set([]);
          this.requesterGroups.set([]);
  
        },
  
        error: error => {
  
          this.toast.show(
            'Operation Failed',
            'Unable to create the ticket.',
            'error'
          );  
        }
  
      });
  
  }

}