#!/usr/bin/env node

/**
 * Script para iniciar Backend e Frontend automaticamente
 * Uso: node start.js
 */

const { spawn } = require('child_process');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Verificar se estamos na raiz do projeto
if (!fs.existsSync('package.json') || !fs.existsSync('backend')) {
  log('❌ Execute este script na raiz do projeto!', 'red');
  process.exit(1);
}

// Verificar Node.js
exec('node --version', (error) => {
  if (error) {
    log('❌ Node.js não encontrado!', 'red');
    process.exit(1);
  }
});

log('🚀 Iniciando B2B Lead Generator...', 'blue');
log('');

// Instalar dependências se necessário
if (!fs.existsSync('node_modules')) {
  log('📦 Instalando dependências do frontend...', 'yellow');
  exec('npm install', (error) => {
    if (error) {
      log('❌ Erro ao instalar dependências do frontend', 'red');
    }
  });
}

if (!fs.existsSync('backend/node_modules')) {
  log('📦 Instalando dependências do backend...', 'yellow');
  exec('cd backend && npm install', (error) => {
    if (error) {
      log('❌ Erro ao instalar dependências do backend', 'red');
    }
  });
}

// Verificar .env
if (!fs.existsSync('backend/.env')) {
  log('⚠️  Arquivo .env não encontrado!', 'yellow');
  log('📝 Execute: cd backend && ./configure-env.sh', 'yellow');
}

log('');
log('✅ Iniciando servidores...', 'green');
log('');

let backendProcess;
let frontendProcess;

// Iniciar Backend
log('🔧 Iniciando Backend (porta 3001)...', 'blue');
backendProcess = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true,
});

// Aguardar um pouco e iniciar Frontend
setTimeout(() => {
  log('🎨 Iniciando Frontend (porta 5173)...', 'blue');
  frontendProcess = spawn('npm', ['run', 'dev:vite'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true,
  });
}, 3000);

// Aguardar e abrir navegador
setTimeout(() => {
  log('');
  log('✅ Servidores iniciados!', 'green');
  log('');
  log('🌐 Frontend: http://localhost:5173', 'blue');
  log('🔧 Backend:  http://localhost:3001', 'blue');
  log('📚 API Docs: http://localhost:3001/api-docs', 'blue');
  log('');
  
  // Abrir navegador
  const platform = process.platform;
  let openCommand;
  
  if (platform === 'darwin') {
    openCommand = 'open';
  } else if (platform === 'win32') {
    openCommand = 'start';
  } else {
    openCommand = 'xdg-open';
  }
  
  exec(`${openCommand} http://localhost:5173`, (error) => {
    if (error) {
      log('⚠️  Não foi possível abrir o navegador automaticamente', 'yellow');
      log('   Acesse manualmente: http://localhost:5173', 'yellow');
    }
  });
  
  log('💡 Para parar, pressione Ctrl+C', 'yellow');
  log('');
}, 8000);

// Limpar ao sair
process.on('SIGINT', () => {
  log('');
  log('🛑 Parando servidores...', 'yellow');
  if (backendProcess) backendProcess.kill();
  if (frontendProcess) frontendProcess.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  if (backendProcess) backendProcess.kill();
  if (frontendProcess) frontendProcess.kill();
  process.exit(0);
});

