# CondoSmart - Setup Completo
# Este script prepara todo para ejecutar CondoSmart (Backend + Frontend)

$ErrorActionPreference = "Continue"

Clear-Host

Write-Host @"

╔════════════════════════════════════════════════════════════╗
║                                                            ║
║         🚀 CondoSmart - Setup Completo                   ║
║                                                            ║
║  Este script configura Backend + Frontend                ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

Write-Host "¿Qué deseas hacer?`n" -ForegroundColor Yellow
Write-Host "1. Iniciar Backend (Django)"
Write-Host "2. Iniciar Frontend (React)"
Write-Host "3. Iniciar AMBOS (Backend + Frontend)"
Write-Host "4. Solo Backend (sin Frontend)"
Write-Host "5. Ver estado de servicios"
Write-Host "6. Limpiar y resetear`n"

$choice = Read-Host "Opción (1-6)"

switch ($choice) {
    "1" { Start-Backend }
    "2" { Start-Frontend }
    "3" { Start-Both }
    "4" { Start-Backend }
    "5" { Check-Status }
    "6" { Reset-Project }
    default { Write-Host "❌ Opción no válida" -ForegroundColor Red }
}

function Start-Backend {
    Write-Host "`n📌 Iniciando Backend (Django)...`n" -ForegroundColor Cyan
    Set-Location "$PSScriptRoot\CondoSmart-Backend"

    # Verificar si venv existe
    if (-not (Test-Path "venv")) {
        Write-Host "⚠️  Entorno virtual no encontrado" -ForegroundColor Yellow
        Write-Host "📝 Creando entorno virtual...`n" -ForegroundColor Yellow
        & python -m venv venv
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Error creando venv" -ForegroundColor Red
            Write-Host "💡 Instala Python desde python.org" -ForegroundColor Yellow
            return
        }
    }

    # Activar venv
    & ".\venv\Scripts\Activate.ps1"

    # Instalar dependencias
    if (-not (Test-Path "requirements.lock")) {
        Write-Host "📦 Instalando dependencias...`n" -ForegroundColor Yellow
        & pip install -r requirements.txt -q
    }

    # Ejecutar migraciones
    Write-Host "🔄 Ejecutando migraciones...`n" -ForegroundColor Yellow
    & python manage.py migrate --noinput

    # Cargar datos de prueba
    Write-Host "📊 Cargando datos de prueba...`n" -ForegroundColor Yellow
    & python run_seeds.py

    Write-Host "`n✅ Backend listo en http://localhost:8000`n" -ForegroundColor Green
    & python manage.py runserver
}

function Start-Frontend {
    Write-Host "`n📌 Iniciando Frontend (React)...`n" -ForegroundColor Cyan
    Set-Location "$PSScriptRoot\CondoSmart-Frontend"

    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Instalando dependencias npm...`n" -ForegroundColor Yellow
        & npm install --silent
    }

    Write-Host "`n✅ Frontend iniciando en http://localhost:3000`n" -ForegroundColor Green
    & npm start
}

function Start-Both {
    Write-Host "`n🎯 Iniciando Backend + Frontend...`n" -ForegroundColor Cyan

    # Backend en nueva ventana
    Write-Host "📌 Abriendo Backend en nueva ventana...`n" -ForegroundColor Yellow
    $backendCmd = @"
        cd "$PSScriptRoot\CondoSmart-Backend"
        .\venv\Scripts\Activate.ps1
        python manage.py migrate --noinput
        python run_seeds.py
        python manage.py runserver
"@
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd

    # Esperar 5 segundos
    Start-Sleep -Seconds 5

    # Frontend en esta ventana
    Set-Location "$PSScriptRoot\CondoSmart-Frontend"

    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Instalando dependencias npm...`n" -ForegroundColor Yellow
        & npm install --silent
    }

    Write-Host "`n✅ Backend abierto en terminal separada" -ForegroundColor Green
    Write-Host "✅ Frontend iniciando en http://localhost:3000`n" -ForegroundColor Green
    & npm start
}

function Check-Status {
    Write-Host "`n📊 Estado de servicios:`n" -ForegroundColor Cyan

    # Verificar Backend
    $backend = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
    if ($backend) {
        Write-Host "✅ Backend: Corriendo en http://localhost:8000" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend: NO está ejecutándose" -ForegroundColor Red
    }

    # Verificar Frontend
    $frontend = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
    if ($frontend) {
        Write-Host "✅ Frontend: Corriendo en http://localhost:3000" -ForegroundColor Green
    } else {
        Write-Host "❌ Frontend: NO está ejecutándose" -ForegroundColor Red
    }

    Write-Host ""
    Read-Host "Presiona Enter para continuar"
}

function Reset-Project {
    Write-Host "`n⚠️  ADVERTENCIA: Esto borrará node_modules, venv y datos`n" -ForegroundColor Red
    $confirm = Read-Host "¿Continuar? (s/n)"

    if ($confirm -ne "s" -and $confirm -ne "S") {
        return
    }

    Write-Host "`n🗑️  Limpiando Frontend..." -ForegroundColor Yellow
    Set-Location "$PSScriptRoot\CondoSmart-Frontend"
    if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
    if (Test-Path "build") { Remove-Item -Recurse -Force "build" }
    if (Test-Path ".cache") { Remove-Item -Recurse -Force ".cache" }

    Write-Host "🗑️  Limpiando Backend..." -ForegroundColor Yellow
    Set-Location "$PSScriptRoot\CondoSmart-Backend"
    if (Test-Path "venv") { Remove-Item -Recurse -Force "venv" }
    if (Test-Path "__pycache__") { Remove-Item -Recurse -Force "__pycache__" }

    Write-Host "`n✅ Limpieza completada" -ForegroundColor Green
    Write-Host "💡 Ejecuta este script nuevamente para reinstalar" -ForegroundColor Yellow
}

Read-Host "`nPresiona Enter para salir"
