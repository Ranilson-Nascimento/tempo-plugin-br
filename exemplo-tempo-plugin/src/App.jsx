import React, { useState, useCallback } from 'react';
import { TempoWidget } from '../../dist/index.esm.js';
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
} from 'lucide-react';
import './App.css';

const DEMO_STORAGE_KEY = 'tempo-plugin-br-demo-position';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [lastError, setLastError] = useState(null);
  const [modalTheme, setModalTheme] = useState('default');

  const handleTemperatureUpdate = useCallback((data) => {
    setWeatherData(data);
    setLastError(null);
  }, []);

  const handleCityChange = useCallback((city) => {
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
            <span className="demo-logo-icon">🌡️</span>
            <div>
              <h1 className="demo-logo-title">Tempo Plugin BR</h1>
              <p className="demo-logo-subtitle">Widget de clima para React</p>
            </div>
          </div>
          <Badge variant="secondary" className="demo-badge-version">
            v2.0
          </Badge>
        </div>
      </header>

      <main className="demo-main">
        <section className="demo-hero">
          <div className="demo-hero-content">
            <Badge className="demo-hero-badge">Demonstração ao vivo</Badge>
            <h2 className="demo-hero-title">
              Clima brasileiro em tempo real no seu app
            </h2>
            <p className="demo-hero-desc">
              Arraste o widget, clique para ver detalhes e troque de cidade. A posição é salva
              automaticamente. Experimente no celular: arraste com o dedo.
            </p>
            {weatherData && (
              <div className="demo-hero-live">
                <span className="demo-hero-live-dot" />
                <span>
                  {weatherData.city} — {weatherData.temperature}°C, {weatherData.description}
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

        <section className="demo-section">
          <h3 className="demo-section-title">Recursos da v2</h3>
          <div className="demo-cards">
            <Card className="demo-card">
              <CardHeader>
                <Hand className="demo-card-icon" />
                <CardTitle className="demo-card-title">Touch e mouse</CardTitle>
                <CardDescription className="demo-card-desc">
                  Arraste no desktop e no mobile com o dedo. Funciona em qualquer dispositivo.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="demo-card">
              <CardHeader>
                <Palette className="demo-card-icon" />
                <CardTitle className="demo-card-title">Temas do modal</CardTitle>
                <CardDescription className="demo-card-desc">
                  Tema padrão (gradiente), claro ou escuro. Escolha abaixo e abra o widget.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="demo-card">
              <CardHeader>
                <MapPin className="demo-card-icon" />
                <CardTitle className="demo-card-title">Posição persistida</CardTitle>
                <CardDescription className="demo-card-desc">
                  Com positionStorageKey a posição do widget é salva no localStorage.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="demo-card">
              <CardHeader>
                <ShieldCheck className="demo-card-icon" />
                <CardTitle className="demo-card-title">Acessível</CardTitle>
                <CardDescription className="demo-card-desc">
                  Foco no modal, Escape para fechar, ARIA e suporte a teclado.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="demo-card">
              <CardHeader>
                <Zap className="demo-card-icon" />
                <CardTitle className="demo-card-title">Previsão e erros</CardTitle>
                <CardDescription className="demo-card-desc">
                  3, 5 ou 7 dias de previsão. Callback onError e botão &quot;Tentar novamente&quot; no modal.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="demo-card">
              <CardHeader>
                <Cloud className="demo-card-icon" />
                <CardTitle className="demo-card-title">Open-Meteo</CardTitle>
                <CardDescription className="demo-card-desc">
                  Dados gratuitos, sem chave de API. Nominatim para geocoding, com cache.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="demo-section demo-section-alt">
          <h3 className="demo-section-title">Tema do modal</h3>
          <Tabs
            value={modalTheme}
            onValueChange={setModalTheme}
            className="demo-tabs"
          >
            <TabsList className="demo-tabs-list">
              <TabsTrigger value="default">Padrão</TabsTrigger>
              <TabsTrigger value="light">Claro</TabsTrigger>
              <TabsTrigger value="dark">Escuro</TabsTrigger>
            </TabsList>
            <TabsContent value={modalTheme} className="demo-tabs-content">
              <p className="text-muted-foreground text-sm">
                Abra o widget (clique na bolinha) para ver o modal com o tema escolhido.
              </p>
            </TabsContent>
          </Tabs>
        </section>

        <section className="demo-section">
          <h3 className="demo-section-title">Como testar</h3>
          <ol className="demo-steps">
            <li>
              <ChevronRight className="demo-step-icon" />
              <span><strong>Arraste</strong> o widget para qualquer canto da tela (mouse ou dedo).</span>
            </li>
            <li>
              <ChevronRight className="demo-step-icon" />
              <span><strong>Clique</strong> ou toque para abrir o modal com detalhes e previsão.</span>
            </li>
            <li>
              <ChevronRight className="demo-step-icon" />
              <span><strong>Troque de cidade</strong> no campo de busca dentro do modal.</span>
            </li>
            <li>
              <ChevronRight className="demo-step-icon" />
              <span><strong>Recarregue a página</strong> — a posição do widget continua onde você deixou.</span>
            </li>
          </ol>
        </section>

        <section className="demo-section demo-section-cta">
          <Card className="demo-cta-card">
            <CardContent className="demo-cta-content">
              <ThermometerSun className="demo-cta-icon" />
              <div>
                <h4 className="demo-cta-title">Instale no seu projeto</h4>
                <p className="demo-cta-desc">
                  <code>npm install tempo-plugin-br</code> — documentação e props no README do repositório.
                </p>
                <Button asChild variant="outline" size="sm" className="demo-cta-btn">
                  <a
                    href="https://github.com/Ranilson-Nascimento/tempo-plugin-br"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="size-4" />
                    Ver no GitHub
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="demo-footer">
        <p>
          Dados por <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a>
          {' · '}
          Feito com ❤️ por <a href="https://github.com/Ranilson-Nascimento" target="_blank" rel="noopener noreferrer">Ranilson Nascimento</a>
        </p>
      </footer>

      <TempoWidget
        initialX={120}
        initialY={120}
        positionStorageKey={DEMO_STORAGE_KEY}
        theme={modalTheme}
        forecastDays={5}
        updateInterval={5}
        size={72}
        backgroundColor="#0f766e"
        textColor="#ffffff"
        onTemperatureUpdate={handleTemperatureUpdate}
        onCityChange={handleCityChange}
        onError={handleError}
      />
    </div>
  );
}

export default App;
