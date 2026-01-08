#!/bin/bash

# Script para enviar código para GitHub
# Execute: bash envio-github.sh

echo "🚀 Preparando para enviar para GitHub..."
echo ""

# Verificar se já tem remote
if git remote -v | grep -q origin; then
    echo "⚠️  Remote 'origin' já existe!"
    echo "Deseja substituir? (s/N)"
    read -r resposta
    if [ "$resposta" != "s" ] && [ "$resposta" != "S" ]; then
        echo "❌ Cancelado."
        exit 1
    fi
    git remote remove origin
fi

# Verificar se já tem commits
if ! git log --oneline &>/dev/null; then
    echo "📦 Fazendo commit inicial..."
    git add .
    git commit -m "Initial commit: B2B Lead Generator

- Frontend React + Electron + TypeScript
- Backend Node.js + Express + TypeScript
- Integração com Apollo, Unipile e OpenAI
- Sistema de autenticação com JWT
- Banco de dados PostgreSQL com Prisma
- Sistema Solar 3D para visualização de leads
- Feed de atividades estilo Instagram
- Tracking com Google Tag Manager
- Deploy configurado (Railway + Vercel)"
fi

echo ""
echo "📝 PRÓXIMOS PASSOS:"
echo ""
echo "1. Crie um repositório no GitHub:"
echo "   👉 https://github.com/new"
echo "   Nome: b2b-lead-generator"
echo "   NÃO marque: README, .gitignore, license"
echo ""
echo "2. Depois de criar, copie a URL do repositório"
echo "   (algo como: https://github.com/SEU_USUARIO/b2b-lead-generator.git)"
echo ""
echo "3. Execute:"
echo "   git remote add origin https://github.com/SEU_USUARIO/b2b-lead-generator.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "💡 Ou me forneça sua URL do GitHub e eu faço por você!"
echo ""

