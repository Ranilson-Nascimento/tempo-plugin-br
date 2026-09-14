import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WeatherData, TempoPluginProps, TempoErrorType } from '../types';
import { WeatherService } from '../utils/weatherApi';
import { TempoModal } from './TempoModal';
import './TempoWidget.css';

function loadStoredPosition(key: string, fallback: { x: number; y: number }): { x: number; y: number } {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as { x?: number; y?: number };
    if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
      return { x: parsed.x, y: parsed.y };
    }
  } catch {}
  return fallback;
}

function savePosition(key: string, x: number, y: number): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify({ x, y }));
  } catch {}
}

function getCleanCityName(fullCity: string): string {
  if (!fullCity) return '';
  const base = fullCity.split('-')[0].trim();
  return base
    .replace(/^regi[aã]o\s+(metropolitana|geogr[aá]fica\s+(imediata|intermedi[aá]ria)?|integrada(\s+de\s+desenvolvimento)?)?\s*(de\s+|do\s+|da\s+)?/i, '')
    .replace(/^microrregi[aã]o\s*(de\s+|do\s+|da\s+)?/i, '')
    .replace(/^mesorregi[aã]o\s*(de\s+|do\s+|da\s+)?/i, '')
    .trim();
}

export const TempoWidget: React.FC<TempoPluginProps> = ({
  initialX = 24,
  initialY = 24,
  initialCity,
  backgroundColor = '#0284c7',
  textColor = '#ffffff',
  size = 68,
  updateInterval = 10,
  forecastDays = 3,
  positionStorageKey,
  theme = 'default',
  showTooltip = true,
  className = '',
  onTemperatureUpdate,
  onCityChange,
  onError
}) => {
  const weatherService = WeatherService.getInstance();
  const [mounted, setMounted] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(() => {
    const cached = weatherService.getCachedWeather();
    if (cached && (!initialCity || cached.city.toLowerCase().includes(initialCity.toLowerCase()))) {
      return cached;
    }
    return null;
  });
  const [loading, setLoading] = useState(!weatherData);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const initialPos = { x: initialX, y: initialY };
  const storedPos = positionStorageKey
    ? loadStoredPosition(positionStorageKey, initialPos)
    : initialPos;
  const [position, setPosition] = useState(storedPos);
  const [isDragging, setIsDragging] = useState(false);
  const [currentCity, setCurrentCity] = useState<string | null>(initialCity ?? null);
  const dragStart = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);
  const lastTouchId = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchWeatherData = useCallback(async () => {
    try {
      if (!weatherData) setLoading(true);
      setError(null);
      let data: WeatherData;
      if (currentCity) {
        data = await weatherService.getWeatherByCity(currentCity, forecastDays);
      } else {
        const location = await weatherService.getCurrentLocation();
        data = await weatherService.getWeatherData(location, undefined, forecastDays);
      }
      setWeatherData(data);
      onTemperatureUpdate?.(data);
    } catch (err) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      if (!weatherData) setError(errObj.message);
      const errorType: TempoErrorType = currentCity ? 'city' : 'weather';
      onError?.(errObj, errorType);
      console.error('Erro ao buscar dados meteorológicos:', err);
    } finally {
      setLoading(false);
    }
  }, [currentCity, forecastDays, weatherService, weatherData, onTemperatureUpdate, onError]);

  const handleCityChange = useCallback(
    async (newCity: string) => {
      try {
        setLoading(true);
        setError(null);
        const data = await weatherService.getWeatherByCity(newCity, forecastDays);
        setWeatherData(data);
        setCurrentCity(newCity);
        onCityChange?.(newCity);
        onTemperatureUpdate?.(data);
      } catch (err) {
        const errObj = err instanceof Error ? err : new Error(String(err));
        setError(errObj.message);
        onError?.(errObj, 'city');
      } finally {
        setLoading(false);
      }
    },
    [forecastDays, weatherService, onCityChange, onTemperatureUpdate, onError]
  );

  const handleResetLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setCurrentCity(null);
      const location = await weatherService.getCurrentLocation();
      const data = await weatherService.getWeatherData(location, undefined, forecastDays);
      setWeatherData(data);
      onTemperatureUpdate?.(data);
      if (data.city) {
        onCityChange?.(data.city);
      }
    } catch (err) {
      const errObj = err instanceof Error ? err : new Error(String(err));
      setError(errObj.message);
      onError?.(errObj, 'location');
    } finally {
      setLoading(false);
    }
  }, [forecastDays, weatherService, onCityChange, onTemperatureUpdate, onError]);

  useEffect(() => {
    if (!mounted) return;
    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, updateInterval * 60 * 1000);
    return () => clearInterval(interval);
  }, [mounted, fetchWeatherData, updateInterval]);

  const applyPosition = useCallback(
    (clientX: number, clientY: number) => {
      const newX = clientX - dragStart.current.x;
      const newY = clientY - dragStart.current.y;
      const maxX = typeof window !== 'undefined' ? window.innerWidth - size : 0;
      const maxY = typeof window !== 'undefined' ? window.innerHeight - size : 0;
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    },
    [size]
  );

  const savePositionIfNeeded = useCallback(() => {
    if (positionStorageKey) {
      savePosition(positionStorageKey, position.x, position.y);
    }
  }, [positionStorageKey, position.x, position.y]);

  const startDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (loading) return;
      setIsDragging(true);
      hasMoved.current = false;
      dragStart.current = { x: clientX - position.x, y: clientY - position.y };
    },
    [loading, position.x, position.y]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return; // Only primary mouse button
      e.preventDefault();
      startDrag(e.clientX, e.clientY);
      let active = true;

      const onMouseMove = (ev: MouseEvent) => {
        if (!active) return;
        hasMoved.current = true;
        applyPosition(ev.clientX, ev.clientY);
      };

      const onMouseUp = () => {
        active = false;
        setTimeout(() => setIsDragging(false), 50);
        savePositionIfNeeded();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [startDrag, applyPosition, savePositionIfNeeded]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.changedTouches[0];
      if (!touch) return;
      lastTouchId.current = touch.identifier;
      startDrag(touch.clientX, touch.clientY);
    },
    [startDrag]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = Array.from(e.changedTouches).find((t) => t.identifier === lastTouchId.current);
      if (touch) {
        hasMoved.current = true;
        applyPosition(touch.clientX, touch.clientY);
      }
    },
    [applyPosition]
  );

  const handleTouchEnd = useCallback(() => {
    lastTouchId.current = null;
    setTimeout(() => setIsDragging(false), 50);
    savePositionIfNeeded();
  }, [savePositionIfNeeded]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (hasMoved.current) {
        e.preventDefault();
        return;
      }
      if (!loading) {
        setShowModal(true);
      }
    },
    [loading]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!loading) setShowModal(true);
      }
    },
    [loading]
  );

  if (!mounted) return null;

  // Background gradient calculation
  const computedBg = backgroundColor.startsWith('linear-gradient') || backgroundColor.startsWith('radial-gradient')
    ? backgroundColor
    : `radial-gradient(circle at 35% 30%, ${backgroundColor} 0%, rgba(15, 23, 42, 0.95) 120%)`;

  const widgetStyle: React.CSSProperties = {
    width: size,
    height: size,
    background: computedBg,
    color: textColor,
    cursor: loading ? 'wait' : isDragging ? 'grabbing' : 'pointer',
    fontSize: size > 56 ? '11px' : '9px',
    padding: '4px'
  };

  const containerStyle: React.CSSProperties = {
    left: position.x,
    top: position.y
  };

  const title = weatherData
    ? `${weatherData.city}: ${weatherData.temperature}°C, ${weatherData.description}`
    : error
    ? `Erro: ${error}`
    : 'Carregando previsão...';

  const isNearTop = position.y < 55;

  return (
    <>
      <div
        className={`tempo-widget-container ${className}`}
        style={containerStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`tempo-widget ${isDragging ? 'tempo-widget--dragging' : ''}`}
          style={widgetStyle}
          onMouseDown={handleMouseDown}
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label={title}
          title={title}
        >
          {loading ? (
            <div className="tempo-widget-loading-spinner" aria-hidden />
          ) : error ? (
            <div className="tempo-widget-error" aria-label="Erro ao carregar">
              ⚠️
            </div>
          ) : weatherData ? (
            <>
              <span className="tempo-widget-status-dot" title="Clima em tempo real" />
              <div
                className="tempo-widget-icon"
                style={{ fontSize: size > 56 ? Math.round(size * 0.3) : 16 }}
              >
                {weatherData.icon}
              </div>
              <div
                className="tempo-widget-temp"
                style={{ fontSize: size > 56 ? Math.round(size * 0.28) : 15 }}
              >
                {weatherData.temperature}°
              </div>
              <div
                className="tempo-widget-city"
                style={{ fontSize: size > 56 ? '8.5px' : '7.5px' }}
              >
                {getCleanCityName(weatherData.city)}
              </div>
            </>
          ) : null}
        </div>

        {/* Hover quick preview pill */}
        {showTooltip && isHovered && !isDragging && !loading && weatherData && (
          <div
            className="tempo-widget-tooltip"
            style={isNearTop ? { bottom: 'auto', top: 'calc(100% + 10px)' } : undefined}
          >
            <span className="tempo-widget-tooltip-dot" />
            <span>
              <strong>{getCleanCityName(weatherData.city)}</strong> • {weatherData.temperature}°C {weatherData.description}
            </span>
          </div>
        )}
      </div>

      {showModal && (
        <TempoModal
          weatherData={weatherData}
          error={error}
          loading={loading}
          theme={theme}
          onClose={() => setShowModal(false)}
          onCityChange={handleCityChange}
          onResetLocation={handleResetLocation}
          onRetry={fetchWeatherData}
        />
      )}
    </>
  );
};

export default TempoWidget;
