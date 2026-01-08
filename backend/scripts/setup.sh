#!/bin/bash

echo "🚀 Configurando Backend B2B Lead Generator..."

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale Node.js 18+ primeiro."
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js versão 18+ é necessária. Versão atual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
    echo "⚠️  Por favor, edite o arquivo .env e adicione suas API keys"
else
    echo "✅ Arquivo .env já existe"
fi

# Criar diretório de dados
mkdir -p data/leads
mkdir -p data/tracking

echo "✅ Diretórios de dados criados"

echo ""
echo "✨ Setup concluído!"
echo ""
echo "Próximos passos:"
echo "1. Edite o arquivo .env e adicione suas API keys"
echo "2. Execute 'npm run dev' para iniciar o servidor de desenvolvimento"
echo "3. Execute 'npm run build && npm start' para produção"
echo ""

