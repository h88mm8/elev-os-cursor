# ⚡ Início Rápido - 1 Comando

## 🚀 Iniciar Tudo Automaticamente

### Opção 1: Script Node.js (Recomendado - Cross-platform)

```bash
npm start
```

### Opção 2: Script Bash (macOS/Linux)

```bash
./start.sh
```

### Opção 3: Script Windows (.bat)

```bash
start.bat
```

### Opção 4: Script Node.js direto

```bash
node start.js
```

---

## ✨ O que o script faz:

1. ✅ Verifica se Node.js está instalado
2. ✅ Instala dependências se necessário
3. ✅ Verifica configuração do .env
4. ✅ Inicia o Backend (porta 3001)
5. ✅ Inicia o Frontend (porta 5173)
6. ✅ Abre o navegador automaticamente
7. ✅ Mostra URLs e status

---

## 📍 URLs que serão abertas:

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001
- **API Docs:** http://localhost:3001/api-docs

---

## 🛑 Para Parar:

Pressione `Ctrl+C` no terminal onde executou o script.

---

## ⚙️ Comandos Manuais (se preferir):

### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend:
```bash
npm run dev:vite
```

---

## 🎯 Recomendação:

Use **`npm start`** - é o mais simples e funciona em qualquer sistema! 🚀

