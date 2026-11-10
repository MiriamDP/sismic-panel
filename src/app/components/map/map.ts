import { Component, signal, DestroyRef, inject, effect, output } from '@angular/core';
import { LeafletDirective } from '@bluehalo/ngx-leaflet';
import * as L from 'leaflet';
import type { FeatureCollection, Point } from 'geojson';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Earthquake } from '../../interfaces/earthquake';
import { EarthquakeSocketService } from '../../services/earthquake-socket-service';
import { EarthquakeMappers } from '../../mapper/earthquake-mapper';
import { EarthquakeStoreService } from '../../services/earthquake-store-service';

type Properties = { mag: number | null; place: string; time: number; updated: number; country_name?: string | null };
type Events = FeatureCollection<Point, Properties> & { metadata?: { generated?: number; mode?: string } };
type Config = { mode: 'demo' | 'api'; apiUrl: string; refreshMs: number; skipNgrokWarning: boolean };

@Component({
  selector: 'app-map',
  imports: [LeafletDirective],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class MapComponent {
  readonly mode = signal('Cargando configuración');
  readonly status = signal('Preparando el mapa…');
  readonly lastRead = signal<Date|string>('Sin lectura');
  newEarthquake=output<Earthquake>()
  lastReadEffect=effect(()=>{

    const value = this.lastRead();
    
    if (value instanceof Date || !isNaN(Date.parse(value))) {
      const dateObj = value instanceof Date ? value : new Date(value);

      const date = dateObj.toISOString().split('T')[0];
      const hour = dateObj.toISOString().split('T')[1].substring(0, 8);
      
      this.lastReadDateEmit.emit(date);
      this.lastReadHourEmit.emit(hour);
    } else {
      this.lastReadDateEmit.emit('Sin fecha');
      this.lastReadHourEmit.emit('Sin hora');
    }
  })
  lastReadDateEmit=output<string>();
  lastReadHourEmit=output<string>();
  readonly generated = signal('Sin información');
  readonly count = signal(0);
  // countEffect=effect(()=>{
  //   this.countEmit.emit(this.count())
  // })
  countEmit = output<number>();
  // readonly totalEarthquakes =signal(0);
  totalEarthquakesEmit =output<number>();
  omittedCount=output<number>();
  // totalEffect=effect(()=>{
  //   this.totalEarthquakesEmit.emit(this.count())
  // })
  readonly omitted = signal(0);
  readonly countriesStatus = signal('Cargando catálogo');
  readonly options: L.MapOptions = { center: L.latLng(18, 0), zoom: 2, minZoom: 2, maxZoom: 8, preferCanvas: true, worldCopyJump: false };
  private map?: L.Map;
  private events = L.layerGroup();
  private timer?: ReturnType<typeof setTimeout>;
  private controller = new AbortController();
  private destroyed = false;
  private destroyRef = inject(DestroyRef);
  private earthquakeWebsocket = inject(EarthquakeSocketService);
  private earthquakeMarkers = new Map<string, L.CircleMarker>();
  private earthquakeData = new Map<string, Earthquake>();
  private readonly MAX_EARTHQUAKES = 3;
  private animationTimers = new Set<ReturnType<typeof setTimeout>>();
  private pulseMarkers = new Set<L.Marker>();
  private earthquakeStore=inject(EarthquakeStoreService)


  constructor() {
    effect(()=> {
      const earthquakes=this.earthquakeStore.earthquakes();
      if (!this.map) {return;}
      this.syncEarthquakes(earthquakes);  
    });
  }

  async onMapReady(map: L.Map): Promise<void> {
    this.map = map;
    requestAnimationFrame(() => {
      map.invalidateSize(true);
    });

    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    const base = L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        noWrap: true,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    ).addTo(map);

    const borders = L.geoJSON(undefined, {
      style: { color: '#334155', weight: 1, fill: false },
      onEachFeature: (feature, layer) => {
        const name = document.createElement('span');
        name.textContent = feature.properties?.NAME_ES ?? feature.properties?.ADMIN ?? 'Sin nombre';
        layer.bindTooltip(name);
      }
    }).addTo(map);

    this.events.addTo(map);

    L.control.layers({ 'OpenStreetMap': base }, { 'Países (Natural Earth)': borders, 'Terremotos': this.events }).addTo(map);
    map.attributionControl.addAttribution('Fronteras: Natural Earth · Datos reales: USGS');
    try {
      borders.addData(await this.readJson<FeatureCollection>('datos/paises.geojson'));
      this.countriesStatus.set('Catálogo de países cargado');
    } catch { this.countriesStatus.set('No se pudo cargar el catálogo de países'); }
    if (this.destroyed) return;
    try {
      const config = await this.readJson<Config>('config.json');
      if (!['demo', 'api'].includes(config.mode)) throw new Error('Modo inválido');
      this.mode.set(config.mode === 'demo' ? 'DEMOSTRACIÓN · datos ficticios' : 'API · datos del backend');
      // await this.refresh(config);
      if (config.mode === 'demo') {

        await this.refresh(config);

      } else {
        this.loadStoredEarthquakes();


      }
    } catch { this.status.set('Error: revisa public/config.json'); }
  }

  private async readJson<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
    const response = await fetch(url, {
      headers, cache: 'no-store',
      signal: AbortSignal.any([this.controller.signal, AbortSignal.timeout(15000)])
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json() as Promise<T>;
  }

  private async refresh(config: Config): Promise<void> {
    try {
      const url = config.mode === 'demo' ? 'datos/terremotos-demo.geojson' : `${config.apiUrl.replace(/\/$/, '')}/api/eventos`;
      const headers: Record<string, string> = {};
      if (config.mode === 'api' && config.skipNgrokWarning) headers['ngrok-skip-browser-warning'] = '1';
      const data = await this.readJson<Events>(url, headers);
      if (this.destroyed) return;
      if (data.type !== 'FeatureCollection' || !Array.isArray(data.features)) throw new Error('Se esperaba FeatureCollection');
      // Construir primero la nueva capa: si falla, conservar la anterior.
      const next = L.layerGroup(); let omitted = 0; let count = 0;
      for (const feature of data.features) {
        const p = feature.properties;
        const c = feature.geometry?.type === 'Point' ? feature.geometry.coordinates : [];
        const [lon, lat, depth] = c;
        if (!p || !Number.isFinite(lon) || !Number.isFinite(lat) || Math.abs(lon) > 180 || Math.abs(lat) > 90) {
          omitted++;
          continue;
        }
        const magnitude = typeof p.mag === 'number' && Number.isFinite(p.mag) ? p.mag : null;
        const depthOk = typeof depth === 'number' && Number.isFinite(depth);
        const color = !depthOk ? '#64748b' : depth < 70 ? '#e8a317' : depth < 300 ? '#e35b37' : '#7b3fb6';
        const popup = document.createElement('div');
        popup.textContent = `${p.place ?? 'Sin descripción'}\nMagnitud: ${magnitude ?? 'ND'}\nProfundidad: ${depthOk ? depth + ' km' : 'ND'}\nFecha UTC: ${this.date(p.time)}\nPaís: ${p.country_name ?? 'Sin país asignado'}\nID: ${feature.id ?? 'ND'}`;
        L.circleMarker([lat, lon], { radius: magnitude === null ? 4 : Math.max(3, Math.min(18, 3 + (magnitude + 1) * 2)), color, fillColor: color, fillOpacity: .75, weight: 1 }).bindPopup(popup).addTo(next);
        count++;
      }
      this.events.clearLayers(); 
      this.events.addLayer(next);
      this.count.set(count);
      this.omitted.set(omitted);
      this.lastRead.set(new Date().toISOString());
      this.generated.set(this.date(data.metadata?.generated));
      this.status.set(config.mode === 'demo' ? 'Ejemplo estático: no representa actividad real' : 'API accesible · consulta completada');
    } catch {
      if (!this.destroyed) this.status.set('No se pudo actualizar: se conserva la última lectura. Revisa API, túnel y CORS.');
    } finally {

      // if (!this.destroyed && config.mode === 'api') this.timer = setTimeout(() => void this.refresh(config), Math.max(30000, Number(config.refreshMs) || 60000));
      if (!this.destroyed && config.mode === 'demo') {
        this.timer = setTimeout(
          () => void this.refresh(config),
          Math.max(30000, Number(config.refreshMs) || 60000)
        );

      }
    }
  }
  private date(value: unknown): string {
    if (typeof value !== 'number' || !Number.isFinite(value)) return 'ND';
    const d = new Date(value); return Number.isNaN(d.getTime()) ? 'ND' : d.toISOString();
  }
  // ngOnDestroy(): void { this.destroyed = true; clearTimeout(this.timer); this.controller.abort(); }
  ngOnDestroy(): void {

    this.destroyed = true;

    clearTimeout(this.timer);

    this.controller.abort();

    // Cancelar animaciones pendientes
    for (const timer of this.animationTimers) {
      clearTimeout(timer);
    }

    this.animationTimers.clear();

    // Eliminar ondas del mapa
    for (const marker of this.pulseMarkers) {
      marker.remove();
    }

    this.pulseMarkers.clear();

    // Limpiar marcadores
    this.earthquakeMarkers.clear();
    this.earthquakeData.clear();

  }

  // private updateEarthquakeMarkers(earthquakes: Earthquake[]): void {

  //   for (const earthquake of earthquakes) {

  //     const {
  //       id,
  //       latitude,
  //       longitude
  //     } = earthquake;

  //     // Validar el terremoto
  //     if (
  //       !id ||
  //       !Number.isFinite(latitude) ||
  //       !Number.isFinite(longitude) ||
  //       Math.abs(latitude) > 90 ||
  //       Math.abs(longitude) > 180
  //     ) {
  //       continue;
  //     }

  //     // Comprobar si ya existe
  //     const existingMarker = this.earthquakeMarkers.get(id);

  //     if (existingMarker) {

  //       // Actualizar el marcador sin duplicarlo
  //       existingMarker.setLatLng([latitude, longitude]);

  //       const magnitude = earthquake.magnitude;
  //       const magnitudeOk =
  //         typeof magnitude === 'number' &&
  //         Number.isFinite(magnitude);

  //       const depth = earthquake.depth;
  //       const depthOk =
  //         typeof depth === 'number' &&
  //         Number.isFinite(depth);

  //       const color = !depthOk
  //         ? '#64748b'
  //         : depth! < 70
  //           ? '#e8a317'
  //           : depth! < 300
  //             ? '#e35b37'
  //             : '#7b3fb6';

  //       existingMarker.setStyle({
  //         radius: magnitudeOk
  //           ? Math.max(3, Math.min(18, 3 + (magnitude! + 1) * 2))
  //           : 4,
  //         color,
  //         fillColor: color
  //       });

  //       this.updateMarkerPopup(existingMarker, earthquake);

  //       this.earthquakeData.set(id, earthquake);

  //       continue;
  //     }

  //     // Si hemos alcanzado el máximo, eliminar el más antiguo
  //     if (this.earthquakeMarkers.size >= this.MAX_EARTHQUAKES) {

  //       const oldestId = this.earthquakeMarkers.keys().next().value;

  //       if (oldestId !== undefined) {

  //         const oldestMarker = this.earthquakeMarkers.get(oldestId);

  //         if (oldestMarker) {
  //           this.events.removeLayer(oldestMarker);
  //         }

  //         this.earthquakeMarkers.delete(oldestId);
  //         this.earthquakeData.delete(oldestId);

  //       }
  //     }

  //     // Crear el nuevo marcador
  //     const marker = this.createEarthquakeMarker(earthquake);

  //     marker.addTo(this.events);

  //     // Insertarlo al final de la cola
  //     this.earthquakeMarkers.set(id, marker);
  //     this.earthquakeData.set(id, earthquake);

  //     // Animar únicamente los terremotos nuevos
  //     const depth = earthquake.depth;

  //     const color = depth == null
  //       ? '#64748b'
  //       : depth < 70
  //         ? '#e8a317'
  //         : depth < 300
  //           ? '#e35b37'
  //           : '#7b3fb6';

  //     this.animateEarthquake(
  //       latitude,
  //       longitude,
  //       color
  //     );

  //   }

  //   this.count.set(this.earthquakeMarkers.size);
  //   this.totalEarthquakes.update(v=>v+1);

  //   this.lastRead.set(new Date().toISOString());

  // }

  private formatEventDate(value: string | number): string {

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? 'ND'
      : date.toISOString();

  }

  // private connectToEarthquakes(apiUrl: string): void {

  //   const wsUrl = apiUrl
  //     .replace(/^http/, 'ws')
  //     .replace(/\/$/, '') + '/ws/earthquakes';

  //   this.status.set('Conectando al servidor de terremotos...');

  //   this.earthquakeWebsocket.connect(wsUrl)
  //     .pipe(
  //       takeUntilDestroyed(this.destroyRef)
  //     )
  //     .subscribe({

  //       next: message => {

  //         if (message.type !== 'earthquakes_update') {
  //           return;
  //         }

  //         console.log('DATOS ORIGINALES:', message.items);

  //       const mapped = EarthquakeMappers.mapEarthquakes(message.items);

  //       console.table(mapped.map(e => ({
  //         id: e.id,
  //         latitude: e.latitude,
  //         longitude: e.longitude,
  //         latType: typeof e.latitude,
  //         lonType: typeof e.longitude,
  //         valid: Number.isFinite(e.latitude) &&
  //               Number.isFinite(e.longitude)
  //       })));

  //         // Procesar los terremotos recibidos
  //         //this.updateEarthquakeMarkers(EarthquakeMappers.mapEarthquakes(message.items));

  //         this.status.set(
  //           'WebSocket conectado · Actualización en tiempo real'
  //         );

  //         this.generated.set(new Date().toISOString());

  //       },

  //       error: error => {

  //         console.error('Error WebSocket:', error);

  //         this.status.set(
  //           'Error en la conexión WebSocket'
  //         );

  //       }

  //     });

  // }

  private createEarthquakeMarker(
    earthquake: Earthquake
  ): L.CircleMarker {

    const {
      magnitude,
      place,
      event_time,
      latitude,
      longitude,
      depth
    } = earthquake;

    const magnitudeOk =
      typeof magnitude === 'number' &&
      Number.isFinite(magnitude);

    const depthOk =
      typeof depth === 'number' &&
      Number.isFinite(depth);

    const color = !depthOk
      ? '#64748b'
      : depth! < 70
        ? '#e8a317'
        : depth! < 300
          ? '#e35b37'
          : '#7b3fb6';

    const marker = L.circleMarker(
      [latitude, longitude],
      {
        radius: magnitudeOk
          ? Math.max(3, Math.min(18, 3 + (magnitude! + 1) * 2))
          : 4,

        color,
        fillColor: color,
        fillOpacity: 0.75,
        weight: 1
      }
    );

    this.updateMarkerPopup(marker, earthquake);

    return marker;
  }

  private updateMarkerPopup(
    marker: L.CircleMarker,
    earthquake: Earthquake
  ): void {

    const popup = document.createElement('div');

    popup.textContent = [
      earthquake.place ?? 'Sin descripción',
      `Magnitud: ${earthquake.magnitude ?? 'ND'}`,
      `Profundidad: ${earthquake.depth != null ? earthquake.depth + ' km' : 'ND'}`,
      `Fecha UTC: ${this.formatEventDate(earthquake.event_time)}`,
      `ID: ${earthquake.id}`
    ].join('\n');

    marker.bindPopup(popup);
  }

  private syncEarthquakes(
    earthquakes: Earthquake[]
  ): void {

    const validCoordinates = earthquakes
      .filter(event =>
        !!event.id &&
        Number.isFinite(event.latitude) &&
        Number.isFinite(event.longitude) &&
        Math.abs(event.latitude) <= 90 &&
        Math.abs(event.longitude) <= 180
      )
      // .sort((a, b) =>
      //   new Date(b.event_time).getTime() -
      //   new Date(a.event_time).getTime()
      // )
      // .slice(0, this.MAX_EARTHQUAKES);

       // 2. Contabilizar únicamente los eventos inválidos
  const invalidCoordinates = earthquakes.length - validCoordinates.length;

  // 3. Ordenar cronológicamente
  const sortedEarthquakes = [...validCoordinates].sort((a, b) =>
    new Date(b.event_time).getTime() -
    new Date(a.event_time).getTime()
  );

  // 4. Seleccionar los tres más recientes
  const validEarthquakes = sortedEarthquakes.slice(
    0,
    this.MAX_EARTHQUAKES
  );

  // 5. Contabilizar los excluidos por el límite
  const excludedByLimit = Math.max(
    0,
    sortedEarthquakes.length - this.MAX_EARTHQUAKES
  );

    console.log('Total recibidos:', earthquakes.length);
    console.log('Coordenadas válidas:', validCoordinates.length);
    console.log('Coordenadas inválidas:', invalidCoordinates);
    console.log('Excluidos por límite:', excludedByLimit);
    console.log('Terremotos que se pintarán:', validEarthquakes.length);

    const uniqueEarthquakes = Array.from(
      new Map(earthquakes.map(e => [e.id, e])).values()
    );
    this.totalEarthquakesEmit.emit(uniqueEarthquakes.length); //deben ser unicos
    this.countEmit.emit(validEarthquakes.length);
    this.omittedCount.emit(invalidCoordinates);


//       console.log('Total recibidos:', earthquakes.length);
//       console.log('Total válidos:', validEarthquakes.length);
// console.log('Total descartados:', earthquakes.length - validEarthquakes.length);

    // IDs que deben permanecer en el mapa
    const currentIds = new Set(
      validEarthquakes.map(event => event.id)
    );

    // 1. Eliminar terremotos que ya no están entre los 20 últimos
    for (const [id, marker] of this.earthquakeMarkers) {

      if (!currentIds.has(id)) {

        this.events.removeLayer(marker);

        this.earthquakeMarkers.delete(id);
        this.earthquakeData.delete(id);

      }
    }

    let omitted = earthquakes.length - validEarthquakes.length;

    // 2. Añadir nuevos terremotos o actualizar existentes
    for (const earthquake of validEarthquakes) {

      const existingMarker = this.earthquakeMarkers.get(
        earthquake.id
      );

      if (!existingMarker) {

        // // Crear marcador nuevo
        // const marker = this.createEarthquakeMarker(earthquake);

        // marker.addTo(this.events);

        // this.earthquakeMarkers.set(
        //   earthquake.id,
        //   marker
        // );
        // Crear marcador permanente
        const marker = this.createEarthquakeMarker(earthquake);

        marker.addTo(this.events);

        this.earthquakeMarkers.set(
          earthquake.id,
          marker
        );

        // Calcular el color del epicentro
        const depth = earthquake.depth;

        const color =
          depth == null
            ? '#64748b'
            : depth < 70
              ? '#e8a317'
              : depth < 300
                ? '#e35b37'
                : '#7b3fb6';

        // Animar únicamente los terremotos nuevos
        this.animateEarthquake(
          earthquake.latitude,
          earthquake.longitude,
          color
        );

        //Emitr terremoto mas reciente
        this.newEarthquake.emit(earthquakes[0])


      } else {

        // Actualizar marcador existente sin recrearlo
        existingMarker.setLatLng([
          earthquake.latitude,
          earthquake.longitude
        ]);

        const magnitude = earthquake.magnitude;

        const magnitudeOk =
          typeof magnitude === 'number' &&
          Number.isFinite(magnitude);

        const depth = earthquake.depth;

        const depthOk =
          typeof depth === 'number' &&
          Number.isFinite(depth);

        const color = !depthOk
          ? '#64748b'
          : depth! < 70
            ? '#e8a317'
            : depth! < 300
              ? '#e35b37'
              : '#7b3fb6';

        existingMarker.setStyle({
          radius: magnitudeOk
            ? Math.max(3, Math.min(18, 3 + (magnitude! + 1) * 2))
            : 4,
          color,
          fillColor: color
        });

        this.updateMarkerPopup(existingMarker, earthquake);

      }

      this.earthquakeData.set(
        earthquake.id,
        earthquake
      );

    }

    this.count.set(this.earthquakeMarkers.size);
    this.omitted.set(invalidCoordinates);

    this.lastRead.set(new Date().toISOString());

  }
  private animateEarthquake(
    latitude: number,
    longitude: number,
    color: string
  ): void {

    if (!this.map) return;

    const pulse = L.marker(
      [latitude, longitude],
      {
        interactive: false,
        keyboard: false,
        icon: L.divIcon({
          className: '',
          html: `<div class="seismic-pulse"
                    style="border-color: ${color};
                           background: ${color}26;">
               </div>`,
          iconSize: [80, 80],
          iconAnchor: [40, 40]
        })
      }
    );

    pulse.addTo(this.map);
    this.pulseMarkers.add(pulse);

    const timer = setTimeout(() => {

      pulse.remove();

      this.pulseMarkers.delete(pulse);
      this.animationTimers.delete(timer);

    }, 2600);

    this.animationTimers.add(timer);

  }

  private loadStoredEarthquakes():void {
    const earthquakes=this.earthquakeStore.getAll();
    this.syncEarthquakes(earthquakes);
  }
}
