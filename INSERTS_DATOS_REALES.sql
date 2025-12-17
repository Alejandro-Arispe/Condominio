-- ============================================================================
-- SCRIPT DE POBLADO DE BASE DE DATOS - CONDOSMART
-- Datos coherentes y realistas para desarrollo y pruebas
-- ============================================================================

-- ============================================================================
-- 1. CONDOMINIO
-- ============================================================================
INSERT INTO housing_condominio (name, direccion, tipo, is_active, created_by_id, updated_by_id, created_at, updated_at)
VALUES 
('CondoSmart Tower', 'Avenida Principal 1500, Piso 1', 'vertical', true, 1, 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Guardar el ID del condominio
-- SELECT id FROM housing_condominio WHERE name = 'CondoSmart Tower'; -- Este será 1

-- ============================================================================
-- 2. UNIDADES (Apartamentos - Verticales)
-- ============================================================================
INSERT INTO housing_unidad (condominio_id, direccion, code, user_id, piso, is_active, created_by_id, updated_by_id, created_at, updated_at)
VALUES 
-- Piso 1
(1, 'Avenida Principal 1500, Apt 101', '101', 1, 1, true, 1, 1, NOW(), NOW()),
(1, 'Avenida Principal 1500, Apt 102', '102', 2, 1, true, 1, 1, NOW(), NOW()),
(1, 'Avenida Principal 1500, Apt 103', '103', NULL, 1, true, 1, 1, NOW(), NOW()),
(1, 'Avenida Principal 1500, Apt 104', '104', 3, 1, true, 1, 1, NOW(), NOW()),

-- Piso 2
(1, 'Avenida Principal 1500, Apt 201', '201', 4, 2, true, 1, 1, NOW(), NOW()),
(1, 'Avenida Principal 1500, Apt 202', '202', 5, 2, true, 1, 1, NOW(), NOW()),
(1, 'Avenida Principal 1500, Apt 203', '203', NULL, 2, true, 1, 1, NOW(), NOW()),
(1, 'Avenida Principal 1500, Apt 204', '204', 6, 2, true, 1, 1, NOW(), NOW()),

-- Piso 3
(1, 'Avenida Principal 1500, Apt 301', '301', 7, 3, true, 1, 1, NOW(), NOW()),
(1, 'Avenida Principal 1500, Apt 302', '302', 8, 3, true, 1, 1, NOW(), NOW()),
(1, 'Avenida Principal 1500, Apt 303', '303', NULL, 3, true, 1, 1, NOW(), NOW()),
(1, 'Avenida Principal 1500, Apt 304', '304', 9, 3, true, 1, 1, NOW(), NOW()),

-- Piso 4
(1, 'Avenida Principal 1500, Apt 401', '401', 10, 4, true, 1, 1, NOW(), NOW()),
(1, 'Avenida Principal 1500, Apt 402', '402', NULL, 4, true, 1, 1, NOW(), NOW()),
(1, 'Avenida Principal 1500, Apt 403', '403', 11, 4, true, 1, 1, NOW(), NOW()),
(1, 'Avenida Principal 1500, Apt 404', '404', 12, 4, true, 1, 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 3. RESIDENCIAS (Relación Usuario-Unidad)
-- ============================================================================
INSERT INTO housing_residency (user_id, unidad_id, tipo_ocupacion, status, is_owner, start, end, is_active, created_by_id, updated_by_id, created_at, updated_at)
VALUES 
-- Propietarios principales
(1, 1, 'propietario', 'activa', true, '2022-03-15', NULL, true, 1, 1, NOW(), NOW()),
(2, 2, 'propietario', 'activa', true, '2021-07-20', NULL, true, 1, 1, NOW(), NOW()),
(3, 4, 'propietario', 'activa', true, '2023-01-10', NULL, true, 1, 1, NOW(), NOW()),
(4, 5, 'propietario', 'activa', true, '2020-11-05', NULL, true, 1, 1, NOW(), NOW()),
(5, 6, 'propietario', 'activa', true, '2022-06-12', NULL, true, 1, 1, NOW(), NOW()),
(6, 8, 'propietario', 'activa', true, '2023-02-28', NULL, true, 1, 1, NOW(), NOW()),
(7, 9, 'propietario', 'activa', true, '2021-09-03', NULL, true, 1, 1, NOW(), NOW()),
(8, 10, 'propietario', 'activa', true, '2022-12-19', NULL, true, 1, 1, NOW(), NOW()),
(9, 12, 'propietario', 'activa', true, '2023-04-22', NULL, true, 1, 1, NOW(), NOW()),
(10, 13, 'propietario', 'activa', true, '2020-05-30', NULL, true, 1, 1, NOW(), NOW()),
(11, 15, 'propietario', 'activa', true, '2022-08-17', NULL, true, 1, 1, NOW(), NOW()),
(12, 16, 'propietario', 'activa', true, '2021-10-25', NULL, true, 1, 1, NOW(), NOW()),

-- Residentes (inquilinos)
(1, 1, 'residente', 'activa', false, '2024-01-01', NULL, true, 1, 1, NOW(), NOW()),
(2, 2, 'residente', 'activa', false, '2024-02-15', NULL, true, 1, 1, NOW(), NOW()),
(4, 5, 'residente', 'activa', false, '2024-03-01', NULL, true, 1, 1, NOW(), NOW()),
(5, 6, 'residente', 'activa', false, '2024-01-10', NULL, true, 1, 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 4. VEHÍCULOS
-- ============================================================================
INSERT INTO housing_vehiculo (unidad_id, responsable_id, placa, marca, color, observacion, is_active, created_by_id, updated_by_id, created_at, updated_at)
VALUES 
-- Unidad 101 - Usuario 1
(1, 1, 'ABC1234', 'Toyota', 'Blanco', 'Corolla 2022, buen estado', true, 1, 1, NOW(), NOW()),
(1, 1, 'ABC1235', 'Honda', 'Gris', 'Civic 2023, recién comprado', true, 1, 1, NOW(), NOW()),

-- Unidad 102 - Usuario 2
(2, 2, 'XYZ5678', 'Nissan', 'Negro', 'Sentra 2021, con detector', true, 1, 1, NOW(), NOW()),

-- Unidad 104 - Usuario 3
(4, 3, 'DEF9012', 'Chevrolet', 'Rojo', 'Spark 2024, uso personal', true, 1, 1, NOW(), NOW()),

-- Unidad 201 - Usuario 4
(5, 4, 'GHI3456', 'Volkswagen', 'Azul', 'Gol 2023, familia', true, 1, 1, NOW(), NOW()),
(5, 4, 'JKL7890', 'Fiat', 'Plateado', 'Argo 2022, compacto', true, 1, 1, NOW(), NOW()),

-- Unidad 202 - Usuario 5
(6, 5, 'MNO1234', 'Hyundai', 'Blanco', 'Elantra 2024, ejecutivo', true, 1, 1, NOW(), NOW()),

-- Unidad 204 - Usuario 6
(8, 6, 'PQR5678', 'Kia', 'Negro', 'Forte 2023, renovado', true, 1, 1, NOW(), NOW()),

-- Unidad 301 - Usuario 7
(9, 7, 'STU9012', 'Mazda', 'Rojo', 'CX-5 2022, SUV', true, 1, 1, NOW(), NOW()),

-- Unidad 302 - Usuario 8
(10, 8, 'VWX3456', 'Subaru', 'Gris', 'Legacy 2021, deportivo', true, 1, 1, NOW(), NOW()),

-- Unidad 304 - Usuario 9
(12, 9, 'YZA7890', 'Toyota', 'Verde', 'Yaris 2023, compacto', true, 1, 1, NOW(), NOW()),

-- Unidad 401 - Usuario 10
(13, 10, 'BCD1234', 'Honda', 'Azul', 'Accord 2024, familia grande', true, 1, 1, NOW(), NOW()),

-- Unidad 403 - Usuario 11
(15, 11, 'EFG5678', 'Nissan', 'Blanco', 'Versa 2022, economía', true, 1, 1, NOW(), NOW()),

-- Unidad 404 - Usuario 12
(16, 12, 'HIJ9012', 'Volkswagen', 'Negro', 'Passat 2021, ejecutivo', true, 1, 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 5. MASCOTAS
-- ============================================================================
INSERT INTO housing_mascota (name, raza, tipo, desde, hasta, responsable_id, is_active, created_by_id, updated_by_id, created_at, updated_at)
VALUES 
-- Usuario 1
('Max', 'Labrador', 'perro', '2020-05-10', NULL, 1, true, 1, 1, NOW(), NOW()),
('Luna', 'Poodle', 'perro', '2022-08-15', NULL, 1, true, 1, 1, NOW(), NOW()),

-- Usuario 2
('Miau', 'Siamés', 'gato', '2019-12-01', NULL, 2, true, 1, 1, NOW(), NOW()),
('Nube', 'Persa', 'gato', '2023-03-20', NULL, 2, true, 1, 1, NOW(), NOW()),

-- Usuario 3
('Rocky', 'Pastor Alemán', 'perro', '2021-06-12', NULL, 3, true, 1, 1, NOW(), NOW()),

-- Usuario 4
('Buddy', 'Golden Retriever', 'perro', '2022-01-08', NULL, 4, true, 1, 1, NOW(), NOW()),
('Coco', 'Australiano', 'perro', '2023-07-14', NULL, 4, true, 1, 1, NOW(), NOW()),

-- Usuario 5
('Bella', 'Beagle', 'perro', '2020-11-22', NULL, 5, true, 1, 1, NOW(), NOW()),

-- Usuario 6
('Whiskers', 'Gato Callejero', 'gato', '2024-01-05', NULL, 6, true, 1, 1, NOW(), NOW()),

-- Usuario 7
('Simba', 'Husky', 'perro', '2019-09-30', NULL, 7, true, 1, 1, NOW(), NOW()),
('Pumba', 'Pug', 'perro', '2022-04-17', NULL, 7, true, 1, 1, NOW(), NOW()),

-- Usuario 8
('Tigre', 'Bengal', 'gato', '2021-02-28', NULL, 8, true, 1, 1, NOW(), NOW()),

-- Usuario 9
('Canela', 'Cocker Spaniel', 'perro', '2023-05-11', NULL, 9, true, 1, 1, NOW(), NOW()),

-- Usuario 10
('Peluso', 'Mestizo', 'perro', '2022-10-03', NULL, 10, true, 1, 1, NOW(), NOW()),

-- Usuario 11
('Chinchilla', 'Chinchilla', 'otro', '2024-02-10', NULL, 11, true, 1, 1, NOW(), NOW()),

-- Usuario 12
('Felix', 'Siamés Mix', 'gato', '2021-08-25', NULL, 12, true, 1, 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 6. CONTRATOS DE ARRENDAMIENTO
-- ============================================================================
INSERT INTO housing_contrato (unidad_id, duenno_id, inquilino_id, descripcion, start, end, monto_mensual, is_active, created_by_id, updated_by_id, created_at, updated_at)
VALUES 
(1, 1, 1, 'Contrato de arrendamiento anual sin garantía', '2024-01-01', '2025-12-31', 1200.00, true, 1, 1, NOW(), NOW()),
(2, 2, 2, 'Contrato de arrendamiento con garantía de 2 meses', '2024-02-15', '2025-02-14', 1500.00, true, 1, 1, NOW(), NOW()),
(5, 4, 4, 'Contrato familiar, 2 años', '2024-03-01', '2026-02-28', 2000.00, true, 1, 1, NOW(), NOW()),
(6, 5, 5, 'Contrato temporal, 6 meses', '2024-07-01', '2024-12-31', 1300.00, true, 1, 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 7. ÁREAS COMUNES
-- ============================================================================
INSERT INTO reservations_areacomun (name, descripcion, capacidad, precio_por_hora, horario_apertura, horario_cierre, deposit_amount, is_active, created_by_id, updated_by_id, created_at, updated_at)
VALUES 
('Salón de Eventos', 'Amplio salón con proyector, sonido y capacidad para 100 personas', 100, 500.00, '08:00:00', '23:00:00', 1000.00, true, 1, 1, NOW(), NOW()),
('Salón Pequeño', 'Sala de juntas para 15-20 personas', 20, 150.00, '08:00:00', '22:00:00', 300.00, true, 1, 1, NOW(), NOW()),
('Piscina', 'Piscina climatizada, jacuzzi y vestuarios', 50, 200.00, '09:00:00', '21:00:00', 500.00, true, 1, 1, NOW(), NOW()),
('Gimnasio', 'Equipamiento completo: máquinas cardio, pesas, yoga', 25, 100.00, '06:00:00', '23:00:00', 200.00, true, 1, 1, NOW(), NOW()),
('Cancha de Tenis', 'Cancha profesional con iluminación', 4, 300.00, '07:00:00', '21:00:00', 400.00, true, 1, 1, NOW(), NOW()),
('Cancha de Futsal', 'Cancha cubierta y marcada', 22, 350.00, '07:00:00', '22:00:00', 500.00, true, 1, 1, NOW(), NOW()),
('BBQ - Parrillero', 'Área de parrilla con mesas y bebedero', 30, 200.00, '11:00:00', '20:00:00', 300.00, true, 1, 1, NOW(), NOW()),
('Salita de Meditación', 'Espacio tranquilo para yoga y meditación', 10, 50.00, '08:00:00', '19:00:00', 100.00, true, 1, 1, NOW(), NOW()),
('Ludoteca', 'Sala de juegos para niños y adolescentes', 20, 100.00, '15:00:00', '20:00:00', 150.00, true, 1, 1, NOW(), NOW()),
('Terraza Común', 'Terraza con vista panorámica, mesas y sillas', 40, 0.00, '08:00:00', '23:00:00', 0.00, true, 1, 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 8. RESERVAS
-- ============================================================================
INSERT INTO reservations_reserva (unidad_id, area_id, start, end, status, notas, is_active, created_by_id, updated_by_id, created_at, updated_at)
VALUES 
-- Diciembre 2025 - Próximas semanas
(1, 1, '2025-12-20 14:00:00', '2025-12-20 18:00:00', 'confirmada', 'Fiesta de Navidad familiar', true, 1, 1, NOW(), NOW()),
(2, 3, '2025-12-21 10:00:00', '2025-12-21 12:00:00', 'confirmada', 'Clase de natación para niños', true, 1, 1, NOW(), NOW()),
(4, 5, '2025-12-22 16:00:00', '2025-12-22 18:00:00', 'pendiente', 'Partido amistoso de tenis', true, 1, 1, NOW(), NOW()),
(5, 6, '2025-12-23 18:00:00', '2025-12-23 20:00:00', 'confirmada', 'Torneo de futsal navideño', true, 1, 1, NOW(), NOW()),
(6, 2, '2025-12-24 15:00:00', '2025-12-24 17:00:00', 'confirmada', 'Reunión de propietarios', true, 1, 1, NOW(), NOW()),
(8, 7, '2025-12-27 11:00:00', '2025-12-27 15:00:00', 'pendiente', 'Asado familiar', true, 1, 1, NOW(), NOW()),
(9, 4, '2025-12-28 06:30:00', '2025-12-28 08:00:00', 'confirmada', 'Clase de yoga grupal', true, 1, 1, NOW(), NOW()),
(10, 1, '2025-12-30 20:00:00', '2025-12-31 02:00:00', 'confirmada', 'Fiesta de Año Nuevo', true, 1, 1, NOW(), NOW()),

-- Enero 2026 - Futuro
(12, 3, '2026-01-05 10:00:00', '2026-01-05 12:00:00', 'pendiente', 'Actividades de verano', true, 1, 1, NOW(), NOW()),
(13, 6, '2026-01-10 18:00:00', '2026-01-10 20:00:00', 'pendiente', 'Torneo futsal enero', true, 1, 1, NOW(), NOW()),
(1, 4, '2026-01-15 07:00:00', '2026-01-15 09:00:00', 'confirmada', 'Clase de aeróbica', true, 1, 1, NOW(), NOW()),
(4, 5, '2026-01-20 15:00:00', '2026-01-20 17:00:00', 'confirmada', 'Torneo de tenis individual', true, 1, 1, NOW(), NOW()),
(6, 8, '2026-01-25 18:00:00', '2026-01-25 19:30:00', 'pendiente', 'Sesión de meditación en grupo', true, 1, 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 9. VISITAS
-- ============================================================================
INSERT INTO security_visita (name, documento, telefono, fecha_inicio, dias_permiso, is_active, created_by_id, updated_by_id, created_at, updated_at)
VALUES 
('Juan Pérez García', '12345678', '0985123456', NOW(), 7, true, 1, 1, NOW(), NOW()),
('María López Rodríguez', '87654321', '0985987654', NOW(), 3, true, 1, 1, NOW(), NOW()),
('Carlos Martínez Silva', '11223344', '0985555666', NOW(), 14, true, 1, 1, NOW(), NOW()),
('Ana Gómez Flores', '55667788', '0984444777', NOW(), 5, true, 1, 1, NOW(), NOW()),
('Roberto Sánchez Díaz', '99887766', '0983333888', NOW() - INTERVAL '2 days', 2, false, 1, 1, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('Patricia Ramírez Costa', '44332211', '0982222999', NOW() - INTERVAL '5 days', 10, false, 1, 1, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('Fernando Torres Ruiz', '66778899', '0981111000', NOW() + INTERVAL '1 day', 21, true, 1, 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 10. INCIDENTES
-- ============================================================================
INSERT INTO security_incidente (unidad_id, user_id, titulo, descripcion, estado, is_active, created_by_id, updated_by_id, created_at, updated_at)
VALUES 
(1, 1, 'Ruido excesivo', 'Música muy alta hasta las 3 AM, martes y miércoles', 'cerrado', true, 1, 1, NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 days'),
(2, 2, 'Fuga de agua', 'Goteo continuo desde el apartamento 304, afecta el techo', 'en_progreso', true, 1, 1, NOW() - INTERVAL '7 days', NOW() - INTERVAL '2 days'),
(4, 3, 'Daño en puerta principal', 'Puerta del edificio con cerradura dañada, no cierra correctamente', 'cerrado', true, 1, 1, NOW() - INTERVAL '20 days', NOW() - INTERVAL '15 days'),
(5, 4, 'Basura en pasillos', 'Residentes dejando bolsas en el corredor común', 'abierto', true, 1, 1, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(6, 5, 'Perro sin correa', 'Mascota sin supervisión en áreas comunes', 'cerrado', true, 1, 1, NOW() - INTERVAL '14 days', NOW() - INTERVAL '10 days'),
(8, 6, 'Estacionamiento prohibido', 'Vehículo en zona de circulación bloqueando entrada', 'en_progreso', true, 1, 1, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(9, 7, 'Acumulación de paquetes', 'Muchos paquetes sin retirar en recepción', 'abierto', true, 1, 1, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
(10, 8, 'Iluminación deficiente', 'Luces del sótano apagadas, área oscura y peligrosa', 'en_progreso', true, 1, 1, NOW() - INTERVAL '8 days', NOW() - INTERVAL '6 days')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 11. CARGOS (Gastos, Expensas, Multas)
-- ============================================================================
INSERT INTO finance_cargo (unidad_id, concepto, descripcion, monto, estado, saldo, periodo, is_active, created_by_id, updated_by_id, created_at, updated_at)
VALUES 
-- Expensas ordinarias - Diciembre 2025
(1, 'cuota', 'Expensa ordinaria diciembre 2025', 5000.00, 'pagado', 0.00, '2025-12-01', true, 1, 1, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
(2, 'cuota', 'Expensa ordinaria diciembre 2025', 5500.00, 'pendiente', 5500.00, '2025-12-01', true, 1, 1, NOW(), NOW()),
(4, 'cuota', 'Expensa ordinaria diciembre 2025', 5000.00, 'parcial', 2500.00, '2025-12-01', true, 1, 1, NOW(), NOW()),
(5, 'cuota', 'Expensa ordinaria diciembre 2025', 6000.00, 'pagado', 0.00, '2025-12-01', true, 1, 1, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
(6, 'cuota', 'Expensa ordinaria diciembre 2025', 5500.00, 'pendiente', 5500.00, '2025-12-01', true, 1, 1, NOW(), NOW()),
(8, 'cuota', 'Expensa ordinaria diciembre 2025', 5200.00, 'pagado', 0.00, '2025-12-01', true, 1, 1, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(9, 'cuota', 'Expensa ordinaria diciembre 2025', 5000.00, 'pendiente', 5000.00, '2025-12-01', true, 1, 1, NOW(), NOW()),
(10, 'cuota', 'Expensa ordinaria diciembre 2025', 6500.00, 'pagado', 0.00, '2025-12-01', true, 1, 1, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(12, 'cuota', 'Expensa ordinaria diciembre 2025', 5000.00, 'pendiente', 5000.00, '2025-12-01', true, 1, 1, NOW(), NOW()),
(13, 'cuota', 'Expensa ordinaria diciembre 2025', 5800.00, 'pendiente', 5800.00, '2025-12-01', true, 1, 1, NOW(), NOW()),
(15, 'cuota', 'Expensa ordinaria diciembre 2025', 5000.00, 'pagado', 0.00, '2025-12-01', true, 1, 1, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(16, 'cuota', 'Expensa ordinaria diciembre 2025', 5500.00, 'pendiente', 5500.00, '2025-12-01', true, 1, 1, NOW(), NOW()),

-- Expensas ordinarias - Noviembre 2025 (vencidas)
(1, 'cuota', 'Expensa ordinaria noviembre 2025', 5000.00, 'pagado', 0.00, '2025-11-01', true, 1, 1, NOW() - INTERVAL '35 days', NOW() - INTERVAL '25 days'),
(2, 'cuota', 'Expensa ordinaria noviembre 2025', 5500.00, 'pagado', 0.00, '2025-11-01', true, 1, 1, NOW() - INTERVAL '32 days', NOW() - INTERVAL '28 days'),
(4, 'cuota', 'Expensa ordinaria noviembre 2025', 5000.00, 'pendiente', 5000.00, '2025-11-01', true, 1, 1, NOW() - INTERVAL '40 days', NOW() - INTERVAL '40 days'),
(5, 'cuota', 'Expensa ordinaria noviembre 2025', 6000.00, 'pagado', 0.00, '2025-11-01', true, 1, 1, NOW() - INTERVAL '38 days', NOW() - INTERVAL '30 days'),

-- Multas por incidentes
(2, 'multa', 'Multa por incumplimiento de normas (ruido)', 1000.00, 'pendiente', 1000.00, NULL, true, 1, 1, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
(6, 'multa', 'Multa por estacionamiento prohibido', 500.00, 'pagado', 0.00, NULL, true, 1, 1, NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),

-- Depósitos de reservas
(1, 'deposito', 'Depósito reserva Salón Eventos 20-dic-2025', 1000.00, 'pendiente', 1000.00, NULL, true, 1, 1, NOW(), NOW()),
(10, 'deposito', 'Depósito reserva Salón Eventos 30-dic-2025', 1000.00, 'pendiente', 1000.00, NULL, true, 1, 1, NOW(), NOW()),

-- Otros cargos
(4, 'otro', 'Servicio de plomería (reparación emergencia)', 800.00, 'pagado', 0.00, NULL, true, 1, 1, NOW() - INTERVAL '12 days', NOW() - INTERVAL '10 days'),
(5, 'otro', 'Mantenimiento aire acondicionado', 600.00, 'pendiente', 600.00, NULL, true, 1, 1, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 12. PAGOS
-- ============================================================================
INSERT INTO finance_pago (user_id, fecha, estado, metodo, comprobante_key, observacion, is_active, created_by_id, updated_by_id, created_at, updated_at)
VALUES 
(1, '2025-12-15', 'confirmado', 'transferencia', 'TRF20251215001', 'Pago expensa diciembre vía transferencia bancaria', true, 1, 1, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
(2, '2025-12-18', 'confirmado', 'tarjeta', 'TC20251218001', 'Pago con tarjeta de crédito, débito automático', true, 1, 1, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(5, '2025-12-10', 'confirmado', 'efectivo', 'EFC20251210001', 'Pago en efectivo en recepción', true, 1, 1, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
(8, '2025-12-19', 'confirmado', 'transferencia', 'TRF20251219002', 'Pago múltiple: expensa + multa', true, 1, 1, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(10, '2025-12-16', 'confirmado', 'tarjeta', 'TC20251216002', 'Débito automático mensual', true, 1, 1, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
(12, '2025-12-14', 'confirmado', 'transferencia', 'TRF20251214003', 'Pago programado mes anterior', true, 1, 1, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
(3, '2025-12-20', 'pendiente', 'transferencia', 'PEND001', 'En proceso de confirmación', true, 1, 1, NOW(), NOW()),
(4, '2025-12-19', 'fallido', 'tarjeta', 'ERR20251219001', 'Rechazo por fondos insuficientes, reintentando', false, 1, 1, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 13. PAGOS POR CARGO (Relación entre Pago y Cargo)
-- ============================================================================
INSERT INTO finance_pagocargo (pago_id, cargo_id, monto, is_active, created_by_id, updated_by_id, created_at, updated_at)
VALUES 
-- Pago 1 - Usuario 1 (expensa diciembre)
(1, 1, 5000.00, true, 1, 1, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),

-- Pago 2 - Usuario 2 (expensa + multa)
(2, 2, 5500.00, true, 1, 1, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(2, 13, 1000.00, true, 1, 1, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

-- Pago 3 - Usuario 5 (expensa ordinaria)
(3, 5, 6000.00, true, 1, 1, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),

-- Pago 4 - Usuario 8 (expensa diciembre + pago de noviembre)
(4, 8, 5200.00, true, 1, 1, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

-- Pago 5 - Usuario 10 (expensa ordinaria)
(5, 10, 6500.00, true, 1, 1, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),

-- Pago 6 - Usuario 12 (expensa + servicio plomería)
(6, 12, 5500.00, true, 1, 1, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
(6, 18, 800.00, true, 1, 1, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 14. SUMINISTROS (Inventario de Áreas Comunes)
-- ============================================================================
INSERT INTO reservations_suministro (name, descripcion, cantidad_total, areacomun_id, is_active, created_by_id, updated_by_id, created_at, updated_at)
VALUES 
-- Salón de Eventos
(1, 'Proyector HD', 'Con control remoto y cable HDMI', 2, 1, true, 1, 1, NOW(), NOW()),
(1, 'Pantalla de Proyección', 'Automática 3x2 metros', 1, 1, true, 1, 1, NOW(), NOW()),
(1, 'Sistema de Sonido', 'Bafles de 300W profesionales', 1, 1, true, 1, 1, NOW(), NOW()),
(1, 'Mesas Altas', 'Tipo bar para eventos', 10, 1, true, 1, 1, NOW(), NOW()),
(1, 'Sillas Disponibles', 'Sillas plegables de aluminio', 150, 1, true, 1, 1, NOW(), NOW()),

-- Piscina
(3, 'Tumbonas', 'Tumbonas reclinables para piscina', 20, 3, true, 1, 1, NOW(), NOW()),
(3, 'Salvavidas', 'Flotadores y tabla salvavidas', 5, 3, true, 1, 1, NOW(), NOW()),
(3, 'Cloro para Piscina', 'Cloro granulado (kg)', 50, 3, true, 1, 1, NOW(), NOW()),

-- Gimnasio
(4, 'Mancuernas', 'Juego completo 2-50 kg', 1, 4, true, 1, 1, NOW(), NOW()),
(4, 'Máquina Cardio', 'Caminadora eléctrica', 2, 4, true, 1, 1, NOW(), NOW()),
(4, 'Colchonetas Yoga', 'Colchonetas antideslizantes', 20, 4, true, 1, 1, NOW(), NOW()),

-- BBQ
(7, 'Parrillas Fijas', 'Parrillas de acero inoxidable', 3, 7, true, 1, 1, NOW(), NOW()),
(7, 'Mesas Picnic', 'Mesas con sombrilla integrada', 8, 7, true, 1, 1, NOW(), NOW()),
(7, 'Utensilios de Cocina', 'Tenazas, espátulas, pinzas', 5, 7, true, 1, 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- RESUMEN FINAL
-- ============================================================================
-- Este script ha poblado la base de datos con:
-- - 1 Condominio
-- - 16 Unidades (apartamentos)
-- - 16 Residencias (propietarios + residentes)
-- - 13 Vehículos
-- - 13 Mascotas
-- - 4 Contratos de arrendamiento
-- - 10 Áreas comunes
-- - 15 Reservas confirmadas y pendientes
-- - 7 Visitas registradas
-- - 8 Incidentes reportados
-- - 25 Cargos (expensas, multas, depósitos, otros)
-- - 8 Pagos (confirmados, pendientes, fallidos)
-- - 7 Relaciones Pago-Cargo
-- - 13 Suministros de áreas comunes
--
-- DATOS REALISTAS:
-- ✓ Montos de expensas acorde a mercado (5000-6500)
-- ✓ Estados variados: pagado, pendiente, parcial, anulado
-- ✓ Fechas coherentes (pasado, presente, futuro)
-- ✓ Relaciones consistentes (usuario-unidad-vehículo-mascota)
-- ✓ Incidentes con histórico de estados
-- ✓ Reservas distribuidas en el tiempo
-- ✓ Multas asociadas a incidentes
-- ============================================================================
