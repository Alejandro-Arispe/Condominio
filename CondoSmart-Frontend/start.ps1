# CondoSmart Frontend - Iniciar Servidor de Desarrollo
# Este script inicia el frontend en http://localhost:3000

Write-Host @"

╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          🚀 CondoSmart Frontend - Dev Server              ║
║                                                            ║
║  Iniciando servidor en http://localhost:3000              ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

# Cambiar a directorio del script
Set-Location $PSScriptRoot

# Verificar si existen node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  npm dependencies no están instaladas." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📝 Instalando dependencias... (esto puede tomar algunos minutos)" -ForegroundColor Yellow
    Write-Host ""
    
    & npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
        Write-Host ""
        Read-Host "Presiona Enter para salir"
        exit 1
    }
}

# Iniciar el servidor
Write-Host ""
Write-Host "✅ Iniciando servidor de desarrollo..." -ForegroundColor Green
Write-Host ""
Write-Host "📍 Abre tu navegador en: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Credenciales de prueba:" -ForegroundColor Yellow
Write-Host "  Usuario: admin@condosmart.com"
Write-Host "  Contraseña: admin123"
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

# Ejecutar npm start
& npm start
