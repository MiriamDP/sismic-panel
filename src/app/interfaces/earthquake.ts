export interface EarthquakeResponse {
    event_id: string;
    magnitude: number;
    place: string;
    event_time: string;
    longitude: number;
    latitude: number;
    country_code: string | null;
    country_name: string | null;
    depth_km: number | null;
}

export interface Earthquake{
    id: string;
    magnitude: number;
    place: string;
    event_time: string;
    longitude: number;
    latitude: number;
    country_code: string|null;
    country_name: string | null;

    depth: number | null;
}

export interface Pagination {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface EarthquakesResponse {
  items: EarthquakeResponse[];
  pagination: Pagination;
}
export interface Earthquakes {
  items: Earthquake[];
  pagination: Pagination;
}

export interface EarthquakeMessage {
  type: string;
  items: EarthquakeResponse[];
}

export interface EarthquakeFilters {
  page: number;
  pageSize: number;

  countryCode: string | null;

  startDate: string | null;
  endDate: string | null;

  minMagnitude: number | null;
  maxMagnitude: number | null;

  minDepth: number | null;
  maxDepth: number | null;
}