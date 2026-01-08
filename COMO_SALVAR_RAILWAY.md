# 🔧 Como Salvar Configurações no Railway

## ⚠️ Problema Identificado:

O Railway não está salvando as mudanças quando você:
- Muda o Builder (Nixpacks → Docker)
- Atualiza comandos

---

## ✅ Solução: Como Salvar Corretamente

### **Passo 1: Fazer Todas as Mudanças**

1. **Build Command:**
   - Campo: "Custom Build Command"
   - Valor: `cd backend && npm install && DATABASE_URL="postgresql://user:password@localhost:5432/db?schema=public" npx prisma generate`
   - ✅ Clique no **check (✓)** para salvar

2. **Builder:**
   - Dropdown: "Builder"
   - Selecione: **"Dockerfile"** (não "Nixpacks")
   - ✅ Clique no **check (✓)** para salvar

3. **Start Command:**
   - Vá na seção **"Deploy"** (role para baixo ou clique em "Deploy" no menu lateral)
   - Campo: "Custom Start Command"
   - Valor: `export DATABASE_URL="${DATABASE_URL:-postgresql://user:password@localhost:5432/db?schema=public}" && sh backend/start.sh`
   - ✅ Clique no **check (✓)** para salvar

### **Passo 2: Verificar se Salvou**

1. **Recarregue a página** (F5 ou Cmd+R)
2. **Verifique se as mudanças estão lá:**
   - Builder deve estar como "Dockerfile"
   - Build command deve estar atualizado
   - Start command deve estar atualizado

### **Passo 3: Se Não Salvou**

**Opção A: Usar o botão "Update"**
1. Role até o **final da página Settings**
2. Procure por um botão **"Update"** ou **"Save"**
3. Clique nele

**Opção B: Fazer Deploy Manual**
1. Vá na aba **"Deployments"**
2. Clique em **"Deploy"** ou **"Redeploy"**
3. Isso pode forçar o salvamento

**Opção C: Remover e Recriar**
1. Se persistir, tente **remover os comandos customizados**
2. Deixe **vazios** para usar o `railway.json` ou `Dockerfile`
3. O Railway deve detectar automaticamente

---

## 🎯 Configuração Recomendada:

### **Se usar Dockerfile (Recomendado):**

1. **Builder:** `Dockerfile`
2. **Build Command:** Deixe **VAZIO** (o Dockerfile faz o build)
3. **Start Command:** Deixe **VAZIO** (o Dockerfile define o CMD)

O Railway vai usar automaticamente o `backend/Dockerfile` que já tem tudo configurado!

### **Se usar Nixpacks:**

1. **Builder:** `Nixpacks` (ou "Railpack Default")
2. **Build Command:** `cd backend && npm install && DATABASE_URL="postgresql://user:password@localhost:5432/db?schema=public" npx prisma generate`
3. **Start Command:** `export DATABASE_URL="${DATABASE_URL:-postgresql://user:password@localhost:5432/db?schema=public}" && sh backend/start.sh`

---

## 💡 Dica:

**Melhor opção:** Use **Dockerfile** e deixe os comandos **VAZIOS**. O Dockerfile já tem tudo configurado!

1. Builder: **Dockerfile**
2. Build Command: **VAZIO**
3. Start Command: **VAZIO**

Isso vai usar o `backend/Dockerfile` que já enviamos com todas as correções!

---

## ✅ Checklist:

- [ ] Builder mudado para "Dockerfile"
- [ ] Build Command atualizado (ou vazio se usar Dockerfile)
- [ ] Start Command atualizado (ou vazio se usar Dockerfile)
- [ ] Clicou no check (✓) em cada campo
- [ ] Recarregou a página para verificar
- [ ] Railway fez deploy automático

---

**Tente usar Dockerfile com comandos vazios - é mais simples e já está tudo configurado!** 🚀

