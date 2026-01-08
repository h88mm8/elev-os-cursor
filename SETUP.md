# Guia de Configuração - B2B Lead Generator

## Pré-requisitos

- Node.js 18+ e npm
- Contas ativas nas seguintes plataformas:
  - Apollo (para busca de leads)
  - Unipile (para comunicação)
  - OpenAI (para análise por IA)
  - Google Tag Manager (para tracking)

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Compile o código do Electron:
```bash
npm run build:electron
```

## Configuração das APIs

### 1. Apollo API
- Acesse https://www.apollo.io/ e obtenha sua API key
- Configure no app em: Configurações > API Keys > Apollo API Key

### 2. Unipile API
- Acesse https://unipile.com/ e obtenha sua API key
- Configure no app em: Configurações > API Keys > Unipile API Key

### 3. OpenAI API
- Acesse https://platform.openai.com/ e obtenha sua API key
- Configure no app em: Configurações > API Keys > OpenAI API Key

### 4. Google Tag Manager
- Configure seu GTM ID em: Configurações > API Keys > Google Tag Manager ID
- Instale o snippet do GTM no site/landing page dos seus clientes

## Backend/API Server

Este aplicativo requer um servidor backend para intermediar as chamadas de API. Você precisará criar um servidor que:

1. Gerencia as chaves de API de forma segura
2. Faz as chamadas para Apollo, Unipile, OpenAI
3. Implementa scraping do LinkedIn (quando necessário)
4. Gerencia dados de tracking do Google Tag Manager

**Exemplo de estrutura do backend:**
```
backend/
├── routes/
│   ├── apollo.js      # Rotas da Apollo API
│   ├── unipile.js     # Rotas da Unipile API
│   ├── openai.js      # Rotas da OpenAI
│   ├── tracking.js    # Rotas de tracking
│   └── linkedin.js    # Scraping do LinkedIn
├── services/
│   ├── apolloService.js
│   ├── unipileService.js
│   ├── openAIService.js
│   └── trackingService.js
└── server.js
```

Configure a URL do backend no arquivo `.env`:
```
VITE_API_BASE_URL=http://localhost:3001/api
```

## Executando o Projeto

### Desenvolvimento
```bash
npm run dev
```

Isso iniciará:
- Servidor Vite na porta 5173 (frontend)
- Aplicativo Electron (desktop)

### Build para Produção
```bash
npm run build
```

Os arquivos compilados estarão em `release/`

## Estrutura do Projeto

```
b2b-lead-generator/
├── electron/              # Código Electron (desktop)
│   ├── main.ts           # Processo principal
│   └── preload.ts        # Script de pré-carregamento
├── src/
│   ├── components/       # Componentes React
│   ├── pages/            # Páginas principais
│   │   ├── SolarSystemView.tsx    # Vista do sistema solar
│   │   ├── FeedView.tsx           # Feed de atividades
│   │   ├── SearchView.tsx         # Busca de leads
│   │   ├── LeadDetailView.tsx     # Detalhes do lead
│   │   └── SettingsView.tsx       # Configurações
│   ├── services/         # Serviços de API
│   ├── store/            # Gerenciamento de estado (Zustand)
│   └── types/            # Tipos TypeScript
├── package.json
└── README.md
```

## Funcionalidades Implementadas

✅ Estrutura base do projeto
✅ Sistema de busca de leads com filtros
✅ Visualização estilo sistema solar (3D)
✅ Feed de atividades diárias
✅ Interface de detalhes do lead
✅ Tela de configurações
✅ Integração com APIs (estrutura pronta)

## Próximos Passos

1. Implementar o servidor backend
2. Conectar as APIs reais (Apollo, Unipile, OpenAI)
3. Implementar scraping do LinkedIn
4. Configurar tracking do Google Tag Manager
5. Adicionar persistência de dados (banco de dados)
6. Implementar autenticação
7. Adicionar testes

## Suporte

Para problemas ou dúvidas, consulte a documentação das APIs:
- [Apollo API Docs](https://apolloio.github.io/apollo-api-docs/)
- [Unipile Docs](https://docs.unipile.com/)
- [OpenAI API Docs](https://platform.openai.com/docs)

