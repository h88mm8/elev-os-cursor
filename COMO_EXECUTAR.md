# 🚀 Como Executar e Ver a Plataforma

## 📋 Pré-requisitos

1. ✅ Node.js instalado (v18 ou superior)
2. ✅ PostgreSQL instalado e rodando (ou usar cloud)
3. ✅ API Keys configuradas no `.env` (opcional para começar)

---

## 🎯 Opção 1: Executar Manualmente (Recomendado)

### Passo 1: Iniciar o Backend

```bash
# Navegar para a pasta do backend
cd backend

# Instalar dependências (se ainda não instalou)
npm install

# Iniciar o servidor
npm run dev
```

Você verá:
```
✅ Servidor rodando na porta 3001
✅ Banco de dados conectado
```

**Backend estará em:** http://localhost:3001

---

### Passo 2: Iniciar o Frontend (em outro terminal)

```bash
# Abrir um NOVO terminal (manter o backend rodando)

# Navegar para a raiz do projeto
cd /Users/henriquemarques/b2b-lead-generator

# Instalar dependências (se ainda não instalou)
npm install

# Iniciar o frontend
npm run dev
```

Você verá:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Frontend estará em:** http://localhost:5173

---

### Passo 3: Acessar a Plataforma

1. Abra seu navegador
2. Acesse: **http://localhost:5173**
3. Você verá a tela de login/registro

---

## 🎯 Opção 2: Executar Tudo de Uma Vez (Script)

### Usando o script do package.json (raiz):

```bash
# Na raiz do projeto
npm run dev
```

Isso iniciará backend e frontend simultaneamente.

---

## 📱 Onde Ver a Plataforma

### 🌐 URL Local:
```
http://localhost:5173
```

### 🔧 Portas:
- **Frontend (React + Electron):** Porta 5173
- **Backend (API):** Porta 3001
- **API Docs (Swagger):** http://localhost:3001/api-docs

---

## 🖥️ Como Funciona

### 1. Desktop App (Electron)
Se você executar:
```bash
npm run build:electron
npm run start:electron
```

A aplicação abrirá como um aplicativo desktop nativo.

### 2. Web App (Navegador)
Se você executar:
```bash
npm run dev
```

A aplicação abrirá no navegador em: http://localhost:5173

---

## 📸 Telas da Plataforma

### Tela de Login/Registro
- Primeira tela ao acessar
- URL: http://localhost:5173/login

### Tela Principal - Sistema Solar
- Visualização 3D dos leads orbitando
- URL: http://localhost:5173/

### Feed de Atividades
- Feed estilo Instagram com atividades diárias
- URL: http://localhost:5173/feed

### Busca de Leads
- Busca avançada com filtros
- URL: http://localhost:5173/search

### Detalhes do Lead
- Informações completas do lead
- URL: http://localhost:5173/lead/:id

### Configurações
- Configurar API keys e empresa
- URL: http://localhost:5173/settings

---

## 🐛 Problemas Comuns

### Erro: "Port already in use"

**Solução:**
```bash
# Verificar o que está usando a porta
lsof -i :5173  # Para frontend
lsof -i :3001  # Para backend

# Matar o processo
kill -9 <PID>
```

### Erro: "Cannot find module"

**Solução:**
```bash
# Reinstalar dependências
cd backend && npm install
cd .. && npm install
```

### Erro: "Database connection failed"

**Solução:**
1. Verifique se PostgreSQL está rodando:
   ```bash
   # macOS
   brew services list | grep postgresql
   ```

2. Configure `DATABASE_URL` no `.env`

3. Execute as migrations:
   ```bash
   cd backend
   npx prisma migrate dev
   ```

### Frontend não conecta com Backend

**Solução:**
1. Verifique se backend está rodando na porta 3001
2. Verifique CORS no backend
3. Verifique `ALLOWED_ORIGINS` no `.env`

---

## ✅ Checklist Antes de Executar

- [ ] Node.js instalado (`node --version`)
- [ ] Dependências instaladas (`npm install` em ambos)
- [ ] PostgreSQL rodando (ou DATABASE_URL configurada)
- [ ] Arquivo `.env` configurado (backend/.env)
- [ ] Portas 3001 e 5173 livres

---

## 🎬 Comandos Rápidos

### Iniciar Tudo:
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
npm run dev
```

### Acessar:
- **Plataforma:** http://localhost:5173
- **API:** http://localhost:3001
- **Docs:** http://localhost:3001/api-docs

---

## 📚 Documentação Adicional

- `SETUP.md` - Setup completo do projeto
- `BACKEND_SETUP.md` - Setup específico do backend
- `CONFIGURACAO_RAPIDA.md` - Configuração das API keys

---

## 🎉 Pronto!

Depois de executar os comandos acima, abra:

**👉 http://localhost:5173**

E você verá a plataforma funcionando! 🚀

