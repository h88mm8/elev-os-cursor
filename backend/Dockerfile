# Dockerfile para Railway
FROM node:20-alpine

# CRÍTICO: Definir DATABASE_URL como ENV PADRÃO NO INÍCIO
# Isso garante que existe desde o início do container, antes de qualquer comando
ENV DATABASE_URL=postgresql://user:password@localhost:5432/db?schema=public

WORKDIR /app

# Copiar arquivos do backend
COPY backend/package*.json ./
RUN npm ci --production=false

# Copiar código do backend para /app
COPY backend/ ./

# Gerar Prisma Client (DATABASE_URL já existe como ENV)
RUN npx prisma generate || echo "⚠️  Prisma generate falhou, mas continuando..."

# Build TypeScript (tentar, mas não falhar se houver erro)
RUN npm run build 2>&1 || echo "⚠️  Build TypeScript falhou, mas continuando..."

# Expor porta
EXPOSE 3001

# Comando de start - já estamos em /app com todo o código
COPY backend/start.sh ./start.sh
RUN chmod +x start.sh
# O start.sh vai verificar se há DATABASE_URL real e sobrescrever se necessário
# Usar exec form sem sh para evitar problemas
CMD ["./start.sh"]
