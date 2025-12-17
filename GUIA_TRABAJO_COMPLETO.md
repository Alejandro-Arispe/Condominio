# 🚀 GUÍA COMPLETA - INTEGRACIÓN Y REFACTORING

**Fecha Inicio**: 16 de Diciembre 2025
**Estado**: Planificación Detallada Completada
**Objetivo Final**: CondoSmart 100% Operativo con Datos Reales

---

## 📚 DOCUMENTOS CREADOS

1. ✅ `PLAN_INTEGRACION_COMPLETA.md` - Plan general
2. ✅ `MIGRACIONES_Y_DATOS.md` - BD y SQL
3. ✅ `ENDPOINTS_API.md` - Especificación de endpoints
4. ✅ `INTEGRACION_WEBCAM.md` - Cámara y componentes
5. ✅ `GUIA_TRABAJO_COMPLETO.md` - Este documento

---

## 🎯 ROADMAP DE IMPLEMENTACIÓN

### FASE 1: Base de Datos (HOY - 1-2 horas)

**✅ COMPLETADO:**
- [x] Actualizar modelo `AreaComun` (agregar capacidad, precio, horario)
- [x] Crear modelo `Deposito` (para gestionar depósitos de reservas)

**❌ PENDIENTE:**
```bash
# Ejecutar en terminal backend
cd d:\Documents\SI2\0-MESA\condominio\CondoSmart-Backend

# 1. Generar migraciones
python manage.py makemigrations reservations

# 2. Aplicar migraciones
python manage.py migrate reservations

# 3. Verificar que funcionó
python manage.py shell
>>> from reservations.models import AreaComun, Deposito
>>> AreaComun.objects.count()
```

**Luego:** Ejecutar SQL inserts desde `MIGRACIONES_Y_DATOS.md`

---

### FASE 2: API Backend (1.5-2 días)

#### 2.1 Endpoint de Fotos
**Archivo**: `accounts/views.py` → Agregar a `CustomUserViewSet`

```python
@action(detail=True, methods=['post'])
def upload_foto(self, request, pk=None):
    """POST /api/v1/usuarios/{id}/upload_foto/"""
    # Upload to S3, save photo_key
    # Return presigned_url

@action(detail=True, methods=['get'])
def get_foto(self, request, pk=None):
    """GET /api/v1/usuarios/{id}/get_foto/"""
    # Return presigned_url
```

**Estimado**: 1.5 horas

---

#### 2.2 Endpoints de Seguridad (Facial/Placa)
**Archivo**: `security/views.py` → Agregar a `AccesoViewSet`

```python
@action(detail=False, methods=['post'])
def verificar_facial(self, request):
    """POST /api/v1/accesos/verificar_facial/"""
    # foto_base64 → Comparar con fotos en S3
    # Return match, usuario, confianza

@action(detail=False, methods=['post'])
def verificar_placa(self, request):
    """POST /api/v1/accesos/verificar_placa/"""
    # placa o foto → OCR
    # Return vehiculo, permitido

@action(detail=False, methods=['post'])
def registrar_acceso(self, request):
    """POST /api/v1/accesos/registrar_acceso/"""
    # Crear Acceso + AccesoEvidencia
    # Return acceso_id, permitido
```

**Estimado**: 2.5 horas

---

#### 2.3 Endpoint de Reservas
**Archivo**: `reservations/views.py` → Actualizar `ReservaViewSet`

```python
@action(detail=True, methods=['post'])
def confirmar(self, request, pk=None):
    """POST /api/v1/reservas/{id}/confirmar/"""
    # Crear Deposito
    # Cambiar status a 'confirmada'

@action(detail=True, methods=['post'])
def cancelar(self, request, pk=None):
    """POST /api/v1/reservas/{id}/cancelar/"""
    # Devolver Deposito
    # Cambiar status a 'cancelada'

def create(self, request, *args, **kwargs):
    # Validar disponibilidad
    # Calcular costo
    # Crear Deposito si es necesario
```

**Estimado**: 2 horas

---

#### 2.4 Endpoint de Tickets/Mantenimiento
**Archivo**: `maintenance/views.py` → Actualizar `TicketMantenimientoViewSet`

```python
def create(self, request, *args, **kwargs):
    """POST /api/v1/tickets/"""
    # Recibir tipo, descripción, fotos
    # Guardar fotos en S3
    # Crear ticket con estado 'pendiente'
    
# Agregar campos faltantes al modelo si es necesario:
# - prioridad: baja, media, alta, urgente
# - fotos: ManyToMany o ImageField múltiple
```

**Estimado**: 1.5 horas

---

### FASE 3: Frontend - Instalación (1-2 horas)

```bash
# 1. Instalar react-webcam
cd d:\Documents\SI2\0-MESA\condominio\CondoSmart-Frontend
npm install react-webcam

# 2. Crear archivos de componentes
# src/hooks/useCamera.js
# src/components/camera/CameraCapture.jsx
# src/components/camera/PlateCapture.jsx
```

**Archivos ya disponibles en**: `INTEGRACION_WEBCAM.md`

---

### FASE 4: Frontend - Integración (2-3 días)

#### 4.1 RealizarReservaPage - Crear Reserva
**Cambios Necesarios:**
```jsx
// ANTES: Mock data estático
// DESPUÉS:
- GET /api/v1/areas/ → Llenar select
- Calendario real
- POST /api/v1/reservas/ → Crear
- Validar disponibilidad
- Mostrar costo total
- Confirmar depósito
```

**Estimado**: 2 horas

---

#### 4.2 ReconocimientoFacialPage - Integrar Cámara
**Cambios Necesarios:**
```jsx
// ANTES: Tabla estática con datos mock
// DESPUÉS:
- Importar CameraCapture
- Botón "Iniciar Verificación" → abre cámara
- POST /api/v1/accesos/verificar_facial/ → enviar foto
- POST /api/v1/accesos/registrar_acceso/ → crear acceso
- Mostrar resultado (✅ Autorizado / ❌ Denegado)
- Guardar en historial
```

**Estimado**: 2 horas

---

#### 4.3 HistorialAccesosPage - Conectar API
**Cambios Necesarios:**
```jsx
// ANTES: Mock data
// DESPUÉS:
- GET /api/v1/accesos/ → Cargar datos reales
- Mostrar foto de usuario/vehículo
- Filtros funcionales
- Estadísticas calculadas desde datos
```

**Estimado**: 1.5 horas

---

#### 4.4 ConfigurarAreasComunesPage - CRUD Real
**Cambios Necesarios:**
```jsx
// ANTES: Tabla mock
// DESPUÉS:
- GET /api/v1/areas/ → Cargar áreas
- POST /api/v1/areas/ → Crear
- PUT /api/v1/areas/{id}/ → Editar
- DELETE /api/v1/areas/{id}/ → Eliminar
- Campos: nombre, capacidad, precio/hora, horario
```

**Estimado**: 2 horas

---

#### 4.5 MantenimientoPage - Solicitar Mantenimiento
**Cambios Necesarios:**
```jsx
// ANTES: No existe
// DESPUÉS:
- Formulario con tipo, descripción
- Carga múltiple de fotos
- POST /api/v1/tickets/ → Crear
- GET /api/v1/tickets/ → Listar
- Estados actualizados en tiempo real
```

**Estimado**: 2 horas

---

#### 4.6 GestionarDepositosPage - Conectar API
**Cambios Necesarios:**
```jsx
// ANTES: Mock data
// DESPUÉS:
- GET /api/v1/depositos/ → Cargar
- Filtrar por estado (activo, retenido, devuelto)
- Mostrar monto y motivo retención
- Botón para devolver depósito
```

**Estimado**: 1.5 horas

---

### FASE 5: Testing (1-2 horas)

**Checklist:**
```
[ ] Crear reserva desde formulario
[ ] Verificar facial desde cámara
[ ] Verificar placa desde cámara
[ ] Historial actualiza con accesos
[ ] Solicitar mantenimiento
[ ] Subir foto de usuario
[ ] Editar áreas comunes
[ ] Gestionar depósitos
[ ] Sin errores en console
[ ] API responde correctamente
```

---

## 📊 RESUMEN DE HORAS

| Fase | Componente | Horas | Estado |
|------|-----------|-------|--------|
| 1 | BD + Migraciones | 1.5 | 🟡 Casi |
| 2.1 | Endpoint Fotos | 1.5 | ⚪ Pendiente |
| 2.2 | Endpoint Facial/Placa | 2.5 | ⚪ Pendiente |
| 2.3 | Endpoint Reservas | 2 | ⚪ Pendiente |
| 2.4 | Endpoint Tickets | 1.5 | ⚪ Pendiente |
| 3 | Instalación Frontend | 1.5 | ⚪ Pendiente |
| 4.1 | Reservas UI | 2 | ⚪ Pendiente |
| 4.2 | Facial UI | 2 | ⚪ Pendiente |
| 4.3 | Historial Accesos UI | 1.5 | ⚪ Pendiente |
| 4.4 | Áreas Comunes UI | 2 | ⚪ Pendiente |
| 4.5 | Mantenimiento UI | 2 | ⚪ Pendiente |
| 4.6 | Depósitos UI | 1.5 | ⚪ Pendiente |
| 5 | Testing | 2 | ⚪ Pendiente |
| **TOTAL** | | **22 horas** | |

---

## 🚀 CÓMO EMPEZAR

### Opción 1: Hacerlo tú mismo
1. Lee `PLAN_INTEGRACION_COMPLETA.md`
2. Ejecuta pasos de migración BD
3. Copia código de `ENDPOINTS_API.md` en views.py
4. Conecta frontend según `INTEGRACION_WEBCAM.md`

### Opción 2: Que yo lo haga
1. Dime dónde empezar (Backend o Frontend)
2. Dime si tienes prisa (acelerar o hacer bien)
3. Voy creando paso a paso

### Opción 3: Combinado
1. Yo hago backend
2. Tú haces frontend
3. Nos coordinamos

---

## 🔗 ENLACES RÁPIDOS

```
📄 Documentos:
- PLAN_INTEGRACION_COMPLETA.md
- MIGRACIONES_Y_DATOS.md
- ENDPOINTS_API.md
- INTEGRACION_WEBCAM.md

🔌 Dependencias:
- Backend: django-storages (ya instalado)
- Frontend: react-webcam (instalar)

🎯 Prioridades:
1. BD + Migraciones
2. API Fotos + Facial + Placa
3. Frontend Reservas
4. Frontend Facial
```

---

## ✅ CRITERIOS DE ÉXITO

Al final tendremos:

- ✅ BD actualizada con todos los datos
- ✅ Fotos de usuario en S3
- ✅ Verificación facial por cámara
- ✅ Verificación de placas por cámara
- ✅ Crear reservas con confirmación
- ✅ Solicitar mantenimiento con fotos
- ✅ Gestionar depósitos (retener/devolver)
- ✅ Historial de accesos actualizado
- ✅ Áreas comunes con CRUD
- ✅ **CERO mock data**
- ✅ Todo funcionando en localhost

---

## 💬 PRÓXIMO PASO

¿Por dónde empezamos?

**Opciones:**
1. 🏢 Backend primero (API completa)
2. 🎨 Frontend primero (UI luego conectamos)
3. 🤝 Simultáneo (yo backend, tú frontend)

**Avísame cuál prefieres y comenzamos ya! 🚀**

