# tempo-plugin-br

[![npm version](https://img.shields.io/npm/v/tempo-plugin-br.svg?color=blue)](https://www.npmjs.com/package/tempo-plugin-br)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-16.8%2B%20%7C%2018%20%7C%2019-61dafb.svg)](https://reactjs.org/)

Componente React moderno de previsão do tempo para aplicações web brasileiras. Oferece widget flutuante arrastável, modal com métricas climáticas completas (temperatura, sensação térmica, umidade, vento, índice UV e previsão para os próximos dias) e hook headless `useTempo` para integração customizada.

Não requer cadastro de chave de API ou configuração de backend. Utiliza a infraestrutura aberta do Open-Meteo com geolocalização e geocodificação reversa para municípios brasileiros.

Demonstração online: [ranilson-nascimento.github.io/tempo-plugin-br](https://ranilson-nascimento.github.io/tempo-plugin-br/)

---

## Funcionalidades

- **Zero Configuração:** Conexão direta com a API aberta Open-Meteo, sem necessidade de tokens ou cadastro.
- **Foco no Brasil:** Identificação precisa de cidades brasileiras com sigla de estado (ex: "Curitiba - PR", "São Paulo - SP").
- **Design Glassmorphism:** Interface translúcida com suporte aos temas Padrão (Glass), Claro (Clean) e Escuro (OLED).
- **Arrastável:** Suporte completo a interações com mouse e touch em dispositivos móveis, com opção de persistência da posição via `localStorage`.
- **Cache Local (SWR):** Exibição imediata dos dados salvos localmente enquanto revalida em segundo plano, eliminando tempo de carregamento perceptível.
- **Hook Headless (`useTempo`):** Acesso direto aos dados de clima e geolocalização para implementação de interfaces personalizadas (navbars, dashboards, etc.).
- **Responsivo:** Adapta-se automaticamente a telas menores, exibindo o modal como uma gaveta inferior deslizante (*bottom sheet*).

---

## Instalação

```bash
npm install tempo-plugin-br
```

Caso utilize Yarn ou pnpm:

```bash
yarn add tempo-plugin-br
# ou
pnpm add tempo-plugin-br
```

---

## Como Usar

Basta importar o componente `TempoWidget` e o arquivo de estilos CSS:

```jsx
import React from 'react';
import { TempoWidget } from 'tempo-plugin-br';
import 'tempo-plugin-br/index.css';

export default function App() {
  return (
    <div>
      <h1>Minha Aplicação</h1>
      <TempoWidget />
    </div>
  );
}
```

Ao carregar o componente:
1. O widget solicita permissão de geolocalização do navegador para identificar a cidade atual.
2. Caso o usuário não conceda permissão, o componente utiliza São Paulo como local padrão e permite busca manual por qualquer outro município no modal.
3. Clicar no widget abre o modal com métricas detalhadas (sensação térmica, vento, umidade, UV, nascer/pôr do sol e previsão estendida).

---

## Hook Headless (`useTempo`)

Para criar uma interface própria (como um indicador na barra de navegação ou painel de controle), utilize o hook `useTempo`:

```jsx
import React from 'react';
import { useTempo } from 'tempo-plugin-br';

export function BarraDeClima() {
  const { weather, loading, error, setCity, refresh } = useTempo({
    initialCity: 'Curitiba',
    enableLocalCache: true
  });

  if (loading) return <span>Carregando dados meteorológicos...</span>;
  if (error) return <span>Erro ao obter previsão do tempo.</span>;
  if (!weather) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span>{weather.city}</span>
      <span>{weather.temperature}°C</span>
      <button onClick={() => setCity('Rio de Janeiro')}>Ver Rio de Janeiro</button>
      <button onClick={refresh}>Atualizar</button>
    </div>
  );
}
```

---

## Exemplos de Customização

### 1. Cores, tamanho e tema visual

```jsx
<TempoWidget
  backgroundColor="#0f766e"
  textColor="#ffffff"
  size={72}
  theme="dark"
  forecastDays={5}
/>
```

### 2. Persistir a posição arrastada

Para manter o widget na mesma posição escolhida pelo usuário entre recarregamentos de página:

```jsx
<TempoWidget positionStorageKey="minha-app-widget-posicao" />
```

### 3. Utilização com Next.js (App Router)

Por utilizar APIs do navegador (`localStorage`, geolocalização e eventos de ponteiro), adicione a diretiva `'use client'` no topo do arquivo do componente que renderiza o widget:

```jsx
'use client';

import { TempoWidget } from 'tempo-plugin-br';
import 'tempo-plugin-br/index.css';

export default function HomePage() {
  return (
    <main>
      <TempoWidget />
    </main>
  );
}
```

---

## Propriedades do `TempoWidget`

| Propriedade | Tipo | Padrão | Descrição |
| :--- | :--- | :--- | :--- |
| `initialX` | `number` | `24` | Posição horizontal inicial em pixels em relação à borda esquerda. |
| `initialY` | `number` | `24` | Posição vertical inicial em pixels em relação à borda superior. |
| `initialCity` | `string` | `undefined` | Cidade inicial fixa. Se não definida, utiliza a geolocalização do dispositivo. |
| `backgroundColor` | `string` | `"#0284c7"` | Cor de fundo ou gradiente do widget flutuante. |
| `textColor` | `string` | `"#ffffff"` | Cor do texto e ícones do widget. |
| `size` | `number` | `68` | Diâmetro do widget em pixels (largura e altura). |
| `updateInterval` | `number` | `10` | Intervalo de atualização automática dos dados em minutos. |
| `forecastDays` | `3 \| 5 \| 7` | `3` | Quantidade de dias exibidos na previsão estendida do modal. |
| `positionStorageKey` | `string` | `undefined` | Chave para persistir a posição arrastada no `localStorage`. |
| `theme` | `'default' \| 'light' \| 'dark'` | `'default'` | Tema do modal: vidro translúcido (`default`), claro (`light`) ou escuro (`dark`). |
| `showTooltip` | `boolean` | `true` | Exibe a pílula de prévia climática ao passar o cursor sobre o widget. |
| `className` | `string` | `""` | Classe CSS customizada para o contêiner do componente. |
| `onTemperatureUpdate` | `(data: WeatherData) => void` | — | Callback executado após a obtenção de novos dados climáticos. |
| `onCityChange` | `(city: string) => void` | — | Callback executado quando o usuário altera a localidade. |
| `onError` | `(err: Error, type: string) => void` | — | Callback executado em caso de erro de localização, busca ou rede. |

---

## Informações Exibidas no Modal

O modal meteorológico reúne:
- **Resumo Atual:** Temperatura em destaque, sensação térmica, data atual em português e variação térmica do dia (mínima e máxima).
- **Métricas Detalhadas:**
  - Umidade relativa do ar com indicador de nível;
  - Velocidade e direção do vento (pontos cardeais e colaterais: N, NE, L, SE, S, SO, O, NO);
  - Índice UV com classificação de risco e barra proporcional;
  - Probabilidade de precipitação do dia;
  - Horários de nascer e pôr do sol;
  - Pressão atmosférica e visibilidade.
- **Previsão Estendida:** Dias da semana com amplitude térmica visual (barras de espectro mínimo e máximo).
- **Atalhos Rápidos:** Seleção rápida para capitais brasileiras e campo de busca para qualquer cidade.
- **Botão GPS:** Retorno à localização atual com um clique.
- **Alertas Meteorológicos:** Notificação em destaque no topo em situações de instabilidade severa ou tempestades.

---

## Desenvolvimento Local

Para clonar e executar o ambiente de desenvolvimento local:

```bash
# Clone o repositório
git clone https://github.com/Ranilson-Nascimento/tempo-plugin-br.git
cd tempo-plugin-br

# Instale dependências e compile o pacote
npm install
npm run build

# Inicie a aplicação de exemplo
cd exemplo-tempo-plugin
npm install --legacy-peer-deps
npm run dev
```

Acesse `http://localhost:5173` no navegador.

---

## Licença

Distribuído sob a licença [MIT](LICENSE).

Desenvolvido por [Ranilson Nascimento](https://github.com/Ranilson-Nascimento).
