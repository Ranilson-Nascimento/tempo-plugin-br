import React, { useState, useCallback } from 'react';
import { WeatherData } from '../types/index.js';
import './TempoModal.css';

interface TempoModalProps {
  weatherData: WeatherData;
  onClose: () => void;
  onCityChange: (city: string) => void;
  loading: boolean;
}

export const TempoModal: React.FC<TempoModalProps> = ({
  weatherData,
  onClose,
  onCityChange,
  loading
}) => {
  const [newCity, setNewCity] = useState('');
  const [isChangingCity, setIsChangingCity] = useState(false);

  const handleCitySubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCity.trim()) return;

    setIsChangingCity(true);
    try {
      await onCityChange(newCity.trim());
      setNewCity('');
    } catch (error) {
      console.error('Erro ao alterar cidade:', error);
    } finally {
      setIsChangingCity(false);
    }
  }, [newCity, onCityChange]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  return (
    <div className="tempo-modal-overlay" onClick={handleOverlayClick}>
      <div className="tempo-modal">
        <div className="tempo-modal-header">
          <h2 className="tempo-modal-title">
            {weatherData.icon} Clima em {weatherData.city}
          </h2>
          <button 
            className="tempo-modal-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <div className="tempo-modal-content">
          <div className="tempo-main-info">
            <div className="tempo-temperature">
              {weatherData.temperature}°C
            </div>
            <div className="tempo-description">
              {weatherData.description}
            </div>
            <div className="tempo-feels-like">
              Sensação térmica: {weatherData.feelsLike}°C
            </div>
          </div>

          <div className="tempo-details">
            <div className="tempo-detail-item">
              <span className="tempo-detail-label">💧 Umidade:</span>
              <span className="tempo-detail-value">{weatherData.humidity}%</span>
            </div>
            <div className="tempo-detail-item">
              <span className="tempo-detail-label">💨 Vento:</span>
              <span className="tempo-detail-value">{weatherData.windSpeed} km/h</span>
            </div>
            <div className="tempo-detail-item">
              <span className="tempo-detail-label">🌡️ Pressão:</span>
              <span className="tempo-detail-value">{weatherData.pressure} hPa</span>
            </div>
            <div className="tempo-detail-item">
              <span className="tempo-detail-label">👁️ Visibilidade:</span>
              <span className="tempo-detail-value">{weatherData.visibility} km</span>
            </div>
          </div>

          <div className="tempo-city-changer">
            <h3>Alterar Cidade</h3>
            <form onSubmit={handleCitySubmit} className="tempo-city-form">
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="Digite o nome da cidade..."
                className="tempo-city-input"
                disabled={isChangingCity}
              />
              <button
                type="submit"
                className="tempo-city-button"
                disabled={!newCity.trim() || isChangingCity}
              >
                {isChangingCity ? '🔄' : '🔍'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

