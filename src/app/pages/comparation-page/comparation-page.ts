import { Component, inject, signal } from '@angular/core';
import { EarthquakeComparisonFilters, EarthquakeComparisonMetrics } from '../../interfaces/earthquake';
import { FormComparison } from '../../components/form-comparison/form-comparison';
import { ComparisonSummary } from '../../components/metrics/comparison/comparison-summary/comparison-summary';
import { ComparisonEarthquakeEvolution } from '../../components/metrics/comparison/graphics/comparison-earthquake-evolution/comparison-earthquake-evolution';
import { ComparisonTimeDistribution } from '../../components/metrics/comparison/graphics/comparison-time-distribution/comparison-time-distribution';
import { ComparisonMagnitudeDepth } from '../../components/metrics/comparison/graphics/comparison-magnitude-depth/comparison-magnitude-depth';
import { ComparisonTopCountries } from '../../components/metrics/comparison/comparison-top-countries/comparison-top-countries';
import { ComparisonMaxEarthquake } from '../../components/metrics/comparison/comparison-max-earthquake/comparison-max-earthquake';
import { rxResource } from '@angular/core/rxjs-interop';
import { EarthquakeService } from '../../services/earthquake-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-comparation-page',
  imports: [FormComparison, ComparisonSummary, ComparisonEarthquakeEvolution, ComparisonTimeDistribution, ComparisonMagnitudeDepth, ComparisonTopCountries, ComparisonMaxEarthquake, RouterLink],
  templateUrl: './comparation-page.html',
  styleUrl: './comparation-page.css',
})
export class ComparationPage {
  hasSearched = signal(false);
  filterForm = signal<Partial<EarthquakeComparisonFilters>>({
    startDay: 1,
    startMonth: 1,
    endDay: 31,
    endMonth: 12,

    firstYear: 2024,
    secondYear: 2025,

    countryCode: null,
    minMagnitude: null,
    maxMagnitude: null,
    minDepth: null,
    maxDepth: null
  });
  private earthquakeSvc = inject(EarthquakeService);

  comparison = rxResource({
    params: () => {if (!this.hasSearched()) {
        return undefined;
      }

      return this.filterForm();},

    stream: ({ params }) =>
      this.earthquakeSvc.getEarthquakeComparison(params)
  });

  onFiltersChange(filters: Partial<EarthquakeComparisonFilters>): void {

    this.filterForm.set(filters);
    this.hasSearched.set(true);


    console.log('Filtros de comparación:', filters);

  }

  get averageLabel(): string {

    return 'Media diaria';

  }

}
