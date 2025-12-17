# 📋 PLAN DE INTEGRACIÓN COMPLETA - CondoSmart

**Fecha**: 16 de Diciembre 2025
**Estado**: En Planificación
**Objetivo**: Conectar frontend con API real, eliminar mock data, implementar cámara y gestión de fotos

---

## 🔍 ANÁLISIS ACTUAL

### ✅ Tablas Existentes en BD

```
accounts:
  - CustomUser (photo_key para fotos)

housing:
  - Condominio
  - Unidad
  - Residency
  - Vehiculo (placa para reconocimiento)
  - Mascota
  - Contrato

security:
  - Visita (photo_key)
  - Acceso (para registrar in/out)
  - AccesoEvidencia (MODO: manual/face/placa) ⭐
  - Incidente

reservations:
  - AreaComun
  - Suministro
  - Reserva ✅

finance:
  - Cargo
  - Pago
  - etc
```

### ❌ Problemas Identificados

1. **Frontend**: 100% con mock data estático
2. **Fotos de usuarios**: Guardadas en S3, pero no hay endpoint para subirlas
3. **Reconocimiento facial**: No hay integración con cámara
4. **Lectura de placas**: No hay integración con cámara
5. **Crear reservas**: No hay formulario
6. **Solicitar mantenimiento**: No hay endpoint/formulario
7. **AreaComun**: Falta campo de horario, capacidad, precio/hora

---

## 🛠️ PLAN DE ACCIÓN

### FASE 1: COMPLETAR BD (Hoy)

#### 1.1 Actualizar modelo AreaComun
```python
# En reservations/models.py - AreaComun necesita:
- capacidad (IntegerField)
- precio_hora (DecimalField)
- horario_apertura (TimeField)
- horario_cierre (TimeField)
```

#### 1.2 Crear tabla Deposito
```python
# Nueva tabla para gestionar depósitos de reservas
class Deposito(TimeStampedBy):
    reserva = ForeignKey(Reserva)
    estado = CharField(choices=[('activo', 'activo'), ('retenido', 'retenido'), ('devuelto', 'devuelto')])
    monto = DecimalField
    motivo_retencion = TextField (opcional)
```

#### 1.3 Actualizar AccesoEvidencia
```python
# Agregar confianza para facial/placa
confidence = DecimalField(0-100%) ← Para saber qué tan seguro es el match
```

---

### FASE 2: ENDPOINTS BACKEND (API)

#### 2.1 Foto de Usuario - Subir/Descargar
```
POST /api/v1/usuarios/{id}/foto/
  - Recibir archivo image
  - Guardar en S3
  - Actualizar CustomUser.photo_key
  - Return: presigned_url para descargar

GET /api/v1/usuarios/{id}/foto/
  - Retornar presigned_url de S3
```

#### 2.2 Reconocimiento Facial/Placa
```
POST /api/v1/accesos/verificar-facial/
  - Recibir: foto (base64 o file)
  - Comparar con fotos en S3
  - Return: match (bool), usuario_id, confianza (%)

POST /api/v1/accesos/verificar-placa/
  - Recibir: placa (string) o foto (OCR)
  - Buscar Vehiculo
  - Return: vehiculo, permitido (bool)

POST /api/v1/accesos/registrar-acceso/
  - Recibir: tipo (facial/placa/manual), foto
  - Crear Acceso + AccesoEvidencia
  - Return: acceso_id, permitido
```

#### 2.3 Crear Reserva
```
POST /api/v1/reservas/
  - Recibir: area_id, start, end, notas
  - Validar disponibilidad
  - Crear depósito si es necesario
  - Return: reserva + monto total
```

#### 2.4 Solicitar Mantenimiento
```
POST /api/v1/tickets/
  - Recibir: tipo, descripción, fotos
  - Crear TicketMantenimiento
  - Return: ticket_id, estado
```

---

### FASE 3: FRONTEND - Conectar API

#### 3.1 RealizarReservaPage
```jsx
- Input: área, fecha inicio, fecha fin
- Mostrar disponibilidad en calendario
- Botón "Crear Reserva"
- Después: modal de confirmación con monto
```

#### 3.2 ReconocimientoFacialPage
```jsx
- Video stream de cámara ← react-webcam
- Botón "Capturar Foto"
- Enviar a POST /accesos/verificar-facial/
- Mostrar resultado: ✅ Autorizado / ❌ Denegado
- Si coincide: mostrar usuario y permitir entrada
- Guardar en historial de accesos
```

#### 3.3 HistorialAccesosPage
```jsx
- Conectar a GET /api/v1/accesos/?unidad={id}
- Mostrar foto + nombre + método (facial/placa/manual)
- Filtrar por fecha, método, resultado
```

#### 3.4 SolicitudMantenimientoDe
```jsx
- Input: tipo, descripción, fotos (múltiple)
- Botón "Solicitar"
- POST /api/v1/tickets/
- Mostrar confirmación
```

#### 3.5 ConfigurarAreasComunesPage
```jsx
- GET /api/v1/areas/ (conectar API)
- POST /api/v1/areas/ (crear área)
- Campos: nombre, capacidad, precio/hora, horario
- PUT /api/v1/areas/{id}/ (editar)
- DELETE /api/v1/areas/{id}/ (eliminar)
```

---

### FASE 4: LIBRERÍA DE CÁMARA

#### 4.1 Instalar dependencia
```bash
npm install react-webcam
```

#### 4.2 Hook personalizado para cámara
```jsx
// src/hooks/useCamera.js
export const useCamera = () => {
  const webcamRef = useRef(null);
  
  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    return imageSrc; // base64
  };
  
  return { webcamRef, capturePhoto };
};
```

#### 4.3 Componente Webcam reutilizable
```jsx
// src/components/CameraCapture.jsx
const CameraCapture = ({ onCapture, onClose }) => {
  const { webcamRef, capturePhoto } = useCamera();
  
  const handleCapture = () => {
    const photo = capturePhoto();
    onCapture(photo); // enviar a padre
  };
  
  return (
    <Modal isOpen>
      <Webcam ref={webcamRef} />
      <Button onClick={handleCapture}>Capturar</Button>
      <Button onClick={onClose}>Cerrar</Button>
    </Modal>
  );
};
```

---

## 📊 MATRIZ DE CAMBIOS

| Módulo | Cambio | Prioridad | Estimado |
|--------|--------|-----------|----------|
| BD - AreaComun | Agregar campos | 🔴 Alta | 30 min |
| BD - Deposito | Crear tabla | 🔴 Alta | 30 min |
| BD - Seeds | Generar datos | 🔴 Alta | 1 hora |
| API - Fotos | Endpoint upload | 🔴 Alta | 1 hora |
| API - Facial | Endpoint verify | 🔴 Alta | 1.5 horas |
| API - Placa | Endpoint verify | 🔴 Alta | 1 hora |
| API - Reservas | Endpoint crear | 🟡 Media | 1 hora |
| API - Tickets | Endpoint crear | 🟡 Media | 1 hora |
| Frontend - Reservas | Conectar API | 🔴 Alta | 2 horas |
| Frontend - Facial | Webcam + API | 🔴 Alta | 2 horas |
| Frontend - Placa | Webcam + API | 🔴 Alta | 2 horas |
| Frontend - Tickets | Conectar API | 🟡 Media | 1.5 horas |
| **TOTAL** | | | **~16 horas** |

---

## 🎯 PASO A PASO (Comenzamos ya)

### Hoy - Parte 1: BD
1. Actualizar `AreaComun` (agregar campos)
2. Crear tabla `Deposito`
3. Generar inserts SQL

### Hoy - Parte 2: API Endpoints
4. Endpoint foto usuario
5. Endpoint verificación facial
6. Endpoint verificación placa

### Mañana - Parte 1: Frontend Reservas
7. Conectar RealizarReservaPage
8. Crear formulario + calendario

### Mañana - Parte 2: Frontend Facial
9. Integrar react-webcam
10. Conectar con API

### Mañana - Parte 3: Frontend Placa
11. Integrar react-webcam
12. Conectar con API

---

## ✅ CRITERIOS DE ÉXITO

- [ ] Todos los datos en BD (sin mock)
- [ ] Puedo crear reserva desde formulario
- [ ] Puedo verificar usuario por facial desde cámara
- [ ] Puedo verificar vehículo por placa desde cámara
- [ ] Puedo solicitar mantenimiento
- [ ] Historial de accesos muestra datos reales
- [ ] Puedo subir foto de usuario
- [ ] Todo funcionando en localhost

---

¿Empezamos?
