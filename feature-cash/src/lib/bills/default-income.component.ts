import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Id, MoneyChangeItem } from '@bombos/data-access';

@Component({
  standalone: true,
  selector: 'bombos-default-income',
  imports: [AsyncPipe, ReactiveFormsModule],
  template: `
    <select
      class="w-full p-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block"
      [formControl]="formControl"
      (change)="valueChange.emit(formControl.value)"
    >
      @for (incomeItem of incomes; track incomeItem.id) {
      <option [value]="incomeItem.id">
        {{ incomeItem.name }} {{ incomeItem.amount }}
      </option>
      }
    </select>
  `,
})
export class DefaultIncomeComponent {
  @Input() incomes: (MoneyChangeItem & Id)[] = [];
  @Input() set defaultValue(value: string) {
    this.formControl.patchValue(value);
  }

  @Output() valueChange = new EventEmitter<string>();

  readonly formControl = new FormControl();
}
