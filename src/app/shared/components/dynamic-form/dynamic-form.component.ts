import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField } from '../../model/form-field.model';

@Component({
  selector: 'app-dynamic-form',
  imports: [ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormComponent {

  private readonly fb = inject(FormBuilder);

  readonly fields = input.required<FormField[]>();

  readonly value = input<Record<string, any> | null>(null);

  readonly submitLabel = input('Guardar');

  readonly submitted =
    output<Record<string, any>>();

  readonly form = computed(() => {
    console.log('CREANDO FORM');

    const group: Record<string, FormControl> = {};

    for (const field of this.fields()) {

      const validators = [];

      if (field.required) {
        validators.push(Validators.required);
      }

      group[field.key] = new FormControl(
        '',
        validators
      );
    }

    return new FormGroup(group);
  });

  constructor() {

    effect(() => {

      const value = this.value();

      if (!value) {
        return;
      }

      queueMicrotask(() => {
        this.form().patchValue(value);
      });

    });

  }

  save(): void {

    const form = this.form();
    console.log("dinamyv save")
    console.log(form)
    if (form.invalid) {

      form.markAllAsTouched();

      return;
    }

    this.submitted.emit(
      form.getRawValue()
    );
  }

}
