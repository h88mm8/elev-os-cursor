# 🚀 B2B Lead Generator

Software para geração de oportunidades de negócio B2B com inteligência artificial.

[![Deploy Railway](https://railway.app/button.svg)](https://railway.app)
[![Deploy Vercel](https://vercel.com/button)](https://vercel.com/new)

## 📋 Status

✅ **Frontend:** React 18 + TypeScript + Electron  
✅ **Backend:** Node.js + Express + TypeScript  
✅ **Database:** PostgreSQL + Prisma  
✅ **Deploy:** Railway (Backend) + Vercel (Frontend)  
✅ **CI/CD:** GitHub Actions

## Funcionalidades

- 🔍 **Busca de Leads B2B** com filtros avançados (integração Apollo)
- 📊 **Enriquecimento de Dados** - email, telefone, dados da empresa
- 🤖 **Análise por IA** - análise estratégica e diária dos leads (OpenAI)
- 💬 **Múltiplos Canais** - Email, WhatsApp, LinkedIn (Unipile)
- 📅 **Calendário Integrado** - links de agenda e convites de reunião
- 📈 **Tracking** - Google Tag Manager para tracking de comportamento
- 🎯 **Sistema Solar** - visualização única com leads orbitando por estágios
- 📱 **Feed Diário** - atividades diárias geradas por IA (estilo Instagram)

## Tecnologias

- **Frontend**: React 18 + TypeScript
- **Desktop**: Electron
- **3D**: Three.js + React Three Fiber
- **State Management**: Zustand
- **Roteamento**: React Router
- **Estilização**: CSS Modules

## Instalação

```bash
npm install
npm run build:electron
```

> **Nota**: Este aplicativo requer um servidor backend para funcionar completamente. Veja [SETUP.md](./SETUP.md) para instruções detalhadas.

## Desenvolvimento

```bash
npm run dev
```

Isso iniciará tanto o servidor Vite quanto o Electron.

## Build

```bash
npm run build
```

## Estrutura do Projeto

```
├── electron/          # Código do Electron
│   ├── main.ts       # Processo principal
│   └── preload.ts    # Script de pré-carregamento
├── src/
│   ├── components/   # Componentes reutilizáveis
│   ├── pages/        # Páginas principais
│   ├── services/     # Serviços de API
│   ├── store/        # Gerenciamento de estado
│   └── types/        # Tipos TypeScript
└── package.json
```

## Integrações

O software utiliza as seguintes APIs:

- **Apollo** - Busca e enriquecimento de leads B2B
- **Unipile** - Email, LinkedIn, WhatsApp e Calendário
- **OpenAI** - Análise estratégica e geração de atividades diárias
- **Google Tag Manager** - Tracking de comportamento

## Configuração

1. Configure suas API keys na tela de Configurações após iniciar o aplicativo
2. Configure um servidor backend (veja [SETUP.md](./SETUP.md) para detalhes)
3. Configure a URL do backend no arquivo `.env`:

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

Veja [SETUP.md](./SETUP.md) para instruções completas de configuração.

## Licença

MIT

