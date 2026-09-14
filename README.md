# 🌤️ Tempo Plugin BR

[![npm version](https://img.shields.io/npm/v/tempo-plugin-br.svg?color=blue)](https://www.npmjs.com/package/tempo-plugin-br)
[![license](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-16.8%2B%20%7C%2018%20%7C%2019-61dafb.svg)](https://reactjs.org/)
[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4-red)](https://github.com/sponsors/Ranilson-Nascimento)

E aí, dev! 👋 

O **Tempo Plugin BR** é um widget de clima leve e moderno feito especialmente para aplicações React no Brasil. Sabe aquela bolinha flutuante de temperatura que você pode arrastar para qualquer canto da tela (tanto no mouse quanto no celular com o dedo) e que abre uma previsão linda ao clicar? É exatamente isso!

Sem precisar cadastrar cartão, sem chave de API e sem dor de cabeça de configurar backend.

👉 **Veja funcionando ao vivo:** [ranilson-nascimento.github.io/tempo-plugin-br](https://ranilson-nascimento.github.io/tempo-plugin-br/) *(dica: teste abrir no celular e arrastar com o dedo!)*

---

## ✨ Por que usar?

- 🆓 **Zero configuração de API:** Usa dados abertos da Open-Meteo. Não precisa criar conta nem colocar token.
- 🇧🇷 **Pensado para o Brasil:** Mostra nomes reais de municípios e siglas de estado certinhas (ex: *São Paulo - SP*, *Rio de Janeiro - RJ*, *Curitiba - PR*).
- 🪟 **Design Glassmorphism Moderno:** Efeito de vidro fosco translúcido (*frosted glass*), micro-animações, pílula de prévia no hover e visual estilo Apple Weather.
- ⚡ **Cache Instantâneo (SWR):** Ao recarregar a página, a temperatura aparece na hora (0ms de espera), sem aquele spinner chato piscando na tela.
- 👆 **Totalmente Arrastável:** Funciona suave com mouse no desktop e com touch no mobile. Dá até para salvar a posição no `localStorage`.
- 🪝 **Opção de Hook Headless (`useTempo`):** Não quer a bolinha flutuante pronta? Sem problemas! Você pode usar só o hook e montar seu próprio visual na sua navbar.

---

## 📦 Instalação

No terminal do seu projeto:

```bash
npm install tempo-plugin-br
```

ou se você usa Yarn / pnpm:

```bash
yarn add tempo-plugin-br
# ou
pnpm add tempo-plugin-br
```

---

## 🚀 Como usar em 30 segundos

Basta importar o componente e o arquivo de estilos (CSS):

```jsx
import React from 'react';
import { TempoWidget } from 'tempo-plugin-br';
import 'tempo-plugin-br/index.css'; // Não esqueça do CSS!

export default function App() {
  return (
    <div>
      <h1>Meu Aplicativo</h1>
      
      {/* Bolinha de clima flutuante e arrastável */}
      <TempoWidget />
    </div>
  );
}
```

Pronto! Ao carregar a página:
1. O widget pede permissão para pegar a localização atual do usuário.
2. Identifica a cidade e busca o clima do dia com previsão estendida.
3. Se o usuário não autorizar o GPS, ele não trava o app: abre por padrão em São Paulo e o usuário pode pesquisar qualquer outra cidade pelo modal.

---

## 🪝 Quer só os dados? Use o Hook Headless (`useTempo`)

Se você já tem seu próprio design, navbar ou dashboard e só quer os dados mastigados e reativos, use o hook `useTempo`:

```jsx
import React from 'react';
import { useTempo } from 'tempo-plugin-br';

export function MinhaBarraDeClima() {
  const { weather, loading, error, setCity, refresh } = useTempo({
    initialCity: 'Curitiba',
    enableLocalCache: true // Carrega na hora do cache local
  });

  if (loading) return <span>Consultando satélite... 🛰️</span>;
  if (error) return <span>Não foi possível carregar o clima.</span>;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span>📍 {weather.city}</span>
      <span>{weather.icon} {weather.temperature}°C</span>
      <button onClick={() => setCity('Rio de Janeiro')}>Ver Rio</button>
      <button onClick={refresh} title="Atualizar agora">🔄</button>
    </div>
  );
}
```

---

## 🛠️ Exemplos Práticos de Customização

### 1. Mudando cores, tamanho e tema
Você pode combinar a bolinha com as cores da sua marca e escolher o tema do modal (`default`, `light` ou `dark`):

```jsx
<TempoWidget
  backgroundColor="#0f766e" // Cor de fundo da bolinha
  textColor="#ffffff"        // Cor do texto
  size={72}                  // Diâmetro em pixels
  theme="dark"               // Modal com tema escuro OLED
  forecastDays={5}           // 3, 5 ou 7 dias de previsão
/>
```

### 2. Lembrar onde o usuário deixou a bolinha
Quer que a bolinha continue no mesmo lugar da tela quando o usuário voltar amanhã? Basta passar a prop `positionStorageKey`:

```jsx
<TempoWidget positionStorageKey="posicao-widget-meu-app" />
```

### 3. Usando no Next.js (App Router)
Como o widget depende de recursos do navegador (geolocalização e arraste interativo), adicione `'use client'` no topo do componente que o renderiza:

```jsx
'use client';

import { TempoWidget } from 'tempo-plugin-br';
import 'tempo-plugin-br/index.css';

export default function PaginaInicial() {
  return (
    <main>
      <TempoWidget />
    </main>
  );
}
```

---

## 📋 Todas as Props do `TempoWidget`

Tudo no widget tem valores padrão sensatos, então nenhuma prop é obrigatória:

| Prop | Tipo | Padrão | Para que serve? |
| :--- | :--- | :--- | :--- |
| `initialX` | `number` | `24` | Distância inicial da esquerda da tela (em pixels). |
| `initialY` | `number` | `24` | Distância inicial do topo da tela (em pixels). |
| `initialCity` | `string` | `undefined` | Se quiser fixar uma cidade inicial (ex: `"Belo Horizonte"`). Se não passar, tenta o GPS. |
| `backgroundColor` | `string` | `"#0284c7"` | Cor de fundo ou gradiente da bolinha. |
| `textColor` | `string` | `"#ffffff"` | Cor do texto e dos ícones dentro da bolinha. |
| `size` | `number` | `68` | Tamanho (largura e altura) da bolinha em pixels. |
| `updateInterval` | `number` | `10` | Intervalo em minutos para reconsultar os dados automaticamente. |
| `forecastDays` | `3 \| 5 \| 7` | `3` | Quantidade de dias futuros na previsão do modal. |
| `positionStorageKey` | `string` | `undefined` | Chave para salvar a posição arrastada no `localStorage`. |
| `theme` | `'default' \| 'light' \| 'dark'` | `'default'` | Tema visual do modal (vidro padrão, claro clean ou escuro OLED). |
| `showTooltip` | `boolean` | `true` | Mostra a pílula de prévia climática quando o usuário passa o mouse por cima. |
| `className` | `string` | `""` | Classe CSS extra para o container, caso precise de ajustes finos. |
| `onTemperatureUpdate` | `(data) => void` | — | Callback chamado quando novos dados de clima chegam. |
| `onCityChange` | `(city) => void` | — | Chamado quando o usuário escolhe outra cidade no modal. |
| `onError` | `(err, type) => void`| — | Chamado em caso de falha (tipo: `'location'`, `'weather'` ou `'city'`). |

---

## 🌡️ O que o Modal exibe para o usuário?

Ao clicar na bolinha, abre um modal completo com:
- **Card Principal:** Temperatura em destaque, sensação térmica, data formatada em português e variação do dia (`↓ Mín • ↑ Máx`).
- **Cards de Métricas:**
  - 💧 **Umidade:** Porcentagem com barra de nível (avisa se o ar está seco ou ideal).
  - 💨 **Vento:** Velocidade em km/h com **bússola direcional** (ex: `NE ↗`, `S ↓`).
  - ☀️ **Índice UV:** Nível com barra colorida (Baixo, Moderado, Alto, Extremo).
  - 🌧️ **Chuva:** Probabilidade de precipitação do dia.
  - 🌅 **Sol:** Horários exatos do nascer e pôr do sol.
- **Previsão Estendida:** Dias da semana com barrinhas de espectro térmico estilo Apple Weather.
- **Capitais Brasileiras em 1 Clique:** Chips rápidos (*São Paulo, Rio, Curitiba, Salvador, Brasília, etc.*) para trocar de cidade num instante.
- **Busca Aberta:** Campo para digitar qualquer município do Brasil.
- **Botão GPS:** Atalho no cabeçalho para voltar à localização atual do usuário quando quiser.
- **Alertas Meteorológicos:** Avisos automáticos se houver previsão de tempestades severas ou granizo.

---

## ❓ Dúvidas Frequentes (FAQ)

<details>
<summary><b>1. Preciso pagar alguma coisa ou criar conta na Open-Meteo?</b></summary>
<p>Não! A Open-Meteo oferece dados abertos gratuitos para uso sem necessidade de chave de API (API Key) nem cadastro.</p>
</details>

<details>
<summary><b>2. O que acontece se o usuário negar o acesso à localização?</b></summary>
<p>O widget não quebra nem trava seu app. Ele detecta a negação e usa São Paulo como fallback padrão amigável, permitindo que o usuário pesquise sua cidade manualmente pelo modal a qualquer hora.</p>
</details>

<details>
<summary><b>3. Funciona em celulares e tablets?</b></summary>
<p>Sim! O arrasto foi programado tanto para eventos de mouse quanto para eventos de toque (touch). Em telas menores de celular, o modal se transforma automaticamente em uma gaveta inferior deslizante (<i>bottom-sheet</i>) com alça de toque.</p>
</details>

<details>
<summary><b>4. Por que preciso importar o CSS separadamente?</b></summary>
<p>Para manter o bundle de JavaScript o mais enxuto possível e evitar conflitos com bibliotecas como Tailwind ou styled-components. Importando <code>import 'tempo-plugin-br/index.css'</code>, todos os estilos e efeitos glassmorphism ficam encapsulados e isolados com prefixos próprios (<code>.tempo-*</code>).</p>
</details>

---

## 👨‍💻 Rodando o projeto de exemplo localmente

Se quiser clonar o repositório e testar/alterar na sua máquina:

```bash
# 1. Clone o repositório
git clone https://github.com/Ranilson-Nascimento/tempo-plugin-br.git
cd tempo-plugin-br

# 2. Instale as dependências e compile o pacote
npm install
npm run build

# 3. Entre na pasta da aplicação de demonstração
cd exemplo-tempo-plugin
npm install --legacy-peer-deps
npm run dev
```

Depois é só abrir `http://localhost:5173` no seu navegador.

---

## 🤝 Contribuindo

Ideias, melhorias e correções são super bem-vindas!
1. Faça um Fork do projeto.
2. Crie uma branch com sua funcionalidade (`git checkout -b feature/minha-melhoria`).
3. Commit suas alterações (`git commit -m 'feat: adiciona nova funcionalidade'`).
4. Faça o push para a branch (`git push origin feature/minha-melhoria`).
5. Abra um Pull Request.

---

## 📄 Licença

Distribuído sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<p align="center">
  Feito com ❤️ por <b><a href="https://github.com/Ranilson-Nascimento">Ranilson Nascimento</a></b><br>
  Dúvidas ou sugestões? Sinta-se à vontade para abrir uma issue!
</p>
