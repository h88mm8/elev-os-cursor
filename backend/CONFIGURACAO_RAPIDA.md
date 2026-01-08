# ⚡ Configuração Rápida - API Keys

## 🚀 Setup em 5 minutos

### 1. Arquivo .env já está criado! ✅

O arquivo `.env` foi criado automaticamente na pasta `backend/`

### 2. Secrets já foram gerados! ✅

- ✅ `JWT_SECRET` - Gerado automaticamente
- ✅ `API_SECRET` - Gerado automaticamente

### 3. Agora só falta adicionar suas API Keys:

Edite o arquivo `backend/.env` e adicione:

```env
# Apollo.io - Obter em: https://app.apollo.io/#/settings/integrations/api
APOLLO_API_KEY=cole_sua_chave_aqui

# Unipile - Obter em: https://app.unipile.com/settings/api
UNIPILE_API_KEY=cole_sua_chave_aqui

# OpenAI - Obter em: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-cole_sua_chave_aqui

# Google Tag Manager (opcional)
GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX

# Database (configure se não usar localhost)
DATABASE_URL=postgresql://user:password@localhost:5432/b2b_leads
```

### 4. Como editar:

```bash
# Opção 1: Nano (terminal)
cd backend
nano .env

# Opção 2: VS Code
code backend/.env

# Opção 3: Qualquer editor de texto
open backend/.env
```

---

## 📋 Links Rápidos para Obter Keys:

| API | Link | Onde encontrar |
|-----|------|----------------|
| **Apollo** | https://app.apollo.io/#/settings/integrations/api | Settings → Integrations → API |
| **Unipile** | https://app.unipile.com/settings/api | Settings → API |
| **OpenAI** | https://platform.openai.com/api-keys | API Keys → Create new |
| **GTM** | https://tagmanager.google.com | Container ID (GTM-XXXXXXX) |

---

## ✅ Checklist:

- [x] Arquivo `.env` criado
- [x] Secrets de segurança gerados
- [ ] Adicionar `APOLLO_API_KEY`
- [ ] Adicionar `UNIPILE_API_KEY`
- [ ] Adicionar `OPENAI_API_KEY`
- [ ] Configurar `DATABASE_URL` (se necessário)
- [ ] Testar com `npm run dev`

---

## 🧪 Testar depois de configurar:

```bash
cd backend
npm run dev
```

Se tudo estiver OK, você verá:
```
✅ Servidor rodando na porta 3001
```

---

## 📚 Guia Completo:

Para instruções detalhadas, veja: `GUIA_CONFIGURACAO_API_KEYS.md`

---

## ⚠️ Importante:

- **NUNCA** compartilhe o arquivo `.env`
- **NUNCA** commite no Git (já está no .gitignore)
- As API keys são privadas e pessoais

---

Pronto! Agora é só adicionar suas chaves e começar a usar! 🎉

