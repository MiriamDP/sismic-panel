import { Component, effect, input, OnDestroy } from '@angular/core';
import { Earthquake } from '../../interfaces/earthquake';
import { LeafletDirective } from '@bluehalo/ngx-leaflet';
import * as L from 'leaflet';

@Component({
  selector: 'app-simple-map',
  imports: [LeafletDirective],
  templateUrl: './simple-map.html',
  styleUrl: './simple-map.css',
})
export class SimpleMap implements OnDestroy {
   earthquake = input.required<Earthquake>();

  readonly options: L.MapOptions = {
    center: L.latLng(0, 0),
    zoom: 2,
    minZoom: 2,
    maxZoom: 18,
    zoomControl: true
  };

  private map?: L.Map;
  private marker?: L.CircleMarker;

  constructor() {
    effect(() => {
      const earthquake = this.earthquake();

      if (!this.map) return;

      this.updateMarker(earthquake);
    });
  }

  onMapReady(map: L.Map): void {
    this.map = map;

    L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }
    ).addTo(map);

    this.updateMarker(this.earthquake());

    setTimeout(() => map.invalidateSize(), 100);
  }

  private updateMarker(earthquake: Earthquake): void {

    const { latitude, longitude, magnitude, depth } = earthquake;

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      Math.abs(latitude) > 90 ||
      Math.abs(longitude) > 180
    ) {
      return;
    }

    const color =
      depth == null ? '#64748b' :
      depth < 70 ? '#e8a317' :
      depth < 300 ? '#e35b37' :
      '#7b3fb6';

    // Eliminar marcador anterior
    this.marker?.remove();

    // Crear marcador del terremoto
    this.marker = L.circleMarker(
      [latitude, longitude],
      {
        radius: magnitude != null
          ? Math.max(5, Math.min(22, 5 + magnitude * 2))
          : 6,
        color,
        fillColor: color,
        fillOpacity: 0.8,
        weight: 2
      }
    ).addTo(this.map!);

    // Popup
    const popup = document.createElement('div');

    popup.textContent = [
      earthquake.place ?? 'Sin descripción',
      `Magnitud: ${magnitude ?? 'ND'}`,
      `Profundidad: ${depth != null ? depth + ' km' : 'ND'}`,
      `Fecha: ${new Date(earthquake.event_time).toLocaleString()}`,
      `ID: ${earthquake.id}`
    ].join('\n');

    this.marker.bindPopup(popup).openPopup();

    // Centrar mapa en el epicentro
    this.map!.setView(
      [latitude, longitude],
      8,
      { animate: true }
    );
  }

ngOnDestroy() {
  this.marker?.remove();
  this.map = undefined;
}
}
