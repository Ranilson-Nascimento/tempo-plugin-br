export interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  city: string;
  country: string;
  icon: string;
  feelsLike: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  windDirection?: number;
  cloudCover?: number;
  precipitationProbability?: number;
  sunrise?: string;
  sunset?: string;
  forecast?: DailyForecast[];
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitation: number;
  precipitationProbability: number;
  uvIndexMax: number;
  description: string;
  icon: string;
}

export type TempoErrorType = 'location' | 'weather' | 'city';
export type TempoTheme = 'default' | 'light' | 'dark';

export interface TempoPluginProps {
  initialX?: number;
  initialY?: number;
  initialCity?: string;
  backgroundColor?: string;
  textColor?: string;
  size?: number;
  updateInterval?: number;
  forecastDays?: 3 | 5 | 7;
  positionStorageKey?: string | null;
  theme?: TempoTheme;
  onTemperatureUpdate?: (data: WeatherData) => void;
  onCityChange?: (city: string) => void;
  onError?: (error: Error, type: TempoErrorType) => void;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface ApiResponse {
  current_weather: {
    temperature: number;
    weathercode: number;
    windspeed: number;
    winddirection: number;
  };
  hourly: {
    temperature_2m: number[];
    relativehumidity_2m: number[];
    apparent_temperature: number[];
    pressure_msl: number[];
    visibility: number[];
    precipitation_probability?: number[];
    windspeed_10m?: number[];
    winddirection_10m?: number[];
    cloudcover?: number[];
    uv_index?: number[];
  };
  daily?: {
    time: string[];
    sunrise?: string[];
    sunset?: string[];
    precipitation_sum?: number[];
    precipitation_probability_max?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    uv_index_max?: number[];
    weathercode?: number[];
  };
}

