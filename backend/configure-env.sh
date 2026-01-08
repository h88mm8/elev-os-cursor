#!/bin/bash

# Script para configurar o arquivo .env automaticamente
# Uso: ./configure-env.sh

echo "🔧 Configurando arquivo .env..."
echo ""

# Verificar se .env já existe
if [ -f .env ]; then
    echo "⚠️  Arquivo .env já existe!"
    read -p "Deseja sobrescrever? (s/N): " overwrite
    if [ "$overwrite" != "s" ] && [ "$overwrite" != "S" ]; then
        echo "❌ Cancelado. Mantendo arquivo existente."
        exit 0
    fi
fi

# Gerar secrets seguros
echo "🔐 Gerando secrets seguros..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
API_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Criar arquivo .env
cat > .env << EOF
# ============================================
# CONFIGURAÇÃO DO AMBIENTE - B2B LEAD GENERATOR
# ============================================
# IMPORTANTE: NÃO compartilhe este arquivo!

# ============================================
# CONFIGURAÇÃO DO SERVIDOR
# ============================================
PORT=3001
NODE_ENV=development

# ============================================
# BANCO DE DADOS (PostgreSQL)
# ============================================
# Formato: postgresql://usuario:senha@host:porta/database
DATABASE_URL=postgresql://user:password@localhost:5432/b2b_leads

# ============================================
# API KEYS - CONFIGURE AQUI!
# ============================================

# Apollo.io API Key
# Obter em: https://app.apollo.io/#/settings/integrations/api
APOLLO_API_KEY=

# Unipile API Key
# Obter em: https://app.unipile.com/settings/api
UNIPILE_API_KEY=

# OpenAI API Key
# Obter em: https://platform.openai.com/api-keys
# Formato: sk-... (começa com sk-)
OPENAI_API_KEY=

# Google Tag Manager ID
# Obter em: https://tagmanager.google.com
# Formato: GTM-XXXXXXX
GOOGLE_TAG_MANAGER_ID=

# ============================================
# SEGURANÇA
# ============================================
JWT_SECRET=$JWT_SECRET
API_SECRET=$API_SECRET

# ============================================
# CORS
# ============================================
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
EOF

echo "✅ Arquivo .env criado com sucesso!"
echo ""
echo "📝 PRÓXIMOS PASSOS:"
echo "1. Edite o arquivo .env e adicione suas API keys:"
echo "   - APOLLO_API_KEY"
echo "   - UNIPILE_API_KEY"
echo "   - OPENAI_API_KEY"
echo "   - GOOGLE_TAG_MANAGER_ID (opcional)"
echo "   - DATABASE_URL (se não usar localhost)"
echo ""
echo "2. As chaves JWT_SECRET e API_SECRET já foram geradas automaticamente!"
echo ""
echo "3. Para editar: nano .env (ou abra no seu editor favorito)"
echo ""

