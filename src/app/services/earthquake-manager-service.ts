import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EarthquakeMappers } from '../mapper/earthquake-mapper';
import { EarthquakeSocketService } from './earthquake-socket-service';
import { EarthquakeStoreService } from './earthquake-store-service';

@Injectable({
  providedIn: 'root',
})
export class EarthquakeManagerService {
  private socket = inject(EarthquakeSocketService);
  private store = inject(EarthquakeStoreService);
  private destroyRef = inject(DestroyRef);
  readonly connected = signal(false);

  connect(apiUrl: string): void {
    const wsUrl= apiUrl.replace(/^http/, 'ws').replace(/\/$/, '') + '/ws/earthquakes'; 
    
    this.socket.connect(wsUrl).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: message => {
          if (message.type !== 'earthquakes_update') return;
          const earthquakes = EarthquakeMappers.mapEarthquakes(message.items);
          
          // Guardar los eventos en el almacén global
          this.store.addOrUpdate(earthquakes);this.connected.set(true);
      },
      error: error=> {         
        console.error('Error WebSocket:', error);
        this.connected.set(false);        
      },
      complete: ()=> {this.connected.set(false);}      
    });  
  }

}
