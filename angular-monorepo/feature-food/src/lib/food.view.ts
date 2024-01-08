import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'bombos-food-view',
  template: `
    <div class="flex flex-col items-center justify-center">
      <h1 class="text-2xl text-gray-900 dark:text-white">Food</h1>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoodViewComponent {}
