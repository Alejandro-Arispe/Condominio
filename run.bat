@echo off
REM CondoSmart - Setup Completo
REM Este script prepara todo para ejecutar CondoSmart (Backend + Frontend)

chcp 65001 >nul
cls

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║         🚀 CondoSmart - Setup Completo                   ║
echo ║                                                            ║
echo ║  Este script configura Backend + Frontend                ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo ¿Qué deseas hacer?
echo.
echo 1. Iniciar Backend (Django)
echo 2. Iniciar Frontend (React)
echo 3. Iniciar AMBOS (Backend + Frontend)
echo 4. Solo Backend (sin Frontend)
echo 5. Ver estado de servicios
echo 6. Limpiar y resetear
echo.

set /p choice="Opción (1-6): "

if "%choice%"=="1" goto backend_only
if "%choice%"=="2" goto frontend_only
if "%choice%"=="3" goto both
if "%choice%"=="4" goto backend_only
if "%choice%"=="5" goto status
if "%choice%"=="6" goto reset

echo ❌ Opción no válida
goto end

:backend_only
echo.
echo 📌 Iniciando Backend (Django)...
echo.
cd /d "%~dp0CondoSmart-Backend"

REM Verificar si venv existe
if not exist "venv" (
    echo ⚠️  Entorno virtual no encontrado
    echo 📝 Creando entorno virtual...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo ❌ Error creando venv
        echo 💡 Instala Python desde python.org
        goto end
    )
)

REM Activar venv
call venv\Scripts\activate.bat

REM Instalar dependencias si es necesario
if not exist "requirements.lock" (
    echo 📦 Instalando dependencias...
    pip install -r requirements.txt -q
)

REM Ejecutar migraciones
echo 🔄 Ejecutando migraciones...
python manage.py migrate --noinput

REM Cargar datos de prueba si no existen
echo 📊 Cargando datos de prueba...
python run_seeds.py

echo.
echo ✅ Backend listo en http://localhost:8000
echo.
python manage.py runserver

goto end

:frontend_only
echo.
echo 📌 Iniciando Frontend (React)...
echo.
cd /d "%~dp0CondoSmart-Frontend"

if not exist "node_modules" (
    echo 📦 Instalando dependencias npm...
    call npm install -q
)

echo.
echo ✅ Frontend iniciando en http://localhost:3000
echo.
call npm start

goto end

:both
echo.
echo 🎯 Iniciando Backend + Frontend...
echo.

REM Backend en una ventana
echo 📌 Abriendo Backend en nueva ventana...
start cmd /k "cd /d %~dp0CondoSmart-Backend && call venv\Scripts\activate.bat && python manage.py migrate --noinput && python run_seeds.py && python manage.py runserver"

REM Esperar 5 segundos
timeout /t 5

REM Frontend en esta ventana
cd /d "%~dp0CondoSmart-Frontend"

if not exist "node_modules" (
    echo 📦 Instalando dependencias npm...
    call npm install -q
)

echo.
echo ✅ Backend abierto en terminal separada
echo ✅ Frontend iniciando en http://localhost:3000
echo.
call npm start

goto end

:status
echo.
echo 📊 Estado de servicios:
echo.

REM Verificar Backend
netstat -ano | find ":8000" >nul
if %errorlevel%==0 (
    echo ✅ Backend: Corriendo en http://localhost:8000
) else (
    echo ❌ Backend: NO está ejecutándose
)

REM Verificar Frontend
netstat -ano | find ":3000" >nul
if %errorlevel%==0 (
    echo ✅ Frontend: Corriendo en http://localhost:3000
) else (
    echo ❌ Frontend: NO está ejecutándose
)

echo.
pause
goto end

:reset
echo.
echo ⚠️  ADVERTENCIA: Esto borrará node_modules, venv y datos
echo.
set /p confirm="¿Continuar? (s/n): "

if /i not "%confirm%"=="s" goto end

echo.
echo 🗑️  Limpiando Frontend...
cd /d "%~dp0CondoSmart-Frontend"
if exist "node_modules" rmdir /s /q node_modules 2>nul
if exist "build" rmdir /s /q build 2>nul
if exist ".cache" rmdir /s /q .cache 2>nul

echo 🗑️  Limpiando Backend...
cd /d "%~dp0CondoSmart-Backend"
if exist "venv" rmdir /s /q venv 2>nul
if exist "__pycache__" rmdir /s /q __pycache__ 2>nul

echo ✅ Limpieza completada
echo 💡 Ejecuta este script nuevamente para reinstalar

goto end

:end
echo.
pause
