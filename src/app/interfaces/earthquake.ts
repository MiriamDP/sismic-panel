export interface Earthquake{
    id: string;
    magnitude: number;
    place: string;
    event_time: string;
    longitude: number;
    latitude: number;
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

export interface EarthquakeResponse {
  items: Earthquake[];
  pagination: Pagination;
}

export interface EarthquakeMessage {
  type: string;
  items: Earthquake[];
}