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
  };
}

