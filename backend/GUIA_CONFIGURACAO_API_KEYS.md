# 🔑 Guia de Configuração das API Keys

## 📋 Passo a Passo para Configurar o `.env`

### 1️⃣ Criar o Arquivo .env

Execute no terminal:
```bash
cd backend
./configure-env.sh
```

Ou copie manualmente:
```bash
cp .env.example .env
```

---

### 2️⃣ Obter as API Keys

#### 🔵 Apollo.io API Key

1. Acesse: https://app.apollo.io/#/settings/integrations/api
2. Faça login na sua conta Apollo
3. Navegue até: **Settings → Integrations → API**
4. Clique em **"Generate API Key"** ou copie a existente
5. Cole no `.env`:
   ```env
   APOLLO_API_KEY=sua_chave_aqui
   ```

**Formato:** Geralmente é uma string alfanumérica longa

---

#### 🟢 Unipile API Key

1. Acesse: https://app.unipile.com/settings/api
2. Faça login na sua conta Unipile
3. Vá em **Settings → API**
4. Gere ou copie sua API Key
5. Cole no `.env`:
   ```env
   UNIPILE_API_KEY=sua_chave_aqui
   ```

**Formato:** Geralmente é um Bearer token

---

#### 🤖 OpenAI API Key

1. Acesse: https://platform.openai.com/api-keys
2. Faça login na sua conta OpenAI
3. Clique em **"Create new secret key"**
4. Dê um nome (ex: "B2B Lead Generator")
5. **IMPORTANTE:** Copie a chave imediatamente! Ela só aparece uma vez.
6. Cole no `.env`:
   ```env
   OPENAI_API_KEY=sk-sua_chave_aqui
   ```

**Formato:** Sempre começa com `sk-`

⚠️ **Nota sobre custos:** GPT-4 é caro. Considere usar GPT-3.5-turbo para testes:
- No código, pode trocar `gpt-4` por `gpt-3.5-turbo`
- Muito mais barato e suficiente para a maioria dos casos

---

#### 📊 Google Tag Manager ID (Opcional)

1. Acesse: https://tagmanager.google.com
2. Selecione seu container ou crie um novo
3. O ID está no formato: **GTM-XXXXXXX**
4. Cole no `.env`:
   ```env
   GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX
   ```

---

### 3️⃣ Configurar Banco de Dados

#### Opção A: PostgreSQL Local

1. Instale PostgreSQL (se não tiver):
   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql

   # Criar banco
   createdb b2b_leads
   ```

2. Configure no `.env`:
   ```env
   DATABASE_URL=postgresql://seu_usuario:sua_senha@localhost:5432/b2b_leads
   ```

#### Opção B: PostgreSQL Cloud (Recomendado para produção)

**Supabase (Grátis até certo limite):**
1. Acesse: https://supabase.com
2. Crie um projeto
3. Vá em **Settings → Database**
4. Copie a "Connection string"
5. Cole no `.env`

**Railway (Fácil deploy):**
1. Acesse: https://railway.app
2. Crie um projeto
3. Adicione PostgreSQL
4. Copie a connection string
5. Cole no `.env`

---

### 4️⃣ Gerar Secrets de Segurança

Se não usou o script automático, gere secrets seguros:

```bash
# No terminal
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('API_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

Cole os valores no `.env`.

---

### 5️⃣ Exemplo de Arquivo .env Completo

```env
# Servidor
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:senha@localhost:5432/b2b_leads

# API Keys
APOLLO_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
UNIPILE_API_KEY=Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=sk-proj-abcdefghijklmnopqrstuvwxyz1234567890
GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX

# Segurança
JWT_SECRET=1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
API_SECRET=abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

---

### 6️⃣ Validar Configuração

Após configurar, teste se está funcionando:

```bash
cd backend
npm run dev
```

Verifique os logs. Se tudo estiver OK, você verá:
```
✅ Servidor rodando na porta 3001
```

Se houver erros de API key, verifique:
- ✅ Não há espaços antes/depois das chaves
- ✅ As chaves estão corretas
- ✅ As URLs estão corretas
- ✅ O arquivo `.env` está na pasta `backend/`

---

## 🧪 Testar Conexões

### Testar Apollo:
```bash
curl -X POST http://localhost:3001/api/apollo/search \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -H "Content-Type: application/json" \
  -d '{"jobTitle": ["CEO"]}'
```

### Testar OpenAI:
```bash
curl -X POST http://localhost:3001/api/openai/analyze/lead-123 \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

---

## ⚠️ Segurança

1. **NUNCA** commite o arquivo `.env` no Git
2. ✅ Já está no `.gitignore` (verificado automaticamente)
3. **NUNCA** compartilhe suas API keys
4. **NUNCA** exponha as keys no frontend
5. Use variáveis de ambiente em produção (Railway, Heroku, etc.)

---

## 🔧 Troubleshooting

### Erro: "API Key não configurada"
- Verifique se a variável está no `.env`
- Reinicie o servidor: `npm run dev`
- Verifique se não há espaços na chave

### Erro: "401 Unauthorized"
- API key inválida ou expirada
- Gere uma nova chave na plataforma
- Verifique se copiou a chave completa

### Erro: "429 Rate Limit"
- Você excedeu o limite de requisições
- Aguarde alguns minutos
- Verifique seu plano na plataforma

### Erro: "Connection refused" (Database)
- PostgreSQL não está rodando
- Verifique a connection string
- Teste: `psql DATABASE_URL`

---

## ✅ Checklist Final

- [ ] Arquivo `.env` criado
- [ ] `APOLLO_API_KEY` configurada
- [ ] `UNIPILE_API_KEY` configurada
- [ ] `OPENAI_API_KEY` configurada
- [ ] `GOOGLE_TAG_MANAGER_ID` configurada (opcional)
- [ ] `DATABASE_URL` configurada
- [ ] `JWT_SECRET` gerado
- [ ] `API_SECRET` gerado
- [ ] Servidor iniciado sem erros
- [ ] Teste de conexão com APIs realizado

---

## 🎉 Pronto!

Agora você está pronto para usar o sistema com conexões reais!

**Próximos passos:**
1. Execute `npm run dev` no backend
2. Execute `npm run dev` no frontend
3. Acesse http://localhost:5173
4. Faça login e comece a usar!

