import { useState, useEffect, useCallback } from 'react';
import { WeatherData, UseTempoOptions, UseTempoReturn, TempoErrorType } from '../types';
import { WeatherService } from '../utils/weatherApi';

/**
 * Hook headless para consumir dados de clima brasileiro com cache SWR,
 * reverse geocoding automático e suporte a troca de cidades.
 */
export function useTempo(options: UseTempoOptions = {}): UseTempoReturn {
  const {
    initialCity,
    forecastDays = 3,
    updateInterval = 10,
    enableLocalCache = true,
    onTemperatureUpdate,
    onCityChange,
    onError
  } = options;

  const weatherService = WeatherService.getInstance();
  const [city, setCityState] = useState<string | null>(initialCity ?? null);

  // Carrega do cache instantâneo se disponível (SWR)
  const [weather, setWeather] = useState<WeatherData | null>(() => {
    if (enableLocalCache) {
      const cached = weatherService.getCachedWeather();
      if (cached && (!initialCity || cached.city.toLowerCase().includes(initialCity.toLowerCase()))) {
        return cached;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(!weather);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    try {
      if (!weather) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }
      setError(null);

      let data: WeatherData;
      if (city) {
        data = await weatherService.getWeatherByCity(city, forecastDays);
      } else {
        const location = await weatherService.getCurrentLocation();
        data = await weatherService.getWeatherData(location, undefined, forecastDays);
      }

      setWeather(data);
      onTemperatureUpdate?.(data);
    } catch (err) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      setError(errObj.message);
      const errorType: TempoErrorType = city ? 'city' : 'weather';
      onError?.(errObj, errorType);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [city, forecastDays, weatherService, onTemperatureUpdate, onError]);

  const setCity = useCallback(
    async (newCity: string) => {
      setCityState(newCity);
      onCityChange?.(newCity);
    },
    [onCityChange]
  );

  const resetLocation = useCallback(async () => {
    setCityState(null);
  }, []);

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, updateInterval * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeather, updateInterval]);

  return {
    weather,
    loading,
    isRefreshing,
    error,
    city,
    refresh: fetchWeather,
    setCity,
    resetLocation
  };
}

export default useTempo;
