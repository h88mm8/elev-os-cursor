# 🔌 Conexões Reais com APIs - Guia de Configuração

## ✅ Status das Integrações

Todas as conexões com APIs externas foram implementadas com:
- ✅ Autenticação real
- ✅ Retry logic
- ✅ Tratamento de erros específicos
- ✅ Logging detalhado
- ✅ Validação de API keys
- ✅ Timeouts configurados

---

## 🔑 APOLLO API

### Configuração
1. Obtenha sua API Key em: https://app.apollo.io/#/settings/integrations/api
2. Adicione no `.env`:
```env
APOLLO_API_KEY=sua_chave_aqui
```

### Endpoints Implementados

#### 1. Buscar Leads
```typescript
POST /api/apollo/search
{
  "jobTitle": ["CEO", "CTO"],
  "industry": ["Technology"],
  "companySize": ["51-200"],
  "location": ["São Paulo"],
  "keywords": ["software", "saas"]
}
```

**Funcionamento:**
- ✅ Conecta na API real da Apollo
- ✅ Usa endpoint `/mixed_people/search`
- ✅ Mapeia filtros para formato da Apollo
- ✅ Retorna leads reais encontrados
- ✅ Trata erros de autenticação e rate limiting

#### 2. Enriquecer Lead
```typescript
POST /api/apollo/enrich/:leadId
```

**Funcionamento:**
- ✅ Busca dados completos do lead
- ✅ Enriquece com informações adicionais
- ✅ Retorna lead atualizado

### Erros Tratados
- 401: API Key inválida
- 429: Rate limit excedido
- 404: Lead não encontrado
- Timeout: Retry automático

---

## 💬 UNIPILE API

### Configuração
1. Obtenha sua API Key em: https://app.unipile.com/settings/api
2. Adicione no `.env`:
```env
UNIPILE_API_KEY=sua_chave_aqui
```

### Endpoints Implementados

#### 1. Enviar Email
```typescript
POST /api/unipile/email
{
  "leadId": "lead-123",
  "subject": "Assunto",
  "message": "Corpo da mensagem"
}
```

**Funcionamento:**
- ✅ Busca email do lead no banco
- ✅ Envia email via Unipile API
- ✅ Retorna message ID
- ✅ Salva comunicação no histórico

#### 2. Enviar WhatsApp
```typescript
POST /api/unipile/whatsapp
{
  "leadId": "lead-123",
  "message": "Mensagem"
}
```

**Funcionamento:**
- ✅ Busca telefone do lead
- ✅ Envia WhatsApp via Unipile
- ✅ Retorna confirmação

#### 3. LinkedIn - Conectar
```typescript
POST /api/unipile/linkedin/connect
{
  "leadId": "lead-123",
  "message": "Mensagem opcional"
}
```

#### 4. LinkedIn - Curtir Post
```typescript
POST /api/unipile/linkedin/like
{
  "leadId": "lead-123",
  "postId": "post-123"
}
```

#### 5. LinkedIn - Comentar Post
```typescript
POST /api/unipile/linkedin/comment
{
  "leadId": "lead-123",
  "postId": "post-123",
  "comment": "Comentário"
}
```

#### 6. Gerar Link de Calendário
```typescript
GET /api/unipile/calendar/:leadId
```

**Funcionamento:**
- ✅ Gera link único para o lead
- ✅ Fallback se API falhar
- ✅ Retorna link e data de expiração

### Erros Tratados
- 401: API Key inválida
- 403: Sem permissão (LinkedIn)
- 429: Rate limit
- Timeout: Retry automático

---

## 🤖 OPENAI API

### Configuração
1. Obtenha sua API Key em: https://platform.openai.com/api-keys
2. Adicione no `.env`:
```env
OPENAI_API_KEY=sk-sua_chave_aqui
```

### Funcionalidades Implementadas

#### 1. Análise Estratégica de Lead
```typescript
POST /api/openai/analyze/:leadId
```

**Funcionamento:**
- ✅ Analisa lead completo (perfil + empresa)
- ✅ Gera resumo executivo
- ✅ Identifica pain points
- ✅ Sugere oportunidades
- ✅ Recomenda abordagem

**Modelo:** GPT-4
**Formato:** JSON estruturado

#### 2. Gerar Atividades Diárias
```typescript
POST /api/openai/daily-activities
{
  "leadIds": ["lead-1", "lead-2"]
}
```

**Funcionamento:**
- ✅ Processa leads em lotes (5 por vez)
- ✅ Gera atividade personalizada para cada lead
- ✅ Escolhe canal ideal
- ✅ Cria mensagem personalizada
- ✅ Define ações do LinkedIn quando aplicável

#### 3. Gerar Mensagem
```typescript
POST /api/openai/generate-message
{
  "leadId": "lead-123",
  "channel": "email",
  "context": "Contexto adicional"
}
```

**Funcionamento:**
- ✅ Gera mensagem personalizada
- ✅ Adaptada ao canal (email, WhatsApp, LinkedIn)
- ✅ Máximo 300 tokens
- ✅ Temperatura 0.8 para criatividade

### Erros Tratados
- 401: API Key inválida
- 429: Rate limit excedido
- Modelo não disponível
- Timeout: Retry automático

---

## 📊 TRACKING (Google Tag Manager)

### Configuração
1. Obtenha seu GTM ID em: https://tagmanager.google.com
2. Adicione no `.env`:
```env
GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX
```

### Funcionamento
- ✅ Script GTM injetado automaticamente
- ✅ Tracking de page views
- ✅ Tracking de cliques em CTAs
- ✅ Tracking de scroll
- ✅ Eventos customizados

---

## 🧪 TESTAR AS CONEXÕES

### 1. Testar Apollo
```bash
curl -X POST http://localhost:3001/api/apollo/search \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jobTitle": ["CEO"],
    "location": ["São Paulo"]
  }'
```

### 2. Testar Unipile
```bash
curl -X POST http://localhost:3001/api/unipile/email \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "leadId": "lead-123",
    "subject": "Teste",
    "message": "Mensagem de teste"
  }'
```

### 3. Testar OpenAI
```bash
curl -X POST http://localhost:3001/api/openai/analyze/lead-123 \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## ⚠️ IMPORTANTE

### Antes de Usar em Produção:

1. **Configure todas as API Keys no `.env`**
2. **Teste cada integração individualmente**
3. **Verifique rate limits de cada API**
4. **Configure webhooks se necessário**
5. **Monitore logs para erros**

### Rate Limits Conhecidos:

- **Apollo:** Varia por plano (verificar documentação)
- **Unipile:** Varia por plano (verificar documentação)
- **OpenAI:** 
  - GPT-4: ~500 req/min (varia)
  - Verificar seu plano em https://platform.openai.com/account/usage

### Custos:

- **Apollo:** Baseado em créditos
- **Unipile:** Baseado em ações/mensagens
- **OpenAI:** Baseado em tokens usados (GPT-4 é caro)

---

## 🔧 TROUBLESHOOTING

### Erro: "API Key não configurada"
- Verifique se a variável está no `.env`
- Reinicie o servidor após adicionar
- Verifique se não há espaços na chave

### Erro: "Rate limit excedido"
- Aguarde alguns minutos
- Verifique seu plano na API
- Implemente rate limiting no código

### Erro: "Timeout"
- Aumente timeout no código
- Verifique sua conexão
- Algumas APIs podem estar lentas

---

## ✅ CONCLUSÃO

**Todas as conexões reais estão implementadas!**

Agora o sistema:
- ✅ Busca leads reais da Apollo
- ✅ Envia emails/WhatsApp via Unipile
- ✅ Usa LinkedIn via Unipile
- ✅ Analisa leads com OpenAI
- ✅ Gera mensagens com IA

**Basta configurar as API keys e começar a usar!** 🚀

