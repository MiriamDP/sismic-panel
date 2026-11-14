import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config-service';

@Injectable({
  providedIn: 'root',
})
export class HealthService {
  private configSvc=inject(ConfigService);
  private apiUrl=this.configSvc.settings.apiUrl;
  private http=inject(HttpClient)

  // Comprobar estado de la API
  getHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }
}
