export interface Rate {
  currency: string;
  code: string;
  mid: number;
}

export interface LatestRatesResponse {
  effectiveDate: string;
  rates: Rate[];
}
