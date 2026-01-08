# ⚠️ IMPORTANTE: Corrigir Comandos no Railway Dashboard

## 🐛 Problema:

O Railway está usando **comandos customizados do dashboard**, não os do `railway.json`!

**Comandos atuais (ERRADOS):**
- **Build:** `cd backend && npm install && npx prisma generate` ❌
- **Start:** `cd backend && npx prisma migrate deploy && npm start` ❌

Esses comandos tentam executar Prisma **sem DATABASE_URL**!

---

## ✅ Solução: Atualizar Comandos no Dashboard

Você precisa **atualizar manualmente** os comandos no Railway Dashboard:

### 1. **Acesse Settings do serviço:**
   - Vá em: `elev-os-cursor` → Aba **"Settings"**

### 2. **Em "Build":**
   
   **Build command** (substitua por):
   ```bash
   cd backend && npm install && DATABASE_URL="postgresql://user:password@localhost:5432/db?schema=public" npx prisma generate
   ```

   **Ou deixe vazio** para usar o `railway.json` ou `nixpacks.toml`.

### 3. **Em "Deploy":**
   
   **Start command** (substitua por):
   ```bash
   cd backend && export DATABASE_URL="${DATABASE_URL:-postgresql://user:password@localhost:5432/db?schema=public}" && sh start.sh
   ```

   **OU remova o comando customizado** e deixe o Railway usar o do `railway.json`.

---

## 🎯 Passo a Passo no Dashboard:

1. **Acesse:** Railway Dashboard → Projeto `soothing-comfort` → Serviço `elev-os-cursor`
2. **Clique na aba:** "Settings"
3. **Role até:** "Build" section
4. **Build command:** Cole:
   ```bash
   cd backend && npm install && DATABASE_URL="postgresql://user:password@localhost:5432/db?schema=public" npx prisma generate
   ```
5. **Role até:** "Deploy" section
6. **Start command:** Cole:
   ```bash
   cd backend && export DATABASE_URL="${DATABASE_URL:-postgresql://user:password@localhost:5432/db?schema=public}" && sh start.sh
   ```
7. **Clique em:** "Update" (no final da página)

---

## ✅ OU: Remover Comandos Customizados

**Melhor opção:** Remova os comandos customizados do dashboard e deixe o Railway usar os arquivos de configuração (`railway.json` ou `nixpacks.toml`).

1. **Build command:** Deixe **VAZIO**
2. **Start command:** Deixe **VAZIO**
3. O Railway usará automaticamente:
   - `railway.json` (se existir)
   - `nixpacks.toml` (se existir)
   - Detecção automática (fallback)

---

## 📝 Comandos Corretos:

### **Build Command:**
```bash
cd backend && npm install && DATABASE_URL="postgresql://user:password@localhost:5432/db?schema=public" npx prisma generate
```

### **Start Command:**
```bash
cd backend && export DATABASE_URL="${DATABASE_URL:-postgresql://user:password@localhost:5432/db?schema=public}" && sh start.sh
```

---

## 🚀 Após Atualizar:

1. **Salve as configurações** no dashboard
2. **Railway fará redeploy automático**
3. **Aguarde 2-3 minutos**
4. **Verifique os logs** para confirmar que funcionou

---

## ⚠️ Importante:

**Os comandos no dashboard SOBRESCREVEM os arquivos de configuração!**

Se você tem comandos customizados no dashboard, eles têm **prioridade** sobre:
- `railway.json`
- `nixpacks.toml`
- Detecção automática

**Solução:** Atualize os comandos no dashboard OU remova-os para usar os arquivos de configuração.

---

**Atualize os comandos no Railway Dashboard agora!** 🚀

