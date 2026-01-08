# 📋 Comandos para Copiar e Colar no Railway

## 🔧 Build Command:

Cole este comando no campo "Custom Build Command" do Railway:

```bash
cd backend && npm install && DATABASE_URL="postgresql://user:password@localhost:5432/db?schema=public" npx prisma generate
```

---

## 🚀 Start Command:

Cole este comando no campo "Custom Start Command" do Railway:

```bash
cd backend && export DATABASE_URL="${DATABASE_URL:-postgresql://user:password@localhost:5432/db?schema=public}" && sh start.sh
```

---

## 📝 Onde Colar:

1. **Railway Dashboard** → Projeto `soothing-comfort` → Serviço `elev-os-cursor`
2. Aba **"Settings"**
3. Seção **"Build"** → Campo "Custom Build Command"
4. Seção **"Deploy"** → Campo "Custom Start Command"
5. Clique em **"Update"** no final da página

---

**Copie e cole esses comandos exatamente como estão acima!** ✅

