# 🚀 Guia de Deploy - B2B Lead Generator

## 📋 Opções de Deploy

### 1. **Railway** (Recomendado - Fácil e Grátis)
✅ Melhor para: Backend + PostgreSQL  
✅ Grátis até certo limite  
✅ Deploy automático do GitHub

### 2. **Vercel** (Melhor para Frontend)
✅ Melhor para: Frontend React  
✅ Grátis e rápido  
✅ Deploy automático

### 3. **Render** (Alternativa)
✅ Backend + Frontend  
✅ Grátis com limitações  
✅ Deploy simples

### 4. **Heroku** (Tradicional)
✅ Confiável  
⚠️ Pago (não tem mais tier grátis)

---

## 🎯 Opção Recomendada: Railway + Vercel

### Frontend (Vercel) + Backend (Railway)

**Vantagens:**
- ✅ Grátis para começar
- ✅ Deploy automático do GitHub
- ✅ PostgreSQL incluído no Railway
- ✅ CDN global no Vercel
- ✅ HTTPS automático

---

## 📝 Passo a Passo

### Passo 1: Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Crie um repositório (ex: `b2b-lead-generator`)
3. **NÃO** inicialize com README (já temos)
4. Copie a URL do repositório

### Passo 2: Enviar Código para GitHub

```bash
cd /Users/henriquemarques/b2b-lead-generator

# Adicionar tudo
git add .

# Primeiro commit
git commit -m "Initial commit: B2B Lead Generator"

# Adicionar remote (substitua pela URL do seu repositório)
git remote add origin https://github.com/SEU_USUARIO/b2b-lead-generator.git

# Enviar para GitHub
git branch -M main
git push -u origin main
```

---

## 🚂 Deploy no Railway (Backend)

### 1. Criar Conta no Railway

1. Acesse: https://railway.app
2. Clique em "Login with GitHub"
3. Autorize o acesso

### 2. Criar Novo Projeto

1. Clique em "New Project"
2. Selecione "Deploy from GitHub repo"
3. Escolha seu repositório
4. Railway detectará automaticamente o backend

### 3. Configurar Variáveis de Ambiente

No Railway, vá em **Variables** e adicione:

```env
NODE_ENV=production
PORT=3001

# Database (Railway cria automaticamente)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# API Keys
APOLLO_API_KEY=sua_chave_aqui
UNIPILE_API_KEY=sua_chave_aqui
OPENAI_API_KEY=sua_chave_aqui
GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX

# Security
JWT_SECRET=gerar_um_secret_seguro
API_SECRET=gerar_um_secret_seguro

# CORS (URL do Vercel depois)
ALLOWED_ORIGINS=https://seu-app.vercel.app
```

### 4. Configurar Build

Railway detectará automaticamente, mas você pode criar `railway.json`:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && npm install && npx prisma generate && npx prisma migrate deploy && npm start"
  }
}
```

### 5. Adicionar PostgreSQL

1. No projeto Railway, clique em **"New"**
2. Selecione **"Database"** → **"Add PostgreSQL"**
3. Railway criará automaticamente a `DATABASE_URL`

### 6. Obter URL do Backend

Após o deploy, Railway fornecerá uma URL tipo:
`https://seu-backend-production.up.railway.app`

---

## ▲ Deploy no Vercel (Frontend)

### 1. Criar Conta no Vercel

1. Acesse: https://vercel.com
2. Clique em "Sign Up"
3. Use "Continue with GitHub"

### 2. Importar Projeto

1. Clique em "Add New" → "Project"
2. Importe do GitHub
3. Selecione seu repositório

### 3. Configurar Build

**Framework Preset:** Vite  
**Root Directory:** (deixe vazio - raiz)  
**Build Command:** `npm run build`  
**Output Directory:** `dist`

### 4. Variáveis de Ambiente

Adicione no Vercel:

```env
VITE_API_BASE_URL=https://seu-backend-production.up.railway.app/api
```

### 5. Deploy

Clique em **"Deploy"** e aguarde (2-3 minutos)

---

## 🔗 Atualizar URLs

### 1. Atualizar CORS no Railway

Depois que o Vercel gerar a URL do frontend, atualize no Railway:

```env
ALLOWED_ORIGINS=https://seu-app.vercel.app
```

### 2. Atualizar Frontend

Se necessário, atualize `vite.config.ts` ou `.env.production`:

```env
VITE_API_BASE_URL=https://seu-backend.railway.app/api
```

---

## 🗄️ Configurar Banco de Dados

### No Railway:

1. Vá no banco PostgreSQL criado
2. Copie a `DATABASE_URL`
3. Cole nas variáveis de ambiente do backend
4. Rode migrations:

```bash
# No terminal do Railway ou localmente
npx prisma migrate deploy
```

---

## 🔄 Deploy Automático

Ambos Railway e Vercel fazem deploy automático quando você:

1. Faz `git push` para o GitHub
2. Eles detectam mudanças automaticamente
3. Fazem rebuild e redeploy

---

## 📱 URLs Finais

Após o deploy:

- **Frontend:** `https://seu-app.vercel.app`
- **Backend:** `https://seu-backend.railway.app`
- **API Docs:** `https://seu-backend.railway.app/api-docs`

---

## 🔧 Troubleshooting

### Backend não conecta com Frontend

- Verifique `ALLOWED_ORIGINS` no Railway
- Verifique `VITE_API_BASE_URL` no Vercel
- Verifique CORS no código

### Banco de dados não funciona

- Verifique `DATABASE_URL` no Railway
- Rode migrations: `npx prisma migrate deploy`
- Verifique se PostgreSQL está ativo no Railway

### Build falha

- Verifique logs no Railway/Vercel
- Verifique se todas as dependências estão no `package.json`
- Verifique Node.js version

---

## ✅ Checklist Final

- [ ] Código no GitHub
- [ ] Railway configurado (Backend)
- [ ] Vercel configurado (Frontend)
- [ ] PostgreSQL criado no Railway
- [ ] Variáveis de ambiente configuradas
- [ ] Migrations rodadas
- [ ] URLs testadas
- [ ] CORS configurado
- [ ] Deploy automático funcionando

---

## 🎉 Pronto!

Seu software estará online e sincronizado com GitHub! 🚀

