# CondoSmart Frontend

Sistema integral de gestión de condominios - Frontend en React

## 📋 Descripción

Frontend de la aplicación CondoSmart desarrollado con React 18, siguiendo la metodología PUDS y la estructura de paquetes documentada en la especificación del proyecto.

## 🏗️ Estructura de Paquetes (Según PUDS)

### 1. **Autenticación y Acceso** 🔐
- Iniciar Sesión
- Gestionar Usuarios
- Cambiar Contraseña

### 2. **Vivienda** 🏠
- Administrar Unidades
- Ocupantes
- Gestionar Vehículos
- Gestionar Mascotas
- Información de Unidad

### 3. **Seguridad** 🔒
- Gestionar Accesos y Visitas
- Reconocimiento Facial/Placas
- Alertas e Incidentes
- Historial de Accesos

### 4. **Reservas** 📅
- Configurar Áreas Comunes
- Realizar Reservas
- Ciclo de Vida de Reservas
- Gestionar Depósitos

### 5. **Finanzas** 💰
- Configurar Expensas
- Generar Expensas
- Estado de Cuenta
- Historial de Pagos
- Realizar Pago

### 6. **Comunicación** 📢
- Enviar Comunicados
- Reporte de Lectura

### 7. **Servicios y Mantenimiento** 🔧
- Programar Servicios
- Registrar Ejecución
- Solicitar Mantenimiento

### 8. **Reportes y Analítica** 📊
- Generar Reportes
- Analítica Visual

## 🛠️ Tecnologías

- **React 18.2.0** - Framework principal
- **React Router DOM 6.20.0** - Enrutamiento
- **Axios 1.6.2** - Cliente HTTP
- **Tailwind CSS 3.3.6** - Estilos
- **React Icons 4.12.0** - Iconografía
- **Date-fns 2.30.0** - Manejo de fechas

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# Compilar para producción
npm build
```

## 📦 Estructura de Directorios

```
src/
├── components/        # Componentes reutilizables
│   ├── ProtectedRoute.jsx
│   └── Sidebar.jsx
├── context/          # Context API para estado global
│   └── AuthContext.jsx
├── pages/            # Páginas principales
│   ├── LoginPage.jsx
│   └── Dashboard.jsx
├── services/         # Servicios para consumir API
├── utils/            # Funciones auxiliares
│   └── hooks.js
├── App.jsx           # Componente raíz
├── index.jsx         # Punto de entrada
└── index.css         # Estilos globales
```

## 🔐 Autenticación

La aplicación utiliza JWT para autenticación. El token se almacena en `localStorage` y se envía en cada solicitud.

### Flujo de Login
1. Usuario ingresa credenciales
2. Se valida contra el backend
3. Se obtiene token JWT
4. Se guarda en localStorage
5. Se redirige a dashboard

## 🎨 Diseño

### Paleta de Colores
- **Primario**: Blue (#2563eb)
- **Secundario**: Dark Blue (#1e40af)
- **Éxito**: Green
- **Error**: Red
- **Advertencia**: Yellow/Orange

### Componentes UI
- Sidebar expandible con paquetes
- Formularios con validación
- Tablas responsivas
- Cards de estadísticas
- Notificaciones de error/éxito

## 📱 Responsividad

La aplicación es completamente responsiva:
- **Desktop**: Sidebar fijo lateral
- **Tablet**: Sidebar colapsable
- **Mobile**: Menú hamburguesa

## 🔄 Estado de Desarrollo (PUDS)

### Fase 1: Inicio ✅
- [x] Definición de alcance y requisitos
- [x] Estructura base del proyecto
- [x] Autenticación y login
- [x] Dashboard inicial

### Fase 2: Elaboración (En Progreso)
- [ ] Módulos principales
- [ ] Integración con API
- [ ] Validaciones
- [ ] Manejo de errores

### Fase 3: Construcción
- [ ] Componentes detallados
- [ ] Pruebas unitarias
- [ ] Optimización

### Fase 4: Transición
- [ ] Despliegue
- [ ] Documentación final
- [ ] Capacitación

## 📝 Variables de Entorno

Crear archivo `.env`:

```
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_ENV=development
```

## 🐛 Troubleshooting

### CORS Error
Asegurar que el backend está configurado con CORS correctamente.

### Token Expirado
El token se valida automáticamente en `AuthContext`.

## 📚 Documentación Relacionada

- [Backend - Django API](../CondoSmart-Backend)
- [Especificación PUDS](../Documentacion%20SI2.txt)
- [Diagramas de Casos de Uso](../diagramas/)

## 👥 Contribuyentes

Desarrollado como proyecto académico en la UAGRM.

---

**Última actualización**: 15 de diciembre de 2025
