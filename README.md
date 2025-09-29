# Tempo Plugin BR

[![Sponsor](https://img.shields.io/badge/Sponsor-%E2%9D%A4-red)](https://github.com/sponsors/Ranilson-Nascimento)

Um plugin React moderno para exibir a temperatura brasileira em tempo real com componente flutuante e arrastável.

## Demonstração

Veja o plugin em ação: **[Demo Interativa](https://ranilson-nascimento.github.io/tempo-plugin-br/)**

Experimente: Arraste o widget, clique para ver detalhes e teste todas as funcionalidades!

## Características

- Plug-and-Play: Funciona imediatamente após a instalação
- API Brasileira: Usa APIs gratuitas e confiáveis para dados meteorológicos
- Totalmente Customizável: Cores, tamanho e posição personalizáveis
- Responsivo: Funciona perfeitamente em desktop e mobile
- Arrastável: Interface intuitiva para reposicionar o widget
- Leve e Rápido: Bundle otimizado e performance excelente
- Atualização Automática: Dados atualizados automaticamente
- Múltiplas Cidades: Suporte para qualquer cidade brasileira

## Instalação

```bash
npm install tempo-plugin-br
```

ou

```bash
yarn add tempo-plugin-br
```

## Uso Básico

### Importação Simples

```jsx
import React from 'react';
import { TempoWidget } from 'tempo-plugin-br';

function App() {
  return (
    <div>
      <h1>Minha Aplicação</h1>
      <TempoWidget />
    </div>
  );
}

export default App;
```

### Uso com Customização

```jsx
import React from 'react';
import { TempoWidget } from 'tempo-plugin-br';

function App() {
  const handleTemperatureUpdate = (data) => {
    console.log('Nova temperatura:', data.temperature);
  };

  const handleCityChange = (city) => {
    console.log('Cidade alterada para:', city);
  };

  return (
    <div>
      <TempoWidget
        initialX={100}
        initialY={50}
        initialCity="São Paulo"
        backgroundColor="#ff6b6b"
        textColor="#ffffff"
        size={70}
        updateInterval={5}
        onTemperatureUpdate={handleTemperatureUpdate}
        onCityChange={handleCityChange}
      />
    </div>
  );
}

export default App;
```

## Propriedades (Props)

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `initialX` | `number` | `20` | Posição inicial X do widget |
| `initialY` | `number` | `20` | Posição inicial Y do widget |
| `initialCity` | `string` | `undefined` | Cidade inicial (detecta automaticamente se não especificada) |
| `backgroundColor` | `string` | `#007bff` | Cor de fundo do widget |
| `textColor` | `string` | `#ffffff` | Cor do texto |
| `size` | `number` | `60` | Tamanho do widget em pixels |
| `updateInterval` | `number` | `10` | Intervalo de atualização em minutos |
| `onTemperatureUpdate` | `function` | `undefined` | Callback chamado quando a temperatura é atualizada |
| `onCityChange` | `function` | `undefined` | Callback chamado quando a cidade é alterada |

## Exemplos de Customização

### Widget Pequeno e Discreto

```jsx
<TempoWidget
  size={40}
  backgroundColor="rgba(0, 0, 0, 0.7)"
  initialX={window.innerWidth - 60}
  initialY={20}
/>
```

### Widget Grande e Colorido

```jsx
<TempoWidget
  size={80}
  backgroundColor="#e74c3c"
  textColor="#ffffff"
  initialX={20}
  initialY={20}
/>
```

### Widget com Tema Escuro

```jsx
<TempoWidget
  backgroundColor="#2c3e50"
  textColor="#ecf0f1"
  size={65}
/>
```

## Funcionalidades

### Widget Flutuante
- O widget aparece como uma bolinha flutuante na tela
- Exibe a temperatura atual e um ícone do clima
- Pode ser arrastado para qualquer posição na tela
- Mantém a posição mesmo após atualizações

### Modal Informativo
- Clique no widget para abrir um modal com informações detalhadas
- Mostra temperatura, sensação térmica, umidade, vento, pressão, visibilidade, UV, nuvens e chuva
- Previsão de 3 dias com temperaturas máxima e mínima
- Interface para alterar a cidade
- Design moderno com gradientes e efeitos visuais

### Detecção Automática de Localização
- Detecta automaticamente a localização do usuário
- Fallback para São Paulo caso a geolocalização falhe
- Suporte para qualquer cidade brasileira

## API de Dados

O plugin utiliza a API gratuita **Open-Meteo** que oferece:
- Dados meteorológicos precisos e atualizados
- Sem necessidade de chave de API
- Sem limites de requisições para uso não comercial
- Suporte completo ao Brasil
- Dados em português

## Compatibilidade

- React 16.8+
- TypeScript
- Todos os navegadores modernos
- Mobile e Desktop
- SSR (Server-Side Rendering)

## Desenvolvimento

### Clonando o Repositório

```bash
git clone https://github.com/Ranilson-Nascimento/tempo-plugin-br.git
cd tempo-plugin-br
npm install
```

### Scripts Disponíveis

```bash
# Desenvolvimento do pacote
npm run dev

# Build para produção
npm run build

# Executar testes
npm test

# Publicar no NPM
npm publish
```

### Executando o Exemplo Local

```bash
# Instalar dependências do exemplo
cd exemplo-tempo-plugin
npm install --legacy-peer-deps

# Executar servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173` para ver a demonstração interativa.

## Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Agradecimentos

- [Open-Meteo](https://open-meteo.com/) pela API gratuita de dados meteorológicos
- Comunidade React brasileira pelo feedback e suporte

## Suporte

Se você encontrar algum problema ou tiver sugestões:

- Reporte bugs
- Sugira melhorias
- Entre em contato: ranilson.nascimento93@gmail.com

---

Feito com ❤️ por [Ranilson Nascimento](https://github.com/Ranilson-Nascimento)

