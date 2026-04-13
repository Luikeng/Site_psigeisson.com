@echo off
setlocal enabledelayedexpansion
cls
echo ======================================================
echo    GERENCIADOR DE DEPLOY - ARTE MENTAL
echo ======================================================
echo.

:: 1. VERIFICA SE O GIT ESTA INSTALADO
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] O Git nao esta instalado. 
    echo Por favor, instale em: https://git-scm.com/
    pause
    exit /b
)

:: 2. INICIALIZACAO E CONFIGURACAO DO REPOSITORIO
if not exist ".git" (
    echo [1/4] Inicializando repositorio local...
    git init
    git branch -M main
    git remote add origin https://github.com/Luikeng/Site_Arte_Mental.git
) else (
    echo [1/4] Repositorio ja inicializado. Verificando conexao...
    :: Garante que o remote origin aponte para o lugar certo
    git remote remove origin >nul 2>&1
    git remote add origin https://github.com/Luikeng/Site_Arte_Mental.git
    git branch -M main
)

:: 3. ADICIONAR ARQUIVOS
echo [2/4] Preparando arquivos para envio...
git add .

:: 4. CRIAR O COMMIT (MENSAGEM)
echo.
set /p msg="[3/4] O que voce mudou? (ex: novos icones): "
if "%msg%"=="" set msg="Atualizacao via script"
git commit -m "%msg%"

:: 5. ENVIAR PARA O GITHUB
echo.
echo [4/4] Enviando para o GitHub...
echo (Pode ser que uma janela de login apareca agora)
echo.

:: Tenta o envio normal primeiro
git push origin main

:: 6. SE FALHAR, OFERECE O ENVIO FORCADO
if %errorlevel% neq 0 (
    echo.
    echo ------------------------------------------------------
    echo [AVISO] O envio falhou. Isso geralmente acontece se 
    echo o GitHub tiver arquivos que voce nao tem no seu PC.
    echo ------------------------------------------------------
    echo.
    set /p force="Deseja FORCAR o envio para resolver? (S/N): "
    if /i "!force!"=="S" (
        echo [INFO] Forcando sincronizacao...
        git push -f origin main
    ) else (
        echo [INFO] Envio cancelado. Tente rodar o script novamente.
    )
)

echo.
echo ======================================================
echo    PROCESSO FINALIZADO!
echo    Verifique seu site em alguns minutos.
echo ======================================================
pause
