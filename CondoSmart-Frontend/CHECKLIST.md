# ✅ CondoSmart Frontend - Checklist de Verificación

## Pre-Requisitos
- [ ] Node.js instalado (v16+)
  - Verifica: `node --version`
- [ ] npm instalado (v8+)
  - Verifica: `npm --version`
- [ ] Django backend en ejecución
  - URL: http://localhost:8000
  - Verifica: Abre en navegador y deberías ver Swagger API

## Instalación y Setup

### Paso 1: Preparar Entorno
- [ ] Navega a la carpeta `CondoSmart-Frontend`
- [ ] Verifica que exista `.env.local`
- [ ] Verifica contenido de `.env.local`:
  ```
  VITE_API_BASE_URL=http://localhost:8000/api/v1
  ```

### Paso 2: Instalar Dependencias
- [ ] Ejecuta: `npm install`
- [ ] Verifica que se cree carpeta `node_modules`
- [ ] No debe haber errores rojos

### Paso 3: Iniciar Frontend
- [ ] Ejecuta: `npm start`
- [ ] Espera el mensaje: "Compiled successfully!"
- [ ] Navegador abre automáticamente en http://localhost:3000

## Verificación Funcional

### Página de Login
- [ ] Se carga la página de login
- [ ] Campos de usuario y contraseña visible
- [ ] Botón "Ingresar" aparece
- [ ] Puedes ver el logo de CondoSmart

### Autenticación
- [ ] Ingresa: admin@condosmart.com / admin123
- [ ] Se envía request al backend
- [ ] Recibes token JWT
- [ ] Te redirige a /dashboard
- [ ] No hay errores en console (F12)

### Dashboard
- [ ] Se carga correctamente
- [ ] Aparecen los 4 KPI cards
- [ ] Sidebar izquierdo visible
- [ ] Menu de navegación funcional

### Sidebar y Navegación
- [ ] Expande menú "🏠 Vivienda"
  - [ ] Aparecen 4 opciones (Unidades, Ocupantes, Vehículos, Mascotas)
- [ ] Expande menú "💰 Finanzas"
  - [ ] Aparecen 3 opciones (Gastos, Pagos, Estado de Cuenta)
- [ ] Expande menú "🔒 Seguridad"
  - [ ] Aparecen 2 opciones (Accesos, Incidentes)
- [ ] Expande otros menús
  - [ ] Todas las opciones visibles
  - [ ] 8 módulos totales con 14 páginas

### Vivienda - Unidades
- [ ] URL: http://localhost:3000/unidades
- [ ] Tabla de unidades carga
- [ ] Botón "Nueva Unidad" funciona
- [ ] Se abre modal de crear
- [ ] Puedes rellenar formulario
- [ ] Botón "Guardar" responde (aunque sea mock data)

### Vivienda - Ocupantes
- [ ] URL: http://localhost:3000/ocupantes
- [ ] Tabla de ocupantes carga
- [ ] Filtros de estado funcionan
- [ ] Modal de crear funciona

### Vivienda - Vehículos
- [ ] URL: http://localhost:3000/vehiculos
- [ ] Color preview en tabla funciona
- [ ] Se muestra preview de color de vehículos

### Vivienda - Mascotas
- [ ] URL: http://localhost:3000/mascotas
- [ ] Emoji de mascotas aparece (🐕 🐈 🐠 🐹 🐾)
- [ ] Tipos de mascotas aparecen en dropdown

### Finanzas - Gastos
- [ ] URL: http://localhost:3000/gastos
- [ ] KPI cards muestran datos
- [ ] Tabla de gastos carga
- [ ] Categorías de gastos visibles

### Finanzas - Pagos
- [ ] URL: http://localhost:3000/historial-pagos
- [ ] Estados de pago muestran badges con colores
- [ ] Métodos de pago listados

### Finanzas - Estado de Cuenta
- [ ] URL: http://localhost:3000/estado-cuenta
- [ ] Período selector funciona
- [ ] Dos tablas: Cargos y Pagos

### Seguridad - Accesos
- [ ] URL: http://localhost:3000/accesos
- [ ] Tipos de acceso visibles (visitante, servicio, etc.)

### Seguridad - Incidentes
- [ ] URL: http://localhost:3000/incidentes
- [ ] Severidades muestran colores (🟡🟠🔴⚫)
- [ ] Estados visibles

### Otros Módulos
- [ ] Reservas funciona: `/reservas`
- [ ] Comunicados funciona: `/comunicados`
- [ ] Mantenimiento funciona: `/solicitar-mantenimiento`
- [ ] Reportes funciona: `/reportes`

## Pruebas de Usuario

### Login/Logout
- [ ] Puedes hacer logout
- [ ] Te redirige a login
- [ ] Borras token al logout
- [ ] No puedes acceder a páginas protegidas sin token

### CRUD Básico
- [ ] Puedes crear registros (mock)
- [ ] Puedes ver lista de registros
- [ ] Puedes editar registros (modal se abre)
- [ ] Puedes eliminar registros (aparece confirmación)

### Validación
- [ ] Campos requeridos no dejan enviar
- [ ] Mensajes de validación aparecen
- [ ] Errores se muestran claramente

### Responsive
- [ ] Abre DevTools (F12)
- [ ] Activa Device Toolbar
- [ ] Prueba en Mobile (375px)
- [ ] Prueba en Tablet (768px)
- [ ] Sidebar colapsable en mobile
- [ ] Tabla se scrollea horizontalmente si es necesario

## Console y Errores

### Console (F12)
- [ ] No hay errores rojos
- [ ] No hay warnings críticos
- [ ] Si hay mensajes, son informativos

### Network (F12 → Network tab)
- [ ] Requests a `/api/v1/` son exitosos
- [ ] Status 200 para requests válidos
- [ ] No hay 404 o 500 errors

### Storage (F12 → Application → Local Storage)
- [ ] `access_token` guardado
- [ ] `refresh_token` guardado
- [ ] `user` data guardado

## Problemas Comunes

### Si la página no carga
- [ ] Verifica que npm start no tenga errores
- [ ] Verifica que el backend esté en http://localhost:8000
- [ ] Revisa console (F12) para errores

### Si login no funciona
- [ ] Backend debe estar ejecutándose
- [ ] Credenciales deben ser correctas: admin@condosmart.com / admin123
- [ ] Verifica `.env.local` tiene URL correcta

### Si componentes no cargan
- [ ] Limpia cache: Ctrl+Shift+Delete
- [ ] Recarga página: Ctrl+R o F5
- [ ] Reinicia npm start

## Performance Check

### Lighthouse (DevTools)
- [ ] Performance: > 70
- [ ] Accessibility: > 80
- [ ] Best Practices: > 80
- [ ] SEO: > 80

### Speed Metrics
- [ ] First Contentful Paint: < 3s
- [ ] Largest Contentful Paint: < 4s
- [ ] Time to Interactive: < 5s

## Checklist de Deploy

### Antes de Producción
- [ ] Todos los tests pasan (si existen)
- [ ] No hay console errors
- [ ] Network requests funcionan
- [ ] Responsive en todos los tamaños
- [ ] Login funciona
- [ ] Logout funciona
- [ ] CRUD básico funciona
- [ ] Validaciones funcionan

### Build Producción
- [ ] `npm run build` genera carpeta `build/`
- [ ] Build no tiene errores
- [ ] Puedes servir contenido de `build/` estáticamente

---

## ✅ Status Final

Si completaste todos los items anteriores:

✅ **Frontend completamente funcional**  
✅ **Todas las 8 módulos operativos**  
✅ **Integración con backend lista**  
✅ **Listo para desarrollo posterior**  

---

**¡Felicitaciones! Tu CondoSmart Frontend está 100% funcional.** 🎉

