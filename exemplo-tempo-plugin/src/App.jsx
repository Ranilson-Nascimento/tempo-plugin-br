import React, { useState } from 'react';
import './App.css';

// Simulação do componente TempoWidget para demonstração
const TempoWidget = ({ 
  initialX = 20, 
  initialY = 20, 
  backgroundColor = '#007bff',
  textColor = '#ffffff',
  size = 60,
  onTemperatureUpdate,
  onCityChange 
}) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [showModal, setShowModal] = useState(false);
  const [temperature] = useState(25);
  const [city] = useState('São Paulo');

  const widgetStyle = {
    position: 'fixed',
    left: position.x,
    top: position.y,
    width: size,
    height: size,
    backgroundColor,
    color: textColor,
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    fontSize: size > 50 ? '12px' : '10px',
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    userSelect: 'none',
    zIndex: 9999,
    transition: 'all 0.3s ease'
  };

  const handleMouseDown = (e) => {
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (e) => {
      setPosition({
        x: e.clientX - startX,
        y: e.clientY - startY
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <>
      <div
        style={widgetStyle}
        onMouseDown={handleMouseDown}
        onClick={() => setShowModal(true)}
        title={`${temperature}°C - Céu limpo`}
      >
        <div style={{ fontSize: size > 50 ? '16px' : '14px' }}>☀️</div>
        <div style={{ fontSize: size > 50 ? '14px' : '12px' }}>{temperature}°</div>
      </div>

      {showModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
          }}
          onClick={() => setShowModal(false)}
        >
          <div 
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '400px',
              width: '90%',
              color: 'white',
              fontFamily: 'Arial, sans-serif'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>☀️ Clima em {city}</h2>
              <button 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'white', 
                  fontSize: '24px', 
                  cursor: 'pointer' 
                }}
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '8px' }}>{temperature}°C</div>
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>Céu limpo</div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>Sensação térmica: 27°C</div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '16px',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>💧 Umidade</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>60%</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>💨 Vento</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>10 km/h</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>🌡️ Pressão</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>1013 hPa</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>👁️ Visibilidade</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>10 km</div>
              </div>
            </div>

            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', textAlign: 'center' }}>Alterar Cidade</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Digite o nome da cidade..."
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  style={{
                    padding: '12px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontSize: '16px',
                    cursor: 'pointer',
                    minWidth: '48px'
                  }}
                >
                  🔍
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function App() {
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleTemperatureUpdate = (data) => {
    addLog(`Temperatura atualizada: ${data.temperature}°C em ${data.city}`);
  };

  const handleCityChange = (city) => {
    addLog(`Cidade alterada para: ${city}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🌡️ Tempo Plugin BR - Demonstração
          </h1>
          <p className="text-xl text-white/90 mb-6">
            Plugin React para exibir temperatura brasileira em tempo real
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-4">Como usar:</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">📦 Instalação</h3>
                <code className="bg-black/20 text-green-300 p-2 rounded block text-sm">
                  npm install tempo-plugin-br
                </code>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">🚀 Uso Básico</h3>
                <code className="bg-black/20 text-green-300 p-2 rounded block text-sm">
                  {'import TempoWidget from "tempo-plugin-br";'}
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">✨ Exemplos</h2>
            
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-2">Widget Padrão</h3>
                <p className="text-white/80 text-sm mb-3">
                  Widget básico com configurações padrão
                </p>
                <code className="bg-black/20 text-green-300 p-2 rounded block text-sm">
                  {'<TempoWidget />'}
                </code>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-2">Widget Customizado</h3>
                <p className="text-white/80 text-sm mb-3">
                  Widget com cores e tamanho personalizados
                </p>
                <code className="bg-black/20 text-green-300 p-2 rounded block text-sm whitespace-pre">
{`<TempoWidget
  backgroundColor="#ff6b6b"
  size={70}
  initialCity="Rio de Janeiro"
/>`}
                </code>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-2">Com Callbacks</h3>
                <p className="text-white/80 text-sm mb-3">
                  Widget com funções de callback para eventos
                </p>
                <code className="bg-black/20 text-green-300 p-2 rounded block text-sm whitespace-pre">
{`<TempoWidget
  onTemperatureUpdate={handleUpdate}
  onCityChange={handleCityChange}
/>`}
                </code>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-4">📊 Logs de Eventos</h2>
            <div className="bg-black/20 rounded-lg p-4 h-64 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-white/60 text-sm">
                  Interaja com o widget para ver os logs aqui...
                </p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="text-green-300 text-sm mb-1 font-mono">
                    {log}
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => setLogs([])}
              className="mt-4 bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Limpar Logs
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">🎯 Características</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-2">🎨</div>
              <h3 className="text-lg font-medium text-white mb-1">Customizável</h3>
              <p className="text-white/80 text-sm">Cores, tamanho e posição personalizáveis</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📱</div>
              <h3 className="text-lg font-medium text-white mb-1">Responsivo</h3>
              <p className="text-white/80 text-sm">Funciona em desktop e mobile</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🖱️</div>
              <h3 className="text-lg font-medium text-white mb-1">Arrastável</h3>
              <p className="text-white/80 text-sm">Interface intuitiva para reposicionar</p>
            </div>
          </div>
        </div>
      </div>

      {/* Widgets de demonstração */}
      <TempoWidget 
        onTemperatureUpdate={handleTemperatureUpdate}
        onCityChange={handleCityChange}
      />
      
      <TempoWidget 
        initialX={typeof window !== 'undefined' ? window.innerWidth - 80 : 300}
        initialY={20}
        backgroundColor="#e74c3c"
        size={70}
        onTemperatureUpdate={handleTemperatureUpdate}
        onCityChange={handleCityChange}
      />
      
      <TempoWidget 
        initialX={20}
        initialY={typeof window !== 'undefined' ? window.innerHeight - 80 : 400}
        backgroundColor="#2c3e50"
        size={50}
        onTemperatureUpdate={handleTemperatureUpdate}
        onCityChange={handleCityChange}
      />
    </div>
  );
}

export default App;
