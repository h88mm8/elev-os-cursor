#!/bin/bash

# Script para enviar código para GitHub
# Execute: bash COMANDOS_PARA_GITHUB.sh

echo "🚀 Preparando para enviar para GitHub..."
echo ""

# 1. Adicionar todos os arquivos
echo "📦 Adicionando arquivos..."
git add .

# 2. Ver status
echo ""
echo "📋 Status dos arquivos:"
git status --short | head -20

# 3. Fazer commit
echo ""
echo "💾 Fazendo commit..."
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

echo ""
echo "✅ Commit feito!"
echo ""
echo "📝 PRÓXIMOS PASSOS:"
echo ""
echo "1. Crie um repositório no GitHub:"
echo "   Acesse: https://github.com/new"
echo "   Nome: b2b-lead-generator"
echo "   NÃO marque: README, .gitignore, license"
echo ""
echo "2. Depois de criar, execute:"
echo "   git remote add origin https://github.com/SEU_USUARIO/b2b-lead-generator.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Substitua 'SEU_USUARIO' pela sua conta do GitHub"
echo ""

