# 🔌 ENDPOINTS API A IMPLEMENTAR

---

## 1️⃣ FOTOS DE USUARIO

### Endpoint 1.1: Subir foto de usuario
```
POST /api/v1/usuarios/{id}/foto/
Content-Type: multipart/form-data

Body:
  - foto: <archivo image>

Response 200:
{
  "photo_key": "usuarios/2/foto_1702754400.jpg",
  "photo_url": "https://condosmart-evidencias.s3.amazonaws.com/usuarios/2/foto_1702754400.jpg",
  "mensaje": "Foto actualizada exitosamente"
}

Response 400:
{
  "error": "El archivo debe ser una imagen (JPG, PNG, GIF)"
}
```

### Endpoint 1.2: Obtener foto de usuario
```
GET /api/v1/usuarios/{id}/foto/

Response 200:
{
  "photo_url": "https://condosmart-evidencias.s3.amazonaws.com/usuarios/2/foto_1702754400.jpg",
  "uploaded_at": "2025-12-16T10:30:00Z"
}

Response 404:
{
  "error": "El usuario no tiene foto"
}
```

---

## 2️⃣ RECONOCIMIENTO FACIAL

### Endpoint 2.1: Verificar facial (con captura de cámara)
```
POST /api/v1/accesos/verificar-facial/
Content-Type: application/json

Body:
{
  "foto_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...",
  "unidad_id": 1
}

Response 200:
{
  "match": true,
  "usuario": {
    "id": 2,
    "username": "alejandro",
    "first_name": "Alejandro",
    "last_name": "López",
    "photo_url": "https://..."
  },
  "confianza": 95.5,
  "permitido": true,
  "mensaje": "Acceso autorizado. Bienvenido Alejandro López"
}

Response 200 (sin match):
{
  "match": false,
  "confianza": 0,
  "permitido": false,
  "mensaje": "No se encontró coincidencia. Acceso denegado."
}

Response 400:
{
  "error": "Foto no proporcionada o formato inválido"
}
```

### Endpoint 2.2: Registrar acceso por facial
```
POST /api/v1/accesos/registrar-acceso/
Content-Type: application/json

Body:
{
  "foto_base64": "data:image/jpeg;base64/...",
  "tipo": "facial",
  "unidad_id": 1
}

Response 201:
{
  "acceso_id": 1234,
  "usuario": "alejandro",
  "tipo": "facial",
  "permitido": true,
  "confianza": 95.5,
  "fecha_hora": "2025-12-16T10:35:42Z",
  "sentido": "in"
}

Response 400:
{
  "error": "No autorizado"
}
```

---

## 3️⃣ RECONOCIMIENTO DE PLACAS

### Endpoint 3.1: Verificar placa
```
POST /api/v1/accesos/verificar-placa/
Content-Type: application/json

Body (Opción 1 - String):
{
  "placa": "ABC-123",
  "unidad_id": 1
}

Body (Opción 2 - Foto para OCR):
{
  "foto_base64": "data:image/jpeg;base64/...",
  "tipo_lectura": "ocr",
  "unidad_id": 1
}

Response 200:
{
  "match": true,
  "vehiculo": {
    "id": 5,
    "placa": "ABC-123",
    "marca": "Toyota",
    "color": "Blanco",
    "responsable": {
      "id": 2,
      "username": "alejandro",
      "first_name": "Alejandro"
    }
  },
  "unidad": {
    "id": 1,
    "code": "101"
  },
  "permitido": true,
  "mensaje": "Vehículo autorizado. Bienvenido Alejandro López"
}

Response 200 (sin match):
{
  "match": false,
  "permitido": false,
  "mensaje": "Placa no registrada. Acceso denegado."
}
```

### Endpoint 3.2: Registrar acceso por placa
```
POST /api/v1/accesos/registrar-acceso/
Content-Type: application/json

Body:
{
  "placa": "ABC-123",
  "tipo": "placa",
  "unidad_id": 1
}

Response 201:
{
  "acceso_id": 1235,
  "vehiculo_placa": "ABC-123",
  "propietario": "alejandro",
  "tipo": "placa",
  "permitido": true,
  "fecha_hora": "2025-12-16T10:36:50Z",
  "sentido": "in"
}
```

---

## 4️⃣ CREAR RESERVA

### Endpoint 4.1: Crear reserva
```
POST /api/v1/reservas/
Content-Type: application/json

Body:
{
  "area_id": 1,
  "unidad_id": 1,
  "start": "2025-12-20T18:00:00Z",
  "end": "2025-12-20T22:00:00Z",
  "notas": "Fiesta de cumpleaños"
}

Response 201:
{
  "id": 42,
  "unidad": {
    "id": 1,
    "code": "101"
  },
  "area": {
    "id": 1,
    "name": "Salón de Eventos",
    "precio_por_hora": 150.00,
    "capacidad": 150,
    "horario_apertura": "08:00:00",
    "horario_cierre": "22:00:00"
  },
  "start": "2025-12-20T18:00:00Z",
  "end": "2025-12-20T22:00:00Z",
  "duracion_horas": 4,
  "costo_total": 600.00,
  "deposito_requerido": 500.00,
  "monto_final": 1100.00,
  "status": "pendiente",
  "notas": "Fiesta de cumpleaños",
  "mensaje": "Reserva creada exitosamente. Por favor confirme su depósito."
}

Response 400:
{
  "error": "El área no está disponible en ese horario",
  "conflictos": [
    {
      "start": "2025-12-20T16:00:00Z",
      "end": "2025-12-20T20:00:00Z"
    }
  ]
}

Response 400:
{
  "error": "El horario solicitado está fuera de los horarios de funcionamiento"
}
```

### Endpoint 4.2: Confirmar reserva
```
POST /api/v1/reservas/{id}/confirmar/
Content-Type: application/json

Body:
{
  "metodo_pago": "transferencia"
}

Response 200:
{
  "id": 42,
  "status": "confirmada",
  "deposito": {
    "id": 8,
    "monto": 500.00,
    "estado": "activo"
  },
  "mensaje": "Reserva confirmada. Su depósito ha sido registrado."
}
```

### Endpoint 4.3: Cancelar reserva
```
DELETE /api/v1/reservas/{id}/
Content-Type: application/json

Response 200:
{
  "id": 42,
  "status": "cancelada",
  "deposito_devuelto": 500.00,
  "mensaje": "Reserva cancelada. Su depósito será devuelto."
}
```

---

## 5️⃣ SOLICITAR MANTENIMIENTO

### Endpoint 5.1: Crear solicitud de mantenimiento
```
POST /api/v1/tickets/
Content-Type: multipart/form-data

Body:
  - tipo: "reparacion"  // mantenimiento, limpieza, reparacion, plagas, jardineria
  - descripcion: "Grieta en la pared del baño"
  - unidad_id: 1
  - fotos: <archivo1.jpg>, <archivo2.jpg>  (múltiple)
  - prioridad: "media"  // baja, media, alta, urgente

Response 201:
{
  "id": 12,
  "unidad": {
    "id": 1,
    "code": "101"
  },
  "tipo": "reparacion",
  "descripcion": "Grieta en la pared del baño",
  "prioridad": "media",
  "estado": "pendiente",
  "fotos": [
    {
      "id": 1,
      "url": "https://condosmart-evidencias.s3.amazonaws.com/tickets/12/foto_1.jpg"
    }
  ],
  "fecha_creacion": "2025-12-16T10:40:00Z",
  "estimado_atencion": "2025-12-17",
  "mensaje": "Solicitud creada exitosamente. Le notificaremos cuando sea atendida."
}

Response 400:
{
  "error": "Debe proporcionar al menos una descripción"
}
```

### Endpoint 5.2: Listar tickets del usuario
```
GET /api/v1/tickets/?unidad_id=1

Response 200:
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 12,
      "tipo": "reparacion",
      "descripcion": "Grieta en la pared...",
      "estado": "pendiente",
      "prioridad": "media",
      "fecha_creacion": "2025-12-16T10:40:00Z",
      "fecha_atencion": null
    },
    ...
  ]
}
```

### Endpoint 5.3: Cambiar estado del ticket (Admin)
```
PATCH /api/v1/tickets/{id}/
Content-Type: application/json

Body:
{
  "estado": "completado",
  "observaciones": "Reparación completada satisfactoriamente"
}

Response 200:
{
  "id": 12,
  "estado": "completado",
  "fecha_atencion": "2025-12-16T14:30:00Z",
  "observaciones": "Reparación completada satisfactoriamente"
}
```

---

## 6️⃣ CONSULTAR DISPONIBILIDAD DE ÁREAS

### Endpoint 6.1: Disponibilidad de área en rango de fechas
```
GET /api/v1/areas/{id}/disponibilidad/?start=2025-12-20T18:00:00Z&end=2025-12-20T22:00:00Z

Response 200:
{
  "area_id": 1,
  "area_name": "Salón de Eventos",
  "disponible": true,
  "horario_operativo": {
    "apertura": "08:00:00",
    "cierre": "22:00:00"
  },
  "conflictos": [],
  "costo_estimado": 600.00
}

Response 200 (conflicto):
{
  "area_id": 1,
  "disponible": false,
  "conflictos": [
    {
      "reserva_id": 40,
      "start": "2025-12-20T18:00:00Z",
      "end": "2025-12-20T20:30:00Z",
      "usuario": "maria.garcia"
    }
  ]
}
```

---

## 📝 IMPLEMENTACIÓN EN VIEWS

### Ubicaciones de código:

1. **Fotos**: `accounts/views.py` → `CustomUserViewSet`
2. **Facial/Placa**: `security/views.py` → `AccesoViewSet` (nuevos @action)
3. **Reservas**: `reservations/views.py` → `ReservaViewSet`
4. **Mantenimiento**: `maintenance/views.py` → `TicketMantenimientoViewSet`

---

## 🎯 Prioridad

1. ✅ **CRÍTICO**: Fotos + Facial + Placa (acceso)
2. ✅ **CRÍTICO**: Crear Reserva
3. ✅ **IMPORTANTE**: Solicitar Mantenimiento
4. ✅ **SOPORTE**: Disponibilidad de áreas

