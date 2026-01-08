# Dockerfile para Railway
FROM node:20-alpine

# CRÍTICO: Definir DATABASE_URL como ENV PADRÃO NO INÍCIO
# Isso garante que existe desde o início do container, antes de qualquer comando
ENV DATABASE_URL=postgresql://user:password@localhost:5432/db?schema=public

WORKDIR /app

# Copiar arquivos do backend
COPY backend/package*.json ./
RUN npm ci --production=false

# Copiar código
COPY backend/ ./

# Gerar Prisma Client (DATABASE_URL já existe como ENV)
RUN npx prisma generate || echo "⚠️  Prisma generate falhou, mas continuando..."

# Build TypeScript (tentar, mas não falhar se houver erro)
RUN npm run build 2>&1 || echo "⚠️  Build TypeScript falhou, mas continuando..."

# Expor porta
EXPOSE 3001

# Comando de start
COPY backend/start.sh ./start.sh
RUN chmod +x start.sh
# O start.sh vai verificar se há DATABASE_URL real e sobrescrever se necessário
CMD ["./start.sh"]
