import { HttpClient, HttpParams, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Earthquake, EarthquakeResponse, Earthquakes, EarthquakesResponse } from '../interfaces/earthquake';
import { EarthquakeMappers } from '../mapper/earthquake-mapper';
import { ImportJob } from '../interfaces/import-job';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EarthquakeService {
  private apiUrl = 'http://localhost:8000/api/earthquakes'
  private http = inject(HttpClient)

  // Obtener terremotos almacenados
  getEarthquakes(page: number, pageSize: number = 20): Observable<Earthquakes> {

    const params = new HttpParams()
      .set('page', page)
      .set('page_size', pageSize);

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


}

