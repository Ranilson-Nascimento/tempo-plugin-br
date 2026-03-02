import React, { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { WeatherData, TempoTheme } from '../types';
import './TempoModal.css';

interface TempoModalProps {
  weatherData: WeatherData | null;
  error: string | null;
  loading: boolean;
  theme?: TempoTheme;
  onClose: () => void;
  onCityChange: (city: string) => void;
  onRetry: () => void;
}

export const TempoModal: React.FC<TempoModalProps> = ({
  weatherData,
  error,
  loading,
  theme = 'default',
  onClose,
  onCityChange,
  onRetry
}) => {
  const [newCity, setNewCity] = useState('');
  const [isChangingCity, setIsChangingCity] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const handleCitySubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newCity.trim()) return;
      setIsChangingCity(true);
      try {
        await onCityChange(newCity.trim());
        setNewCity('');
    } catch {
    } finally {
        setIsChangingCity(false);
      }
    },
    [newCity, onCityChange]
  );

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  useEffect(() => {
    previousActiveElement.current = document.activeElement as HTMLElement | null;
    const focusable = modalRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !modalRef.current) return;
      const focusableElements = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null);
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    };
  }, [onClose]);

  const themeClass = theme === 'light' ? 'tempo-modal--light' : theme === 'dark' ? 'tempo-modal--dark' : '';

  const content = (
    <div
      className="tempo-modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tempo-modal-title"
      aria-describedby={error ? 'tempo-modal-error' : 'tempo-modal-content'}
    >
      <div className={`tempo-modal ${themeClass}`} ref={modalRef}>
        <div className="tempo-modal-header">
          <h2 id="tempo-modal-title" className="tempo-modal-title">
            {weatherData ? (
              <>
                {weatherData.icon} Clima em {weatherData.city}
              </>
            ) : error ? (
              'Erro ao carregar'
            ) : (
              'Clima'
            )}
          </h2>
          <button
            type="button"
            className="tempo-modal-close"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>

        <div id="tempo-modal-content" className="tempo-modal-content">
          {error ? (
            <div id="tempo-modal-error" className="tempo-modal-error-block">
              <p className="tempo-modal-error-text">{error}</p>
              <button type="button" className="tempo-modal-retry" onClick={onRetry} disabled={loading}>
                {loading ? 'Carregando…' : 'Tentar novamente'}
              </button>
            </div>
          ) : null}

          {weatherData && !error && (
            <>
              <div className="tempo-modal-hero">
                <div className="tempo-modal-hero-main">
                  <div className="tempo-temperature">{weatherData.temperature}°C</div>
                  <div className="tempo-description">{weatherData.description}</div>
                </div>
                <div className="tempo-modal-hero-feels">
                  <span className="tempo-feels-label">Sensação</span>
                  <span className="tempo-feels-value">{weatherData.feelsLike}°C</span>
                </div>
              </div>

              <div className="tempo-details tempo-details-grid">
                <div className="tempo-detail-item">
                  <span className="tempo-detail-label">💧 Umidade</span>
                  <span className="tempo-detail-value">{weatherData.humidity}%</span>
                </div>
                <div className="tempo-detail-item">
                  <span className="tempo-detail-label">💨 Vento</span>
                  <span className="tempo-detail-value">{weatherData.windSpeed} km/h</span>
                </div>
                <div className="tempo-detail-item">
                  <span className="tempo-detail-label">🌡️ Pressão</span>
                  <span className="tempo-detail-value">{weatherData.pressure} hPa</span>
                </div>
                <div className="tempo-detail-item">
                  <span className="tempo-detail-label">👁️ Visib.</span>
                  <span className="tempo-detail-value">{weatherData.visibility} km</span>
                </div>
                {weatherData.uvIndex !== undefined && (
                  <div className="tempo-detail-item">
                    <span className="tempo-detail-label">☀️ UV</span>
                    <span className="tempo-detail-value">{weatherData.uvIndex}</span>
                  </div>
                )}
                {weatherData.cloudCover !== undefined && (
                  <div className="tempo-detail-item">
                    <span className="tempo-detail-label">☁️ Nuvens</span>
                    <span className="tempo-detail-value">{weatherData.cloudCover}%</span>
                  </div>
                )}
                {weatherData.precipitationProbability !== undefined && (
                  <div className="tempo-detail-item">
                    <span className="tempo-detail-label">🌧️ Chuva</span>
                    <span className="tempo-detail-value">{weatherData.precipitationProbability}%</span>
                  </div>
                )}
                {(weatherData.sunrise || weatherData.sunset) && (
                  <div className="tempo-detail-item">
                    <span className="tempo-detail-label">🌅 Sol</span>
                    <span className="tempo-detail-value tempo-detail-value-small">
                      {weatherData.sunrise &&
                        new Date(weatherData.sunrise).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      {weatherData.sunrise && weatherData.sunset && ' / '}
                      {weatherData.sunset &&
                        new Date(weatherData.sunset).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                    </span>
                  </div>
                )}
              </div>

              {weatherData.forecast && weatherData.forecast.length > 0 && (
                <div className="tempo-forecast-strip">
                  {weatherData.forecast.slice(1, 4).map((day, index) => (
                    <div key={day.date} className="tempo-forecast-card">
                      <div className="tempo-forecast-day-name">
                        {new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                      </div>
                      <div className="tempo-forecast-icon">{day.icon}</div>
                      <div className="tempo-forecast-temps">
                        <span className="tempo-forecast-max">{day.tempMax}°</span>
                        <span className="tempo-forecast-min">{day.tempMin}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <form className="tempo-city-form" onSubmit={handleCitySubmit}>
                <input
                  type="text"
                  className="tempo-city-input"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="Buscar cidade..."
                  disabled={isChangingCity}
                  aria-label="Nome da cidade"
                />
                <button
                  type="submit"
                  className="tempo-city-button"
                  disabled={!newCity.trim() || isChangingCity}
                  aria-label={isChangingCity ? 'Buscando...' : 'Buscar cidade'}
                >
                  {isChangingCity ? '⏳' : '🔍'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : null;
};
