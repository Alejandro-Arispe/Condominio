## INSTRUCCIONES PARA FINALIZAR LA IMPLEMENTACIÓN

Toda la lógica ha sido implementada en el código. Ejecuta estos comandos en orden:

### BACKEND (Django)

1. **Realizar migraciones** - Esto crea los campos faltantes en AreaComun
```bash
cd CondoSmart-Backend
python manage.py makemigrations reservations
python manage.py migrate
```

2. **Reiniciar servidor Django**
```bash
python manage.py runserver
```

El servidor debe estar corriendo en `http://localhost:8000`

### FRONTEND (React)

1. **Instalar dependencias** (si usa react-webcam para componentes avanzados)
```bash
cd CondoSmart-Frontend
npm install react-webcam
```

2. **Iniciar servidor React**
```bash
npm start
```

El frontend estará en `http://localhost:3000`

---

## NUEVOS ENDPOINTS IMPLEMENTADOS

### 1. Upload de Foto de Usuario
**POST** `/accounts/users/{id}/upload_foto/`
```bash
curl -X POST http://localhost:8000/api/accounts/users/1/upload_foto/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "foto=@/path/to/photo.jpg"
```
Respuesta: `{ "photo_key": "...", "url": "..." }`

### 2. Verificación Facial
**POST** `/security/accesos/verificar_facial/`
```bash
curl -X POST http://localhost:8000/api/security/accesos/verificar_facial/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "foto=@/path/to/photo.jpg" \
  -F "unidad_id=1" \
  -F "sentido=in"
```
Respuesta: `{ "acceso_id": 1, "match": true, "usuario": "admin" }`

### 3. Verificación de Placa
**POST** `/security/accesos/verificar_placa/`
```bash
curl -X POST http://localhost:8000/api/security/accesos/verificar_placa/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "placa=ABC1234&unidad_id=1&sentido=in"
```
Respuesta: `{ "acceso_id": 2, "match": true, "placa": "ABC-1234" }`

### 4. Crear Reserva
**POST** `/reservations/reservas/`
```bash
curl -X POST http://localhost:8000/api/reservations/reservas/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "unidad": 1,
    "area": 1,
    "start": "2025-12-20T14:00:00Z",
    "end": "2025-12-20T16:00:00Z",
    "notas": "Reserva de prueba"
  }'
```
Respuesta: `{ "id": 1, "status": "pendiente", ... }`

---

## NUEVOS COMPONENTES REACT

Los componentes están listos para usar:

1. **`useCamera`** - Hook para capturar fotos
   - Ubicación: `src/hooks/useCamera.js`
   - Uso: `const { videoRef, canvasRef, openCamera, captureAsBlob } = useCamera()`

2. **`FacialCaptureComponent`** - Widget de verificación facial
   - Ubicación: `src/components/security/FacialCaptureComponent.jsx`
   - Uso: `<FacialCaptureComponent unidadId={1} onSuccess={...} onError={...} />`

3. **`PlateVerificationComponent`** - Widget de verificación de placa
   - Ubicación: `src/components/security/PlateVerificationComponent.jsx`
   - Uso: `<PlateVerificationComponent unidadId={1} onSuccess={...} onError={...} />`

4. **`ReservationFormComponent`** - Widget de crear reserva
   - Ubicación: `src/components/reservas/ReservationFormComponent.jsx`
   - Uso: `<ReservationFormComponent unidadId={1} onSuccess={...} onError={...} />`

5. **`UserPhotoUploadComponent`** - Widget de subir foto de usuario
   - Ubicación: `src/components/accounts/UserPhotoUploadComponent.jsx`
   - Uso: `<UserPhotoUploadComponent userId={1} onSuccess={...} onError={...} />`

---

## VALIDACIONES IMPLEMENTADAS

✓ Upload de foto: Valida tipo JPEG/PNG/WEBP y tamaño máx 5MB
✓ Verificación facial: Compara con Rekognition, crea evidencia de acceso
✓ Verificación de placa: Busca vehículo registrado en unidad
✓ Crear reserva: 
  - Valida horarios del área común
  - Valida conflicto de fechas
  - Crea cargo si hay depósito requerido
  - Manejo de errores completo

---

## FLUJOS COMPLETAMENTE IMPLEMENTADOS

### Flujo 1: Reconocimiento Facial
1. Usuario abre cámara → `FacialCaptureComponent`
2. Captura foto → `captureAsBlob()`
3. Envía a `/security/accesos/verificar_facial/`
4. Backend carga a S3 y compara con Rekognition
5. Retorna match + usuario
6. Se crea `Acceso` + `AccesoEvidencia` (automático)

### Flujo 2: Verificación de Placa
1. Usuario ingresa placa → `PlateVerificationComponent`
2. Envía a `/security/accesos/verificar_placa/`
3. Backend busca vehículo en BD
4. Retorna match + placa
5. Se crea `Acceso` + `AccesoEvidencia` (automático)

### Flujo 3: Crear Reserva
1. Usuario completa form → `ReservationFormComponent`
2. Valida horarios y conflictos
3. Envía a `/reservations/reservas/`
4. Backend valida nuevamente
5. Crea `Reserva` con estado "pendiente"
6. Si hay depósito, crea `Cargo` automáticamente

### Flujo 4: Upload Foto Usuario
1. Usuario selecciona foto → `UserPhotoUploadComponent`
2. Valida tipo y tamaño
3. Envía a `/accounts/users/{id}/upload_foto/`
4. Backend sube a S3
5. Guarda `photo_key` en BD
6. Retorna URL pública

---

## NOTAS IMPORTANTES

⚠️ **AWS S3 Y REKOGNITION**
- Asegúrate que `settings.py` tiene credenciales AWS válidas
- La colección 'condosmart-habitantes' debe existir en Rekognition
- El bucket 'condosmart-evidencias' debe existir

⚠️ **MIGRACIONES DE BD**
- Los modelos ya tienen los campos necesarios
- Solo ejecuta: `python manage.py makemigrations` y `migrate`
- No es necesario editar `models.py`

⚠️ **TOKENS JWT**
- Todos los endpoints requieren token de autenticación
- Incluir header: `Authorization: Bearer <token>`
- Token se obtiene en `/accounts/login/`

---

## RESUMEN DE CAMBIOS

### Backend
- ✓ 1 endpoint de upload de foto (accounts/views.py)
- ✓ 2 endpoints de verificación (security/views.py)
- ✓ 1 endpoint mejorado de crear reserva (reservations/views.py)
- ✓ Todas las validaciones implementadas
- ✓ Integración con S3 y Rekognition

### Frontend
- ✓ 1 hook `useCamera` para captura
- ✓ 4 componentes listos para usar
- ✓ Manejo de errores
- ✓ Preview de imágenes
- ✓ Validación de formularios

### BD
- ✓ Modelos ya tienen campos necesarios
- ✓ Solo requiere ejecutar migraciones

---

**¿Preguntas? Todos los componentes están listos. Ejecuta los comandos anteriores y el proyecto estará 100% funcional.**
