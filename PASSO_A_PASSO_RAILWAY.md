# 🚀 Passo a Passo Completo - Railway Setup

## ✅ Passo 1: Corrigir Comandos no Railway Dashboard

### 1.1 Acesse o Dashboard:
1. Vá para: https://railway.app
2. Entre no projeto: **soothing-comfort**
3. Clique no serviço: **elev-os-cursor**

### 1.2 Vá em Settings:
1. Clique na aba **"Settings"** (no topo)
2. Role até a seção **"Build"**

### 1.3 Atualize Build Command:
1. Encontre o campo **"Custom Build Command"**
2. **Apague** o comando atual: `cd backend && npm install && npx prisma generate`
3. **Cole** este comando:
   ```bash
   cd backend && npm install && DATABASE_URL="postgresql://user:password@localhost:5432/db?schema=public" npx prisma generate
   ```

### 1.4 Atualize Start Command:
1. Role até a seção **"Deploy"**
2. Encontre o campo **"Custom Start Command"**
3. **Apague** o comando atual: `cd backend && npx prisma migrate deploy && npm start`
4. **Cole** este comando:
   ```bash
   cd backend && export DATABASE_URL="${DATABASE_URL:-postgresql://user:password@localhost:5432/db?schema=public}" && sh start.sh
   ```

### 1.5 Salve:
1. Role até o final da página
2. Clique em **"Update"**
3. Aguarde o redeploy automático (2-3 minutos)

---

## ✅ Passo 2: Criar Banco PostgreSQL no Railway

### 2.1 Criar o Banco:
1. No mesmo projeto **soothing-comfort**
2. Clique no botão **"New"** (canto superior direito)
3. Selecione **"Database"**
4. Escolha **"Add PostgreSQL"**
5. Aguarde o Railway criar o banco (30-60 segundos)

### 2.2 Obter DATABASE_URL:
1. Clique no serviço do banco recém-criado (geralmente chamado "PostgreSQL")
2. Vá na aba **"Variables"**
3. Encontre a variável **`DATABASE_URL`**
4. Clique no ícone de **"copiar"** ao lado do valor
5. **Guarde** essa URL (você vai precisar)

---

## ✅ Passo 3: Conectar Banco ao Serviço

### 3.1 Adicionar Variável no Serviço:
1. Volte para o serviço **elev-os-cursor**
2. Vá na aba **"Variables"**
3. Clique em **"New Variable"** ou **"Reference Variable"**

### 3.2 Referenciar DATABASE_URL:
1. Se houver opção **"Reference Variable"**:
   - Selecione o serviço PostgreSQL
   - Selecione a variável `DATABASE_URL`
   - Clique em **"Add"**

2. **OU** se não houver essa opção:
   - Nome: `DATABASE_URL`
   - Valor: Cole a URL que você copiou no Passo 2.2
   - Clique em **"Add"**

### 3.3 Verificar:
1. Confirme que `DATABASE_URL` aparece na lista de variáveis
2. O valor deve começar com `postgresql://` e ter credenciais reais (não `user:password`)

---

## ✅ Passo 4: Verificar Deploy

### 4.1 Aguardar Redeploy:
1. O Railway deve fazer redeploy automático após adicionar a variável
2. Aguarde 2-3 minutos

### 4.2 Verificar Logs:
1. Vá na aba **"Deploy Logs"**
2. Procure por:
   - ✅ `✅ DATABASE_URL válido encontrado.`
   - ✅ `📦 Executando migrations...`
   - ✅ `🚀 Iniciando servidor...`
   - ✅ `🚀 Servidor rodando na porta...`

### 4.3 Verificar Status:
1. O serviço deve estar **"Online"** (bolinha verde)
2. Se estiver **"Crashed"**, verifique os logs para erros

---

## ✅ Passo 5: Testar API

### 5.1 Health Check:
1. Vá na aba **"Settings"** do serviço
2. Em **"Networking"**, clique em **"Generate Domain"**
3. Copie a URL gerada (ex: `https://elev-os-cursor-production.up.railway.app`)
4. Acesse no navegador: `https://[sua-url]/health`
5. Deve retornar: `{"status":"ok",...}`

### 5.2 Testar Endpoint:
```bash
curl https://[sua-url]/api/leads
```

---

## 🎯 Resumo dos Comandos:

### Build Command:
```bash
cd backend && npm install && DATABASE_URL="postgresql://user:password@localhost:5432/db?schema=public" npx prisma generate
```

### Start Command:
```bash
cd backend && export DATABASE_URL="${DATABASE_URL:-postgresql://user:password@localhost:5432/db?schema=public}" && sh start.sh
```

---

## ⚠️ Troubleshooting:

### Erro: "DATABASE_URL not found"
- Verifique se a variável foi adicionada corretamente
- Confirme que o nome é exatamente `DATABASE_URL` (maiúsculas)

### Erro: "Connection refused"
- Verifique se o banco PostgreSQL está online
- Confirme que a URL está correta

### Servidor não inicia:
- Verifique os logs em "Deploy Logs"
- Confirme que os comandos foram atualizados corretamente

---

## ✅ Checklist Final:

- [ ] Build command atualizado no dashboard
- [ ] Start command atualizado no dashboard
- [ ] Banco PostgreSQL criado
- [ ] DATABASE_URL adicionada ao serviço elev-os-cursor
- [ ] Serviço está "Online"
- [ ] Health check retorna OK
- [ ] Logs mostram "Servidor rodando"

---

**Siga esses passos na ordem e seu backend estará funcionando com banco de dados!** 🚀

