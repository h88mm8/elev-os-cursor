# ⚡ Quick Start - GitHub e Deploy

## 🎯 Objetivo Rápido

1. Colocar código no GitHub
2. Deploy online (Railway + Vercel)

---

## 📦 Passo 1: GitHub (5 minutos)

```bash
cd /Users/henriquemarques/b2b-lead-generator

# 1. Criar repositório em: https://github.com/new
#    (NÃO marque README, .gitignore ou license)

# 2. Configurar Git (se necessário)
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

# 3. Adicionar arquivos
git add .

# 4. Primeiro commit
git commit -m "Initial commit: B2B Lead Generator"

# 5. Adicionar remote (SUBSTITUA pela URL do seu repositório)
git remote add origin https://github.com/SEU_USUARIO/b2b-lead-generator.git

# 6. Enviar para GitHub
git branch -M main
git push -u origin main
```

✅ **Pronto!** Código no GitHub: https://github.com/SEU_USUARIO/b2b-lead-generator

---

## 🚀 Passo 2: Deploy Backend (Railway) - 10 minutos

1. **Criar conta:** https://railway.app → "Login with GitHub"

2. **Criar projeto:**
   - "New Project" → "Deploy from GitHub repo"
   - Escolha seu repositório
   - Railway detecta backend automaticamente

3. **Adicionar PostgreSQL:**
   - "New" → "Database" → "Add PostgreSQL"

4. **Configurar variáveis:**
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=gerar_secret_aqui
   APOLLO_API_KEY=sua_chave
   UNIPILE_API_KEY=sua_chave
   OPENAI_API_KEY=sua_chave
   ```

5. **Deploy:** Railway faz automaticamente!

6. **Obter URL:** Railway fornece algo como:
   `https://seu-backend.railway.app`

---

## ▲ Passo 3: Deploy Frontend (Vercel) - 5 minutos

1. **Criar conta:** https://vercel.com → "Continue with GitHub"

2. **Importar projeto:**
   - "Add New" → "Project"
   - Import do GitHub
   - Escolha seu repositório

3. **Configurar:**
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Variáveis de ambiente:**
   ```
   VITE_API_BASE_URL=https://seu-backend.railway.app/api
   ```

5. **Deploy:** Vercel faz automaticamente!

6. **Obter URL:** Vercel fornece algo como:
   `https://seu-app.vercel.app`

---

## 🔗 Passo 4: Conectar Tudo

### Atualizar CORS no Railway:

Volte no Railway e atualize:

```
ALLOWED_ORIGINS=https://seu-app.vercel.app
```

Railway fará redeploy automaticamente.

---

## ✅ Pronto!

**Frontend:** https://seu-app.vercel.app  
**Backend:** https://seu-backend.railway.app  
**API Docs:** https://seu-backend.railway.app/api-docs

---

## 🔄 Deploy Automático

Toda vez que você fizer `git push`:

1. ✅ Railway detecta e faz deploy do backend
2. ✅ Vercel detecta e faz deploy do frontend
3. ✅ Tudo atualizado automaticamente!

---

## 📚 Documentação Completa

- **Setup GitHub:** Veja `SETUP_GITHUB.md`
- **Deploy Detalhado:** Veja `DEPLOY.md`

---

**Tempo total:** ~20 minutos  
**Custo:** Grátis (até certo limite)  
**Resultado:** Software online! 🎉

