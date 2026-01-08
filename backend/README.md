# Backend - B2B Lead Generator

API backend para o aplicativo B2B Lead Generator, responsável por intermediar as chamadas para as APIs externas (Apollo, Unipile, OpenAI) e gerenciar dados.

## Tecnologias

- **Node.js** + **Express**
- **TypeScript**
- **Axios** - Cliente HTTP
- **OpenAI SDK** - Integração com GPT
- **Puppeteer** - Scraping do LinkedIn
- **Cheerio** - Parsing HTML
- **Winston** - Logging (opcional)

## Instalação

```bash
cd backend
npm install
```

## Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Configure suas API keys no arquivo `.env`:
```env
APOLLO_API_KEY=sua_chave_apollo
UNIPILE_API_KEY=sua_chave_unipile
OPENAI_API_KEY=sua_chave_openai
GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX
```

## Executando

### Desenvolvimento
```bash
npm run dev
```

O servidor iniciará na porta `3001` (configurável no `.env`).

### Produção
```bash
npm run build
npm start
```

## Estrutura do Projeto

```
backend/
├── src/
│   ├── config/          # Configurações (API keys, etc)
│   ├── middleware/      # Middleware do Express
│   ├── models/          # Modelos de dados
│   ├── routes/          # Rotas da API
│   ├── services/        # Serviços de integração
│   ├── utils/           # Utilitários
│   └── server.ts        # Arquivo principal
├── data/                # Armazenamento local (JSON)
└── package.json
```

## Endpoints da API

### Apollo
- `POST /api/apollo/search` - Buscar leads
- `POST /api/apollo/enrich/:leadId` - Enriquecer dados do lead

### Unipile
- `POST /api/unipile/email` - Enviar email
- `POST /api/unipile/whatsapp` - Enviar WhatsApp
- `POST /api/unipile/linkedin/connect` - Conectar no LinkedIn
- `POST /api/unipile/linkedin/like` - Curtir post no LinkedIn
- `POST /api/unipile/linkedin/comment` - Comentar post no LinkedIn
- `GET /api/unipile/calendar/:leadId` - Obter link de calendário

### OpenAI
- `POST /api/openai/analyze/:leadId` - Análise estratégica do lead
- `POST /api/openai/daily-activities` - Gerar atividades diárias
- `POST /api/openai/generate-message` - Gerar mensagem personalizada

### Tracking
- `GET /api/tracking/:companyDomain` - Obter dados de tracking
- `POST /api/tracking/event` - Registrar evento de tracking
- `GET /api/tracking/:companyDomain/stats` - Estatísticas de tracking

### LinkedIn
- `POST /api/linkedin/scrape-posts/:leadId` - Fazer scraping de posts

## Armazenamento de Dados

Por padrão, o backend usa armazenamento local em arquivos JSON (pasta `data/`). Para produção, recomenda-se:

- **PostgreSQL** ou **MongoDB** para dados estruturados
- **Redis** para cache
- **S3** ou similar para arquivos

## Segurança

- Rate limiting implementado (100 req/15min por IP)
- Helmet.js para headers de segurança
- CORS configurável
- Validação de entrada nas rotas

## Logging

Os logs são exibidos no console. Para produção, configure Winston para salvar em arquivos ou serviço de log.

## Próximos Passos

1. Implementar autenticação JWT
2. Adicionar banco de dados (PostgreSQL/MongoDB)
3. Implementar cache com Redis
4. Adicionar testes automatizados
5. Configurar CI/CD
6. Adicionar documentação Swagger/OpenAPI

## Notas

- O scraping do LinkedIn pode violar os termos de serviço. Use APIs oficiais quando possível.
- As integrações com Apollo, Unipile e OpenAI requerem contas ativas e API keys válidas.
- O backend é stateless - considere usar sessões ou JWT para autenticação de usuários.

