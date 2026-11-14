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

  startDate: string | null ;
  endDate: string | null ;

  minMagnitude: number | null;
  maxMagnitude: number | null;

  minDepth: number | null;
  maxDepth: number | null;
}

export interface EarthquakeMetrics {
  summary: {
    total_earthquakes: number;
    average_magnitude: number | null;
    average_depth: number | null;
    average_per_day: number | null;
    average_per_hour: number | null;
    max_earthquake: Earthquake | null;
  };

  top_countries: CountryMetric[];

  time_distribution: {
    granularity: 'hour' | 'day' | 'month';
    data: {
      date: string;
      count: number;
    }[];
  };

  magnitude_depth: {
    magnitude: number;
    depth: number;
  }[];
}

export interface CountryMetric {
  country_code: string | null;
  country_name: string;
  total_earthquakes: number;
  average_magnitude: number | null;
  max_earthquake: Earthquake | null;
}

export interface EarthquakeMetricsResponse {
  summary: {
    total_earthquakes: number;
    average_magnitude: number | null;
    average_depth: number | null;
    average_per_day: number | null;
    average_per_hour: number | null;
    max_earthquake: EarthquakeResponse | null;
  };

  top_countries: {
    country_code: string | null;
    country_name: string;
    total_earthquakes: number;
    average_magnitude: number | null;
    max_earthquake: EarthquakeResponse | null;
  }[];

  time_distribution: {
    granularity: 'hour' | 'day' | 'month';
    data: {
      date: string;
      count: number;
    }[];
  };

  magnitude_depth: {
    magnitude: number;
    depth: number;
  }[];
}

export interface EarthquakeComparisonFilters {
  countryCode: string | null;

  startDay: number;
  startMonth: number;

  endDay: number;
  endMonth: number;

  firstYear: number;
  secondYear: number;

  minMagnitude: number | null;
  maxMagnitude: number | null;

  minDepth: number | null;
  maxDepth: number | null;
}

export interface EarthquakeComparisonMetrics {
  first_year: number;
  second_year: number;

  first_period: EarthquakeMetrics;
  second_period: EarthquakeMetrics;
}

export interface EarthquakeComparisonMetricsResponse {
  first_year: number;
  second_year: number;

  first_period: EarthquakeMetricsResponse;
  second_period: EarthquakeMetricsResponse;
}