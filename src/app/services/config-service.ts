import { Injectable } from '@angular/core';
export interface AppConfig {
  mode: string;
  max_earthquakes: number;
  apiUrl: string;
  refreshMs: number;
  skipNgrokWarning: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config!: AppConfig;

  setConfig(config: AppConfig): void {
    this.config = config;
  }

  get settings(): AppConfig {
    if (!this.config) {
      throw new Error('La configuración todavía no se ha cargado');
    }

    return this.config;
  }

  get apiUrl(): string {
    return this.settings.apiUrl;
  }
}
