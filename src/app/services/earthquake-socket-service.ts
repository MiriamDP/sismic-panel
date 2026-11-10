import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { defer, Observable, retry, timer } from 'rxjs';
import { EarthquakeMessage } from '../interfaces/earthquake';

@Injectable({
  providedIn: 'root',
})
export class EarthquakeSocketService {

  private createConnection(): WebSocketSubject<EarthquakeMessage> {

    return webSocket<EarthquakeMessage>({
      url: 'ws://localhost:8000/ws/earthquakes',

      deserializer: event => JSON.parse(event.data),

      openObserver: {
        next: () => console.log('WebSocket conectado')
      },

      closeObserver: {
        next: () => console.log('WebSocket desconectado')
      }
    });
  }

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
