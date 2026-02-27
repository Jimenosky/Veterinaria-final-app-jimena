# 🔍 Script de Verificación Pre-GitHub

Write-Host "`n🔍 VERIFICACIÓN PRE-GITHUB`n" -ForegroundColor Cyan
Write-Host "Verificando que todo esté listo para subir al repositorio...`n" -ForegroundColor Yellow

$errores = 0
$advertencias = 0

# Función para mensaje de éxito
function Write-Success {
    param($mensaje)
    Write-Host "✅ $mensaje" -ForegroundColor Green
}

# Función para mensaje de error
function Write-Error-Custom {
    param($mensaje)
    Write-Host "❌ $mensaje" -ForegroundColor Red
    $script:errores++
}

# Función para mensaje de advertencia
function Write-Warning-Custom {
    param($mensaje)
    Write-Host "⚠️  $mensaje" -ForegroundColor Yellow
    $script:advertencias++
}

# === VERIFICACIÓN 1: Archivos .gitignore ===
Write-Host "1️⃣ Verificando archivos .gitignore..." -ForegroundColor Cyan

$gitignoresPaths = @(
    ".gitignore",
    "veterinaria-backend\.gitignore",
    "veterinaria-admin\.gitignore",
    "App-veterinaria-sin-error-web\.gitignore"
)

foreach ($path in $gitignoresPaths) {
    if (Test-Path $path) {
        Write-Success "$path existe"
        
        # Verificar que contenga .env
        $content = Get-Content $path -Raw
        if ($content -match "\.env") {
            Write-Success "$path incluye .env"
        } else {
            Write-Error-Custom "$path NO incluye .env (CRÍTICO)"
        }
    } else {
        Write-Error-Custom "$path NO existe"
    }
}

Write-Host ""

# === VERIFICACIÓN 2: Archivos .env.example ===
Write-Host "2️⃣ Verificando archivos .env.example..." -ForegroundColor Cyan

$envExamplePaths = @(
    "veterinaria-backend\.env.example",
    "veterinaria-admin\.env.example",
    "App-veterinaria-sin-error-web\.env.example"
)

foreach ($path in $envExamplePaths) {
    if (Test-Path $path) {
        Write-Success "$path existe"
    } else {
        Write-Error-Custom "$path NO existe"
    }
}

Write-Host ""

# === VERIFICACIÓN 3: Archivos .env (NO deben existir en git) ===
Write-Host "3️⃣ Verificando que archivos .env NO estén trackeados..." -ForegroundColor Cyan

$envPaths = @(
    "veterinaria-backend\.env",
    "veterinaria-admin\.env",
    "App-veterinaria-sin-error-web\.env",
    ".env"
)

$envEncontrados = @()

foreach ($path in $envPaths) {
    if (Test-Path $path) {
        $envEncontrados += $path
        
        # Verificar si está en git
        $gitStatus = git ls-files $path 2>$null
        if ($gitStatus) {
            Write-Error-Custom "$path está en el repositorio! (CRÍTICO - NO subir)"
        } else {
            Write-Success "$path existe localmente pero NO está trackeado por git (correcto)"
        }
    }
}

if ($envEncontrados.Count -eq 0) {
    Write-Warning-Custom "No se encontraron archivos .env locales (necesitarás crearlos)"
}

Write-Host ""

# === VERIFICACIÓN 4: node_modules ===
Write-Host "4️⃣ Verificando node_modules..." -ForegroundColor Cyan

$nodeModulesPaths = @(
    "veterinaria-backend\node_modules",
    "veterinaria-admin\node_modules",
    "App-veterinaria-sin-error-web\node_modules"
)

foreach ($path in $nodeModulesPaths) {
    if (Test-Path $path) {
        # Verificar si está en git
        $gitStatus = git ls-files $path 2>$null
        if ($gitStatus) {
            Write-Error-Custom "$path está en el repositorio! (node_modules no debe subirse)"
        } else {
            Write-Success "$path NO está trackeado (correcto)"
        }
    }
}

Write-Host ""

# === VERIFICACIÓN 5: Archivos de documentación ===
Write-Host "5️⃣ Verificando documentación..." -ForegroundColor Cyan

$docsPaths = @(
    "README.md",
    "RESUMEN_CAMBIOS.md",
    "MIGRACION_URLS.md",
    "GUIA_GITHUB_NUEVO_REPO.md",
    "GUIA_RENDER_NETLIFY.md"
)

foreach ($path in $docsPaths) {
    if (Test-Path $path) {
        Write-Success "$path existe"
    } else {
        Write-Warning-Custom "$path NO encontrado"
    }
}

Write-Host ""

# === VERIFICACIÓN 6: package.json ===
Write-Host "6️⃣ Verificando package.json..." -ForegroundColor Cyan

$packageJsonPaths = @(
    "veterinaria-backend\package.json",
    "veterinaria-admin\package.json",
    "App-veterinaria-sin-error-web\package.json"
)

foreach ($path in $packageJsonPaths) {
    if (Test-Path $path) {
        Write-Success "$path existe"
        
        # Verificar que tenga dependencies
        $content = Get-Content $path -Raw | ConvertFrom-Json
        if ($content.dependencies) {
            Write-Success "$path tiene dependencias configuradas"
        } else {
            Write-Warning-Custom "$path NO tiene dependencias"
        }
    } else {
        Write-Error-Custom "$path NO existe"
    }
}

Write-Host ""

# === VERIFICACIÓN 7: Git status ===
Write-Host "7️⃣ Verificando estado de Git..." -ForegroundColor Cyan

if (Test-Path ".git") {
    Write-Success "Repositorio Git inicializado"
    
    # Verificar que no haya archivos .env en staging
    $stagedFiles = git diff --cached --name-only 2>$null
    
    $envStaged = $stagedFiles | Where-Object { $_ -match "\.env$" -and $_ -notmatch "\.env\.example$" }
    
    if ($envStaged) {
        Write-Error-Custom "Archivos .env en staging area! Ejecuta: git reset HEAD *.env"
        foreach ($file in $envStaged) {
            Write-Host "   - $file" -ForegroundColor Red
        }
    } else {
        Write-Success "No hay archivos .env en staging (correcto)"
    }
} else {
    Write-Warning-Custom "Git no inicializado. Ejecuta: git init"
}

Write-Host ""

# === RESUMEN ===
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor White
Write-Host "`n📊 RESUMEN DE VERIFICACIÓN`n" -ForegroundColor Cyan

if ($errores -eq 0 -and $advertencias -eq 0) {
    Write-Host "🎉 PERFECTO! Todo está listo para subir a GitHub" -ForegroundColor Green
    Write-Host "`nPróximos pasos:" -ForegroundColor Yellow
    Write-Host "1. git add ." -ForegroundColor White
    Write-Host "2. git commit -m '🎉 Versión inicial'" -ForegroundColor White
    Write-Host "3. git remote add origin https://github.com/Jimenosky/TU-REPO.git" -ForegroundColor White
    Write-Host "4. git push -u origin main" -ForegroundColor White
} elseif ($errores -eq 0) {
    Write-Host "⚠️  HAY $advertencias ADVERTENCIAS" -ForegroundColor Yellow
    Write-Host "`nPuedes continuar, pero revisa las advertencias." -ForegroundColor Yellow
} else {
    Write-Host "❌ HAY $errores ERRORES CRÍTICOS" -ForegroundColor Red
    Write-Host "`n⚠️  NO SUBAS A GITHUB hasta corregir los errores" -ForegroundColor Red
    Write-Host "`nEspecialmente si hay archivos .env en el repositorio!" -ForegroundColor Red
}

if ($advertencias -gt 0) {
    Write-Host "`n📋 Advertencias: $advertencias" -ForegroundColor Yellow
}

if ($errores -gt 0) {
    Write-Host "❌ Errores: $errores" -ForegroundColor Red
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor White

# Pausa
Write-Host "Presiona cualquier tecla para salir..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
