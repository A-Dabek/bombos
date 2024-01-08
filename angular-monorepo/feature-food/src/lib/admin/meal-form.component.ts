import { IconComponent } from '@angular-monorepo/ui';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Meal } from '@bombos/data-access';

@Component({
  standalone: true,
  selector: 'bombos-meal-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form
      [formGroup]="formGroup"
      (ngSubmit)="onSubmit()"
      class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-3 md:p-8"
    >
      <div class="w-full flex justify-between leading-normal">
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
            >New meal</label
          >
        </div>
        <div>
          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center   "
          >
            <bombos-icon name="plus" />
          </button>
        </div>
      </div>
    </form>
  `,
  imports: [IconComponent, ReactiveFormsModule, FormsModule],
})
export class MealFormComponent {
  private fb = inject(NonNullableFormBuilder);

  formGroup = this.fb.group({
    name: '',
  });

  @Output() save = new EventEmitter<Meal>();

  onSubmit() {
    this.save.emit({
      name: this.formGroup.value.name || '',
    });
    this.formGroup.reset();
  }
}
