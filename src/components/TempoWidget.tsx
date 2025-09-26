import React, { useState, useEffect, useCallback } from 'react';
import Draggable from 'react-draggable';
import { WeatherData, TempoPluginProps } from '../types/index.js';
import { WeatherService } from '../utils/weatherApi';
import { TempoModal } from './TempoModal';
import './TempoWidget.css';

export const TempoWidget: React.FC<TempoPluginProps> = ({
  initialX = 20,
  initialY = 20,
  initialCity,
  backgroundColor = '#007bff',
  textColor = '#ffffff',
  size = 60,
  updateInterval = 10,
  onTemperatureUpdate,
  onCityChange
}) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [position, setPosition] = useState({ x: initialX, y: initialY });

  const weatherService = WeatherService.getInstance();

  const fetchWeatherData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data: WeatherData;
      
      if (initialCity) {
        data = await weatherService.getWeatherByCity(initialCity);
      } else {
        const location = await weatherService.getCurrentLocation();
        data = await weatherService.getWeatherData(location);
      }
      
      setWeatherData(data);
      onTemperatureUpdate?.(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados meteorológicos';
      setError(errorMessage);
      console.error('Erro ao buscar dados meteorológicos:', err);
    } finally {
      setLoading(false);
    }
  }, [initialCity, weatherService, onTemperatureUpdate]);

  const handleCityChange = useCallback(async (newCity: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await weatherService.getWeatherByCity(newCity);
      setWeatherData(data);
      onCityChange?.(newCity);
      onTemperatureUpdate?.(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados da cidade';
      setError(errorMessage);
      console.error('Erro ao buscar dados da cidade:', err);
    } finally {
      setLoading(false);
    }
  }, [weatherService, onCityChange, onTemperatureUpdate]);

  useEffect(() => {
    fetchWeatherData();
    
    const interval = setInterval(fetchWeatherData, updateInterval * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchWeatherData, updateInterval]);

  const handleDrag = useCallback((e: any, data: any) => {
    setPosition({ x: data.x, y: data.y });
  }, []);

  const handleClick = useCallback(() => {
    if (!loading && weatherData) {
      setShowModal(true);
    }
  }, [loading, weatherData]);

  const widgetStyle: React.CSSProperties = {
    width: size,
    height: size,
    backgroundColor,
    color: textColor,
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: loading ? 'default' : 'pointer',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    fontSize: size > 50 ? '12px' : '10px',
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    userSelect: 'none',
    transition: 'all 0.3s ease',
    zIndex: 9999
  };

  const temperatureStyle: React.CSSProperties = {
    fontSize: size > 50 ? '14px' : '12px',
    lineHeight: '1',
    margin: 0
  };

  const iconStyle: React.CSSProperties = {
    fontSize: size > 50 ? '16px' : '14px',
    lineHeight: '1',
    margin: 0
  };

  return (
    <>
      <Draggable
        position={position}
        onDrag={handleDrag}
        bounds="parent"
      >
        <div
          className="tempo-widget"
          style={widgetStyle}
          onClick={handleClick}
          title={weatherData ? `${weatherData.temperature}°C - ${weatherData.description}` : 'Carregando...'}
        >
          {loading ? (
            <div className="tempo-widget-loading">⏳</div>
          ) : error ? (
            <div className="tempo-widget-error">❌</div>
          ) : weatherData ? (
            <>
              <div style={iconStyle}>{weatherData.icon}</div>
              <div style={temperatureStyle}>{weatherData.temperature}°</div>
            </>
          ) : null}
        </div>
      </Draggable>

      {showModal && weatherData && (
        <TempoModal
          weatherData={weatherData}
          onClose={() => setShowModal(false)}
          onCityChange={handleCityChange}
          loading={loading}
        />
      )}
    </>
  );
};

