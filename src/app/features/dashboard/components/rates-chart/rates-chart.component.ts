import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  InputSignal,
  computed,
  input
} from '@angular/core';
import { NgIf } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

let chartRegistered = false;
import { RateSeriesPoint } from '../../../../core/models/rate-series.model';
import { DateRange } from '../../../../core/models/date-range.model';

@Component({
  selector: 'app-rates-chart',
  standalone: true,
  imports: [CommonModule, NgIf, NgChartsModule],
  templateUrl: './rates-chart.component.html',
  styleUrls: ['./rates-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatesChartComponent {
  constructor() {
    if (!chartRegistered) {
      Chart.register(...registerables);
      chartRegistered = true;
    }
  }

  readonly series: InputSignal<RateSeriesPoint[]> = input<RateSeriesPoint[]>([]);
  readonly selectedCode = input<string | null>(null);
  readonly currencyName = input<string | null>(null);
  readonly dateRange = input<DateRange>({ start: '', end: '' });
  readonly loading = input(false);
  readonly error = input<string | null>(null);

  readonly chartData = computed<ChartConfiguration<'line'>['data']>(() => {
    const points = this.series();

    return {
      labels: points.map((point) => point.date),
      datasets: [
        {
          label: this.seriesLabel(),
          data: points.map((point) => point.mid),
          fill: false,
          tension: 0.3,
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.35)',
          pointBackgroundColor: '#38bdf8',
          pointBorderColor: '#0f172a',
          pointRadius: 3
        }
      ]
    };
  });

  readonly hasData = computed(() => this.series().length > 0);

  readonly chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: 'rgba(226, 232, 240, 0.8)'
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.2)'
        }
      },
      y: {
        ticks: {
          color: 'rgba(226, 232, 240, 0.8)'
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.15)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#111c33',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(148, 163, 184, 0.4)',
        borderWidth: 1
      }
    }
  };

  private seriesLabel(): string {
    if (this.currencyName()) {
      return `${this.currencyName()} (${this.selectedCode() ?? ''})`;
    }
    return this.selectedCode() ?? 'FX Rate';
  }
}
