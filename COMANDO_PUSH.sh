#!/bin/bash

# Script para fazer push para GitHub
# Execute: bash COMANDO_PUSH.sh

echo "📤 Enviando código para GitHub..."
echo ""
echo "Repositório: https://github.com/h88mm8/elev-os-cursor.git"
echo ""

# Verificar se já está configurado
if ! git remote get-url origin &>/dev/null; then
    echo "⚠️  Remote não configurado. Configurando..."
    git remote add origin https://github.com/h88mm8/elev-os-cursor.git
fi

# Verificar branch
git branch -M main

echo "🔐 Você será solicitado a fazer login no GitHub."
echo ""
echo "Opções de autenticação:"
echo "1. Token de Acesso (recomendado)"
echo "   - Crie em: https://github.com/settings/tokens"
echo "   - Username: h88mm8"
echo "   - Password: SEU_TOKEN (não sua senha!)"
echo ""
echo "2. GitHub CLI (se instalado)"
echo "   - Execute: gh auth login"
echo ""
echo "3. SSH (se configurado)"
echo "   - Mude remote para: git@github.com:h88mm8/elev-os-cursor.git"
echo ""
echo "Pressione Enter para tentar fazer push..."
read

# Tentar push
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Código enviado com sucesso!"
    echo ""
    echo "🌐 Acesse: https://github.com/h88mm8/elev-os-cursor"
    echo ""
    echo "🚀 Próximo passo: Deploy online!"
    echo "   Veja DEPLOY.md para instruções"
else
    echo ""
    echo "❌ Erro ao enviar código."
    echo ""
    echo "💡 Soluções:"
    echo "1. Crie um token: https://github.com/settings/tokens"
    echo "2. Use GitHub CLI: gh auth login"
    echo "3. Configure SSH e mude o remote"
    echo ""
    echo "Veja PUSH_GITHUB.md para mais detalhes"
fi

