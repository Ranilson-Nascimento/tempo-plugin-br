# Tempo Plugin BR

[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4-red)](https://github.com/sponsors/Ranilson-Nascimento)

Widget de clima em tempo real para React, focado no Brasil. Uma bolinha flutuante que você pode arrastar pela tela; ao clicar, abre um modal com temperatura, sensação térmica, previsão e busca por cidade. A localização é detectada automaticamente ou você define uma cidade inicial.

**Demo:** [ranilson-nascimento.github.io/tempo-plugin-br](https://ranilson-nascimento.github.io/tempo-plugin-br/) — vale testar no celular (arraste com o dedo).

---

## Instalação

```bash
npm install tempo-plugin-br
```

ou com yarn:

```bash
yarn add tempo-plugin-br
```

---

## Uso rápido

Importe o componente e o CSS (obrigatório para o widget e o modal ficarem bonitos):

```jsx
import { TempoWidget } from 'tempo-plugin-br';
import 'tempo-plugin-br/dist/index.esm.css';  // não esqueça do CSS

function App() {
  return (
    <div>
      <h1>Meu app</h1>
      <TempoWidget />
    </div>
  );
}
```

Pronto. O widget usa a localização do navegador (se o usuário permitir) e mostra a temperatura; a cidade aparece no formato **Cidade - UF** (ex.: São Paulo - SP).

---

## Customizando

Você pode mudar posição inicial, cores, tamanho, intervalo de atualização e até o tema do modal (padrão, claro ou escuro). Exemplo:

```jsx
<TempoWidget
  initialX={100}
  initialY={80}
  initialCity="Rio de Janeiro"
  backgroundColor="#0f766e"
  textColor="#ffffff"
  size={70}
  updateInterval={5}
  theme="dark"
  forecastDays={5}
  onTemperatureUpdate={(data) => console.log(data.temperature)}
  onCityChange={(city) => console.log('Cidade:', city)}
/>
```

### Salvar a posição da bolinha

Se você passar uma chave em `positionStorageKey`, a posição do widget é salva no `localStorage`. Assim, quando o usuário voltar à página, a bolinha continua onde ele deixou.

```jsx
<TempoWidget positionStorageKey="meu-app-clima-pos" />
```

### Tratar erros

Em caso de falha (localização negada, rede, cidade não encontrada), você pode usar o callback `onError`:

```jsx
<TempoWidget
  onError={(err, type) => {
    // type: 'location' | 'weather' | 'city'
    console.warn(type, err.message);
  }}
/>
```

No próprio modal existe o botão "Tentar novamente" quando algo dá errado.

---

## Todas as props

| Prop | Tipo | Padrão | O que faz |
|------|------|--------|-----------|
| `initialX` | number | 20 | Posição inicial (eixo X) da bolinha em pixels |
| `initialY` | number | 20 | Posição inicial (eixo Y) da bolinha em pixels |
| `initialCity` | string | — | Cidade inicial. Se não informar, tenta usar a localização do navegador |
| `backgroundColor` | string | #007bff | Cor de fundo da bolinha |
| `textColor` | string | #ffffff | Cor do texto da bolinha |
| `size` | number | 60 | Tamanho da bolinha em pixels |
| `updateInterval` | number | 10 | De quantos em quantos minutos os dados são atualizados |
| `forecastDays` | 3, 5 ou 7 | 3 | Quantos dias de previsão aparecem no modal |
| `positionStorageKey` | string | — | Se informado, salva a posição no localStorage com essa chave |
| `theme` | 'default' \| 'light' \| 'dark' | 'default' | Visual do modal (gradiente, claro ou escuro) |
| `onTemperatureUpdate` | função | — | Chamada quando os dados de clima são atualizados (recebe o objeto com temperatura, cidade, etc.) |
| `onCityChange` | função | — | Chamada quando o usuário troca de cidade no modal |
| `onError` | função | — | Chamada em erro (recebe o erro e o tipo: 'location', 'weather' ou 'city') |

---

## O que o widget faz

- **Bolinha:** mostra ícone do tempo, temperatura e nome da cidade (Cidade - UF). Você pode arrastar com o mouse ou com o dedo no celular.
- **Clique (ou toque):** abre o modal com temperatura, sensação térmica, umidade, vento, pressão, UV, previsão dos próximos dias e um campo para buscar outra cidade.
- **Localização:** se não houver `initialCity`, o plugin pede permissão de localização; se o usuário negar ou der falha, os dados usam São Paulo como fallback.
- **Dados:** clima via [Open-Meteo](https://open-meteo.com/) (sem chave de API); nome da cidade a partir das coordenadas via [BigDataCloud](https://www.bigdatacloud.com/) (reverse geocoding, uso no navegador sem chave).

---

## Requisitos

- React 16.8 ou superior
- Navegadores modernos (com suporte a geolocalização e fetch)

O projeto é em TypeScript e exporta os tipos. Em ambiente com SSR (Next, etc.), o widget só é montado no cliente para evitar erro com `window`/`navigator`.

---

## Rodar o exemplo na sua máquina

Na raiz do repositório:

```bash
npm install
npm run build
cd exemplo-tempo-plugin
npm install --legacy-peer-deps
npm run dev
```

Abra `http://localhost:5173` no navegador.

---

## Desenvolvimento do pacote

```bash
npm install
npm run dev    # build em modo watch
npm run build  # gera dist/
npm test       # testes (Jest)
```

---

## Contribuir

Abre uma issue para bug ou ideia, ou manda um pull request. Fork → branch → commit → push → PR.

---

## Licença

MIT. Ver [LICENSE](LICENSE).

Agradecimentos ao [Open-Meteo](https://open-meteo.com/) e ao [BigDataCloud](https://www.bigdatacloud.com/) pelos dados e APIs gratuitas.

---

Feito com ❤️ por [Ranilson Nascimento](https://github.com/Ranilson-Nascimento) · contato: ranilson.nascimento93@gmail.com
