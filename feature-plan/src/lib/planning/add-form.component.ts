import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { ShoppingList } from '@bombos/data-access';
import { IconComponent } from '@bombos/ui';

@Component({
  standalone: true,
  selector: 'bombos-add-list-form',
  template: `
    <form
      class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100"
      [formGroup]="formGroup"
      (ngSubmit)="onSubmit()"
    >
      <div class="w-full flex justify-between p-4 leading-normal">
        <div class="relative z-0 w-full mb-5 group mr-2">
          <input
            type="text"
            name="alias"
            id="alias"
            formControlName="name"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=""
          />
          <label
            for="alias"
            class="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus: peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >New list name</label
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, IconComponent],
})
export class AddFormComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);

  formGroup!: FormGroup<{
    name: FormControl<string>;
  }>;

  add = output<ShoppingList>();

  ngOnInit() {
    this.formGroup = this.fb.group({
      name: this.fb.control(''),
    });
  }

  onSubmit() {
    this.add.emit({
      name: this.formGroup.controls.name.value,
    });
    this.formGroup.reset();
  }
}
