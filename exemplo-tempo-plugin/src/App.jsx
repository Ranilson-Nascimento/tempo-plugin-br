import React, { useState, useEffect } from 'react';
import { TempoWidget } from '../../dist/index.esm.js';
import '../../dist/index.esm.css';
import './App.css';

function App() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [locationStatus, setLocationStatus] = useState('Detectando localização...');

  const handleTemperatureUpdate = (data) => {
    console.log('Nova temperatura:', data);
    setWeatherData(data);
  };

  const handleCityChange = (city) => {
    console.log('Cidade alterada para:', city);
  };

  useEffect(() => {
    // Tentar obter localização
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationStatus(`Localização detectada: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        (error) => {
          console.log('Erro ao obter localização:', error);
          setLocationStatus('Localização não permitida - usando São Paulo como padrão');
        },
        { timeout: 10000 }
      );
    } else {
      setLocationStatus('Geolocalização não suportada - usando São Paulo');
    }
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4'>
      <div className='text-center max-w-6xl mx-auto'>
        <h1 className='text-5xl font-bold text-white mb-4 drop-shadow-lg'>
          🌡️ Tempo Plugin BR
        </h1>
        <p className='text-xl text-white mb-2 drop-shadow'>
          Demonstração Interativa do Plugin React
        </p>
        <p className='text-white mb-8 opacity-90 max-w-2xl mx-auto'>
          Veja como o widget funciona em tempo real! Arraste-o pela tela, clique para ver detalhes completos do clima.
        </p>

        {/* Status da localização */}
        <div className='bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6 max-w-md mx-auto'>
          <h3 className='text-lg font-semibold text-white mb-2'>📍 Status da Localização</h3>
          <p className='text-white text-sm'>{locationStatus}</p>
          {weatherData && (
            <div className='mt-2 text-white text-sm'>
              <p><strong>Cidade:</strong> {weatherData.city}</p>
              <p><strong>Temperatura:</strong> {weatherData.temperature}°C</p>
              <p><strong>Condição:</strong> {weatherData.description}</p>
            </div>
          )}
        </div>

        <div className='grid md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white/10 backdrop-blur-sm rounded-lg p-6'>
            <h3 className='text-xl font-semibold text-white mb-3'>🎯 Plug-and-Play</h3>
            <p className='text-white text-sm opacity-90'>Funciona imediatamente após a instalação. Basta importar e usar!</p>
          </div>

          <div className='bg-white/10 backdrop-blur-sm rounded-lg p-6'>
            <h3 className='text-xl font-semibold text-white mb-3'>🌍 API Brasileira</h3>
            <p className='text-white text-sm opacity-90'>Dados meteorológicos precisos do Brasil via Open-Meteo</p>
          </div>

          <div className='bg-white/10 backdrop-blur-sm rounded-lg p-6'>
            <h3 className='text-xl font-semibold text-white mb-3'>🎨 Totalmente Customizável</h3>
            <p className='text-white text-sm opacity-90'>Cores, tamanho, posição e comportamento personalizáveis</p>
          </div>
        </div>

        <div className='bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8'>
          <h2 className='text-2xl font-semibold text-white mb-4'>🖱️ Como Testar</h2>
          <div className='grid md:grid-cols-2 gap-4 text-left'>
            <div className='text-white'>
              <h4 className='font-semibold mb-2'>1. Arrastar o Widget</h4>
              <p className='text-sm opacity-90'>Clique e arraste a bolinha vermelha para qualquer posição na tela</p>
            </div>
            <div className='text-white'>
              <h4 className='font-semibold mb-2'>2. Ver Detalhes</h4>
              <p className='text-sm opacity-90'>Clique no widget para abrir um modal com informações completas</p>
            </div>
            <div className='text-white'>
              <h4 className='font-semibold mb-2'>3. Trocar Cidade</h4>
              <p className='text-sm opacity-90'>No modal, digite o nome de qualquer cidade brasileira</p>
            </div>
            <div className='text-white'>
              <h4 className='font-semibold mb-2'>4. Atualização Automática</h4>
              <p className='text-sm opacity-90'>Os dados se atualizam automaticamente a cada 5 minutos</p>
            </div>
          </div>
        </div>

        {/* Widget real do pacote */}
        <TempoWidget
          initialX={100}
          initialY={100}
          backgroundColor='#ff6b6b'
          textColor='#ffffff'
          size={80}
          updateInterval={5}
          onTemperatureUpdate={handleTemperatureUpdate}
          onCityChange={handleCityChange}
        />

        <div className='mt-8 text-white text-sm opacity-75 bg-black/20 rounded-lg p-4'>
          <p className='mb-2'>💡 <strong>O que você vê no widget:</strong></p>
          <ul className='text-left max-w-md mx-auto space-y-1'>
            <li>• <strong>Ícone do clima</strong> (☀️, 🌧️, etc.)</li>
            <li>• <strong>Temperatura atual</strong> em graus Celsius</li>
            <li>• <strong>Nome da cidade</strong> (abreviado se necessário)</li>
            <li>• <strong>Clique</strong> para ver detalhes completos em um modal flutuante</li>
            <li>• <strong>Arraste</strong> para reposicionar em qualquer lugar da tela</li>
          </ul>
          <p className='mt-3 text-xs opacity-75'>Permita a localização no navegador para detectar sua cidade automaticamente!</p>
        </div>

        <div className='mt-6 text-white text-xs opacity-50'>
          <p>Feito com ❤️ usando React, TypeScript e dados da Open-Meteo API</p>
        </div>
      </div>
    </div>
  );
}

export default App;