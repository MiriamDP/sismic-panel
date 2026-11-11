import { Component, effect, inject, linkedSignal, signal } from '@angular/core';
import { EarthquakeList } from '../../components/earthquake-list/earthquake-list';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { EarthquakeService } from '../../services/earthquake-service';
import { Pagination } from '../../components/pagination/pagination';
import { EarthquakeFilters } from '../../interfaces/earthquake';
import { LucideSlidersHorizontal } from '@lucide/angular';

@Component({
  selector: 'app-historic-page',
  imports: [EarthquakeList, Pagination,LucideSlidersHorizontal],
  templateUrl: './historic-page.html',
  styleUrl: './historic-page.css',
})
export class HistoricPage {
 private earthquakeSvc = inject(EarthquakeService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  queryParams = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map(params => ({
        page: Number(params.get('page')) || 1,
        pageSize: Number(params.get('pageSize')) || 20,

        countryCode: params.get('countryCode'),
        startDate: params.get('startDate'),
        endDate: params.get('endDate'),

        minMagnitude: params.has('minMagnitude')
          ? Number(params.get('minMagnitude')) : null,

        maxMagnitude: params.has('maxMagnitude')
          ? Number(params.get('maxMagnitude')) : null,

        minDepth: params.has('minDepth')
          ? Number(params.get('minDepth')) : null,

        maxDepth: params.has('maxDepth')
          ? Number(params.get('maxDepth')) : null
      }))
    ),
    {
      initialValue: {
        page: 1,
        pageSize: 20,
        countryCode: null,
        startDate: null,
        endDate: null,
        minMagnitude: null,
        maxMagnitude: null,
        minDepth: null,
        maxDepth: null
      }
    }
  );

  filters = signal<EarthquakeFilters>(this.queryParams());

  // Sincronizar filtros con la URL
  navigateEffect = effect(() => {

    const filters = this.filters();

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        page: filters.page,
        pageSize: filters.pageSize,

        countryCode: filters.countryCode,
        startDate: filters.startDate,
        endDate: filters.endDate,

        minMagnitude: filters.minMagnitude,
        maxMagnitude: filters.maxMagnitude,

        minDepth: filters.minDepth,
        maxDepth: filters.maxDepth
      },
      queryParamsHandling: 'merge'
    });

  });

  earthquakesResource = rxResource({

    params: () => this.filters(),

    stream: ({ params }) => {

      return this.earthquakeSvc.getEarthquakes(params);

    }

  });

  // Actualizar un filtro
  updateFilter<K extends keyof EarthquakeFilters>(
    key: K,
    value: EarthquakeFilters[K]
  ): void {

    this.filters.update(filters => ({
      ...filters,
      [key]: value,
      page: 1
    }));

  }

  changePage(page: number): void {

    this.filters.update(filters => ({
      ...filters,
      page
    }));

  }

  changePageSize(size: number): void {

    this.filters.update(filters => ({
      ...filters,
      pageSize: size,
      page: 1
    }));

  }

  clearFilters(): void {

    this.filters.update(filters => ({
      page: 1,
      pageSize: filters.pageSize,

      countryCode: null,
      startDate: null,
      endDate: null,

      minMagnitude: null,
      maxMagnitude: null,

      minDepth: null,
      maxDepth: null
    }));

  }

  reload(): void {
    this.earthquakesResource.reload();
  }
}
