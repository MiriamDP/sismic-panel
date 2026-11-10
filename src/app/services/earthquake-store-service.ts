import { Injectable, signal } from '@angular/core';
import { Earthquake } from '../interfaces/earthquake';

@Injectable({
  providedIn: 'root',
})
export class EarthquakeStoreService {
      // Almacén de terremotos indexado por ID
    private earthquakesMap = new Map<string, Earthquake>();
    // Estado reactivo
    readonly earthquakes = signal<Earthquake[]>([]);
    readonly count = signal(0);
    /**   * Recibe nuevos terremotos y actualiza   * los existentes sin duplicarlos.   */
    addOrUpdate(earthquakes: Earthquake[]): void {
        for (const earthquake of earthquakes) {
            if (!earthquake.id) { continue; }
            this.earthquakesMap.set(earthquake.id, earthquake);
        }

        // Publicar el estado actualizado
        const sorted = Array.from(this.earthquakesMap.values()).sort((a, b) => new Date(b.event_time).getTime() - new Date(a.event_time).getTime());
        this.earthquakes.set(sorted); this.count.set(sorted.length);
    }

    /**   * Recuperar todos los terremotos almacenados.   */
    getAll(): Earthquake[] {
        return this.earthquakes();
    }
    /**   * Buscar un terremoto por ID.   */
    getById(id: string): Earthquake | undefined 
    { return this.earthquakesMap.get(id); }
    /**   * Vaciar el almacenamiento.   */
    clear(): void { this.earthquakesMap.clear(); this.earthquakes.set([]); this.count.set(0); }
}
