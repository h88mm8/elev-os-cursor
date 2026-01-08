# 📦 Setup GitHub - Passo a Passo

## 🎯 Objetivo

Colocar o código no GitHub e preparar para deploy online.

---

## 📝 Passo 1: Criar Repositório no GitHub

### 1. Acesse o GitHub

Vá para: https://github.com/new

### 2. Criar Novo Repositório

- **Repository name:** `b2b-lead-generator`
- **Description:** `Software para geração de oportunidades de negócio B2B com IA`
- **Visibility:** Escolha:
  - ✅ **Public** (visível para todos)
  - 🔒 **Private** (somente você vê)
- ⚠️ **NÃO** marque:
  - ❌ Add a README file
  - ❌ Add .gitignore
  - ❌ Choose a license

### 3. Copiar URL do Repositório

Você verá algo como:
```
https://github.com/SEU_USUARIO/b2b-lead-generator.git
```

---

## 🔧 Passo 2: Configurar Git Localmente

### 1. Verificar se já existe .git

```bash
cd /Users/henriquemarques/b2b-lead-generator
ls -la .git
```

Se não existir, já inicializamos. Se existir, está OK.

### 2. Configurar Git (se necessário)

```bash
# Seu nome e email (se ainda não configurou)
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

### 3. Adicionar todos os arquivos

```bash
cd /Users/henriquemarques/b2b-lead-generator

# Adicionar tudo
git add .

# Verificar o que será commitado
git status
```

### 4. Primeiro Commit

```bash
git commit -m "Initial commit: B2B Lead Generator

- Frontend React + Electron + TypeScript
- Backend Node.js + Express + TypeScript
- Integração com Apollo, Unipile e OpenAI
- Sistema de autenticação com JWT
- Banco de dados PostgreSQL com Prisma
- Sistema Solar 3D para visualização de leads
- Feed de atividades estilo Instagram
- Tracking com Google Tag Manager"
```

### 5. Conectar com GitHub

```bash
# Adicionar remote (SUBSTITUA pela URL do seu repositório)
git remote add origin https://github.com/SEU_USUARIO/b2b-lead-generator.git

# Verificar
git remote -v
```

### 6. Enviar para GitHub

```bash
# Renomear branch para main (se necessário)
git branch -M main

# Enviar código
git push -u origin main
```

Você será solicitado a fazer login no GitHub.

---

## ✅ Passo 3: Verificar no GitHub

1. Acesse: https://github.com/SEU_USUARIO/b2b-lead-generator
2. Você deve ver todos os arquivos do projeto
3. ✅ Código está no GitHub!

---

## 🔄 Atualizações Futuras

Sempre que fizer mudanças:

```bash
cd /Users/henriquemarques/b2b-lead-generator

# Ver mudanças
git status

# Adicionar arquivos modificados
git add .

# Ou arquivo específico
git add nome-do-arquivo

# Fazer commit
git commit -m "Descrição das mudanças"

# Enviar para GitHub
git push
```

---

## 🔒 Arquivos Protegidos

O `.gitignore` já está configurado para **NÃO** enviar:

- ✅ `.env` (variáveis de ambiente com senhas)
- ✅ `node_modules/` (dependências)
- ✅ `dist/` (arquivos compilados)
- ✅ `data/` (dados locais)
- ✅ Logs e temporários

---

## 📋 Checklist

- [ ] Repositório criado no GitHub
- [ ] `.gitignore` configurado
- [ ] Arquivos adicionados ao Git
- [ ] Primeiro commit feito
- [ ] Remote adicionado
- [ ] Código enviado para GitHub
- [ ] Código visível no GitHub

---

## 🎉 Pronto!

Agora seu código está no GitHub e sincronizado! 🚀

**Próximo passo:** Veja `DEPLOY.md` para colocar online!

