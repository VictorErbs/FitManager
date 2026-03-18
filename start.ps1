# ============================================================
#  FitManager Pro - Script de Inicializacao
#  Uso: Clique com botao direito > "Executar com PowerShell"
#       OU rode: .\start.ps1 no terminal
# ============================================================

Write-Host ""
Write-Host "  ___  _ _  __  __                                   " -ForegroundColor Green
Write-Host " |  _|| | ||  \/  | __ _  _ _   __ _  __ _  ___  _ " -ForegroundColor Green
Write-Host " | |  | | || |\/| |/ _  || ' \ / _  |/ _  ||/ _ \| |" -ForegroundColor Green
Write-Host " |_|  |___||_|  |_|\__,_||_||_|\__,_|\__, ||_| |_|_|" -ForegroundColor Green
Write-Host "                                      |___/          " -ForegroundColor Green
Write-Host ""
Write-Host "  Iniciando FitManager Pro..." -ForegroundColor Cyan
Write-Host ""

# Java 17 (instalado pelo VS Code)
$env:JAVA_HOME = "C:\Users\victor.erbs\AppData\Local\Programs\Eclipse Adoptium\jdk-17.0.18.8-hotspot"

$backendPath = "$PSScriptRoot\backend"

# Verifica se o backend existe
if (-not (Test-Path "$backendPath\pom.xml")) {
    Write-Host "  [ERRO] Pasta 'backend' nao encontrada!" -ForegroundColor Red
    Read-Host "  Pressione Enter para sair"
    exit 1
}

Write-Host "  [1/3] Sincronizando frontend..." -ForegroundColor Yellow
robocopy "$PSScriptRoot\frontend" "$PSScriptRoot\backend\src\main\resources\static" /E /NJH /NJS /NC /NFL | Out-Null
Write-Host "        Frontend sincronizado!" -ForegroundColor Gray
Write-Host ""

Write-Host "  [2/3] Iniciando servidor Java (Spring Boot)..." -ForegroundColor Yellow
Write-Host "        Acesse: http://localhost:8080" -ForegroundColor Gray
Write-Host ""

# Abre o backend em uma nova janela do PowerShell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:JAVA_HOME='$env:JAVA_HOME'; Set-Location '$backendPath'; .\mvnw.cmd spring-boot:run"

Write-Host "  [2/2] Aguardando servidor iniciar (15 segundos)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host ""
Write-Host "  Abrindo o FitManager Pro no navegador!" -ForegroundColor Green
Start-Process "http://localhost:8080/index.html"

Write-Host ""
Write-Host "  Sistema iniciado com sucesso!" -ForegroundColor Green
Write-Host "  Painel: http://localhost:8080/dashboard.html" -ForegroundColor Cyan
Write-Host "  Alunos: http://localhost:8080/students.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Para parar o servidor, feche a janela do Java." -ForegroundColor Gray
Write-Host ""
