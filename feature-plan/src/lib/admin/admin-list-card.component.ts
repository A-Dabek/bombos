import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  input,
  OnChanges,
  output,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Id, ShoppingList } from '@bombos/data-access';
import {
  ConfirmButtonComponent,
  IconComponent,
  LoadingComponent,
} from '@bombos/ui';
import {
  collapseOnLeaveAnimation,
  expandOnEnterAnimation,
} from 'angular-animations';

@Component({
  standalone: true,
  selector: 'bombos-admin-list-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    expandOnEnterAnimation({ anchor: 'enterDetails' }),
    collapseOnLeaveAnimation({ anchor: 'leaveDetails' }),
  ],

  template: `
    @if (loading()) {
    <bombos-loading />
    }
    <div class="flex justify-between items-center">
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
            >List name</label
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
      <ng-content></ng-content>
    </div>
  `,
  imports: [
    RouterLink,
    ConfirmButtonComponent,
    IconComponent,
    KeyValuePipe,
    CdkDrag,
    CdkDragHandle,
    LoadingComponent,
    ReactiveFormsModule,
  ],
})
export class AdminListCardComponent implements OnChanges {
  @HostBinding('class') readonly clazz =
    'block max-w-sm p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100';

  private fb = inject(NonNullableFormBuilder);

  formGroup = this.fb.group({
    name: '',
  });

  list = input.required<ShoppingList & Id>();
  loading = input(false);

  save = output<ShoppingList>();
  delete = output();

  ngOnChanges() {
    this.formGroup.patchValue({
      name: this.list().name,
    });
  }

  onSubmit() {
    this.save.emit({
      name: this.formGroup.value.name || '',
    });
  }
}
