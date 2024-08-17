import { NgClass, NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Delivery, Id } from '@bombos/data-access';
import {
  ConfirmButtonComponent,
  IconComponent,
  LoadingComponent,
} from '@bombos/ui';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'bombos-delivery-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IconComponent,
    LoadingComponent,
    NgClass,
    ConfirmButtonComponent,
    NgStyle,
    RouterLink,
    ReactiveFormsModule,
  ],

  template: `
    @if (loading()) {
    <bombos-loading />
    }
    <img
      class="inner object-cover border border-1 w-full rounded-t-lg md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
      [src]="delivery().img"
      [ngClass]="fullHeight() ? 'h-full' : 'h-24'"
      alt=""
      [routerLink]="link()"
    />
    <div class="flex w-full justify-between p-2 leading-normal">
      <div class="w-full flex justify-between p-4 leading-normal">
        <form
          class="relative z-0 w-full mb-5 group mr-2"
          [formGroup]="formGroup"
        >
          <input
            type="text"
            name="alias"
            id="alias"
            formControlName="alias"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=""
          />
          <label
            for="alias"
            class="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus: peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >What's inside?</label
          >
        </form>
      </div>
      <div [ngClass]="fullHeight() ? 'fixed bottom-3 right-3' : ''">
        <bombos-confirm-button (confirm)="complete.emit()">
          <button
            type="button"
            class="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm p-2 me-2 mb-2"
          >
            <bombos-icon name="delivery" />
          </button>
        </bombos-confirm-button>
      </div>
    </div>
  `,
})
export class DeliveryCardComponent implements OnInit {
  @HostBinding('class') _ =
    'block relative flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100';

  delivery = input.required<Delivery & Id>();
  loading = input(false);
  link = input<unknown[]>([]);
  fullHeight = input(false);

  complete = output();
  update = output<string>();

  private fb = inject(NonNullableFormBuilder);

  formGroup!: FormGroup<{
    alias: FormControl<string>;
  }>;

  ngOnInit() {
    this.formGroup = this.fb.group({
      alias: this.fb.control(this.delivery().alias),
    });
    this.formGroup.controls.alias.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(500))
      .subscribe((value) => {
        this.update.emit(value);
      });
  }
}
