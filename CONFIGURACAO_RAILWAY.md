# ⚙️ Configuração do Railway - Node.js 20

## 🔧 Configuração Necessária no Railway:

O Railway precisa ser configurado para usar Node.js 20. Faça isso no dashboard:

### Opção 1: Configurar no Railway Dashboard

1. **Acesse seu projeto no Railway:**
   - Vá em: https://railway.app/project/[SEU_PROJETO]

2. **Vá em Settings do serviço:**
   - Clique no serviço `elev-os-cursor`
   - Vá na aba **"Settings"**

3. **Configure Environment:**
   - Encontre **"Environment Variables"**
   - Adicione:
     ```env
     NODE_VERSION=20
     ```

4. **Ou configure Build Settings:**
   - Em **"Build"**, adicione:
     - **Node Version:** `20`

### Opção 2: Usar Dockerfile (Já Criado)

O Dockerfile já foi criado e especifica Node.js 20.

No Railway:
1. Vá em **Settings** do serviço
2. Em **"Build"**, selecione:
   - **Build Type:** Dockerfile
   - **Dockerfile Path:** `backend/Dockerfile`

### Opção 3: Usar Nixpacks com Config

O `nixpacks.toml` já especifica Node.js 20.

Railway deve detectar automaticamente, mas você pode forçar:
1. Vá em **Settings**
2. Em **"Build"**, adicione:
   - **Builder:** Nixpacks
   - **Build Command:** (já configurado no railway.json)

---

## ✅ Arquivos Criados:

1. **`backend/.node-version`** - Especifica Node.js 20
2. **`.nvmrc`** - Especifica Node.js 20
3. **`backend/nixpacks.toml`** - Configura Nixpacks para Node.js 20
4. **`backend/Dockerfile`** - Dockerfile com Node.js 20
5. **`backend/package.json`** - Adicionado `engines` com Node.js 20

---

## 🎯 Próximo Passo:

**No Railway Dashboard:**

1. Vá em **Settings** do serviço `elev-os-cursor`
2. Em **"Build"**, verifique:
   - Node Version está como 20 (ou deixe usar o Dockerfile)
3. Faça **Redeploy** manual se necessário

Ou o Railway pode detectar automaticamente com os arquivos criados.

---

## ⏱️ Tempo Esperado:

Com Node.js 20 configurado:
- ⏱️ **3-5 minutos** para build completo

---

**Configure no Railway Dashboard e faça redeploy!** 🚀

