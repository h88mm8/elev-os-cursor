#!/bin/sh

# Script de start para Railway
# Garante que Prisma sempre tenha DATABASE_URL (mesmo fictício) para validação do schema

cd backend || exit 1

# DATABASE_URL fictício para validação do schema do Prisma
FAKE_DB_URL="postgresql://user:password@localhost:5432/db?schema=public"

# Verificar se DATABASE_URL existe e é válido (não fictício)
HAS_REAL_DB=false
if [ -n "$DATABASE_URL" ] && \
   [ "$DATABASE_URL" != "" ] && \
   [ "$DATABASE_URL" != "$FAKE_DB_URL" ] && \
   echo "$DATABASE_URL" | grep -q "postgresql://" && \
   ! echo "$DATABASE_URL" | grep -q "user:password@localhost"; then
  HAS_REAL_DB=true
  echo "✅ DATABASE_URL válido encontrado."
else
  echo "⚠️  DATABASE_URL não configurado ou inválido. Usando valor fictício para validação do schema."
  # Definir DATABASE_URL fictício para que Prisma Client não falhe na importação
  export DATABASE_URL="$FAKE_DB_URL"
fi

# Se tiver banco real, executar migrations
if [ "$HAS_REAL_DB" = true ]; then
  echo "📦 Executando migrations..."
  npx prisma migrate deploy || echo "⚠️  Migration falhou, mas continuando..."
else
  echo "⏭️  Pulando migrations (sem banco real configurado)."
fi

echo "🚀 Iniciando servidor..."
npm start

