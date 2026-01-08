# 🚀 Passo a Passo - GitHub e Deploy

## ✅ Passo 1: Commit Local - FEITO!

O código já foi commitado localmente! ✅

---

## 📝 Passo 2: Criar Repositório no GitHub (2 minutos)

### Acesse:
👉 **https://github.com/new**

### Configure:
1. **Repository name:** `b2b-lead-generator`
2. **Description:** `Software para geração de oportunidades de negócio B2B com IA`
3. **Visibility:** 
   - ✅ **Public** (visível para todos)
   - 🔒 **Private** (somente você vê)
4. ⚠️ **IMPORTANTE:** NÃO marque:
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license

### Clique em:
✅ **"Create repository"**

---

## 🔗 Passo 3: Copiar URL do Repositório

Depois de criar, GitHub mostrará algo como:

```
https://github.com/SEU_USUARIO/b2b-lead-generator.git
```

**Anote essa URL!** Você vai precisar dela.

---

## 📤 Passo 4: Enviar Código para GitHub

### Execute no terminal:

```bash
cd /Users/henriquemarques/b2b-lead-generator

# Adicionar remote (SUBSTITUA SEU_USUARIO pela sua conta do GitHub):
git remote add origin https://github.com/SEU_USUARIO/b2b-lead-generator.git

# Verificar:
git remote -v

# Enviar para GitHub:
git branch -M main
git push -u origin main
```

**Você será solicitado a fazer login no GitHub!**

---

## ✅ Passo 5: Verificar no GitHub

1. Acesse: `https://github.com/SEU_USUARIO/b2b-lead-generator`
2. Você deve ver todos os arquivos do projeto
3. ✅ **Código está no GitHub!**

---

## 🚀 Passo 6: Deploy Backend (Railway)

### 1. Acesse Railway:
👉 **https://railway.app**

### 2. Criar Conta:
- Clique em **"Login with GitHub"**
- Autorize o acesso
- Railway criará sua conta automaticamente

### 3. Criar Projeto:
1. Clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Escolha seu repositório: `b2b-lead-generator`
4. Railway detectará automaticamente o backend

### 4. Adicionar PostgreSQL:
1. No projeto criado, clique em **"New"**
2. Selecione **"Database"** → **"Add PostgreSQL"**
3. Railway criará automaticamente o banco

### 5. Configurar Variáveis de Ambiente:

No Railway, vá em **"Variables"** e adicione:

```env
NODE_ENV=production
PORT=3001

# Database (Railway cria automaticamente)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Security (gere secrets seguros)
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
API_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# API Keys (adicione suas chaves)
APOLLO_API_KEY=sua_chave_aqui
UNIPILE_API_KEY=sua_chave_aqui
OPENAI_API_KEY=sua_chave_aqui
GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX

# CORS (atualizar depois com URL do Vercel)
ALLOWED_ORIGINS=https://seu-app.vercel.app
```

**Para gerar secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 6. Configurar Build:

Railway detecta automaticamente, mas você pode verificar:
- **Root Directory:** `backend`
- **Build Command:** `npm install && npx prisma generate`
- **Start Command:** `npx prisma migrate deploy && npm start`

### 7. Aguardar Deploy:
- Railway fará deploy automaticamente
- Aguarde 2-3 minutos
- Você verá uma URL tipo: `https://seu-backend-production.up.railway.app`

### 8. Obter URL do Backend:
- Copie a URL fornecida pelo Railway
- Algo como: `https://seu-backend.railway.app`
- **Anote essa URL!**

---

## ▲ Passo 7: Deploy Frontend (Vercel)

### 1. Acesse Vercel:
👉 **https://vercel.com**

### 2. Criar Conta:
- Clique em **"Sign Up"**
- Selecione **"Continue with GitHub"**
- Autorize o acesso

### 3. Importar Projeto:
1. Clique em **"Add New"** → **"Project"**
2. Selecione **"Import Git Repository"**
3. Escolha seu repositório: `b2b-lead-generator`
4. Clique em **"Import"**

### 4. Configurar Build:

**Framework Preset:** Vite  
**Root Directory:** (deixe vazio - raiz)  
**Build Command:** `npm run build`  
**Output Directory:** `dist`  
**Install Command:** `npm install`

### 5. Variáveis de Ambiente:

Adicione no Vercel:

```env
VITE_API_BASE_URL=https://seu-backend.railway.app/api
```

**⚠️ IMPORTANTE:** Substitua `seu-backend.railway.app` pela URL real do seu backend no Railway!

### 6. Deploy:
- Clique em **"Deploy"**
- Aguarde 2-3 minutos
- Vercel fornecerá uma URL tipo: `https://seu-app.vercel.app`

### 7. Obter URL do Frontend:
- Copie a URL fornecida pelo Vercel
- **Anote essa URL!**

---

## 🔗 Passo 8: Conectar Tudo

### 1. Atualizar CORS no Railway:

Volte no Railway e atualize a variável:

```env
ALLOWED_ORIGINS=https://seu-app.vercel.app
```

**⚠️ IMPORTANTE:** Substitua pela URL real do seu frontend no Vercel!

### 2. Atualizar Frontend (se necessário):

Se o frontend não conectou, atualize no Vercel:

```env
VITE_API_BASE_URL=https://seu-backend.railway.app/api
```

### 3. Redeploy:

Railway fará redeploy automaticamente quando você atualizar as variáveis.

---

## ✅ Passo 9: Testar

### 1. Acesse seu Frontend:
👉 `https://seu-app.vercel.app`

### 2. Acesse API Docs:
👉 `https://seu-backend.railway.app/api-docs`

### 3. Teste:
- Crie uma conta
- Faça login
- Tudo deve funcionar! ✅

---

## 🎉 Pronto!

Agora seu software está:
- ✅ No GitHub
- ✅ Online e funcionando
- ✅ Com deploy automático

Toda vez que você fizer `git push`:
- ✅ Railway atualiza o backend automaticamente
- ✅ Vercel atualiza o frontend automaticamente

---

## 📚 URLs Finais:

**Frontend:** https://seu-app.vercel.app  
**Backend:** https://seu-backend.railway.app  
**API Docs:** https://seu-backend.railway.app/api-docs  
**GitHub:** https://github.com/SEU_USUARIO/b2b-lead-generator

---

## 🆘 Precisa de Ajuda?

Se tiver algum problema em qualquer passo, me avise! 🚀

