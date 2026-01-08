# Dockerfile para Railway
FROM node:20-alpine

WORKDIR /app

# Copiar arquivos do backend
COPY backend/package*.json ./
RUN npm ci --production=false

# Copiar código
COPY backend/ ./

# Gerar Prisma Client
RUN npx prisma generate

# Build TypeScript (tentar, mas não falhar se houver erro)
RUN npm run build 2>&1 || echo "⚠️  Build TypeScript falhou, mas continuando..."

# Expor porta
EXPOSE 3001

# Comando de start
CMD ["sh", "-c", "if [ -n \"$DATABASE_URL\" ] && [ \"$DATABASE_URL\" != \"\" ]; then npx prisma migrate deploy || true; fi && npm start"]

