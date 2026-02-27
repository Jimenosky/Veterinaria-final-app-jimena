# ========================================
# 🚀 INSTALACIÓN COMPLETA DEL PROYECTO
# ========================================

Write-Host "`n🚀 INSTALACIÓN COMPLETA DEL SISTEMA VETERINARIA`n" -ForegroundColor Cyan
Write-Host "Este script instalará todas las dependencias necesarias...`n" -ForegroundColor Yellow

$ErrorActionPreference = "Continue"

# Función para instalar en una carpeta
function Install-Dependencies {
    param($carpeta, $nombre)
    
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
    Write-Host "`n📦 Instalando: $nombre" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor White
    
    if (Test-Path $carpeta) {
        Push-Location $carpeta
        
        if (Test-Path "package.json") {
            Write-Host "Ejecutando npm install en $carpeta..." -ForegroundColor Yellow
            npm install
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "`n✅ $nombre instalado correctamente`n" -ForegroundColor Green
            } else {
                Write-Host "`n❌ Error al instalar $nombre`n" -ForegroundColor Red
            }
        } else {
            Write-Host "⚠️  No se encontró package.json en $carpeta`n" -ForegroundColor Yellow
        }
        
        Pop-Location
    } else {
        Write-Host "❌ No se encontró la carpeta: $carpeta`n" -ForegroundColor Red
    }
}

# Verificar Node.js
Write-Host "🔍 Verificando Node.js..." -ForegroundColor Cyan
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "✅ Node.js detectado: $nodeVersion`n" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js no está instalado!" -ForegroundColor Red
    Write-Host "Por favor instala Node.js desde: https://nodejs.org`n" -ForegroundColor Yellow
    pause
    exit
}

Write-Host "🔍 Verificando npm..." -ForegroundColor Cyan
$npmVersion = npm --version 2>$null
if ($npmVersion) {
    Write-Host "✅ npm detectado: $npmVersion`n" -ForegroundColor Green
} else {
    Write-Host "❌ npm no está instalado!`n" -ForegroundColor Red
    pause
    exit
}

Write-Host "`nIniciando instalación en 3 partes...`n" -ForegroundColor Yellow
Start-Sleep -Seconds 2

# 1. Backend
Install-Dependencies "veterinaria-backend" "Backend API (Node.js + Express)"

# 2. Admin Panel
Install-Dependencies "veterinaria-admin" "Panel Administrativo (React + Vite)"

# 3. App Móvil
Install-Dependencies "App-veterinaria-sin-error-web" "App Móvil (React Native + Expo)"

# Resumen
Write-Host "`n" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
Write-Host "✅ INSTALACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
Write-Host "`n📋 Próximos pasos:`n" -ForegroundColor Cyan

Write-Host "1️⃣  Iniciar Backend:" -ForegroundColor Yellow
Write-Host "   cd veterinaria-backend" -ForegroundColor White
Write-Host "   npm start`n" -ForegroundColor White

Write-Host "2️⃣  Iniciar Admin Panel (otra terminal):" -ForegroundColor Yellow
Write-Host "   cd veterinaria-admin" -ForegroundColor White
Write-Host "   npm run dev`n" -ForegroundColor White

Write-Host "3️⃣  Iniciar App Móvil (otra terminal):" -ForegroundColor Yellow
Write-Host "   cd App-veterinaria-sin-error-web" -ForegroundColor White
Write-Host "   npx expo start`n" -ForegroundColor White

Write-Host "O ejecuta:" -ForegroundColor Cyan
Write-Host "   .\PROBAR_TODO.ps1" -ForegroundColor White
Write-Host "   (inicia las 3 partes automáticamente)`n" -ForegroundColor Gray

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor White

pause
