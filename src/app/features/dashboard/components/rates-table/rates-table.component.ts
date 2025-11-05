import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  InputSignal,
  input,
  output
} from '@angular/core';
import { Rate } from '../../../../core/models/rate.model';

@Component({
  selector: 'app-rates-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rates-table.component.html',
  styleUrls: ['./rates-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatesTableComponent {
  readonly rates: InputSignal<Rate[]> = input<Rate[]>([]);
  readonly loading = input(false);
  readonly error = input<string | null>(null);
  readonly selectedCode = input<string | null>(null);

  readonly rateSelected = output<string>();

  trackByCode(_: number, item: Rate): string {
    return item.code;
  }

  onRowClick(code: string): void {
    this.rateSelected.emit(code);
  }
}
