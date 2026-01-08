#!/bin/sh

# Script de start para Railway
# Evita executar Prisma se não houver DATABASE_URL válido

cd backend || exit 1

# Verificar se DATABASE_URL existe e não é o valor fictício
if [ -n "$DATABASE_URL" ] && \
   [ "$DATABASE_URL" != "" ] && \
   [ "$DATABASE_URL" != "postgresql://user:password@localhost:5432/db?schema=public" ] && \
   echo "$DATABASE_URL" | grep -q "postgresql://" && \
   ! echo "$DATABASE_URL" | grep -q "user:password@localhost"; then
  echo "✅ DATABASE_URL encontrado. Executando migrations..."
  npx prisma migrate deploy || echo "⚠️  Migration falhou, mas continuando..."
else
  echo "⚠️  DATABASE_URL não configurado ou inválido. Pulando migrations."
fi

echo "🚀 Iniciando servidor..."
npm start

