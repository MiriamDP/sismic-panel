import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { defer, Observable, retry, timer } from 'rxjs';
import { EarthquakeMessage } from '../interfaces/earthquake';

@Injectable({
  providedIn: 'root',
})
export class EarthquakeSocketService {

  connect(url: string): Observable<EarthquakeMessage> {

    return defer(() =>
      webSocket<EarthquakeMessage>({
        url,

        deserializer: event => JSON.parse(event.data),

        openObserver: {
          next: () => console.log('WebSocket conectado')
        },

        closeObserver: {
          next: () => console.log('WebSocket desconectado')
        }
      })
    ).pipe(
      retry({
        delay: () => timer(5000)
      })
    );

  }
}
