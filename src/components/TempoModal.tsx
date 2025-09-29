import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { WeatherData } from '../types';
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
      // Não fechar o modal automaticamente - deixar o usuário ver os novos dados
    } catch (error) {
      console.error('Erro ao alterar cidade:', error);
      // Manter o modal aberto em caso de erro
    } finally {
      setIsChangingCity(false);
    }
  }, [newCity, onCityChange]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  return createPortal(
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
          {/* Temperatura e descrição em uma linha */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <div className="tempo-temperature" style={{ fontSize: '36px', margin: 0 }}>{weatherData.temperature}°C</div>
              <div className="tempo-description" style={{ fontSize: '14px', margin: '4px 0 0 0' }}>{weatherData.description}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '2px' }}>Sensação</div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>{weatherData.feelsLike}°C</div>
            </div>
          </div>

          {/* Detalhes em grid de 3 colunas */}
          <div className="tempo-details" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '12px', marginBottom: '12px' }}>
            <div className="tempo-detail-item" style={{ padding: '6px' }}>
              <span className="tempo-detail-label" style={{ fontSize: '9px' }}>💧 Umidade</span>
              <span className="tempo-detail-value" style={{ fontSize: '12px' }}>{weatherData.humidity}%</span>
            </div>
            <div className="tempo-detail-item" style={{ padding: '6px' }}>
              <span className="tempo-detail-label" style={{ fontSize: '9px' }}>💨 Vento</span>
              <span className="tempo-detail-value" style={{ fontSize: '12px' }}>{weatherData.windSpeed} km/h</span>
            </div>
            <div className="tempo-detail-item" style={{ padding: '6px' }}>
              <span className="tempo-detail-label" style={{ fontSize: '9px' }}>🌡️ Pressão</span>
              <span className="tempo-detail-value" style={{ fontSize: '12px' }}>{weatherData.pressure} hPa</span>
            </div>
            <div className="tempo-detail-item" style={{ padding: '6px' }}>
              <span className="tempo-detail-label" style={{ fontSize: '9px' }}>👁️ Visib.</span>
              <span className="tempo-detail-value" style={{ fontSize: '12px' }}>{weatherData.visibility} km</span>
            </div>
            {weatherData.uvIndex !== undefined && (
              <div className="tempo-detail-item" style={{ padding: '6px' }}>
                <span className="tempo-detail-label" style={{ fontSize: '9px' }}>☀️ UV</span>
                <span className="tempo-detail-value" style={{ fontSize: '12px' }}>{weatherData.uvIndex}</span>
              </div>
            )}
            {weatherData.cloudCover !== undefined && (
              <div className="tempo-detail-item" style={{ padding: '6px' }}>
                <span className="tempo-detail-label" style={{ fontSize: '9px' }}>☁️ Nuvens</span>
                <span className="tempo-detail-value" style={{ fontSize: '12px' }}>{weatherData.cloudCover}%</span>
              </div>
            )}
            {weatherData.precipitationProbability !== undefined && (
              <div className="tempo-detail-item" style={{ padding: '6px' }}>
                <span className="tempo-detail-label" style={{ fontSize: '9px' }}>🌧️ Chuva</span>
                <span className="tempo-detail-value" style={{ fontSize: '12px' }}>{weatherData.precipitationProbability}%</span>
              </div>
            )}
            {(weatherData.sunrise || weatherData.sunset) && (
              <div className="tempo-detail-item" style={{ padding: '6px' }}>
                <span className="tempo-detail-label" style={{ fontSize: '9px' }}>🌅 Sol</span>
                <span className="tempo-detail-value" style={{ fontSize: '10px' }}>
                  {weatherData.sunrise && new Date(weatherData.sunrise).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  {weatherData.sunrise && weatherData.sunset && ' / '}
                  {weatherData.sunset && new Date(weatherData.sunset).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}
          </div>

          {/* Previsão compacta */}
          {weatherData.forecast && weatherData.forecast.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                {weatherData.forecast.slice(1, 4).map((day, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '8px 6px',
                    textAlign: 'center',
                    minWidth: '60px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <div style={{ fontSize: '9px', opacity: 0.8, marginBottom: '2px' }}>
                      {new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                    </div>
                    <div style={{ fontSize: '14px', marginBottom: '2px' }}>{day.icon}</div>
                    <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', alignItems: 'baseline' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#ff8a80' }}>{day.tempMax}°</span>
                      <span style={{ fontSize: '10px', opacity: 0.7 }}>{day.tempMin}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input de cidade compacto */}
          <form onSubmit={handleCitySubmit} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              placeholder="Buscar cidade..."
              style={{
                flex: 1,
                padding: '8px 10px',
                border: 'none',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                fontSize: '13px',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
              disabled={isChangingCity}
            />
            <button
              type="submit"
              style={{
                padding: '8px 12px',
                border: 'none',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minWidth: '40px'
              }}
              disabled={!newCity.trim() || isChangingCity}
            >
              {isChangingCity ? '⏳' : '🔍'}
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

