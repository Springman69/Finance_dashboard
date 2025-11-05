import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core';
import { DateRange } from '../../../../core/models/date-range.model';

@Component({
  selector: 'app-controls-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './controls-panel.component.html',
  styleUrls: ['./controls-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlsPanelComponent {
  readonly codes = input<string[]>([]);
  readonly selectedCode = input<string | null>(null);
  readonly dateRange = input<DateRange>({ start: '', end: '' });
  readonly filterTerm = input('');
  readonly lastUpdated = input<string | null>(null);
  readonly loading = input(false);

  readonly codeChange = output<string>();
  readonly filterChange = output<string>();
  readonly dateRangeChange = output<DateRange>();
  readonly refreshRequested = output<void>();

  onFilterInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filterChange.emit(value);
  }

  onCodeSelected(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (!value) {
      return;
    }
    this.codeChange.emit(value);
  }

  onStartChanged(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const current = this.dateRange();
    this.dateRangeChange.emit({ ...current, start: value });
  }

  onEndChanged(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const current = this.dateRange();
    this.dateRangeChange.emit({ ...current, end: value });
  }

  onRefresh(): void {
    this.refreshRequested.emit();
  }
}
