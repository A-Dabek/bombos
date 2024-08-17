import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { MoneyChangeItem } from '@bombos/data-access';
import { IconComponent } from '@bombos/ui';

@Component({
  standalone: true,
  selector: 'bombos-amount-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form
      [formGroup]="formGroup"
      (ngSubmit)="onSubmit()"
      class="w-full flex justify-between leading-normal"
    >
      <div class="relative z-0 w-full group mr-2">
        <input
          type="text"
          name="name"
          id="alias"
          formControlName="name"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none    focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=""
          required
        />
        <label
          for="alias"
          class="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus: peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >{{ label() }}</label
        >
      </div>
      <div class="relative z-0 group mr-2">
        <input
          type="number"
          name="amount"
          id="amount"
          formControlName="amount"
          class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none    focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=""
          required
        />
        <label
          for="amount"
          class="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus: peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >Suma</label
        >
      </div>
      <div>
        <button
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center"
        >
          <bombos-icon name="plus" />
        </button>
      </div>
    </form>
  `,
  imports: [IconComponent, ReactiveFormsModule, FormsModule],
})
export class AmountComponent {
  readonly formGroup = inject(NonNullableFormBuilder).group({
    name: '',
    amount: 0,
  });

  label = input('Nazwa');

  save = output<MoneyChangeItem>();

  onSubmit() {
    console.log('submit');
    this.save.emit({
      name: this.formGroup.value.name || '',
      amount: this.formGroup.value.amount || 0,
    });
    this.formGroup.reset();
  }
}
