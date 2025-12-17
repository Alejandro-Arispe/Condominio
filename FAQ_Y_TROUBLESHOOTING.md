# ❓ PREGUNTAS FRECUENTES Y TROUBLESHOOTING

---

## 🔧 CONFIGURACIÓN Y SETUP

### P: ¿Por dónde empiezo?
**R**: Abre `RESUMEN_EJECUTIVO.md` y escoge una de las 3 opciones (Opción 1, 2 o 3)

---

### P: ¿Necesito tener el backend y frontend corriendo?
**R**: Sí, ambos deben estar corriendo:
```
Backend: python manage.py runserver 0.0.0.0:8000
Frontend: npm start (puerto 3000)
```

---

### P: ¿Qué versiones de Python y Node necesito?
**R**: 
- Python: 3.8+
- Node: 14+
- npm: 6+

Verifica:
```
python --version
node --version
npm --version
```

---

### P: ¿Cómo instalo react-webcam?
**R**: 
```bash
cd CondoSmart-Frontend
npm install react-webcam
```

Verifica que se instaló:
```bash
npm list react-webcam
```

---

## 💾 BASE DE DATOS

### P: ¿Cómo ejecuto las migraciones?
**R**: 
```bash
cd CondoSmart-Backend

# 1. Generar migraciones
python manage.py makemigrations reservations

# 2. Aplicar migraciones
python manage.py migrate reservations

# 3. Verificar (opcional)
python manage.py showmigrations reservations
```

---

### P: ¿Dónde ejecuto los SQL inserts?
**R**: En pgAdmin:
1. Abre pgAdmin en http://localhost:5050
2. Conecta a tu BD
3. Abre Query Tool
4. Copia SQL de `MIGRACIONES_Y_DATOS.md`
5. Ejecuta

O en terminal:
```bash
psql -h localhost -U postgres -d condosmart < inserts.sql
```

---

### P: ¿Qué datos de ejemplo necesito?
**R**: Están en `MIGRACIONES_Y_DATOS.md`:
- 1 Condominio
- 4 Áreas Comunes
- 3 Usuarios
- 2 Residencias
- 2 Vehículos
- 1 Reserva
- Depósitos automáticos

---

### P: ¿Se pierden datos si ejecuto migraciones?
**R**: No. Las migraciones solo **AGREGAN** tablas/campos, no eliminan datos.

Para revertir (solo en desarrollo):
```bash
python manage.py migrate reservations zero
```

---

## 🔌 ENDPOINTS API

### P: ¿Cómo pruebo un endpoint?
**R**: Usa Postman o Insomnia:

```
POST http://localhost:8000/api/v1/usuarios/2/upload_foto/
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

Body:
  foto: <archivo.jpg>
```

O en curl:
```bash
curl -X POST http://localhost:8000/api/v1/accesos/verificar_facial/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"foto_base64": "...", "unidad_id": 1}'
```

---

### P: ¿Cómo obtengo el token?
**R**: Login primero:
```
POST /api/v1/token/
{
  "username": "alejandro",
  "password": "123456"
}
```

Respuesta:
```json
{
  "access": "eyJ0eXAi...",
  "refresh": "eyJ0eXAi..."
}
```

Luego usa el `access` token en headers.

---

### P: ¿Qué significa error 400, 401, 404, 500?
**R**:
- **400**: Datos inválidos (falta un campo, formato incorrecto)
- **401**: No autorizado (sin token o token expirado)
- **404**: No encontrado (recurso no existe)
- **500**: Error del servidor (bug en el código)

---

## 🎥 CÁMARA Y FOTOS

### P: ¿Por qué no funciona la cámara?
**R**: Posibles causas:
1. No tienes HTTPS (solo localhost funciona)
2. Permiso de cámara no otorgado
3. Navegador no compatible

Soluciones:
```javascript
// Verifica si webcam está disponible
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => console.log('Cámara OK'))
  .catch(err => console.error('Error:', err))
```

---

### P: ¿En qué navegadores funciona?
**R**: 
- ✅ Chrome (mejor)
- ✅ Edge
- ✅ Firefox
- ⚠️ Safari (parcial)
- ❌ Internet Explorer

---

### P: ¿Cómo capturo foto en base64?
**R**: 
```javascript
import Webcam from 'react-webcam';

const webcamRef = useRef(null);
const photo = webcamRef.current.getScreenshot(); // Returns base64
console.log(photo); // data:image/jpeg;base64,...
```

---

### P: ¿Qué resolución máxima puede tener la foto?
**R**: 
```javascript
const videoConstraints = {
  width: { ideal: 1280 },
  height: { ideal: 720 },
  facingMode: "user"
};
```

Obtiene aprox. 200-300KB por foto en base64.

---

## 🖼️ IMÁGENES Y S3

### P: ¿Dónde se guardan las fotos?
**R**: En AWS S3, bucket: `condosmart-evidencias`

Ruta:
- Usuarios: `usuarios/{user_id}/foto_{timestamp}.jpg`
- Accesos: `accesos/{acceso_id}/{modo}_{evidence_id}.jpg`

---

### P: ¿Necesito credenciales de AWS?
**R**: Sí, en `.env` del backend:
```
AWS_ACCESS_KEY_ID=tu_key
AWS_SECRET_ACCESS_KEY=tu_secret
AWS_STORAGE_BUCKET_NAME=condosmart-evidencias
AWS_S3_REGION_NAME=us-east-2
```

---

### P: ¿Cómo descargo una foto de S3?
**R**: 
```python
from core.services import get_presigned_url

url = get_presigned_url("usuarios/2/foto_1234.jpg", expires_in=3600)
# URL válida por 1 hora
```

---

## 📝 CÓDIGO Y DESARROLLO

### P: ¿Dónde debo pegar el código de endpoints?
**R**: 

**Fotos** → `accounts/views.py` en `CustomUserViewSet`  
**Facial/Placa** → `security/views.py` en `AccesoViewSet`  
**Reservas** → `reservations/views.py` en `ReservaViewSet`

---

### P: ¿Necesito importar algo?
**R**: Sí, en el top de cada archivo:

```python
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
# Etc...
```

Todo está incluido en `CODIGO_ENDPOINTS.md`

---

### P: ¿Cómo importo el componente CameraCapture?
**R**: 
```jsx
import CameraCapture from '../components/camera/CameraCapture';

// En tu componente
<CameraCapture 
  isOpen={showCamera}
  onClose={() => setShowCamera(false)}
  onCapture={handlePhotoCapture}
  title="Capturar Foto"
  facingMode="user"
/>
```

---

## 🧪 TESTING

### P: ¿Cómo sé si todo funciona?
**R**: Checklist:

Backend:
```bash
# ¿Servidor corriendo?
curl http://localhost:8000/api/v1/health/

# ¿Endpoints disponibles?
curl http://localhost:8000/api/v1/usuarios/2/upload_foto/ \
  -H "Authorization: Bearer TOKEN"
```

Frontend:
```bash
# ¿App carga?
http://localhost:3000

# ¿Cámara funciona?
Abre ReconocimientoFacialPage → Capturar Foto
```

---

### P: ¿Cómo debugueo errores?
**R**: 

Backend:
```python
# Agregar print en views.py
print(f"DEBUG: {variable}")

# Ver en terminal donde corre Django
```

Frontend:
```javascript
// Abrir DevTools
F12 → Console → Ver errores

console.log("DEBUG:", variable);
```

---

## ⚠️ ERRORES COMUNES

### Error: "ModuleNotFoundError: No module named 'reservations'"
**Solución**: 
```bash
cd CondoSmart-Backend
python manage.py makemigrations reservations
```

---

### Error: "django.core.exceptions.ImproperlyConfigured"
**Solución**: 
Reinicia el servidor:
```bash
python manage.py runserver 0.0.0.0:8000
```

---

### Error: "Cannot read properties of undefined"
**Solución**: 
```jsx
// Agrega validación
if (webcamRef.current) {
  const photo = webcamRef.current.getScreenshot();
}
```

---

### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Solución**: 
Ya está configurado en `settings.py`:
```python
CORS_ALLOW_ALL_ORIGINS = True
```

Si aún no funciona, reinicia el servidor.

---

### Error: "Token expired"
**Solución**:
```javascript
// Frontend detecta token expirado automáticamente
// Hace refresh automático
// Si no funciona:
1. Haz logout
2. Haz login de nuevo
```

---

## 🔒 SEGURIDAD

### P: ¿Es seguro guardar tokens en localStorage?
**R**: Para desarrollo, sí. Para producción:
- Usa cookies con HttpOnly
- Configura CSRF
- Usa HTTPS

---

### P: ¿Las fotos en S3 son privadas?
**R**: Depende. Actualmente son:
- Generadas con presigned URLs (válidas por 1 hora)
- Solo accesibles quién tiene el URL
- No públicas

Cambiar según necesidad en `core/services.py`

---

## 📊 PERFORMANCE

### P: ¿Qué tamaño máximo de foto soporta?
**R**: 
- Recomendado: < 500KB
- Máximo en código: 5MB
- Base64 es ineficiente para fotos grandes

Solución: Comprimir antes de enviar

```javascript
// Comprimir foto
const canvas = document.createElement('canvas');
canvas.width = 640;
canvas.height = 480;
// ... dibujar y comprimir ...
```

---

### P: ¿Cuántas reservas simultáneas puede manejar?
**R**: 
- BD: 10,000+ sin problema
- API: Depende del servidor
- Frontend: Sin límites

En localhost: Pruebas normales, sin problema

---

## 🚀 DEPLOYMENT

### P: ¿Cómo depliego a producción?
**R**: 

Backend:
```bash
# En servidor remoto
git pull
python manage.py migrate
python manage.py collectstatic
gunicorn condoSmart.wsgi
```

Frontend:
```bash
npm run build
# Copiar carpeta 'build' a servidor web
```

---

### P: ¿Necesito SSL para fotos?
**R**: Sí, para producción:
- Cámara necesita HTTPS
- S3 requiere HTTPS
- JWT debe ser por HTTPS

Usar Let's Encrypt gratis: `certbot`

---

## 📞 SOPORTE

### P: ¿Qué hacer si nada funciona?
**R**: 

1. Verifica que todo está corriendo:
   ```
   Backend: http://localhost:8000/api/v1/health/
   Frontend: http://localhost:3000
   BD: pgAdmin en http://localhost:5050
   ```

2. Revisa logs:
   ```
   Backend: Terminal donde corre Django
   Frontend: DevTools (F12)
   DB: pgAdmin
   ```

3. Reinicia todo:
   ```
   Kill procesos
   npm start (frontend)
   python manage.py runserver (backend)
   ```

4. Borra caché:
   ```
   Frontend: Ctrl+Shift+Del en Chrome
   Backend: Reinicia servidor
   ```

5. Contacta soporte con:
   - Mensaje de error exacto
   - Screenshot de DevTools
   - Qué intentabas hacer

---

## ✅ CHECKLIST DE VALIDACIÓN

- [ ] Backend corriendo en 8000
- [ ] Frontend corriendo en 3000
- [ ] BD conectada y migrada
- [ ] Datos de ejemplo insertados
- [ ] Endpoints respondiendo
- [ ] Cámara funcionando
- [ ] Fotos guardándose en S3
- [ ] Tokens validos
- [ ] Sin errores en console

---

**¿Más preguntas?**  
Revisa los documentos:
- `GUIA_TRABAJO_COMPLETO.md`
- `ENDPOINTS_API.md`
- `CODIGO_ENDPOINTS.md`

