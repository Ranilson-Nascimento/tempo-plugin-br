import React, { useState, useCallback } from 'react';
import { TempoWidget, useTempo } from '../../dist/index.esm.js';
import '../../dist/index.esm.css';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ThermometerSun,
  MapPin,
  Palette,
  Hand,
  ShieldCheck,
  Zap,
  ChevronRight,
  Github,
  Cloud,
  Sparkles,
  Compass,
  Sun,
  Smartphone,
  Code2,
  BellRing
} from 'lucide-react';
import './App.css';

const DEMO_STORAGE_KEY = 'tempo-plugin-br-demo-position';

const WIDGET_COLORS = [
  { label: 'Azul Céu', value: '#0284c7' },
  { label: 'Esmeralda', value: '#0f766e' },
  { label: 'Violeta Cósmico', value: '#6366f1' },
  { label: 'Coral Pôr do Sol', value: '#ea580c' },
  { label: 'Preto Noite', value: '#0f172a' }
];

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [lastError, setLastError] = useState(null);
  const [modalTheme, setModalTheme] = useState('default');
  const [widgetColor, setWidgetColor] = useState('#0284c7');
  const [widgetSize, setWidgetSize] = useState(68);

  const handleTemperatureUpdate = useCallback((data) => {
    setWeatherData(data);
    setLastError(null);
  }, []);

  const handleCityChange = useCallback(() => {
    setLastError(null);
  }, []);

  const handleError = useCallback((error, type) => {
    setLastError({ message: error.message, type });
  }, []);

  return (
    <div className="demo-app">
      <header className="demo-header">
        <div className="demo-header-inner">
          <div className="demo-logo">
            <span className="demo-logo-icon">🌤️</span>
            <div>
              <h1 className="demo-logo-title">Tempo Plugin BR</h1>
              <p className="demo-logo-subtitle">Widget e modal meteorológico moderno para React</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="demo-badge-version">
              v2.1.1 • Glass Design
            </Badge>
          </div>
        </div>
      </header>

      <main className="demo-main">
        <section className="demo-hero">
          <div className="demo-hero-content">
            <Badge className="demo-hero-badge">
              <Sparkles className="size-3 mr-1" />
              Novo Visual Moderno &amp; Glassmorphism
            </Badge>
            <h2 className="demo-hero-title">
              O clima brasileiro em tempo real, agora com visual premium
            </h2>
            <p className="demo-hero-desc">
              Widget flutuante e arrastável com efeito de vidro fosco, micro-animações,
              previsão estendida estilo Apple Weather e atalhos rápidos para capitais brasileiras.
            </p>
            {weatherData && (
              <div className="demo-hero-live">
                <span className="demo-hero-live-dot" />
                <span>
                  <strong>{weatherData.city}</strong>: {weatherData.temperature}°C, {weatherData.description}
                  {weatherData.tempMax != null && ` (↓ ${weatherData.tempMin}° / ↑ ${weatherData.tempMax}°)`}
                </span>
              </div>
            )}
            {lastError && (
              <div className="demo-hero-error">
                Erro ({lastError.type}): {lastError.message}
              </div>
            )}
          </div>
        </section>

        {/* Customização Interativa ao Vivo */}
        <section className="demo-section demo-section-alt">
          <h3 className="demo-section-title">Personalize o widget em tempo real</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Tema do Modal */}
            <div>
              <label className="text-sm font-semibold block mb-2">Tema do Modal:</label>
              <Tabs value={modalTheme} onValueChange={setModalTheme} className="demo-tabs">
                <TabsList className="demo-tabs-list w-full grid grid-cols-3">
                  <TabsTrigger value="default">Padrão Glass</TabsTrigger>
                  <TabsTrigger value="light">Claro Clean</TabsTrigger>
                  <TabsTrigger value="dark">Escuro OLED</TabsTrigger>
                </TabsList>
                <TabsContent value={modalTheme} className="demo-tabs-content text-xs text-muted-foreground mt-2">
                  Clique no widget flutuante para abrir o modal com o tema selecionado.
                </TabsContent>
              </Tabs>
            </div>

            {/* Cor e Tamanho do Widget */}
            <div>
              <label className="text-sm font-semibold block mb-2">Cor do Widget Flutuante:</label>
              <div className="flex flex-wrap gap-2">
                {WIDGET_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setWidgetColor(c.value)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
                    style={{
                      borderColor: widgetColor === c.value ? c.value : 'var(--border)',
                      backgroundColor: widgetColor === c.value ? `${c.value}15` : 'transparent',
                      color: widgetColor === c.value ? c.value : 'var(--foreground)'
                    }}
                  >
                    <span
                      className="size-3 rounded-full"
                      style={{ backgroundColor: c.value }}
                    />
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Recursos e Destaques */}
        <section className="demo-section">
          <h3 className="demo-section-title">O que há de novo neste redesign</h3>
          <div className="demo-cards">
            <Card className="demo-card">
              <CardHeader>
                <Sparkles className="demo-card-icon text-amber-500" />
                <CardTitle className="demo-card-title">Glassmorphism Refinado</CardTitle>
                <CardDescription className="demo-card-desc">
                  Vidro fosco com desfoque de fundo (backdrop blur), iluminação especular e sombras volumétricas multicamada.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="demo-card">
              <CardHeader>
                <Compass className="demo-card-icon text-sky-500" />
                <CardTitle className="demo-card-title">Métricas Detalhadas</CardTitle>
                <CardDescription className="demo-card-desc">
                  Barra de nível de umidade, bússola direcional de vento (N, NE, SO, etc.), e escala de risco para Índice UV.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="demo-card">
              <CardHeader>
                <ThermometerSun className="demo-card-icon text-rose-500" />
                <CardTitle className="demo-card-title">Barras de Amplitude Térmica</CardTitle>
                <CardDescription className="demo-card-desc">
                  Previsão com barras de espectro térmico estilo Apple Weather, demonstrando as mínimas e máximas de cada dia.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="demo-card">
              <CardHeader>
                <MapPin className="demo-card-icon text-emerald-500" />
                <CardTitle className="demo-card-title">Capitais Brasileiras em 1 Clique</CardTitle>
                <CardDescription className="demo-card-desc">
                  Chips rápidos das principais cidades (São Paulo, Rio, Curitiba, Salvador, etc.) e botão de GPS com 1 toque.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="demo-card">
              <CardHeader>
                <Hand className="demo-card-icon text-indigo-500" />
                <CardTitle className="demo-card-title">Arraste Suave e Hover Tooltip</CardTitle>
                <CardDescription className="demo-card-desc">
                  Passe o mouse para ver o resumo instantâneo. Arraste para reposicionar livremente na tela com persistência local.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="demo-card">
              <CardHeader>
                <Zap className="demo-card-icon text-amber-500" />
                <CardTitle className="demo-card-title">Cache Instantâneo (SWR)</CardTitle>
                <CardDescription className="demo-card-desc">
                  Carregamento instantâneo a 0ms com Stale-While-Revalidate: exibe o último clima de imediato e atualiza em segundo plano sem flicker.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="demo-card">
              <CardHeader>
                <Code2 className="demo-card-icon text-cyan-500" />
                <CardTitle className="demo-card-title">Hook Headless `useTempo`</CardTitle>
                <CardDescription className="demo-card-desc">
                  Quer montar sua própria interface? Use o hook <code>useTempo()</code> para acessar dados de clima e geolocalização desacoplados.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="demo-card">
              <CardHeader>
                <BellRing className="demo-card-icon text-red-500" />
                <CardTitle className="demo-card-title">Alertas Meteorológicos</CardTitle>
                <CardDescription className="demo-card-desc">
                  Notificações contextuais em destaque no modal para tempestades, raios, granizo ou risco de alagamentos.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Passos de teste */}
        <section className="demo-section">
          <h3 className="demo-section-title">Como experimentar agora</h3>
          <ol className="demo-steps">
            <li>
              <ChevronRight className="demo-step-icon" />
              <span><strong>Passe o mouse</strong> sobre o widget flutuante para ver a pílula de previsão rápida.</span>
            </li>
            <li>
              <ChevronRight className="demo-step-icon" />
              <span><strong>Arraste</strong> a bolinha para qualquer área da tela (desktop ou celular).</span>
            </li>
            <li>
              <ChevronRight className="demo-step-icon" />
              <span><strong>Clique</strong> para abrir o modal com o visual moderno em cards e previsão estendida.</span>
            </li>
            <li>
              <ChevronRight className="demo-step-icon" />
              <span><strong>Clique em qualquer capital</strong> (ex: Curitiba, Salvador, Manaus) para ver os dados mudarem instantaneamente.</span>
            </li>
          </ol>
        </section>

        {/* Instalação */}
        <section className="demo-section demo-section-cta">
          <Card className="demo-cta-card">
            <CardContent className="demo-cta-content">
              <Sun className="demo-cta-icon text-amber-500" />
              <div>
                <h4 className="demo-cta-title">Pronto para usar no seu projeto</h4>
                <p className="demo-cta-desc">
                  <code>npm install tempo-plugin-br</code> — compatível com React 16.8 até React 19+.
                </p>
                <Button asChild variant="outline" size="sm" className="demo-cta-btn">
                  <a
                    href="https://github.com/Ranilson-Nascimento/tempo-plugin-br"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="size-4 mr-1" />
                    Ver repositório no GitHub
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="demo-footer">
        <p>
          Dados meteorológicos por <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a>
          {' · '}
          Desenvolvido por <a href="https://github.com/Ranilson-Nascimento" target="_blank" rel="noopener noreferrer">Ranilson Nascimento</a>
        </p>
      </footer>

      {/* O Widget Flutuante Redesenhado */}
      <TempoWidget
        initialX={120}
        initialY={120}
        positionStorageKey={DEMO_STORAGE_KEY}
        theme={modalTheme}
        forecastDays={5}
        updateInterval={5}
        size={widgetSize}
        backgroundColor={widgetColor}
        textColor="#ffffff"
        showTooltip={true}
        onTemperatureUpdate={handleTemperatureUpdate}
        onCityChange={handleCityChange}
        onError={handleError}
      />
    </div>
  );
}

export default App;
