import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from '@bombos/ui';

@Component({
  standalone: true,
  selector: 'bombos-upload-file',
  template: `
    <label
      for="uploadFile1"
      class="bg-gray-800 hover:bg-gray-700 text-white p-3 outline-none rounded w-max cursor-pointer mx-auto block font-[sans-serif]"
    >
      <bombos-icon name="upload" />
      <input
        type="file"
        id="uploadFile1"
        class="hidden"
        accept="image/*"
        (change)="onFileUpload($event)"
      />
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, ReactiveFormsModule, IconComponent],
})
export class UploadFileComponent {
  @Output() upload = new EventEmitter<File>();

  onFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.item(0);
    if (!file) return;
    this.upload.emit(file);
  }
}
