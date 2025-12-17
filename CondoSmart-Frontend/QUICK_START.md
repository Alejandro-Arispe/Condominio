# 🚀 CondoSmart Frontend - Quick Start

## Inicio Rápido en 3 Pasos

### ✅ Opción 1: Windows (Más fácil)

```batch
# Abre PowerShell en la carpeta del frontend y ejecuta:
.\start.ps1
```

O simplemente haz doble clic en `start.bat`

### ✅ Opción 2: Línea de Comandos

```bash
# Navega al frontend
cd CondoSmart-Frontend

# Instala dependencias (primera vez)
npm install

# Inicia el servidor
npm start
```

### ✅ Opción 3: Si npm no funciona

```bash
# Usa el servidor alternativo
node start-dev-server.js
```

---

## 📍 Acceso

Una vez iniciado, el frontend estará disponible en:

```
🌐 http://localhost:3000
```

### Credenciales de Prueba

```
👤 Usuario:     admin@condosmart.com
🔐 Contraseña:  admin123
```

---

## ⚙️ Requisitos Previos

- **Node.js 16+** → [Descargar](https://nodejs.org)
- **npm 8+** → Incluido con Node.js
- **Backend en ejecución** → http://localhost:8000

---

## 🔄 Backend Setup (Django)

Si aún no has iniciado el backend:

```bash
# Navega al backend
cd CondoSmart-Backend

# Instala dependencias
pip install -r requirements.txt

# Ejecuta migraciones
python manage.py migrate

# Carga datos de prueba (opcional)
python run_seeds.py

# Inicia el servidor
python manage.py runserver
```

El backend estará en: `http://localhost:8000`

---

## 🛠️ Solución de Problemas

### ❌ Error: "Puerto 3000 ya está en uso"

```bash
# Opción 1: Matar el proceso en el puerto 3000
# En PowerShell (como Admin):
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force

# Opción 2: Usar otro puerto
PORT=3001 npm start
```

### ❌ Error: "npm: comando no encontrado"

Node.js no está instalado. [Descargalo aquí](https://nodejs.org)

### ❌ Error: "No se puede conectar al backend"

1. Verifica que Django esté corriendo: `http://localhost:8000`
2. Revisa que `.env.local` tenga el URL correcto:
   ```
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```
3. Reinicia ambos servidores

### ❌ La página de login no funciona

1. Verifica credenciales:
   - Usuario: `admin@condosmart.com`
   - Contraseña: `admin123`
2. Si el backend está vacío, ejecuta: `python run_seeds.py`
3. Revisa la consola del navegador (F12) para errores

---

## 📂 Estructura del Proyecto

```
CondoSmart-Frontend/
├── public/
│   ├── index.html           # Página principal
│   └── favicon.ico
├── src/
│   ├── components/          # 10 componentes reutilizables
│   ├── pages/              # 19 páginas por módulo
│   ├── services/           # Servicios API
│   ├── context/            # AuthContext
│   ├── utils/              # Utilidades y hooks
│   ├── config/             # Configuración
│   ├── App.jsx             # Componente raíz
│   └── index.js            # Punto de entrada
├── package.json            # Dependencias
├── tailwind.config.js      # Estilos Tailwind
├── .env.local              # Variables de entorno
└── start.bat / start.ps1   # Scripts de inicio
```

---

## 🎯 Características Principales

### Módulos Implementados
- ✅ **Autenticación** - Login con JWT
- ✅ **Vivienda** - Unidades, Ocupantes, Vehículos, Mascotas
- ✅ **Finanzas** - Gastos, Pagos, Estado de Cuenta
- ✅ **Seguridad** - Accesos, Incidentes
- ✅ **Reservas** - Áreas comunes
- ✅ **Comunicación** - Comunicados
- ✅ **Servicios** - Mantenimiento
- ✅ **Reportes** - Análisis y gráficos

### Funcionalidades
- 🔐 Autenticación JWT
- 🎨 Diseño responsive (móvil, tablet, desktop)
- 🔍 Búsqueda y filtros avanzados
- 📊 Dashboards con KPIs
- 📱 Componentes reutilizables
- ⚡ Rendimiento optimizado

---

## 📚 Documentación Adicional

- **README.md** → Visión general del proyecto
- **GUIA_RAPIDA.md** → Guía de uso
- **IMPLEMENTACION_RESUMEN.md** → Detalles técnicos
- **ESTADO_IMPLEMENTACION.md** → Estado de funcionalidades

---

## 🔗 Rutas Principales

| Ruta | Descripción |
|------|-------------|
| `/login` | Login |
| `/dashboard` | Panel principal |
| `/unidades` | Gestión de unidades |
| `/ocupantes` | Gestión de residentes |
| `/vehiculos` | Registro de vehículos |
| `/mascotas` | Registro de mascotas |
| `/estado-cuenta` | Estado de cuenta |
| `/historial-pagos` | Historial de pagos |
| `/accesos` | Control de accesos |
| `/incidentes` | Reportar incidentes |
| `/reservas` | Reservar áreas comunes |
| `/comunicados` | Comunicados |
| `/solicitar-mantenimiento` | Solicitudes de mantenimiento |
| `/reportes` | Reportes y análisis |

---

## 💡 Tips Útiles

### Desarrollo Local
- **Reload automático** → El navegador se recarga al cambiar archivos
- **DevTools** → F12 para ver logs y errores
- **Component Inspector** → React DevTools extension

### Debugging
```javascript
// En la consola del navegador:
// Ver token actual
localStorage.getItem('access_token')

// Ver datos del usuario
localStorage.getItem('user')

// Limpiar datos locales
localStorage.clear()
```

### Performance
- Usa React DevTools para ver renders
- Revisa Network tab en DevTools para API calls
- Abre Console tab para ver errores

---

## 📞 Soporte

Para más información, revisa:
- Documentación del proyecto: Ver archivos `.md`
- Backend API: `http://localhost:8000/api/schema`
- React Docs: `https://react.dev`
- Tailwind Docs: `https://tailwindcss.com`

---

**¡Listo! Tu frontend de CondoSmart está funcional.** 🎉

