import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormMetrics } from '../../components/form-metrics/form-metrics';
import { EarthquakeFilters, EarthquakeMetrics } from '../../interfaces/earthquake';
import { EarthquakeService } from '../../services/earthquake-service';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { MetricsSummary } from '../../components/metrics/metrics-summary/metrics-summary';
import { TopContries } from '../../components/metrics/top-contries/top-contries';
import { MaxEarthquake } from '../../components/metrics/max-earthquake/max-earthquake';
import { TimeDistribution } from '../../components/metrics/graphics/time-distribution/time-distribution';
import { MagnitudeDepth } from '../../components/metrics/graphics/magnitude-depth/magnitude-depth';
import { EarthquakeEvolution } from '../../components/metrics/graphics/earthquake-evolution/earthquake-evolution';

@Component({
  selector: 'app-metrics-page',
  imports: [ReactiveFormsModule, FormMetrics, MetricsSummary, TopContries, MaxEarthquake, TimeDistribution,MagnitudeDepth,EarthquakeEvolution],
  templateUrl: './metrics-page.html',
  styleUrl: './metrics-page.css',
})
export class MetricsPage {
  private earthquakeSvc=inject(EarthquakeService);


  filterForm = signal<Partial<EarthquakeFilters>>(this.earthquakeSvc.lastMetricsFilters() ?? {
    countryCode: null,
    startDate: this.formatDate(new Date()),
    endDate: this.formatDate(new Date()),
    minMagnitude: null,
    maxMagnitude: null,
    minDepth: null,
    maxDepth: null
  });

  metrics = rxResource({
    params: () => this.filterForm(),

    stream: ({ params }) => {
      if (!params) {
        return of({} as EarthquakeMetrics);
      }

      this.earthquakeSvc.setLastMetricsFilters(params);
      return this.earthquakeSvc.getEarthquakeMetrics(params);
    }
  });

  private formatDate(date: Date | null): string | null {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  get averageLabel(): string {
  const data = this.metrics.value();

  if (!data) return 'Media diaria';

  return data.summary.average_per_hour !== null
    ? 'Media por hora'
    : 'Media diaria';
}

onFiltersChange(filters: Partial<EarthquakeFilters>): void {
  this.filterForm.set(filters);
  this.earthquakeSvc.setLastMetricsFilters(filters);
}
}
