import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EarthquakeMappers } from '../mapper/earthquake-mapper';
import { EarthquakeSocketService } from './earthquake-socket-service';
import { EarthquakeStoreService } from './earthquake-store-service';
import { EarthquakeService } from './earthquake-service';
import { map, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EarthquakeManagerService {
  private rest = inject(EarthquakeService);
  private socket = inject(EarthquakeSocketService);
  private store = inject(EarthquakeStoreService);
  private destroyRef = inject(DestroyRef);
  readonly connected = signal(false);

  // connect(apiUrl: string): void {
  //   if (this.store.count()===0){
  //     this.loadLatest();
  //   }


  //   /*Conexion ws*/
  //   const wsUrl= apiUrl.replace(/^http/, 'ws').replace(/\/$/, '') + '/ws/earthquakes'; 

  //   this.socket.connect(wsUrl).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
  //     next: message => {
  //         if (message.type !== 'earthquakes_update') return;
  //         const earthquakes = EarthquakeMappers.mapEarthquakes(message.items);

  //         // Guardar los eventos en el almacén global
  //         this.store.addOrUpdate(earthquakes);this.connected.set(true);
  //     },
  //     error: error=> {         
  //       console.error('Error WebSocket:', error);
  //       this.connected.set(false);        
  //     },
  //     complete: ()=> {this.connected.set(false);}      
  //   });  
  // }
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
    // this.rest.getLatest(3).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
    //   next: items => {
    //     this.store.addOrUpdate(items);
    //   },
    //   error: error => {
    //     console.error('Error cargando terremotos: ', error)
    //   }
    // })
    return this.rest.getLatest(3).pipe(
      tap(earthquakes => {
        this.store.addOrUpdate(earthquakes);
      }),
      map(() => undefined)
    );
  }

}
