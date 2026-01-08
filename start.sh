#!/bin/bash

# Script para iniciar Backend e Frontend automaticamente
# Uso: ./start.sh

echo "🚀 Iniciando B2B Lead Generator..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js primeiro."
    exit 1
fi

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências do frontend..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Instalando dependências do backend..."
    cd backend
    npm install
    cd ..
fi

# Verificar se .env existe no backend
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Arquivo .env não encontrado no backend!"
    echo "📝 Criando arquivo .env..."
    cd backend
    ./configure-env.sh
    cd ..
    echo ""
    echo "⚠️  IMPORTANTE: Configure suas API keys em backend/.env antes de continuar!"
    echo "   Pressione Enter para continuar mesmo assim ou Ctrl+C para sair..."
    read
fi

echo ""
echo "${GREEN}✅ Tudo pronto!${NC}"
echo ""
echo "${BLUE}Iniciando Backend e Frontend...${NC}"
echo ""

# Função para limpar processos ao sair
cleanup() {
    echo ""
    echo "${YELLOW}🛑 Parando servidores...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Capturar Ctrl+C
trap cleanup INT TERM

# Iniciar Backend em background
echo "${BLUE}🔧 Iniciando Backend (porta 3001)...${NC}"
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Aguardar backend iniciar
echo "⏳ Aguardando backend iniciar..."
sleep 5

# Verificar se backend está rodando
if ! curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "⚠️  Backend pode não estar respondendo. Verifique backend.log"
fi

# Iniciar Frontend em background
echo "${BLUE}🎨 Iniciando Frontend (porta 5173)...${NC}"
npm run dev:vite > frontend.log 2>&1 &
FRONTEND_PID=$!

# Aguardar frontend iniciar
echo "⏳ Aguardando frontend iniciar..."
sleep 8

# Verificar se frontend está rodando
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo ""
    echo "${GREEN}✅ Servidores iniciados com sucesso!${NC}"
    echo ""
    echo "🌐 Frontend: ${BLUE}http://localhost:5173${NC}"
    echo "🔧 Backend:  ${BLUE}http://localhost:3001${NC}"
    echo "📚 API Docs: ${BLUE}http://localhost:3001/api-docs${NC}"
    echo ""
    
    # Abrir navegador (macOS, Linux, Windows)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open http://localhost:5173
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        xdg-open http://localhost:5173 2>/dev/null || sensible-browser http://localhost:5173 2>/dev/null
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        # Windows
        start http://localhost:5173
    fi
    
    echo "${YELLOW}💡 Para parar os servidores, pressione Ctrl+C${NC}"
    echo ""
else
    echo "⚠️  Frontend pode não estar respondendo. Verifique frontend.log"
fi

# Manter script rodando e mostrar logs
echo "${BLUE}📋 Logs do Backend (últimas 20 linhas):${NC}"
tail -20 backend.log
echo ""
echo "${BLUE}📋 Logs do Frontend (últimas 20 linhas):${NC}"
tail -20 frontend.log
echo ""

# Aguardar indefinidamente
wait

