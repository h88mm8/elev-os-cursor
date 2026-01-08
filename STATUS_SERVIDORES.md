# 📊 Status dos Servidores

## ✅ Servidores Iniciados!

### 🌐 URLs Disponíveis:

- **Frontend (React):** http://localhost:5173
- **Backend (API):** http://localhost:3001
- **API Docs (Swagger):** http://localhost:3001/api-docs
- **Health Check:** http://localhost:3001/health

---

## 🔍 Verificar Status

### Verificar Backend:
```bash
curl http://localhost:3001/health
```

### Verificar Frontend:
```bash
curl http://localhost:5173
```

### Ver processos rodando:
```bash
ps aux | grep -E "(node|vite|tsx)" | grep -v grep
```

---

## 🛑 Parar Servidores

### Parar tudo:
```bash
# Encontrar PIDs
ps aux | grep -E "(node|vite|tsx)" | grep -v grep

# Matar processos (substitua PID pelos números encontrados)
kill -9 <PID_BACKEND> <PID_FRONTEND>
```

### Ou simplesmente:
Pressione `Ctrl+C` no terminal onde você executou `npm start`

---

## 📋 Logs

### Ver logs do Backend:
```bash
tail -f backend.log
```

### Ver logs do Frontend:
```bash
tail -f frontend.log
```

---

## 🐛 Problemas Comuns

### Porta já em uso:
```bash
# Verificar o que está usando a porta
lsof -i :3001  # Backend
lsof -i :5173  # Frontend

# Matar processo
kill -9 <PID>
```

### Erro de conexão:
1. Verifique se ambos os servidores estão rodando
2. Verifique os logs para erros
3. Verifique se as portas estão livres

---

## ✅ Checklist

- [ ] Backend rodando na porta 3001
- [ ] Frontend rodando na porta 5173
- [ ] Navegador abriu automaticamente
- [ ] Página carrega sem erros no console

---

**Status atual:** 🟢 Servidores iniciados!

Acesse: http://localhost:5173

