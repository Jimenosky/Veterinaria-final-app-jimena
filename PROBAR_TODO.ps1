# ========================================
# 🧪 PROBAR TODO EL SISTEMA LOCALMENTE
# ========================================

Write-Host "`n🧪 INICIANDO SISTEMA COMPLETO`n" -ForegroundColor Cyan
Write-Host "Este script abrirá 3 terminales para cada componente...`n" -ForegroundColor Yellow

# Verificar que las dependencias estén instaladas
$faltaBackend = -not (Test-Path "veterinaria-backend\node_modules")
$faltaAdmin = -not (Test-Path "veterinaria-admin\node_modules")
$faltaApp = -not (Test-Path "App-veterinaria-sin-error-web\node_modules")

if ($faltaBackend -or $faltaAdmin -or $faltaApp) {
    Write-Host "⚠️  DEPENDENCIAS NO INSTALADAS`n" -ForegroundColor Yellow
    
    if ($faltaBackend) { Write-Host "❌ Backend: node_modules faltante" -ForegroundColor Red }
    if ($faltaAdmin) { Write-Host "❌ Admin: node_modules faltante" -ForegroundColor Red }
    if ($faltaApp) { Write-Host "❌ App Móvil: node_modules faltante" -ForegroundColor Red }
    
    Write-Host "`nPrimero ejecuta: .\INSTALAR_TODO.ps1`n" -ForegroundColor Yellow
    pause
    exit
}

# Verificar archivos .env
Write-Host "✅ Verificando archivos .env..." -ForegroundColor Cyan

if (-not (Test-Path "veterinaria-backend\.env")) {
    Write-Host "⚠️  veterinaria-backend\.env no existe" -ForegroundColor Yellow
    Write-Host "   Creando desde .env.example..." -ForegroundColor Gray
    Copy-Item "veterinaria-backend\.env.example" "veterinaria-backend\.env"
}

if (-not (Test-Path "veterinaria-admin\.env")) {
    Write-Host "⚠️  veterinaria-admin\.env no existe" -ForegroundColor Yellow
    Write-Host "   Creando desde .env.example..." -ForegroundColor Gray
    Copy-Item "veterinaria-admin\.env.example" "veterinaria-admin\.env"
}

if (-not (Test-Path "App-veterinaria-sin-error-web\.env")) {
    Write-Host "⚠️  App-veterinaria-sin-error-web\.env no existe" -ForegroundColor Yellow
    Write-Host "   Creando desde .env.example..." -ForegroundColor Gray
    Copy-Item "App-veterinaria-sin-error-web\.env.example" "App-veterinaria-sin-error-web\.env"
}

Write-Host "`n✅ Archivos .env verificados`n" -ForegroundColor Green

# Obtener la ruta actual
$currentPath = Get-Location

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
Write-Host "🚀 INICIANDO COMPONENTES..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor White

# 1. Backend
Write-Host "1️⃣  Iniciando Backend API..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$currentPath\veterinaria-backend'; Write-Host '🔧 BACKEND API' -ForegroundColor Cyan; npm start"
Start-Sleep -Seconds 3

# 2. Admin Panel
Write-Host "2️⃣  Iniciando Admin Panel..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$currentPath\veterinaria-admin'; Write-Host '🖥️  ADMIN PANEL' -ForegroundColor Cyan; npm run dev"
Start-Sleep -Seconds 3

# 3. App Móvil
Write-Host "3️⃣  Iniciando App Móvil..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$currentPath\App-veterinaria-sin-error-web'; Write-Host '📱 APP MÓVIL' -ForegroundColor Cyan; npx expo start"

Write-Host "`n" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
Write-Host "✅ TODAS LAS TERMINALES ABIERTAS" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White

Write-Host "`n📋 URLs de acceso:`n" -ForegroundColor Cyan
Write-Host "   🔧 Backend API:  http://localhost:3001" -ForegroundColor White
Write-Host "   🖥️  Admin Panel: http://localhost:5173" -ForegroundColor White
Write-Host "   📱 App Móvil:   http://localhost:8081 (web)" -ForegroundColor White

Write-Host "`n💡 Consejos:" -ForegroundColor Yellow
Write-Host "   • Espera que el backend inicie primero (puede tomar 10-30 seg)" -ForegroundColor Gray
Write-Host "   • El admin se abrirá automáticamente en el navegador" -ForegroundColor Gray
Write-Host "   • Para la app móvil, escanea el QR con Expo Go" -ForegroundColor Gray
Write-Host "   • Usa Ctrl+C en cada terminal para detener" -ForegroundColor Gray

Write-Host "`n🔐 Credenciales de prueba:" -ForegroundColor Cyan
Write-Host "   Admin: admin@gmail.com / Password1!" -ForegroundColor White
Write-Host "   Cliente: cliente@ejemplo.com / cliente123" -ForegroundColor White

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor White

Write-Host "Presiona cualquier tecla para cerrar esta ventana..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
