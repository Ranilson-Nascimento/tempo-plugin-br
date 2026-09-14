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
  onCityChange: (city: string) => Promise<void> | void;
  onResetLocation?: () => Promise<void> | void;
  onRetry: () => void;
}

const POPULAR_CITIES = [
  'São Paulo',
  'Rio de Janeiro',
  'Curitiba',
  'Belo Horizonte',
  'Brasília',
  'Salvador',
  'Porto Alegre',
  'Fortaleza',
  'Recife',
  'Manaus'
];

function getWindDirection(degrees?: number): { name: string; arrow: string } {
  if (degrees === undefined) return { name: '', arrow: '' };
  const dirs = [
    { name: 'N', arrow: '↑' },
    { name: 'NE', arrow: '↗' },
    { name: 'L', arrow: '→' },
    { name: 'SE', arrow: '↘' },
    { name: 'S', arrow: '↓' },
    { name: 'SO', arrow: '↙' },
    { name: 'O', arrow: '←' },
    { name: 'NO', arrow: '↖' }
  ];
  const idx = Math.round((degrees % 360) / 45) % 8;
  return dirs[idx];
}

function getUvInfo(uv: number): { label: string; color: string; percent: number } {
  if (uv <= 2) return { label: 'Baixo', color: '#10b981', percent: 20 };
  if (uv <= 5) return { label: 'Moderado', color: '#f59e0b', percent: 48 };
  if (uv <= 7) return { label: 'Alto', color: '#f97316', percent: 70 };
  if (uv <= 10) return { label: 'Muito Alto', color: '#ef4444', percent: 88 };
  return { label: 'Extremo', color: '#a855f7', percent: 100 };
}

export const TempoModal: React.FC<TempoModalProps> = ({
  weatherData,
  error,
  loading,
  theme = 'default',
  onClose,
  onCityChange,
  onResetLocation,
  onRetry
}) => {
  const [newCity, setNewCity] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const handleCitySubmit = useCallback(
    async (cityNameToSearch: string) => {
      const trimmed = cityNameToSearch.trim();
      if (!trimmed || isSearching) return;
      setIsSearching(true);
      try {
        await onCityChange(trimmed);
        setNewCity('');
      } finally {
        setIsSearching(false);
      }
    },
    [isSearching, onCityChange]
  );

  const onFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleCitySubmit(newCity);
    },
    [handleCitySubmit, newCity]
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

  const themeClass =
    theme === 'light'
      ? 'tempo-modal--light'
      : theme === 'dark'
      ? 'tempo-modal--dark'
      : 'tempo-modal--default';

  // Format today's date in Portuguese
  const todayFormatted = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  const wind = weatherData ? getWindDirection(weatherData.windDirection) : null;
  const uv = weatherData ? getUvInfo(weatherData.uvIndex) : null;

  // City parts
  const cityParts = weatherData?.city ? weatherData.city.split('-') : [];
  const rawCity = cityParts[0]?.trim() || weatherData?.city || 'Brasil';
  const cityName = rawCity
    .replace(/^regi[aã]o\s+(metropolitana|geogr[aá]fica\s+(imediata|intermedi[aá]ria)?|integrada(\s+de\s+desenvolvimento)?)?\s*(de\s+|do\s+|da\s+)?/i, '')
    .replace(/^microrregi[aã]o\s*(de\s+|do\s+|da\s+)?/i, '')
    .replace(/^mesorregi[aã]o\s*(de\s+|do\s+|da\s+)?/i, '')
    .trim();
  const stateCode = cityParts[1]?.trim() || '';

  // Max and min
  const maxTemp = weatherData?.tempMax ?? weatherData?.forecast?.[0]?.tempMax ?? weatherData?.temperature;
  const minTemp = weatherData?.tempMin ?? weatherData?.forecast?.[0]?.tempMin ?? weatherData?.temperature;

  const content = (
    <div
      className="tempo-modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tempo-modal-title"
    >
      <div className={`tempo-modal ${themeClass}`} ref={modalRef}>
        {/* Mobile bottom sheet handle */}
        <div className="tempo-modal-drag-handle" aria-hidden />

        {/* Modal Header */}
        <div className="tempo-modal-header">
          <div className="tempo-modal-header-location">
            <span className="tempo-modal-pin-icon" aria-hidden>📍</span>
            <div className="tempo-modal-city-box">
              <h2 id="tempo-modal-title" className="tempo-modal-title">
                {cityName}
                {stateCode && <span className="tempo-modal-uf-badge">{stateCode}</span>}
              </h2>
              <div className="tempo-modal-live-status">
                <span className="tempo-modal-live-dot" />
                <span>Tempo Real • Brasil</span>
              </div>
            </div>
          </div>

          <div className="tempo-modal-header-actions">
            {onResetLocation && (
              <button
                type="button"
                className="tempo-modal-icon-btn"
                onClick={onResetLocation}
                title="Usar minha localização GPS"
                aria-label="Usar minha localização GPS"
                disabled={loading}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="12 2 15 11 22 12 15 13 12 22 9 13 2 12 9 11 12 2" fill="currentColor" opacity="0.35" />
                </svg>
              </button>
            )}
            <button
              type="button"
              className="tempo-modal-close-btn"
              onClick={onClose}
              aria-label="Fechar janela"
              title="Fechar (Esc)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="tempo-modal-content">
          {error ? (
            <div className="tempo-modal-error-box">
              <div className="tempo-modal-error-icon">⚠️</div>
              <h3 className="tempo-modal-error-title">Não foi possível carregar o clima</h3>
              <p className="tempo-modal-error-desc">{error}</p>
              <button
                type="button"
                className="tempo-modal-retry-btn"
                onClick={onRetry}
                disabled={loading}
              >
                {loading ? 'Tentando reconectar…' : 'Tentar novamente'}
              </button>
            </div>
          ) : null}

          {weatherData && !error && (
            <>
              {/* Alerta Meteorológico */}
              {weatherData.alert && (
                <div className={`tempo-alert-banner tempo-alert-banner--${weatherData.alert.severity}`}>
                  <span className="tempo-alert-icon">⚠️</span>
                  <div className="tempo-alert-body">
                    <strong className="tempo-alert-title">{weatherData.alert.title}</strong>
                    <span className="tempo-alert-message">{weatherData.alert.message}</span>
                  </div>
                </div>
              )}

              {/* Hero Clima Atual */}
              <div className="tempo-hero-card">
                <div className="tempo-hero-top">
                  <div className="tempo-hero-icon-wrap" aria-hidden>
                    <span className="tempo-hero-weather-icon">{weatherData.icon}</span>
                  </div>
                  <div className="tempo-hero-temp-block">
                    <div className="tempo-hero-temp">
                      {weatherData.temperature}<span className="tempo-hero-unit">°C</span>
                    </div>
                    <div className="tempo-hero-desc">{weatherData.description}</div>
                  </div>
                </div>

                <div className="tempo-hero-pills">
                  <div className="tempo-hero-pill">
                    <span className="tempo-pill-label">Sensação</span>
                    <span className="tempo-pill-val">{weatherData.feelsLike}°C</span>
                  </div>
                  {maxTemp !== undefined && minTemp !== undefined && (
                    <div className="tempo-hero-pill">
                      <span className="tempo-pill-label">Variação hoje</span>
                      <span className="tempo-pill-val">
                        <span className="tempo-text-min">↓ {minTemp}°</span> • <span className="tempo-text-max">↑ {maxTemp}°</span>
                      </span>
                    </div>
                  )}
                  <div className="tempo-hero-pill tempo-hero-pill-date">
                    <span className="tempo-pill-val">{todayFormatted}</span>
                  </div>
                </div>
              </div>

              {/* Grid de Métricas Modernas */}
              <div className="tempo-metrics-section">
                <h4 className="tempo-section-heading">Condições climáticas</h4>
                <div className="tempo-metrics-grid">
                  {/* Umidade */}
                  <div className="tempo-metric-card">
                    <div className="tempo-metric-top">
                      <span className="tempo-metric-icon">💧</span>
                      <span className="tempo-metric-label">Umidade</span>
                    </div>
                    <div className="tempo-metric-value">{weatherData.humidity}%</div>
                    <div className="tempo-metric-bar-track">
                      <div
                        className="tempo-metric-bar-fill tempo-metric-bar--blue"
                        style={{ width: `${Math.min(100, Math.max(5, weatherData.humidity))}%` }}
                      />
                    </div>
                    <span className="tempo-metric-sub">
                      {weatherData.humidity > 70 ? 'Ar úmido' : weatherData.humidity < 35 ? 'Ar seco' : 'Ideal'}
                    </span>
                  </div>

                  {/* Vento */}
                  <div className="tempo-metric-card">
                    <div className="tempo-metric-top">
                      <span className="tempo-metric-icon">💨</span>
                      <span className="tempo-metric-label">Vento</span>
                    </div>
                    <div className="tempo-metric-value">
                      {weatherData.windSpeed} <span className="tempo-metric-unit">km/h</span>
                    </div>
                    {wind && wind.name && (
                      <div className="tempo-metric-badge">
                        <span>Direção: {wind.name}</span>
                        <span className="tempo-wind-arrow">{wind.arrow}</span>
                      </div>
                    )}
                    <span className="tempo-metric-sub">
                      {weatherData.windSpeed < 10 ? 'Brisa leve' : weatherData.windSpeed < 30 ? 'Vento moderado' : 'Ventania'}
                    </span>
                  </div>

                  {/* Índice UV */}
                  {uv && (
                    <div className="tempo-metric-card">
                      <div className="tempo-metric-top">
                        <span className="tempo-metric-icon">☀️</span>
                        <span className="tempo-metric-label">Índice UV</span>
                      </div>
                      <div className="tempo-metric-value">{weatherData.uvIndex}</div>
                      <div className="tempo-metric-bar-track">
                        <div
                          className="tempo-metric-bar-fill"
                          style={{
                            width: `${uv.percent}%`,
                            background: uv.color
                          }}
                        />
                      </div>
                      <span className="tempo-metric-sub" style={{ color: uv.color, fontWeight: 600 }}>
                        {uv.label}
                      </span>
                    </div>
                  )}

                  {/* Probabilidade de Chuva */}
                  {weatherData.precipitationProbability !== undefined && (
                    <div className="tempo-metric-card">
                      <div className="tempo-metric-top">
                        <span className="tempo-metric-icon">🌧️</span>
                        <span className="tempo-metric-label">Chuva</span>
                      </div>
                      <div className="tempo-metric-value">{weatherData.precipitationProbability}%</div>
                      <div className="tempo-metric-bar-track">
                        <div
                          className="tempo-metric-bar-fill tempo-metric-bar--cyan"
                          style={{ width: `${Math.min(100, Math.max(5, weatherData.precipitationProbability))}%` }}
                        />
                      </div>
                      <span className="tempo-metric-sub">
                        {weatherData.precipitationProbability > 50 ? 'Alta probabilidade' : 'Sem previsão de chuva forte'}
                      </span>
                    </div>
                  )}

                  {/* Visibilidade */}
                  <div className="tempo-metric-card">
                    <div className="tempo-metric-top">
                      <span className="tempo-metric-icon">👁️</span>
                      <span className="tempo-metric-label">Visibilidade</span>
                    </div>
                    <div className="tempo-metric-value">
                      {weatherData.visibility} <span className="tempo-metric-unit">km</span>
                    </div>
                    <span className="tempo-metric-sub">
                      {weatherData.visibility >= 10 ? 'Excelente visibilidade' : 'Visibilidade reduzida'}
                    </span>
                  </div>

                  {/* Pressão */}
                  <div className="tempo-metric-card">
                    <div className="tempo-metric-top">
                      <span className="tempo-metric-icon">🌡️</span>
                      <span className="tempo-metric-label">Pressão</span>
                    </div>
                    <div className="tempo-metric-value">
                      {weatherData.pressure} <span className="tempo-metric-unit">hPa</span>
                    </div>
                    <span className="tempo-metric-sub">
                      {weatherData.pressure >= 1013 ? 'Atmosfera estável' : 'Pressão baixa'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Nascer e Pôr do Sol */}
              {(weatherData.sunrise || weatherData.sunset) && (
                <div className="tempo-sun-card">
                  <div className="tempo-sun-item">
                    <span className="tempo-sun-icon">🌅</span>
                    <div>
                      <span className="tempo-sun-title">Nascer do Sol</span>
                      <span className="tempo-sun-time">
                        {weatherData.sunrise
                          ? new Date(weatherData.sunrise).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                          : '--:--'}
                      </span>
                    </div>
                  </div>
                  <div className="tempo-sun-divider" />
                  <div className="tempo-sun-item">
                    <span className="tempo-sun-icon">🌇</span>
                    <div>
                      <span className="tempo-sun-title">Pôr do Sol</span>
                      <span className="tempo-sun-time">
                        {weatherData.sunset
                          ? new Date(weatherData.sunset).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                          : '--:--'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Previsão dos Próximos Dias */}
              {weatherData.forecast && weatherData.forecast.length > 0 && (
                <div className="tempo-forecast-section">
                  <h4 className="tempo-section-heading">Previsão dos próximos dias</h4>
                  <div className="tempo-forecast-list">
                    {weatherData.forecast.map((day, idx) => {
                      const dayDate = new Date(day.date);
                      const dayName = idx === 0
                        ? 'Hoje'
                        : dayDate.toLocaleDateString('pt-BR', { weekday: 'short' });
                      const dayNumber = dayDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).replace('.', '');

                      return (
                        <div key={day.date} className="tempo-forecast-row">
                          <div className="tempo-forecast-day-box">
                            <span className="tempo-forecast-day-name">{dayName}</span>
                            <span className="tempo-forecast-day-date">{dayNumber}</span>
                          </div>

                          <div className="tempo-forecast-weather-box">
                            <span className="tempo-forecast-icon">{day.icon}</span>
                            {day.precipitationProbability > 0 && (
                              <span className="tempo-forecast-rain-pill">
                                💧 {day.precipitationProbability}%
                              </span>
                            )}
                          </div>

                          <div className="tempo-forecast-bar-container">
                            <span className="tempo-forecast-temp-min">{day.tempMin}°</span>
                            <div className="tempo-forecast-spectrum-bar">
                              <div
                                className="tempo-forecast-spectrum-fill"
                                style={{
                                  left: `${Math.max(0, Math.min(60, (day.tempMin - 5) * 2.5))}%`,
                                  right: `${Math.max(0, Math.min(60, (40 - day.tempMax) * 2.5))}%`
                                }}
                              />
                            </div>
                            <span className="tempo-forecast-temp-max">{day.tempMax}°</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Busca e Capitais Rápidas */}
              <div className="tempo-search-section">
                <h4 className="tempo-section-heading">Trocar de cidade</h4>

                {/* Chips de Capitais Populares */}
                <div className="tempo-city-chips">
                  {POPULAR_CITIES.map((city) => {
                    const isSelected = cityName.toLowerCase().includes(city.toLowerCase());
                    return (
                      <button
                        key={city}
                        type="button"
                        className={`tempo-city-chip ${isSelected ? 'tempo-city-chip--active' : ''}`}
                        onClick={() => handleCitySubmit(city)}
                        disabled={isSearching}
                      >
                        {city}
                      </button>
                    );
                  })}
                </div>

                {/* Input de Busca */}
                <form className="tempo-city-form" onSubmit={onFormSubmit}>
                  <div className="tempo-city-input-wrapper">
                    <span className="tempo-search-input-icon">🔍</span>
                    <input
                      type="text"
                      className="tempo-city-input"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder="Buscar por cidade brasileira (ex: Campinas, Florianópolis)..."
                      disabled={isSearching}
                      aria-label="Buscar cidade"
                    />
                    {newCity && (
                      <button
                        type="button"
                        className="tempo-city-clear-btn"
                        onClick={() => setNewCity('')}
                        aria-label="Limpar campo de busca"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="tempo-city-button"
                    disabled={!newCity.trim() || isSearching}
                    aria-label="Buscar"
                  >
                    {isSearching ? (
                      <span className="tempo-btn-spinner" />
                    ) : (
                      'Buscar'
                    )}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="tempo-modal-footer">
          <span>Dados meteorológicos abertos por Open-Meteo</span>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : null;
};

export default TempoModal;
