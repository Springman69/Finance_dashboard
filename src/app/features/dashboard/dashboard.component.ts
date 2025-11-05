import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { UiCardComponent } from '../../shared/ui/card/card.component';
import { ControlsPanelComponent } from './components/controls-panel/controls-panel.component';
import { RatesTableComponent } from './components/rates-table/rates-table.component';
import { RatesChartComponent } from './components/rates-chart/rates-chart.component';
import { NbpService } from '../../core/services/nbp.service';
import { Rate } from '../../core/models/rate.model';
import { RateSeriesPoint } from '../../core/models/rate-series.model';
import { DateRange } from '../../core/models/date-range.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, UiCardComponent, ControlsPanelComponent, RatesTableComponent, RatesChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private readonly nbpService = inject(NbpService);

  readonly rates = signal<Rate[]>([]);
  readonly ratesLoading = signal(false);
  readonly ratesError = signal<string | null>(null);
  readonly lastUpdated = signal<string | null>(null);

  readonly selectedCode = signal<string | null>(null);
  readonly filterTerm = signal('');
  readonly dateRange = signal<DateRange>(this.createDefaultDateRange());
  readonly refreshCounter = signal(0);

  readonly series = signal<RateSeriesPoint[]>([]);
  readonly seriesLoading = signal(false);
  readonly seriesError = signal<string | null>(null);

  readonly availableCodes = computed(() =>
    [...this.rates().map((rate) => rate.code)].sort((a, b) => a.localeCompare(b))
  );

  readonly filteredRates = computed(() => {
    const query = this.filterTerm().trim().toLowerCase();
    if (!query) {
      return this.rates();
    }
    return this.rates().filter((rate) =>
      `${rate.code} ${rate.currency}`.toLowerCase().includes(query)
    );
  });

  readonly selectedCurrency = computed(() =>
    this.rates().find((rate) => rate.code === this.selectedCode()) ?? null
  );

  constructor() {
    void this.loadLatestRates();

    effect(
      () => {
        const code = this.selectedCode();
        const range = this.dateRange();
        this.refreshCounter();

        if (!code) {
          this.series.set([]);
          return;
        }

        void this.loadHistoricalSeries(code, range.start, range.end);
      },
      { allowSignalWrites: true }
    );
  }

  async loadLatestRates(): Promise<void> {
    this.ratesLoading.set(true);
    this.ratesError.set(null);

    try {
      const latest = await firstValueFrom(this.nbpService.getLatestRates());
      this.rates.set(latest.rates);
      this.lastUpdated.set(latest.effectiveDate);

      if (!latest.rates.length) {
        this.selectedCode.set(null);
        return;
      }

      const currentCode = this.selectedCode();
      if (!currentCode || !latest.rates.some((rate) => rate.code === currentCode)) {
        this.selectedCode.set(latest.rates[0]?.code ?? null);
      }
    } catch (error) {
      console.error('Failed to load latest rates', error);
      this.ratesError.set('Unable to load the latest rates. Please try again later.');
      this.rates.set([]);
      this.selectedCode.set(null);
    } finally {
      this.ratesLoading.set(false);
    }
  }

  async loadHistoricalSeries(code: string, start: string, end: string): Promise<void> {
    this.seriesLoading.set(true);
    this.seriesError.set(null);

    try {
      const data = await firstValueFrom(this.nbpService.getHistoricalSeries(code, start, end));
      this.series.set(data);
    } catch (error) {
      console.error('Failed to load historical series', error);
      this.seriesError.set('Historical data is currently unavailable.');
      this.series.set([]);
    } finally {
      this.seriesLoading.set(false);
    }
  }

  onSelectCode(code: string): void {
    if (code === this.selectedCode()) {
      return;
    }
    this.selectedCode.set(code);
  }

  onFilterChange(value: string): void {
    this.filterTerm.set(value);
  }

  onRangeChange(range: DateRange): void {
    const normalized = this.normalizeRange(range);
    this.dateRange.set(normalized);
  }

  onRefresh(): void {
    this.refreshCounter.update((current) => current + 1);
    void this.loadLatestRates();
  }

  private createDefaultDateRange(): DateRange {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 29);

    return {
      start: this.formatDate(start),
      end: this.formatDate(end)
    };
  }

  private normalizeRange(range: DateRange): DateRange {
    let { start, end } = range;

    if (start && end && start > end) {
      [start, end] = [end, start];
    }

    return {
      start: start || this.dateRange().start,
      end: end || this.dateRange().end
    };
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
