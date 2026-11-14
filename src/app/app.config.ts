import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { EarthquakeManagerService } from './services/earthquake-manager-service';
import { ConfigService } from './services/config-service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ngrokInterceptor } from './interceptors/ngrok.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([ngrokInterceptor])
    ),
    provideAppInitializer(async () => {
      const manager = inject(EarthquakeManagerService);
      const configSvc = inject(ConfigService);
      try {
        const response = await fetch('config.json');
        if (!response.ok) {
          throw new Error('No se pudo cargar config.json');
        }
        const config = await response.json();
        configSvc.setConfig(config);

        if (config.mode === 'api') {
          manager.connect(config.apiUrl);
        }
      } catch (error){
        console.error('Error inicializando terremotos:', error);
        throw error;

      }
    })
  ]
};
