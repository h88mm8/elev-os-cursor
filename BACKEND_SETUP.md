# Guia Rápido - Backend Setup

## Instalação Rápida

```bash
cd backend
npm install
cp .env.example .env
```

## Configuração

Edite o arquivo `.env` e adicione suas API keys:

```env
APOLLO_API_KEY=sua_chave_aqui
UNIPILE_API_KEY=sua_chave_aqui
OPENAI_API_KEY=sua_chave_aqui
GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX
```

## Executar

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

O servidor estará rodando em `http://localhost:3001`

## Endpoints Disponíveis

### Health Check
```
GET /health
```

### Apollo
```
POST /api/apollo/search
POST /api/apollo/enrich/:leadId
```

### Unipile
```
POST /api/unipile/email
POST /api/unipile/whatsapp
POST /api/unipile/linkedin/connect
POST /api/unipile/linkedin/like
POST /api/unipile/linkedin/comment
GET /api/unipile/calendar/:leadId
```

### OpenAI
```
POST /api/openai/analyze/:leadId
POST /api/openai/daily-activities
POST /api/openai/generate-message
```

### Tracking
```
GET /api/tracking/:companyDomain
POST /api/tracking/event
GET /api/tracking/:companyDomain/stats
```

### LinkedIn
```
POST /api/linkedin/scrape-posts/:leadId
```

### Leads (CRUD)
```
GET /api/leads
GET /api/leads/:leadId
POST /api/leads
PUT /api/leads/:leadId
DELETE /api/leads/:leadId
```

## Testando a API

### Exemplo: Buscar Leads
```bash
curl -X POST http://localhost:3001/api/apollo/search \
  -H "Content-Type: application/json" \
  -d '{
    "jobTitle": ["CEO"],
    "industry": ["Technology"],
    "location": ["São Paulo"]
  }'
```

### Exemplo: Gerar Atividades Diárias
```bash
curl -X POST http://localhost:3001/api/openai/daily-activities \
  -H "Content-Type: application/json" \
  -d '{
    "leadIds": ["lead-1", "lead-2"]
  }'
```

## Estrutura de Dados

Os dados são armazenados em `backend/data/` como arquivos JSON:
- `data/leads/` - Leads salvos
- `data/tracking/` - Eventos de tracking

Para produção, recomenda-se migrar para um banco de dados (PostgreSQL, MongoDB, etc).

## Troubleshooting

### Erro: "API key não configurada"
- Verifique se o arquivo `.env` existe e contém as chaves corretas

### Erro: "Porta já em uso"
- Altere a porta no arquivo `.env`: `PORT=3002`

### Erro ao fazer scraping do LinkedIn
- O scraping pode violar termos de serviço
- Use APIs oficiais ou serviços como Unipile quando possível

