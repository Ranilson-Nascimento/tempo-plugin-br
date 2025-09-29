import './components/TempoWidget.css';
import './components/TempoModal.css';

export { TempoWidget } from './components/TempoWidget';
export { TempoModal } from './components/TempoModal';
export { WeatherService } from './utils/weatherApi';

// Exportação de tipos
export type { TempoPluginProps, WeatherData, GeoLocation, ApiResponse } from './types';

// Exportação padrão para facilitar a importação
export { TempoWidget as default } from './components/TempoWidget';

