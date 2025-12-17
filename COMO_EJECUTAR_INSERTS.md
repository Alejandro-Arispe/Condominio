## CÓMO EJECUTAR LOS INSERTS EN LA BASE DE DATOS

### Opción 1: Desde pgAdmin (GUI - Más fácil)

1. Abre pgAdmin en tu navegador (localhost:5050 o similar)
2. Conectate a la BD PostgreSQL
3. Selecciona la base de datos `condominio` (o el nombre que uses)
4. Ve a "Tools" → "Query Tool"
5. Abre el archivo `INSERTS_DATOS_REALES.sql`
6. Pega TODO el contenido
7. Presiona `Ctrl + Enter` o el botón "Execute"

### Opción 2: Desde PowerShell (Línea de comandos)

```powershell
# Reemplaza user, password, host según tu configuración
psql -U postgres -d condominio -h localhost -p 5432 -f "D:\Documents\SI2\0-MESA\condominio\INSERTS_DATOS_REALES.sql"
```

Ingresa la contraseña cuando te pida.

### Opción 3: Desde DataGrip / DBeaver

1. Abre tu cliente SQL
2. Crea una nueva ventana de consulta SQL
3. Pega el contenido del archivo
4. Ejecuta (Ctrl + Shift + X en DataGrip, F5 en DBeaver)

---

## VERIFICAR QUE LOS DATOS SE INSERTARON

```sql
-- Contar registros en cada tabla
SELECT COUNT(*) as unidades FROM housing_unidad;
SELECT COUNT(*) as residencias FROM housing_residency;
SELECT COUNT(*) as vehiculos FROM housing_vehiculo;
SELECT COUNT(*) as mascotas FROM housing_mascota;
SELECT COUNT(*) as reservas FROM reservations_reserva;
SELECT COUNT(*) as areas FROM reservations_areacomun;
SELECT COUNT(*) as cargos FROM finance_cargo;
SELECT COUNT(*) as pagos FROM finance_pago;
SELECT COUNT(*) as accesos FROM security_acceso;

-- Ver unidades con sus propietarios
SELECT u.code, u.piso, cu.username FROM housing_unidad u
LEFT JOIN accounts_customuser cu ON u.user_id = cu.id;

-- Ver cargos pendientes
SELECT f.id, hu.code, f.monto, f.estado, f.periodo 
FROM finance_cargo f 
JOIN housing_unidad hu ON f.unidad_id = hu.id 
WHERE f.estado IN ('pendiente', 'parcial');

-- Ver próximas reservas
SELECT r.id, hu.code, ac.name, r.start, r.status 
FROM reservations_reserva r 
JOIN housing_unidad hu ON r.unidad_id = hu.id 
JOIN reservations_areacomun ac ON r.area_id = ac.id 
WHERE r.start > NOW() 
ORDER BY r.start;
```

---

## QUÉ CONTIENEN LOS DATOS

✅ 16 Unidades de apartamentos (piso 1 a 4)
✅ 12 Usuarios propietarios activos
✅ 4 Contratos de arrendamiento reales
✅ 13 Vehículos con placas únicas
✅ 13 Mascotas diversas
✅ 10 Áreas comunes totalmente equipadas
✅ 15 Reservas (confirmadas, pendientes)
✅ 7 Visitas de externos
✅ 8 Incidentes reportados
✅ 25 Cargos (expensas, multas, depósitos)
✅ 8 Pagos con diferentes métodos
✅ 13 Suministros de áreas comunes

Todos los datos son **coherentes y realistas** para desarrollo.
