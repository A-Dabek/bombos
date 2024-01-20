import { NgForOf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { ShoppingItem } from '@bombos/data-access';
import { IconComponent } from '@bombos/ui';

@Component({
  standalone: true,
  selector: 'bombos-list-item-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form
      class="max-w-sm mx-auto"
      [formGroup]="formGroup"
      (ngSubmit)="onSubmit($event)"
    >
      <input
        formControlName="name"
        class="px-2 py-1 rounded-md bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full"
        placeholder="Name"
        required
      />
      <div class="flex justify-between mt-1 items-center">
        <input
          formControlName="amount"
          type="number"
          class="px-2 py-1 rounded-md bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block"
        />

        <select
          formControlName="unit"
          class="px-2 py-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block"
        >
          <option>x</option>
          <option>kg</option>
          <option>l</option>
          <option>g</option>
        </select>

        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              formControlName="urgent"
              type="checkbox"
              value=""
              class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
              required
            />
          </div>
          <label
            for="remember"
            class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >Urgent</label
          >
        </div>
      </div>

      <select
        formControlName="group"
        class="px-2 py-1 mt-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block"
      >
        <option *ngFor="let group of groups" [value]="group">
          {{ group }}
        </option>
      </select>

      <textarea
        formControlName="description"
        rows="2"
        class="mt-1 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Description"
      ></textarea>

      <div class="flex justify-between mt-1">
        <div>
          <button
            type="button"
            (click)="onCancel()"
            class="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2"
          >
            <bombos-icon name="back"></bombos-icon>
          </button>
        </div>

        <div class="flex justify-between">
          <div>
            <button
              id="submit"
              type="submit"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center"
            >
              <bombos-icon name="check"></bombos-icon>
            </button>
          </div>

          <div class="ml-2.5">
            <button
              id="submit-next"
              type="submit"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center"
            >
              <bombos-icon name="check-double"></bombos-icon>
            </button>
          </div>
        </div>
      </div>
    </form>
  `,
  imports: [FormsModule, ReactiveFormsModule, NgForOf, IconComponent],
})
export class ListItemFormComponent implements OnInit {
  @HostBinding('class') readonly clazz = '';

  private fb = inject(NonNullableFormBuilder);

  formGroup = this.fb.group({
    name: '',
    amount: 0,
    unit: 'x',
    description: '',
    urgent: false,
    group: '',
  });

  @Input() groups: string[] = [];
  @Input() value: ShoppingItem | undefined;
  @Output() save = new EventEmitter<ShoppingItem>();
  @Output() cancel = new EventEmitter<void>();

  ngOnInit() {
    if (this.value) {
      this.formGroup.patchValue(this.value);
    }
  }

  onSubmit(event: SubmitEvent) {
    this.save.emit({
      name: this.formGroup.value.name || '',
      amount: this.formGroup.value.amount || 1,
      unit: this.formGroup.value.unit || 'x',
      description: this.formGroup.value.description || '',
      urgent: this.formGroup.value.urgent || false,
      group: this.formGroup.value.group || '',
    });
    this.formGroup.reset();
    if (event.submitter?.id === 'submit') {
      this.onCancel();
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
