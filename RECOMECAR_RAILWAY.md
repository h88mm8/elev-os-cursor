# 🔄 Recomeçar Railway do Zero - Guia Passo a Passo

## ✅ Arquivos Removidos:

Removi `railway.json` e `nixpacks.toml` para que o Railway detecte automaticamente o Dockerfile.

---

## 🚀 Passo a Passo no Railway Dashboard:

### **Passo 1: Apagar Serviço Atual**

1. Vá no serviço **elev-os-cursor**
2. Aba **"Settings"**
3. Role até o final
4. Seção **"Danger"**
5. Clique em **"Delete Service"**
6. Confirme a exclusão

### **Passo 2: Criar Novo Serviço**

1. No projeto **soothing-comfort**
2. Clique em **"New"** (canto superior direito)
3. Selecione **"GitHub Repo"**
4. Escolha: **h88mm8/elev-os-cursor**
5. Clique em **"Deploy Now"**

### **Passo 3: Configurar (Depois que Criar)**

1. Vá em **"Settings"** do novo serviço
2. Em **"Build"**:
   - **Builder:** Deve detectar **"Dockerfile"** automaticamente
   - Se não detectar, selecione manualmente **"Dockerfile"**
   - **Dockerfile Path:** `backend/Dockerfile`
   - **Build Command:** Deixe **VAZIO**
3. Em **"Deploy"**:
   - **Start Command:** Deixe **VAZIO** (o Dockerfile já tem o CMD)

### **Passo 4: Adicionar Variáveis**

1. Aba **"Variables"**
2. Clique em **"+ New Variable"**
3. Adicione:
   - **Nome:** `DATABASE_URL`
   - **Valor:** `postgresql://user:password@localhost:5432/db?schema=public`
   - Clique em **"Add"**

### **Passo 5: Aguardar Deploy**

1. O Railway fará deploy automático
2. Aguarde 2-3 minutos
3. Verifique os logs em **"Deploy Logs"**

---

## ✅ O Que Está Configurado no Dockerfile:

O `backend/Dockerfile` já tem:
- ✅ Node.js 20
- ✅ DATABASE_URL como ENV padrão
- ✅ Prisma generate
- ✅ TypeScript build
- ✅ Start script configurado

---

## 🎯 Resultado Esperado:

- ✅ Railway detecta Dockerfile automaticamente
- ✅ Build funciona sem erros
- ✅ Servidor inicia corretamente
- ✅ Sem necessidade de comandos customizados

---

## ⚠️ Se Não Detectar Dockerfile:

1. Vá em **Settings** → **Build**
2. **Builder:** Selecione **"Dockerfile"** manualmente
3. **Dockerfile Path:** `backend/Dockerfile`
4. Salve e faça deploy

---

## 📝 Checklist:

- [ ] Apagar serviço antigo
- [ ] Criar novo serviço do GitHub
- [ ] Verificar se detectou Dockerfile
- [ ] Adicionar DATABASE_URL nas variáveis
- [ ] Aguardar deploy
- [ ] Verificar logs
- [ ] Servidor deve estar "Online"

---

**Siga esses passos e deve funcionar! O Dockerfile já está pronto.** 🚀

