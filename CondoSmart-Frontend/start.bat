@echo off
REM CondoSmart Frontend - Iniciar Servidor de Desarrollo
REM Este script inicia el frontend en http://localhost:3000

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║          🚀 CondoSmart Frontend - Dev Server              ║
echo ║                                                            ║
echo ║  Iniciando servidor en http://localhost:3000              ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Cambiar a directorio del frontend
cd /d "%~dp0"

REM Verificar si existen node_modules
if not exist "node_modules" (
    echo.
    echo ⚠️  npm dependencies no están instaladas.
    echo.
    echo 📝 Instalando dependencias... (esto puede tomar algunos minutos)
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo ❌ Error instalando dependencias
        echo.
        pause
        exit /b 1
    )
)

REM Iniciar el servidor
echo.
echo ✅ Iniciando servidor de desarrollo...
echo.
echo 📍 Abre tu navegador en: http://localhost:3000
echo.
echo Credenciales de prueba:
echo   Usuario: admin@condosmart.com
echo   Contraseña: admin123
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

REM Ejecutar npm start
call npm start

pause
