#!/bin/sh

# Script de start para Railway
# Garante que Prisma sempre tenha DATABASE_URL (mesmo fictício) para validação do schema

# DEFINIR DATABASE_URL ANTES DE QUALQUER COISA
# Isso é crítico porque o Prisma valida o schema na importação
FAKE_DB_URL="postgresql://user:password@localhost:5432/db?schema=public"

# Se não houver DATABASE_URL, definir fictício IMEDIATAMENTE
if [ -z "$DATABASE_URL" ] || [ "$DATABASE_URL" = "" ]; then
  export DATABASE_URL="$FAKE_DB_URL"
  echo "⚠️  DATABASE_URL não configurado. Usando valor fictício para validação do schema."
fi

cd backend || exit 1

# Verificar se DATABASE_URL é válido (não fictício)
HAS_REAL_DB=false
if [ -n "$DATABASE_URL" ] && \
   [ "$DATABASE_URL" != "" ] && \
   [ "$DATABASE_URL" != "$FAKE_DB_URL" ] && \
   echo "$DATABASE_URL" | grep -q "postgresql://" && \
   ! echo "$DATABASE_URL" | grep -q "user:password@localhost"; then
  HAS_REAL_DB=true
  echo "✅ DATABASE_URL válido encontrado."
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

