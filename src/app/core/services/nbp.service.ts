import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LatestRatesResponse, Rate } from '../models/rate.model';
import { RateSeriesPoint } from '../models/rate-series.model';

interface NbpTableResponse {
  effectiveDate: string;
  rates: Rate[];
}

interface NbpTable {
  effectiveDate: string;
  rates: Rate[];
}

interface NbpSeriesResponse {
  currency: string;
  code: string;
  table: string;
  rates: Array<{
    effectiveDate: string;
    mid: number;
  }>;
}

@Injectable({ providedIn: 'root' })
export class NbpService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://api.nbp.pl/api';

  getLatestRates(): Observable<LatestRatesResponse> {
    return this.http
      .get<NbpTable[]>(`${this.baseUrl}/exchangerates/tables/A?format=json`)
      .pipe(
        map((tables) => {
          const [table] = tables;
          const latest: NbpTableResponse = {
            effectiveDate: table?.effectiveDate ?? '',
            rates: table?.rates ?? []
          };
          return latest;
        })
      );
  }

  getHistoricalSeries(code: string, start: string, end: string): Observable<RateSeriesPoint[]> {
    return this.http
      .get<NbpSeriesResponse>(
        `${this.baseUrl}/exchangerates/rates/A/${code}/${start}/${end}/?format=json`
      )
      .pipe(
        map((response) =>
          response.rates.map((entry) => ({
            date: entry.effectiveDate,
            mid: entry.mid
          }))
        )
      );
  }
}
