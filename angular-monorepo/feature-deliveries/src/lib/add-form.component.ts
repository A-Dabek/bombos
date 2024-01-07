import { IconComponent } from '@angular-monorepo/ui';
import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Delivery } from '@bombos/data-access';

@Component({
  standalone: true,
  selector: 'bombos-add-form',
  template: `
    <form
      class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
      [formGroup]="formGroup"
      (ngSubmit)="onSubmit()"
    >
      <img
        class="object-cover w-full rounded-t-lg h-24 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
        [src]="fileBase64"
        alt=""
      />
      <div class="w-full flex justify-between p-4 leading-normal">
        <div class="relative z-0 w-full mb-5 group mr-2">
          <input
            type="text"
            name="alias"
            id="alias"
            formControlName="alias"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            for="alias"
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >What's inside?</label
          >
        </div>
        <div>
          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-0.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <bombos-icon name="plus" />
          </button>
        </div>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, ReactiveFormsModule, IconComponent],
})
export class AddFormComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private fb = inject(NonNullableFormBuilder);

  formGroup!: FormGroup<{
    alias: FormControl<string>;
    file: FormControl<File>;
  }>;
  fileBase64: string = '';

  private _file: File | null = null;

  @Input({ required: true }) set file(file: File) {
    this._file = file;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.fileBase64 = reader.result as string;
      this.cdr.markForCheck();
    };
    this.formGroup?.controls.file.setValue(file);
  }

  @Output() add = new EventEmitter<Delivery>();

  ngOnInit() {
    this.formGroup = this.fb.group({
      alias: this.fb.control(''),
      file: this.fb.control<File>(this._file!),
    });
  }

  onSubmit() {
    this.add.emit({
      alias: this.formGroup.controls.alias.value,
      img: this.fileBase64,
    });
    this.formGroup.reset();
  }
}
