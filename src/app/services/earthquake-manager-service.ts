import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EarthquakeMappers } from '../mapper/earthquake-mapper';
import { EarthquakeSocketService } from './earthquake-socket-service';
import { EarthquakeStoreService } from './earthquake-store-service';
import { EarthquakeService } from './earthquake-service';
import { map, of, switchMap, tap } from 'rxjs';
import { ConfigService } from './config-service';

@Injectable({
  providedIn: 'root',
})
export class EarthquakeManagerService {
  private rest = inject(EarthquakeService);
  private socket = inject(EarthquakeSocketService);
  private store = inject(EarthquakeStoreService);
  private destroyRef = inject(DestroyRef);
  private configSvc = inject(ConfigService);
  readonly connected = signal(false);

  connect(apiUrl: string): void {

    const initialLoad$ = this.store.count() === 0
      ? this.loadLatest()
      : of(undefined);

    initialLoad$.pipe(
      switchMap(() => {
        const wsUrl = apiUrl.replace(/^http/, 'ws').replace(/\/$/, '') + '/ws/earthquakes';

        return this.socket.connect(wsUrl);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({

      next: message => {

        if (message.type !== 'earthquakes_update') return;

        const earthquakes = EarthquakeMappers.mapEarthquakes(message.items);

        this.store.addOrUpdate(earthquakes);

        this.connected.set(true);
      },

      error: error => {
        console.error('Error conexión:', error);
        this.connected.set(false);
      },

      complete: () => {
        this.connected.set(false);
      }
    });
  }

  private loadLatest() {
    return this.rest.getLatest(this.configSvc.settings.max_earthquakes).pipe(
      tap(earthquakes => {
        this.store.addOrUpdate(earthquakes);
      }),
      map(() => undefined)
    );
  }

}
