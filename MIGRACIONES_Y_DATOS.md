# 🗄️ SCRIPT DE MIGRACIONES Y DATOS

## PASO 1: Crear migraciones en Django

```bash
cd d:\Documents\SI2\0-MESA\condominio\CondoSmart-Backend

# Generar migraciones
python manage.py makemigrations reservations

# Ver el archivo generado
# reservations/migrations/000X_auto_FECHA.py

# Aplicar migraciones
python manage.py migrate reservations
```

---

## PASO 2: Inserts SQL Iniciales

Ejecuta estos comandos en pgAdmin o psql:

### 2.1 Insertar Condominio (si no existe)
```sql
INSERT INTO housing_condominio (name, direccion, tipo, is_active, created_at, updated_at, created_by_id, updated_by_id)
VALUES (
  'Condominio Vista Verde',
  'Calle Principal 123',
  'vertical',
  true,
  NOW(),
  NOW(),
  1,
  1
)
ON CONFLICT DO NOTHING;
```

### 2.2 Insertar Áreas Comunes
```sql
-- Limpiar datos anteriores (opcional)
DELETE FROM reservations_areacomun WHERE name IN ('Salón de Eventos', 'Cancha de Tenis', 'Piscina', 'Gimnasio');

-- Insertar nuevas áreas
INSERT INTO reservations_areacomun (
  name, 
  descripcion, 
  direccion, 
  capacidad, 
  precio_por_hora, 
  horario_apertura, 
  horario_cierre, 
  deposit_amount,
  is_active,
  created_at,
  updated_at,
  created_by_id,
  updated_by_id
) VALUES 
(
  'Salón de Eventos',
  'Gran salón para fiestas y eventos',
  'Planta Baja, Ala Sur',
  150,
  150.00,
  '08:00:00',
  '22:00:00',
  500.00,
  true,
  NOW(),
  NOW(),
  1,
  1
),
(
  'Cancha de Tenis',
  'Cancha profesional de tenis con iluminación',
  'Área Externa - Patio',
  4,
  80.00,
  '06:00:00',
  '20:00:00',
  200.00,
  true,
  NOW(),
  NOW(),
  1,
  1
),
(
  'Piscina',
  'Piscina olímpica con jacuzzi',
  'Área Externa - Oeste',
  50,
  100.00,
  '08:00:00',
  '18:00:00',
  300.00,
  true,
  NOW(),
  NOW(),
  1,
  1
),
(
  'Gimnasio',
  'Gimnasio equipado con máquinas modernas',
  'Planta Baja, Ala Norte',
  30,
  120.00,
  '06:00:00',
  '21:00:00',
  0.00,
  true,
  NOW(),
  NOW(),
  1,
  1
);
```

### 2.3 Verificar Unidades (para crear reservas)
```sql
-- Ver unidades disponibles
SELECT id, code, direccion, piso FROM housing_unidad LIMIT 10;
```

### 2.4 Insertar Usuarios de Prueba
```sql
-- Usuario adicional para tests (si no existen)
INSERT INTO accounts_customuser (
  username,
  email,
  first_name,
  last_name,
  ci,
  phone,
  is_staff,
  is_superuser,
  is_active,
  password,
  created_at,
  updated_at,
  created_by_id,
  updated_by_id,
  photo_key
)
SELECT 
  'maria.garcia',
  'maria@condominio.com',
  'María',
  'García',
  '7654321',
  '+34 612 345 678',
  false,
  false,
  true,
  'pbkdf2_sha256$600000$...',  -- hash de contraseña
  NOW(),
  NOW(),
  1,
  1,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM accounts_customuser WHERE username = 'maria.garcia'
);
```

### 2.5 Insertar Residencias (usuarios en unidades)
```sql
-- Asignar usuario a unidad
INSERT INTO housing_residency (
  user_id,
  unidad_id,
  tipo_ocupacion,
  status,
  is_owner,
  start,
  end,
  is_active,
  created_at,
  updated_at,
  created_by_id,
  updated_by_id
)
SELECT 
  u.id,
  un.id,
  'propietario',
  'activa',
  true,
  '2025-01-01'::date,
  NULL,
  true,
  NOW(),
  NOW(),
  1,
  1
FROM accounts_customuser u
CROSS JOIN housing_unidad un
WHERE u.username = 'alejandro'
  AND un.code = '101'
  AND NOT EXISTS (
    SELECT 1 FROM housing_residency WHERE user_id = u.id AND unidad_id = un.id
  );
```

### 2.6 Insertar Vehículos
```sql
INSERT INTO housing_vehiculo (
  unidad_id,
  responsable_id,
  placa,
  marca,
  color,
  observacion,
  is_active,
  created_at,
  updated_at,
  created_by_id,
  updated_by_id
)
SELECT 
  un.id,
  u.id,
  'ABC-123',
  'Toyota',
  'Blanco',
  'Camioneta 4x4',
  true,
  NOW(),
  NOW(),
  1,
  1
FROM accounts_customuser u
CROSS JOIN housing_unidad un
WHERE u.username = 'alejandro'
  AND un.code = '101'
  AND NOT EXISTS (
    SELECT 1 FROM housing_vehiculo WHERE placa = 'ABC-123'
  );
```

### 2.7 Insertar Reservas de Prueba
```sql
INSERT INTO reservations_reserva (
  unidad_id,
  area_id,
  start,
  end,
  status,
  notas,
  is_active,
  created_at,
  updated_at,
  created_by_id,
  updated_by_id
)
SELECT 
  un.id,
  ac.id,
  '2025-12-20 18:00:00',
  '2025-12-20 22:00:00',
  'confirmada',
  'Fiesta de cumpleaños',
  true,
  NOW(),
  NOW(),
  1,
  1
FROM housing_unidad un
CROSS JOIN reservations_areacomun ac
WHERE un.code = '101'
  AND ac.name = 'Salón de Eventos'
  AND NOT EXISTS (
    SELECT 1 FROM reservations_reserva 
    WHERE unidad_id = un.id AND area_id = ac.id AND start = '2025-12-20 18:00:00'
  );
```

### 2.8 Insertar Depósitos para Reservas
```sql
INSERT INTO reservations_deposito (
  reserva_id,
  monto,
  estado,
  motivo_retencion,
  fecha_devolucion,
  is_active,
  created_at,
  updated_at,
  created_by_id,
  updated_by_id
)
SELECT 
  r.id,
  ac.deposit_amount,
  'activo',
  NULL,
  NULL,
  true,
  NOW(),
  NOW(),
  1,
  1
FROM reservations_reserva r
JOIN reservations_areacomun ac ON r.area_id = ac.id
WHERE r.start >= NOW()
  AND NOT EXISTS (
    SELECT 1 FROM reservations_deposito WHERE reserva_id = r.id
  );
```

---

## PASO 3: Verificar Datos Insertados

```sql
-- Ver todas las áreas comunes
SELECT id, name, capacidad, precio_por_hora, deposit_amount FROM reservations_areacomun;

-- Ver reservas
SELECT r.id, r.unidad_id, ac.name, r.start, r.end, r.status 
FROM reservations_reserva r
JOIN reservations_areacomun ac ON r.area_id = ac.id;

-- Ver depósitos
SELECT d.id, d.reserva_id, d.monto, d.estado 
FROM reservations_deposito d;

-- Ver vehículos
SELECT id, placa, marca, color, unidad_id 
FROM housing_vehiculo;
```

---

## 🚀 COMANDO RÁPIDO (ejecutar en orden)

```powershell
# En la carpeta del backend
cd d:\Documents\SI2\0-MESA\condominio\CondoSmart-Backend

# 1. Generar migraciones
python manage.py makemigrations reservations

# 2. Aplicar migraciones
python manage.py migrate reservations

# 3. Reiniciar servidor
python manage.py runserver 0.0.0.0:8000
```

Luego ejecuta los SQL en pgAdmin.

---

## ⚠️ NOTAS IMPORTANTES

1. **Passwords**: El usuario tiene password hasheado. Para crear uno, usa:
```python
from django.contrib.auth.hashers import make_password
make_password('Test1234!')
```

2. **IDs**: Reemplaza `created_by_id=1` con tu usuario admin (probablemente 1 o 2)

3. **Timestamps**: `NOW()` = timestamp actual

4. **Conflictos**: `ON CONFLICT DO NOTHING` = no insertar si ya existe

5. **Transacciones**: Puedes envolver en `BEGIN; ... COMMIT;` para seguridad

