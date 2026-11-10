import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { EarthquakeManagerService } from './services/earthquake-manager-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAppInitializer(async () => {
      const manager = inject(EarthquakeManagerService);
      try {
        const response = await fetch('config.json');
        if (!response.ok) {
          throw new Error('No se pudo cargar config.json');
        }
        const config = await response.json();
        if (config.mode === 'api') {
          manager.connect(config.apiUrl);
        }
      } catch (error){
        console.error('Error inicializando terremotos:', error);

      }
    })
  ]
};
