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
  // Novos dados adicionais
  windDirection?: number; // Direção do vento em graus
  cloudCover?: number; // Cobertura de nuvens em %
  precipitationProbability?: number; // Probabilidade de precipitação em %
  sunrise?: string; // Horário do nascer do sol
  sunset?: string; // Horário do pôr do sol
  // Previsão para próximos dias
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

export interface TempoPluginProps {
  /** Posição inicial X do widget (padrão: 20) */
  initialX?: number;
  /** Posição inicial Y do widget (padrão: 20) */
  initialY?: number;
  /** Cidade inicial (padrão: detecta automaticamente) */
  initialCity?: string;
  /** Cor de fundo do widget (padrão: '#007bff') */
  backgroundColor?: string;
  /** Cor do texto (padrão: '#ffffff') */
  textColor?: string;
  /** Tamanho do widget em pixels (padrão: 60) */
  size?: number;
  /** Intervalo de atualização em minutos (padrão: 10) */
  updateInterval?: number;
  /** Callback chamado quando a temperatura é atualizada */
  onTemperatureUpdate?: (data: WeatherData) => void;
  /** Callback chamado quando a cidade é alterada */
  onCityChange?: (city: string) => void;
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

