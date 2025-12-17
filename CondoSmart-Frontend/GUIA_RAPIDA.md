# 🚀 Guía de Inicio Rápido - CondoSmart Frontend

## 📦 Instalación y Setup

### 1. Instalar Dependencias
```bash
cd CondoSmart-Frontend
npm install
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz:
```
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_API_TIMEOUT=30000
```

### 3. Iniciar Servidor de Desarrollo
```bash
npm start
```

El frontend abrirá en `http://localhost:3000`

---

## 🔑 Credenciales de Prueba

```
Email: admin@example.com
Contraseña: password123
```

O utiliza cualquier usuario registrado en el backend Django.

---

## 📍 Rutas Principales

### Autenticación
- `/login` - Página de inicio de sesión
- `/dashboard` - Panel principal (protegido)

### Vivienda 🏠
- `/unidades` - Administrar unidades
- `/ocupantes` - Gestionar residentes
- `/vehiculos` - Registro de vehículos
- `/mascotas` - Gestión de mascotas

### Finanzas 💰
- `/estado-cuenta` - Estado de cuenta consolidado
- `/historial-pagos` - Historial de pagos
- `/configurar-expensas` - Configuración de expensas
- `/generar-expensas` - Generación de expensas

### Seguridad 🔒
- `/accesos` - Control de accesos
- `/incidentes` - Alertas e incidentes

### Reservas 📅
- `/reservas` - Calendario de reservas

### Comunicación 📢
- `/comunicados` - Envío de comunicados

### Servicios 🔧
- `/solicitar-mantenimiento` - Solicitudes de mantenimiento

### Reportes 📊
- `/reportes` - Generación de reportes

---

## 🎨 Estructura de Componentes

### Componentes Reutilizables (en `components/common/`)

```jsx
// Botones
<Button variant="primary" onClick={handleClick}>
  Guardar
</Button>

// Alertas
<Alert type="success" title="Éxito" message="Operación completada" />

// Modales
<Modal isOpen={true} onClose={handleClose} title="Título">
  Contenido
</Modal>

// Tablas
<Table columns={columns} data={data} loading={false} />

// Inputs con validación
<Input
  name="email"
  type="email"
  value={value}
  onChange={handleChange}
  placeholder="Correo electrónico"
  error="El correo es requerido"
/>

// Formularios
<FormGroup label="Email" required>
  <Input name="email" value={email} onChange={handleChange} />
</FormGroup>
```

---

## 🔗 Conectar con Backend

### 1. Verificar URL de API

En `services/housingService.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000/api/v1';
```

Asegúrate que el backend Django esté corriendo en este puerto.

### 2. Usar Servicios

```javascript
import { unidadService } from '../../services/housingService';

// Obtener unidades
const response = await unidadService.list({ search: 'term' });

// Crear unidad
await unidadService.create({ code: '101', direccion: '...' });

// Actualizar
await unidadService.update(id, { code: '102' });

// Eliminar
await unidadService.delete(id);
```

### 3. Manejo de Errores

```javascript
try {
  const response = await unidadService.list();
  setData(response.data);
} catch (error) {
  setError('Error al cargar: ' + error.message);
}
```

---

## 🔐 Autenticación

### Flujo de Login

1. Usuario completa email/contraseña en `/login`
2. Se envía solicitud a `POST /token/`
3. Se reciben tokens (access + refresh)
4. Se guardan en localStorage
5. Se redirige a `/dashboard`

### Usar AuthContext

```javascript
import { useAuth } from '../../utils/hooks';

function MiComponente() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <div>Bienvenido {user.username}</div>;
}
```

### Rutas Protegidas

Todas las rutas excepto `/login` requieren autenticación.

---

## 📝 Crear una Nueva Página

### 1. Crear el componente
```javascript
// pages/MiModulo/MiPagina.jsx
import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';

const MiPagina = () => {
  const [data, setData] = useState([]);
  
  return (
    <div className="p-8 space-y-6">
      <PageHeader title="Mi Página" subtitle="Descripción" />
      {/* Contenido */}
    </div>
  );
};

export default MiPagina;
```

### 2. Agregar ruta en App.jsx
```javascript
<Route
  path="/mi-ruta"
  element={<MainLayout><MiPagina /></MainLayout>}
/>
```

### 3. Actualizar Sidebar.jsx si necesario

---

## 🛠️ Desarrollo Local

### Scripts Disponibles

```bash
# Iniciar desarrollo
npm start

# Crear build production
npm run build

# Ejecutar tests (si están configurados)
npm test

# Linter
npm run lint
```

### Estructura de Carpetas

```
src/
├── components/      # Componentes React
├── context/        # Context API
├── pages/          # Páginas por módulo
├── services/       # Servicios API
├── utils/          # Utilidades
├── App.jsx         # Componente raíz
└── index.jsx       # Punto de entrada
```

---

## 🐛 Debugging

### Ver Tokens de Sesión
```javascript
// En consola del navegador
localStorage.getItem('access_token');
localStorage.getItem('refresh_token');
```

### Ver Errores de API
Las solicitudes tienen interceptores que logean errores:
```javascript
// En Network tab del DevTools
```

### React DevTools
Instala extensión de React DevTools para Chrome/Firefox para debuggear componentes.

---

## 📦 Dependencias Principales

```json
{
  "react": "18.2.0",
  "react-router-dom": "6.20.0",
  "axios": "1.6.2",
  "tailwindcss": "3.3.6",
  "react-icons": "4.12.0",
  "date-fns": "2.30.0"
}
```

---

## ✅ Checklist Antes de Producción

- [ ] Cambiar `API_BASE_URL` a URL production
- [ ] Revisar variables de entorno
- [ ] Ejecutar build production: `npm run build`
- [ ] Probar en navegadores principales
- [ ] Verificar responsive design
- [ ] Revisar console para warnings/errors
- [ ] Testear autenticación
- [ ] Testear CRUD básico
- [ ] Verificar conexión con backend

---

## 📚 Recursos Útiles

- [React Docs](https://react.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Axios](https://axios-http.com)
- [React Icons](https://react-icons.github.io/react-icons)

---

## 🆘 Solución de Problemas Comunes

### Error: "Cannot find module"
```bash
# Limpiar node_modules e instalar de nuevo
rm -rf node_modules package-lock.json
npm install
```

### API no responde
- Verificar que backend está corriendo
- Revisar `http://localhost:8000/api/v1`
- Chequear CORS en backend

### Sesión expira constantemente
- Revisar duración de tokens en backend
- Chequear interceptores de axios
- Limpiar localStorage

### Estilo de Tailwind no aplicado
- Verificar archivo `tailwind.config.js`
- Revisar que `index.css` está importado
- Reconstruir: `npm run build`

---

## 📞 Soporte

Para problemas o dudas, revisar:
1. README.md (documentación principal)
2. IMPLEMENTACION_RESUMEN.md (detalles técnicos)
3. Código fuente documentado
4. Comentarios en archivos

---

**¡Happy Coding! 🎉**
