import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { Earthquake, EarthquakeFilters, EarthquakeMetrics, EarthquakeMetricsResponse, EarthquakeResponse, Earthquakes, EarthquakesResponse } from '../interfaces/earthquake';
import { EarthquakeMappers } from '../mapper/earthquake-mapper';
import { ImportJob } from '../interfaces/import-job';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EarthquakeService {
  private apiUrl = 'http://localhost:8000/api/earthquakes'
  private http = inject(HttpClient)
  private metricsCache = new Map<string, EarthquakeMetrics>();
  lastMetricsFilters = signal<Partial<EarthquakeFilters> | null>(null);

  // Obtener terremotos almacenados
  getEarthquakes(filters: EarthquakeFilters): Observable<Earthquakes> {

    let params = new HttpParams()
      .set('page', filters.page)
      .set('page_size', filters.pageSize);

    if (filters.countryCode !== null) {
      params = params.set('country_code', filters.countryCode);
    }

    if (filters.startDate) {
      params = params.set('start_date', filters.startDate);
    }

    if (filters.endDate) {
      params = params.set('end_date', filters.endDate);
    }

    if (filters.minMagnitude !== null) {
      params = params.set('min_magnitude', filters.minMagnitude);
    }

    if (filters.maxMagnitude !== null) {
      params = params.set('max_magnitude', filters.maxMagnitude);
    }

    if (filters.minDepth !== null) {
      params = params.set('min_depth', filters.minDepth);
    }

    if (filters.maxDepth !== null) {
      params = params.set('max_depth', filters.maxDepth);
    }
    return this.http.get<EarthquakesResponse>(
      `${this.apiUrl}`,
      { params }
    ).pipe(
      map(response => ({ ...response, items: EarthquakeMappers.mapEarthquakes(response.items) }))
    );
  }

  // Consultar estado de importación histórica
  getEarthquake(id: string) {
    return httpResource(
      () => `${this.apiUrl}/${id}`,
      {
        parse: (response) =>
          EarthquakeMappers.mapEarthquake(response as EarthquakeResponse)
      }
    );
  }

  // Iniciar importación histórica
  importHistory(
    startDate: string,
    endDate: string,
    minMagnitude: number | null = null
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/import-history`,
      {
        start_date: startDate,
        end_date: endDate,
        min_magnitude: minMagnitude
      }
    );
  }
  // Obetener importacines histórica
  getImports(): Observable<ImportJob[]> {

    return this.http.get<ImportJob[]>(
      `${this.apiUrl}/import-history/jobs`
    );
  }

  getImportStatus() {
    return this.http.get<any>(
      `${this.apiUrl}/import-history/status`
    );
  }

  getLatest(limit: number = environment.MAX_EARTHQUAKES) {
    return this.http.get<EarthquakeResponse[]>(`${this.apiUrl}/latest?limit=${limit}`).pipe(
      tap(resp => console.log('Respuesta recibida', resp)),
      map(response => EarthquakeMappers.mapEarthquakes(response))
    )
  }

  getEarthquakeMetrics(
    filters: Partial<EarthquakeFilters>
  ): Observable<EarthquakeMetrics> {
    const today = this.formatDate(new Date());

  // Comprobar si alguno de los filtros incluye el día actual
  const isToday =
    filters.startDate === today ||
    filters.endDate === today;

  // Generar clave de caché
  const cacheKey = JSON.stringify(filters);

  // Solo consultar caché si no incluye el día actual
  if (!isToday) {

    const cachedData = this.metricsCache.get(cacheKey);

    if (cachedData) {
      console.log('Métricas recuperadas de caché');

      return of(cachedData);
    }

  }

    let params = new HttpParams();

    const parameterMap: Record<string, string> = {
      countryCode: 'country_code',
      startDate: 'start_date',
      endDate: 'end_date',
      minMagnitude: 'min_magnitude',
      maxMagnitude: 'max_magnitude',
      minDepth: 'min_depth',
      maxDepth: 'max_depth'
    };

    Object.entries(filters).forEach(([key, value]) => {

      if (value !== null && value !== undefined) {

        const apiKey = parameterMap[key] ?? key;

        params = params.set(apiKey, String(value));

      }

    });

    console.log('Filtros: ', filters)

    return this.http.get<EarthquakeMetricsResponse>(
      `${this.apiUrl}/metrics`,
      { params }
    ).pipe(

      map(response => ({

        ...response,

        summary: {
          ...response.summary,

          max_earthquake: response.summary.max_earthquake
            ? EarthquakeMappers.mapEarthquake(
              response.summary.max_earthquake
            )
            : null
        },

        top_countries: response.top_countries.map(country => ({

          ...country,

          max_earthquake: country.max_earthquake
            ? EarthquakeMappers.mapEarthquake(
              country.max_earthquake
            )
            : null

        }))

      })),
      tap(data => {// Guardar únicamente consultas históricas
      if (!isToday) {
        this.metricsCache.set(cacheKey, data);
        console.log('Métricas guardadas en caché');
      } else {
        console.log('Consulta en tiempo real: no se guarda en caché');
      }
})

    );;
  }

  clearMetricsCache(): void {
  this.metricsCache.clear();
}

setLastMetricsFilters(filters: Partial<EarthquakeFilters>): void {
  this.lastMetricsFilters.set({ ...filters });
}

private formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}


}

