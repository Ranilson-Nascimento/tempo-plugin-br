import { WeatherData, GeoLocation, ApiResponse, WeatherAlert } from '../types';

const WEATHER_CODES: { [key: number]: { description: string; icon: string } } = {
  0: { description: 'Céu limpo', icon: '☀️' },
  1: { description: 'Principalmente limpo', icon: '🌤️' },
  2: { description: 'Parcialmente nublado', icon: '⛅' },
  3: { description: 'Nublado', icon: '☁️' },
  45: { description: 'Neblina', icon: '🌫️' },
  48: { description: 'Neblina com geada', icon: '🌫️' },
  51: { description: 'Garoa leve', icon: '🌦️' },
  53: { description: 'Garoa moderada', icon: '🌦️' },
  55: { description: 'Garoa intensa', icon: '🌦️' },
  61: { description: 'Chuva leve', icon: '🌧️' },
  63: { description: 'Chuva moderada', icon: '🌧️' },
  65: { description: 'Chuva intensa', icon: '🌧️' },
  71: { description: 'Neve leve', icon: '🌨️' },
  73: { description: 'Neve moderada', icon: '🌨️' },
  75: { description: 'Neve intensa', icon: '🌨️' },
  80: { description: 'Pancadas de chuva leves', icon: '🌦️' },
  81: { description: 'Pancadas de chuva moderadas', icon: '⛈️' },
  82: { description: 'Pancadas de chuva intensas', icon: '⛈️' },
  95: { description: 'Tempestade', icon: '⛈️' },
  96: { description: 'Tempestade com granizo leve', icon: '⛈️' },
  99: { description: 'Tempestade com granizo intenso', icon: '⛈️' }
};

export class WeatherService {
  private static instance: WeatherService;
  private cache: Map<string, { data: WeatherData; timestamp: number }> = new Map();
  private cityNameCache: Map<string, { name: string; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutos
  private readonly CITY_CACHE_DURATION = 60 * 60 * 1000; // 1 hora
  private readonly LOCAL_STORAGE_KEY = 'tempo-plugin-br-cached-weather';

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  getCachedWeather(): WeatherData | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.data && Date.now() - parsed.timestamp < 3 * 60 * 60 * 1000) {
        return parsed.data as WeatherData;
      }
    } catch {}
    return null;
  }

  saveCachedWeather(data: WeatherData): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
    } catch {}
  }

  async getCurrentLocation(): Promise<GeoLocation> {
    if (typeof window === 'undefined' || !window.navigator?.geolocation) {
      return Promise.reject(new Error('Geolocalização não disponível'));
    }
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Erro ao obter localização, usando São Paulo como padrão:', error);
          resolve({
            latitude: -23.5505,
            longitude: -46.6333
          });
        },
        {
          timeout: 10000,
          enableHighAccuracy: false
        }
      );
    });
  }

  private sanitizeCityName(rawName: string): string {
    if (!rawName) return '';
    return rawName
      .replace(/^regi[aã]o\s+(metropolitana|geogr[aá]fica\s+(imediata|intermedi[aá]ria)?|integrada(\s+de\s+desenvolvimento)?)?\s*(de\s+|do\s+|da\s+)?/i, '')
      .replace(/^microrregi[aã]o\s*(de\s+|do\s+|da\s+)?/i, '')
      .replace(/^mesorregi[aã]o\s*(de\s+|do\s+|da\s+)?/i, '')
      .trim();
  }

  async getCityNameFromCoordinates(location: GeoLocation): Promise<string> {
    const cacheKey = `${location.latitude},${location.longitude}`;
    const cached = this.cityNameCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CITY_CACHE_DURATION) {
      return cached.name;
    }
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${location.latitude}&longitude=${location.longitude}&localityLanguage=pt`
      );
      if (!response.ok) throw new Error('Erro ao buscar nome da cidade');
      const data = await response.json();

      // No Brasil, locality geralmente é o município exato (ex: "São Paulo"),
      // enquanto city muitas vezes vem como "Região Metropolitana de São Paulo".
      let cityName = '';
      if (data?.locality && !/^regi[aã]o/i.test(data.locality)) {
        cityName = data.locality;
      } else if (data?.city) {
        cityName = this.sanitizeCityName(data.city);
      } else if (data?.locality) {
        cityName = this.sanitizeCityName(data.locality);
      }

      if (!cityName && data?.principalSubdivision) {
        cityName = data.principalSubdivision;
      }

      const code = data?.principalSubdivisionCode; // ex: "BR-SP" -> UF "SP"
      const uf = code && /^BR-/i.test(code) ? code.replace(/^BR-/i, '') : (data?.principalSubdivision || '');
      const name =
        cityName && uf ? `${cityName} - ${uf}` : cityName || 'Cidade Desconhecida';
      this.cityNameCache.set(cacheKey, { name, timestamp: Date.now() });
      return name;
    } catch (error) {
      console.error('Erro ao buscar nome da cidade:', error);
      return 'Cidade Desconhecida';
    }
  }

  async getCityCoordinates(cityName: string): Promise<GeoLocation> {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=pt&format=json`
      );
      
      if (!response.ok) {
        throw new Error('Erro ao buscar coordenadas da cidade');
      }

      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        throw new Error('Cidade não encontrada');
      }

      return {
        latitude: data.results[0].latitude,
        longitude: data.results[0].longitude
      };
    } catch (error) {
      console.error('Erro ao buscar coordenadas:', error);
      throw error;
    }
  }

  async getWeatherData(location: GeoLocation, cityName?: string, forecastDays: 3 | 5 | 7 = 3): Promise<WeatherData> {
    const cacheKey = `${location.latitude},${location.longitude},${forecastDays}`;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,pressure_msl,visibility,precipitation_probability,windspeed_10m,winddirection_10m,cloudcover,uv_index&daily=sunrise,sunset,precipitation_sum,precipitation_probability_max,temperature_2m_max,temperature_2m_min,uv_index_max,weathercode&timezone=America/Sao_Paulo&forecast_days=${forecastDays}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar dados meteorológicos');
      }

      const data: ApiResponse = await response.json();
      
      const weatherCode = data.current_weather.weathercode;
      const weatherInfo = WEATHER_CODES[weatherCode] || { description: 'Desconhecido', icon: '❓' };
      
      let finalCityName = await this.getCityNameFromCoordinates(location);
      if (finalCityName === 'Cidade Desconhecida' && cityName) finalCityName = cityName;

      const maxDays = Math.min(forecastDays, data.daily?.time?.length ?? 0);
      const forecast: Array<{ date: string; tempMax: number; tempMin: number; precipitation: number; precipitationProbability: number; uvIndexMax: number; description: string; icon: string }> = [];
      if (data.daily?.time) {
        for (let i = 0; i < maxDays; i++) {
          const dailyWeatherCode = data.daily.weathercode?.[i] || 0;
          const dailyWeatherInfo = WEATHER_CODES[dailyWeatherCode] || { description: 'Desconhecido', icon: '❓' };
          
          forecast.push({
            date: data.daily.time[i],
            tempMax: Math.round(data.daily.temperature_2m_max?.[i] ?? 0),
            tempMin: Math.round(data.daily.temperature_2m_min?.[i] ?? 0),
            precipitation: data.daily.precipitation_sum?.[i] ?? 0,
            precipitationProbability: data.daily.precipitation_probability_max?.[i] ?? 0,
            uvIndexMax: data.daily.uv_index_max?.[i] ?? 0,
            description: dailyWeatherInfo.description,
            icon: dailyWeatherInfo.icon
          });
        }
      }
      let cloudCoverValue = 0;
      if (data.hourly.cloudcover && data.hourly.cloudcover.length > 0) {
        const nextHours = data.hourly.cloudcover.slice(0, 3);
        cloudCoverValue = Math.round(nextHours.reduce((sum, val) => sum + val, 0) / nextHours.length);
      }

      let alert: WeatherAlert | undefined;
      if (weatherCode === 99) {
        alert = {
          title: 'Alerta de Tempestade Severa',
          message: 'Tempestade com granizo intenso prevista para esta região.',
          severity: 'danger'
        };
      } else if (weatherCode === 96) {
        alert = {
          title: 'Alerta de Tempestade com Granizo',
          message: 'Tempestade com risco de queda de granizo nas próximas horas.',
          severity: 'danger'
        };
      } else if (weatherCode === 95) {
        alert = {
          title: 'Alerta de Tempestade',
          message: 'Instabilidade com raios e trovoadas nesta região.',
          severity: 'warning'
        };
      } else if (weatherCode === 82 || weatherCode === 65) {
        alert = {
          title: 'Alerta de Chuva Forte',
          message: 'Pancadas de chuva intensas com risco de alagamentos pontuais.',
          severity: 'warning'
        };
      }

      const weatherData: WeatherData = {
        temperature: Math.round(data.current_weather.temperature),
        description: weatherInfo.description,
        humidity: data.hourly.relativehumidity_2m[0] || 0,
        windSpeed: Math.round(data.current_weather.windspeed),
        city: finalCityName || 'Cidade Desconhecida',
        country: 'Brasil',
        icon: weatherInfo.icon,
        feelsLike: Math.round(data.hourly.apparent_temperature[0] || data.current_weather.temperature),
        pressure: Math.round(data.hourly.pressure_msl[0] || 1013),
        visibility: Math.round((data.hourly.visibility[0] || 10000) / 1000),
        uvIndex: Math.round(data.daily?.uv_index_max?.[0] || 0),
        windDirection: data.hourly.winddirection_10m?.[0],
        cloudCover: cloudCoverValue, // Usar valor calculado
        precipitationProbability: data.daily?.precipitation_probability_max?.[0] || 0, // Probabilidade máxima do dia
        sunrise: data.daily?.sunrise?.[0],
        sunset: data.daily?.sunset?.[0],
        forecast: forecast,
        tempMax: data.daily?.temperature_2m_max?.[0] != null ? Math.round(data.daily.temperature_2m_max[0]) : Math.round(data.current_weather.temperature),
        tempMin: data.daily?.temperature_2m_min?.[0] != null ? Math.round(data.daily.temperature_2m_min[0]) : Math.round(data.current_weather.temperature),
        alert
      };

      this.cache.set(cacheKey, { data: weatherData, timestamp: Date.now() });
      this.saveCachedWeather(weatherData);
      return weatherData;
    } catch (error) {
      console.error('Erro ao buscar dados meteorológicos:', error);
      throw error;
    }
  }

  async getWeatherByCity(cityName: string, forecastDays: 3 | 5 | 7 = 3): Promise<WeatherData> {
    const location = await this.getCityCoordinates(cityName);
    return this.getWeatherData(location, cityName, forecastDays);
  }
}

