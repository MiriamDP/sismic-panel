import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HealthService {
  private apiUrl='http://localhost:8000'
  private http=inject(HttpClient)

  // Comprobar estado de la API
  getHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }
}
