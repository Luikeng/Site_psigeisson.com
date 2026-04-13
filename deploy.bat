@echo off
echo ===================================================
echo Iniciando processo de upload e deploy para o GitHub...
echo ===================================================

:: Verifica se o git esta instalado
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Git nao encontrado! Por favor, instale o Git para Windows.
    pause
    exit /b 1
)

:: Verifica se e um repositorio git, se nao for, inicializa e configura
if not exist ".git" (
    echo [!] Repositorio Git nao encontrado na pasta. Inicializando e configurando...
    git init
    git remote add origin https://github.com/luikeng/Site_psigeisson.com.git
    git branch -M main
)

:: Adiciona todos os arquivos modificados e novos
echo [1/3] Preparando arquivos...
git add .

:: Faz o commit. O redirecionamento oculta a mensagem de erro caso nao haja nada para commitar
echo [2/3] Criando commit...
git commit -m "Deploy automatico via script bat" >nul 2>&1

:: Forca o push para a branch main do repositorio remoto
echo [3/3] Forcando envio para o GitHub...
git push origin main --force

if %errorlevel% equ 0 (
    echo ===================================================
    echo SUCESSO! Arquivos enviados para o GitHub.
    echo O GitHub Actions iniciara o deploy automaticamente.
    echo O site estara atualizado em 1 a 2 minutos no link:
    echo https://luikeng.github.io/Site_psigeisson.com/
    echo ===================================================
) else (
    echo ===================================================
    echo ERRO: Falha ao enviar para o GitHub.
    echo Verifique se voce tem permissao para enviar para este repositorio.
    echo ===================================================
)

pause
