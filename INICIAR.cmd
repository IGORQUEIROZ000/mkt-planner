@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Instale o Node.js LTS e execute este arquivo novamente.
  pause
  exit /b 1
)
if exist dist\index.html goto servir
where pnpm >nul 2>nul
if errorlevel 1 (
  echo Este projeto usa pnpm. Execute: npm install -g pnpm
  echo Depois abra este arquivo novamente.
  pause
  exit /b 1
)
if not exist node_modules (
  call pnpm install
  if errorlevel 1 goto falha
)
call pnpm build
if errorlevel 1 goto falha
:servir
echo Abra http://127.0.0.1:4173 no navegador. Mantenha esta janela aberta.
node servir.mjs
exit /b
:falha
echo Nao foi possivel iniciar. Veja a mensagem acima e o README.md.
pause
