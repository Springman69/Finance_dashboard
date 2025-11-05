import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-card',
  standalone: true,
  template: `<ng-content></ng-content>`,
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ui-card'
  }
})
export class UiCardComponent {}
