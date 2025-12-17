# 🏢 CondoSmart - Sistema Inteligente de Gestión de Condominios

Sistema integral de administración de condominios con funcionalidades avanzadas de IA, desarrollado con Django REST Framework y React.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Funcionalidades](#funcionalidades)
- [API Endpoints](#api-endpoints)
- [Credenciales de Prueba](#credenciales-de-prueba)

## ✨ Características

### Gestión Administrativa
- ✅ Gestión de unidades habitacionales y residentes
- ✅ Control de ocupantes y vehículos
- ✅ Administración de mascotas
- ✅ Gestión de usuarios y roles

### Finanzas
- ✅ Generación automática de expensas
- ✅ Configuración personalizada de cargos
- ✅ Registro de pagos
- ✅ **Pago en línea con tarjeta** (simulado)
- ✅ Recordatorios automáticos de vencimiento
- ✅ Reportes financieros con gráficos

### Seguridad con IA
- ✅ **Reconocimiento facial en tiempo real** (TensorFlow.js)
- ✅ **Reconocimiento de placas vehiculares** (OCR)
- ✅ **Detección de anomalías** (comportamientos sospechosos)
- ✅ Control de accesos
- ✅ Gestión de incidentes

### Reservas y Servicios
- ✅ Reserva de áreas comunes
- ✅ Configuración de disponibilidad
- ✅ Gestión de mantenimiento
- ✅ Seguimiento de tickets

### Comunicación
- ✅ Publicación de comunicados
- ✅ **Notificaciones Push en tiempo real**
- ✅ Historial de avisos

### Reportes y Analítica
- ✅ **Dashboard principal con KPIs**
- ✅ Reportes financieros, ocupación, mantenimiento, seguridad
- ✅ **Exportar a PDF y Excel**
- ✅ Gráficos interactivos (Recharts)
- ✅ **Analítica predictiva de morosidad** (IA)

## 🛠 Tecnologías

### Backend
- Python 3.10+
- Django 4.2
- Django REST Framework
- PostgreSQL / SQLite
- JWT Authentication

### Frontend
- React 18
- React Router v6
- Axios
- Recharts (gráficos)
- TensorFlow.js + face-api.js (IA)
- jsPDF (exportar PDF)
- Tailwind CSS

## 📦 Requisitos Previos

- Python 3.10 o superior
- Node.js 16 o superior
- npm o yarn
- Git

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd Condominio
```

### 2. Configurar Backend

```bash
cd CondoSmart-Backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
.\venv\Scripts\Activate.ps1
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Crear base de datos y aplicar migraciones
python manage.py makemigrations
python manage.py migrate

# Cargar datos de prueba
python manage.py seed_data

# Crear superusuario (opcional)
python manage.py createsuperuser
```

### 3. Configurar Frontend

```bash
cd ../CondoSmart-Frontend

# Instalar dependencias
npm install
```

## ⚙️ Configuración

### Backend (.env)

Crear archivo `.env` en `CondoSmart-Backend/`:

```env
SECRET_KEY=tu-secret-key-aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Frontend

El frontend ya está configurado para conectarse a `http://localhost:8000/api/v1/`

## ▶️ Ejecución

### Iniciar Backend

```bash
cd CondoSmart-Backend
.\venv\Scripts\Activate.ps1  # Windows
python manage.py runserver
```

El backend estará disponible en: `http://localhost:8000`

### Iniciar Frontend

```bash
cd CondoSmart-Frontend
npm start
```

El frontend estará disponible en: `http://localhost:3000` o `http://localhost:3001`

## 📁 Estructura del Proyecto

```
Condominio/
├── CondoSmart-Backend/
│   ├── apps/
│   │   ├── accounts/          # Usuarios y autenticación
│   │   ├── housing/           # Unidades, ocupantes, vehículos
│   │   ├── finance/           # Cargos, pagos, expensas
│   │   ├── security/          # Accesos, incidentes, visitas
│   │   ├── maintenance/       # Tickets de mantenimiento
│   │   ├── reservations/      # Reservas de áreas comunes
│   │   └── communications/    # Comunicados
│   ├── config/                # Configuración Django
│   └── manage.py
│
└── CondoSmart-Frontend/
    ├── src/
    │   ├── components/        # Componentes reutilizables
    │   ├── pages/            # Páginas de la aplicación
    │   ├── services/         # Servicios API
    │   ├── context/          # Context API (Auth, Notifications)
    │   └── utils/            # Utilidades (exportar PDF, etc.)
    └── public/
```

## 🎯 Funcionalidades

### Dashboard Principal
- KPIs en tiempo real (unidades, residentes, finanzas, alertas)
- Gráficos de tendencias financieras
- Distribución de gastos
- Actividad reciente
- Accesos rápidos

### Reconocimiento Facial (IA Real)
1. Ir a `/reconocimiento`
2. Permitir acceso a la cámara
3. Click en "Iniciar Escaneo"
4. El sistema detectará rostros automáticamente
5. Muestra 68 puntos faciales y expresiones

### Pago en Línea
1. Ir a `/pago-en-linea`
2. Seleccionar cargo pendiente
3. Ingresar datos de tarjeta
4. Procesar pago (simulado 3 segundos)
5. Recibir notificación push de confirmación

### Exportar Reportes
1. Ir a `/reportes`
2. Seleccionar tipo de reporte
3. Click en "PDF" o "Excel"
4. El archivo se descarga automáticamente

### Notificaciones Push
- Se generan automáticamente cada 30 segundos
- Aparecen en la esquina superior derecha
- Se auto-cierran después de 10 segundos
- Tipos: info, success, warning, error

## 📡 API Endpoints

### Autenticación
```
POST /api/v1/auth/login/          # Login
POST /api/v1/auth/register/       # Registro
POST /api/v1/auth/refresh/        # Refresh token
```

### Usuarios
```
GET    /api/v1/usuarios/          # Listar usuarios
POST   /api/v1/usuarios/          # Crear usuario
GET    /api/v1/usuarios/{id}/     # Detalle usuario
PUT    /api/v1/usuarios/{id}/     # Actualizar usuario
DELETE /api/v1/usuarios/{id}/     # Eliminar usuario
```

### Finanzas
```
GET    /api/v1/cargos/            # Listar cargos
POST   /api/v1/cargos/            # Crear cargo
GET    /api/v1/pagos/             # Listar pagos
POST   /api/v1/pagos/             # Registrar pago
POST   /api/v1/generar-expensas/  # Generar expensas automáticas
POST   /api/v1/enviar-recordatorios/ # Enviar recordatorios
```

### Seguridad
```
GET    /api/v1/accesos/           # Listar accesos
POST   /api/v1/accesos/           # Registrar acceso
GET    /api/v1/incidentes/        # Listar incidentes
POST   /api/v1/incidentes/        # Reportar incidente
```

### Vivienda
```
GET    /api/v1/unidades/          # Listar unidades
GET    /api/v1/ocupantes/         # Listar ocupantes
GET    /api/v1/vehiculos/         # Listar vehículos
GET    /api/v1/mascotas/          # Listar mascotas
```

## 🔑 Credenciales de Prueba

### Administrador
- **Email:** admin@condosmart.com
- **Usuario:** admin
- **Contraseña:** admin123

### Usuario Regular
- **Email:** user@example.com
- **Contraseña:** user123

## 🧪 Datos de Prueba

El comando `python manage.py seed_data` crea:
- 1 condominio
- 10 unidades
- 15 ocupantes
- 8 vehículos
- 5 mascotas
- 20 cargos
- 10 pagos
- 5 reservas
- 3 incidentes
- 10 accesos

## 🐛 Solución de Problemas

### Error de CORS
Si ves errores de CORS, verifica que el frontend esté en la lista de `CORS_ALLOWED_ORIGINS` en `settings.py`

### Error 401 Unauthorized
Asegúrate de estar autenticado. Ve a `/login` e inicia sesión.

### Reconocimiento facial no funciona
1. Verifica que permitiste acceso a la cámara
2. Refresca la página (F5)
3. Verifica la consola del navegador para errores

### Base de datos bloqueada (SQLite)
Si usas SQLite y ves "database is locked":
```bash
python manage.py migrate --run-syncdb
```

## 📝 Notas Importantes

- El reconocimiento facial usa TensorFlow.js y se ejecuta en el navegador
- Los modelos de IA se cargan desde CDN automáticamente
- La pasarela de pago es una simulación (no procesa pagos reales)
- Las notificaciones push son simuladas (no requieren servicio externo)
- Los reportes PDF/Excel se generan en el cliente

## 👥 Autor

Desarrollado como proyecto académico para Sistemas de Información II - UAGRM FICCT

## 📄 Licencia

Este proyecto es de uso académico.
