import { WeatherService } from '../utils/weatherApi';

describe('WeatherService & Utilities', () => {
  let weatherService: WeatherService;

  beforeEach(() => {
    weatherService = WeatherService.getInstance();
    localStorage.clear();
  });

  test('should return singleton instance', () => {
    const instance1 = WeatherService.getInstance();
    const instance2 = WeatherService.getInstance();
    expect(instance1).toBe(instance2);
  });

  test('should save and retrieve cached weather data via SWR', () => {
    const mockWeather: any = {
      temperature: 24,
      description: 'Céu limpo',
      humidity: 60,
      windSpeed: 12,
      city: 'São Paulo - SP',
      country: 'Brasil',
      icon: '☀️',
      feelsLike: 25,
      pressure: 1015,
      visibility: 10,
      uvIndex: 6
    };

    expect(weatherService.getCachedWeather()).toBeNull();
    weatherService.saveCachedWeather(mockWeather);
    const retrieved = weatherService.getCachedWeather();
    expect(retrieved).not.toBeNull();
    expect(retrieved?.city).toBe('São Paulo - SP');
    expect(retrieved?.temperature).toBe(24);
  });

  test('should sanitize metropolitan region names from reverse geocode', async () => {
    // Mock global.fetch for reverse geocoding
    const originalFetch = global.fetch;
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        city: 'Região Metropolitana de São Paulo',
        locality: 'São Paulo',
        principalSubdivision: 'São Paulo',
        principalSubdivisionCode: 'BR-SP'
      })
    } as any);

    const cityName = await weatherService.getCityNameFromCoordinates({ latitude: -23.55, longitude: -46.63 });
    expect(cityName).toBe('São Paulo - SP');
    expect(cityName).not.toContain('Região');

    global.fetch = originalFetch;
  });
});
