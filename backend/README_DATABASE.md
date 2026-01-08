# 🗄️ Setup do Banco de Dados

## Quick Start

### 1. Instalar Dependências
```bash
cd backend
npm install
```

### 2. Configurar PostgreSQL

**Opção A: Docker (Recomendado)**
```bash
docker run --name postgres-b2b \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=b2b_leads \
  -p 5432:5432 \
  -d postgres:15
```

**Opção B: PostgreSQL Local**
```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Criar banco
createdb b2b_leads
```

### 3. Configurar DATABASE_URL

Edite o arquivo `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/b2b_leads"
```

### 4. Rodar Migrations
```bash
npx prisma migrate dev --name init
```

### 5. Gerar Cliente Prisma
```bash
npx prisma generate
```

### 6. Iniciar Servidor
```bash
npm run dev
```

## 🎯 Comandos Úteis

```bash
# Ver banco de dados (Interface visual)
npm run prisma:studio

# Criar nova migration
npm run prisma:migrate

# Resetar banco (CUIDADO: apaga tudo!)
npx prisma migrate reset

# Ver status das migrations
npx prisma migrate status
```

## 📊 Modelos do Banco

- **Lead** - Leads B2B
- **Company** - Empresas
- **Communication** - Histórico de comunicações
- **DailyActivity** - Atividades diárias geradas por IA
- **TrackingEvent** - Eventos de tracking
- **Webhook** - Webhooks registrados
- **WebhookDelivery** - Histórico de deliveries
- **Settings** - Configurações do sistema

## 🔄 Migração de Dados JSON → PostgreSQL

Se você já tem dados em JSON, pode criar um script de migração:

```typescript
// scripts/migrate.ts
import { db } from '../src/services/databaseService'
import { DataStorage } from '../src/utils/dataStorage'

async function migrate() {
  const leadsStorage = new DataStorage('leads')
  const leadIds = await leadsStorage.list()
  
  for (const id of leadIds) {
    const lead = await leadsStorage.get(id)
    if (lead) {
      await db.createLead(lead)
      console.log(`Migrated lead: ${lead.firstName} ${lead.lastName}`)
    }
  }
}

migrate()
```

## ✅ Fallback Automático

O sistema funciona **com ou sem banco de dados**:

- **Com DATABASE_URL**: Usa PostgreSQL via Prisma
- **Sem DATABASE_URL**: Usa armazenamento JSON (desenvolvimento)

Perfeito para desenvolvimento rápido sem precisar configurar PostgreSQL!

