# -*- coding: utf-8 -*-
"""
Script para poblar la base de datos con datos de prueba
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.housing.models import Condominio, Unidad, Residency, Vehiculo, Mascota
from apps.finance.models import Cargo, Pago
from apps.security.models import Visita, Incidente, Acceso
from apps.reservations.models import AreaComun, Reserva
from apps.maintenance.models import TicketMantenimiento
from apps.communications.models import Comunicado
from datetime import datetime, timedelta
from decimal import Decimal

User = get_user_model()


class Command(BaseCommand):
    help = 'Pobla la base de datos con datos de prueba'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Iniciando poblado de base de datos...\n'))

        # 1. Crear superusuario admin
        self.stdout.write(' Creando usuarios...')
        admin, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@condosmart.com',
                'first_name': 'Admin',
                'last_name': 'Sistema',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin.set_password('admin123')
            admin.save()
            self.stdout.write(self.style.SUCCESS('   Admin creado: admin@condosmart.com / admin123'))

        # 2. Crear usuarios residentes
        users_data = [
            {'username': 'alejandro', 'email': 'alejandro@example.com', 'first_name': 'Alejandro', 'last_name': 'López', 'role': 'propietario'},
            {'username': 'maria', 'email': 'maria@example.com', 'first_name': 'María', 'last_name': 'García', 'role': 'residente'},
            {'username': 'carlos', 'email': 'carlos@example.com', 'first_name': 'Carlos', 'last_name': 'Martínez', 'role': 'propietario'},
            {'username': 'ana', 'email': 'ana@example.com', 'first_name': 'Ana', 'last_name': 'Rodríguez', 'role': 'residente'},
        ]

        users = {}
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults={**user_data, 'email': user_data['email']}
            )
            if created:
                user.set_password('password123')
                user.save()
            users[user_data['username']] = user

        self.stdout.write(self.style.SUCCESS(f'  {len(users)} usuarios creados'))

        # 3. Crear condominio
        self.stdout.write(' Creando condominio...')
        condo, _ = Condominio.objects.get_or_create(
            name='CondoSmart Tower',
            defaults={
                'direccion': 'Avenida Principal 1500',
                'tipo': 'vertical',
                'created_by': admin,
                'updated_by': admin,
            }
        )
        self.stdout.write(self.style.SUCCESS('   Condominio creado'))

        # 4. Crear unidades
        self.stdout.write(' Creando unidades...')
        unidades_data = [
            {'code': '101', 'piso': 1, 'user': users['alejandro']},
            {'code': '102', 'piso': 1, 'user': users['maria']},
            {'code': '201', 'piso': 2, 'user': users['carlos']},
            {'code': '202', 'piso': 2, 'user': users['ana']},
            {'code': '301', 'piso': 3, 'user': None},
            {'code': '302', 'piso': 3, 'user': None},
        ]

        unidades = {}
        for unidad_data in unidades_data:
            unidad, _ = Unidad.objects.get_or_create(
                code=unidad_data['code'],
                defaults={
                    'condominio': condo,
                    'direccion': f"Avenida Principal 1500, Apt {unidad_data['code']}",
                    'piso': unidad_data['piso'],
                    'user': unidad_data['user'],
                    'created_by': admin,
                    'updated_by': admin,
                }
            )
            unidades[unidad_data['code']] = unidad

        self.stdout.write(self.style.SUCCESS(f'   {len(unidades)} unidades creadas'))

        # 5. Crear vehículos
        self.stdout.write('Creando vehículos...')
        vehiculos_data = [
            {'placa': 'ABC1234', 'marca': 'Toyota', 'color': 'Blanco', 'unidad': '101', 'responsable': 'alejandro'},
            {'placa': 'XYZ5678', 'marca': 'Nissan', 'color': 'Negro', 'unidad': '102', 'responsable': 'maria'},
            {'placa': 'DEF9012', 'marca': 'Chevrolet', 'color': 'Rojo', 'unidad': '201', 'responsable': 'carlos'},
        ]

        for veh_data in vehiculos_data:
            Vehiculo.objects.get_or_create(
                placa=veh_data['placa'],
                defaults={
                    'unidad': unidades[veh_data['unidad']],
                    'responsable': users[veh_data['responsable']],
                    'marca': veh_data['marca'],
                    'color': veh_data['color'],
                    'observacion': 'Vehículo registrado',
                    'created_by': admin,
                    'updated_by': admin,
                }
            )

        self.stdout.write(self.style.SUCCESS(f'  ✅ {len(vehiculos_data)} vehículos creados'))

        # 6. Crear áreas comunes
        self.stdout.write(' Creando áreas comunes...')
        areas_data = [
            {'name': 'Salón de Eventos', 'capacidad': 100, 'precio': 500, 'apertura': '08:00', 'cierre': '23:00', 'deposito': 1000},
            {'name': 'Piscina', 'capacidad': 50, 'precio': 200, 'apertura': '09:00', 'cierre': '21:00', 'deposito': 500},
            {'name': 'Gimnasio', 'capacidad': 25, 'precio': 100, 'apertura': '06:00', 'cierre': '23:00', 'deposito': 200},
            {'name': 'Cancha de Tenis', 'capacidad': 4, 'precio': 300, 'apertura': '07:00', 'cierre': '21:00', 'deposito': 400},
        ]

        areas = {}
        for area_data in areas_data:
            area, _ = AreaComun.objects.get_or_create(
                name=area_data['name'],
                defaults={
                    'descripcion': f"Área común: {area_data['name']}",
                    'capacidad': area_data['capacidad'],
                    'precio_por_hora': Decimal(area_data['precio']),
                    'horario_apertura': area_data['apertura'],
                    'horario_cierre': area_data['cierre'],
                    'deposit_amount': Decimal(area_data['deposito']),
                    'created_by': admin,
                    'updated_by': admin,
                }
            )
            areas[area_data['name']] = area

        self.stdout.write(self.style.SUCCESS(f'  {len(areas)} áreas comunes creadas'))

        # 7. Crear cargos (expensas)
        self.stdout.write('💰 Creando cargos...')
        periodo_date = datetime(2025, 12, 1).date()
        vencimiento_date = datetime(2025, 12, 15).date()
        
        for code, unidad in unidades.items():
            Cargo.objects.get_or_create(
                unidad=unidad,
                concepto='cuota',
                periodo=periodo_date,
                defaults={
                    'descripcion': 'Expensa ordinaria diciembre 2025',
                    'monto': Decimal('5000.00'),
                    'fecha_vencimiento': vencimiento_date,
                    'estado': 'pendiente',
                    'created_by': admin,
                    'updated_by': admin,
                }
            )

        self.stdout.write(self.style.SUCCESS('   Cargos creados'))


        # 8. Crear comunicados
        self.stdout.write(' Creando comunicados...')
        comunicados_data = [
            {'titulo': 'Bienvenidos a CondoSmart', 'tipo': 'general', 'contenido': 'Sistema de gestión integral para condominios'},
            {'titulo': 'Mantenimiento programado', 'tipo': 'mantenimiento', 'contenido': 'Se realizará mantenimiento de ascensores el próximo sábado'},
            {'titulo': 'Fiesta de fin de año', 'tipo': 'evento', 'contenido': 'Los invitamos a la fiesta de fin de año en el salón de eventos'},
        ]

        for com_data in comunicados_data:
            Comunicado.objects.get_or_create(
                titulo=com_data['titulo'],
                defaults={
                    'contenido': com_data['contenido'],
                    'tipo': com_data['tipo'],
                    'created_by': admin,
                    'updated_by': admin,
                }
            )
        self.stdout.write(self.style.SUCCESS(f'  {len(comunicados_data)} comunicados creados'))

        # Resumen final
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.SUCCESS(' Base de datos poblada exitosamente!\n'))
        self.stdout.write(self.style.SUCCESS(' Resumen:'))
        self.stdout.write(f'  👥 Usuarios: {User.objects.count()}')
        self.stdout.write(f'  🏢 Condominios: {Condominio.objects.count()}')
        self.stdout.write(f'  🏠 Unidades: {Unidad.objects.count()}')
        self.stdout.write(f'  🚗 Vehículos: {Vehiculo.objects.count()}')
        self.stdout.write(f'  🏊 Áreas comunes: {AreaComun.objects.count()}')
        self.stdout.write(f'  💰 Cargos: {Cargo.objects.count()}')
        self.stdout.write(f'  📢 Comunicados: {Comunicado.objects.count()}')
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.SUCCESS('\n🔑 Credenciales de acceso:'))
        self.stdout.write('  📧 Email:    admin@condosmart.com')
        self.stdout.write('  🔐 Password: admin123')
        self.stdout.write('='*60 + '\n')
