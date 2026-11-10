import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Earthquake, EarthquakeResponse } from '../interfaces/earthquake';

@Injectable({
  providedIn: 'root',
})
export class EarthquakeService {
  private apiUrl='http://localhost:8000/api'
  private http=inject(HttpClient)

  // Obtener terremotos almacenados
  getEarthquakes(page: number, pageSize: number = 20): Observable<EarthquakeResponse> {

    const params = new HttpParams()
      .set('page', page)
      .set('page_size', pageSize);

    return this.http.get<EarthquakeResponse>(
      `${this.apiUrl}/earthquakes`,
      { params }
    );
  }

  // Consultar estado de importación histórica
  getImportStatus(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/earthquakes/import-history/status`
    );
  }

  // Iniciar importación histórica
  importHistory(
    startDate: string,
    endDate: string,
    minMagnitude: number | null = null
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/earthquakes/import-history`,
      {
        start_date: startDate,
        end_date: endDate,
        min_magnitude: minMagnitude
      }
    );
  }
}

