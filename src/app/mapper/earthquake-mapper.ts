import { Earthquake, EarthquakeResponse } from "../interfaces/earthquake";

export class EarthquakeMappers{

    static mapEarthquake(data: EarthquakeResponse): Earthquake {
        console.log('Response mapper: ',data)
        return {
            id: data.event_id,
            magnitude: data.magnitude,
            place: data.place,
            event_time: data.event_time,
            longitude: data.longitude,
            latitude: data.latitude,
            country_code: data.country_code,
            depth: data.depth_km
        };
    }
    
    static mapEarthquakes(data: EarthquakeResponse[]): Earthquake[] {
        return data.map(this.mapEarthquake);
    }
}