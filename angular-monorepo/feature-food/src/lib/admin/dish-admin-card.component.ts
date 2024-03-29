import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Dish, Id } from '@bombos/data-access';
import {
  ConfirmButtonComponent,
  IconComponent,
  LoadingComponent,
} from '@bombos/ui';

@Component({
  standalone: true,
  selector: 'bombos-admin-dish-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form
      [formGroup]="formGroup"
      (ngSubmit)="onSubmit()"
      class="w-full flex justify-between leading-normal"
    >
      <div class="relative z-0 w-full mb-5 group mr-2">
        <input
          type="text"
          name="alias"
          id="alias"
          formControlName="name"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none    focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=""
          required
        />
        <label
          for="alias"
          class="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus: peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Meal name</label
        >
      </div>
      <div class="mr-2">
        <button
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center   "
        >
          <bombos-icon name="check" />
        </button>
      </div>
      <bombos-confirm-button class="block" (confirm)="delete.emit()">
        <button
          class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm p-2 me-2 mb-2"
        >
          <bombos-icon name="delete" />
        </button>
      </bombos-confirm-button>
    </form>
    <bombos-loading *ngIf="loading" />
  `,
  imports: [
    IconComponent,
    ConfirmButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    LoadingComponent,
    NgIf,
  ],
})
export class DishAdminCardComponent implements OnChanges {
  @HostBinding('class') class =
    'block max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow relative';

  private fb = inject(NonNullableFormBuilder);

  formGroup = this.fb.group({
    name: '',
  });

  @Input({ required: true }) dish!: Dish & Id;
  @Input() loading = false;

  @Output() save = new EventEmitter<Dish>();
  @Output() list = new EventEmitter();
  @Output() delete = new EventEmitter();

  ngOnChanges() {
    this.formGroup.patchValue({
      name: this.dish.name,
    });
  }

  onSubmit() {
    this.save.emit({
      name: this.formGroup.value.name || '',
    });
  }
}
