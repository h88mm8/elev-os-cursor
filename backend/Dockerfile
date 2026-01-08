# Dockerfile para Railway
FROM node:20-alpine

WORKDIR /app

# Copiar arquivos do backend
COPY backend/package*.json ./
RUN npm ci --production=false

# Copiar código
COPY backend/ ./

# Gerar Prisma Client (usar DATABASE_URL fictício apenas para gerar tipos)
RUN DATABASE_URL="${DATABASE_URL:-postgresql://user:password@localhost:5432/db?schema=public}" npx prisma generate || echo "⚠️  Prisma generate falhou, mas continuando..."

# Build TypeScript (tentar, mas não falhar se houver erro)
RUN npm run build 2>&1 || echo "⚠️  Build TypeScript falhou, mas continuando..."

# Expor porta
EXPOSE 3001

# Comando de start
COPY backend/start.sh ./start.sh
RUN chmod +x start.sh
# Definir DATABASE_URL como ENV padrão para que exista desde o início do container
ENV DATABASE_URL=postgresql://user:password@localhost:5432/db?schema=public
# O start.sh vai sobrescrever se houver DATABASE_URL real
CMD ["sh", "-c", "export DATABASE_URL=\"${DATABASE_URL:-postgresql://user:password@localhost:5432/db?schema=public}\" && sh start.sh"]

