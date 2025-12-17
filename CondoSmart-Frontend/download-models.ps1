# Script para descargar modelos de face-api.js
Write-Host "Descargando modelos de face-api.js..." -ForegroundColor Green

# Crear directorio de modelos
$modelsDir = "public\models"
if (-not (Test-Path $modelsDir)) {
    New-Item -ItemType Directory -Path $modelsDir -Force | Out-Null
}

# URL base
$baseUrl = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/models"

# Modelos necesarios
$models = @(
    "tiny_face_detector_model-weights_manifest.json",
    "tiny_face_detector_model-shard1",
    "face_landmark_68_model-weights_manifest.json",
    "face_landmark_68_model-shard1",
    "face_recognition_model-weights_manifest.json",
    "face_recognition_model-shard1",
    "face_recognition_model-shard2",
    "face_expression_model-weights_manifest.json",
    "face_expression_model-shard1"
)

foreach ($model in $models) {
    $url = "$baseUrl/$model"
    $output = "$modelsDir\$model"
    
    Write-Host "Descargando $model..." -ForegroundColor Yellow
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $output
        Write-Host "OK $model descargado" -ForegroundColor Green
    } catch {
        Write-Host "ERROR descargando $model" -ForegroundColor Red
    }
}

Write-Host "Modelos descargados exitosamente!" -ForegroundColor Green
Write-Host "Ubicacion: $modelsDir" -ForegroundColor Cyan
