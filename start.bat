@echo off
REM Script para iniciar Backend e Frontend automaticamente (Windows)
REM Uso: start.bat

echo.
echo 🚀 Iniciando B2B Lead Generator...
echo.

REM Verificar se Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js não encontrado. Instale Node.js primeiro.
    pause
    exit /b 1
)

REM Verificar dependências
if not exist "node_modules" (
    echo 📦 Instalando dependências do frontend...
    call npm install
)

if not exist "backend\node_modules" (
    echo 📦 Instalando dependências do backend...
    cd backend
    call npm install
    cd ..
)

REM Verificar .env
if not exist "backend\.env" (
    echo ⚠️  Arquivo .env não encontrado no backend!
    echo 📝 Criando arquivo .env...
    cd backend
    call configure-env.sh
    cd ..
    echo.
    echo ⚠️  IMPORTANTE: Configure suas API keys em backend\.env antes de continuar!
    pause
)

echo.
echo ✅ Tudo pronto!
echo.
echo 🔧 Iniciando Backend e Frontend...
echo.

REM Iniciar Backend em nova janela
start "B2B Lead Generator - Backend" cmd /k "cd backend && npm run dev"

REM Aguardar backend iniciar
timeout /t 5 /nobreak >nul

REM Iniciar Frontend em nova janela
start "B2B Lead Generator - Frontend" cmd /k "npm run dev:vite"

REM Aguardar frontend iniciar
timeout /t 8 /nobreak >nul

echo.
echo ✅ Servidores iniciados!
echo.
echo 🌐 Frontend: http://localhost:5173
echo 🔧 Backend:  http://localhost:3001
echo 📚 API Docs: http://localhost:3001/api-docs
echo.

REM Abrir navegador
start http://localhost:5173

echo 💡 Os servidores estão rodando em janelas separadas.
echo    Feche as janelas ou pressione Ctrl+C para parar.
echo.
pause

