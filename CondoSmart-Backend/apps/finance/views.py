# -*- coding: utf-8 -*-
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Q
from django.utils import timezone
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from .models import Cargo, Pago, PagoCargo, ConfiguracionExpensa, Recordatorio
from .serializers import (
    CargoSerializer, PagoSerializer, PagoCargoSerializer,
    ConfiguracionExpensaSerializer, RecordatorioSerializer
)
from apps.housing.models import Unidad


class CargoViewSet(viewsets.ModelViewSet):
    queryset = Cargo.objects.all()
    serializer_class = CargoSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)
    
    @action(detail=False, methods=['get'])
    def por_unidad(self, request):
        """Obtiene todos los cargos de una unidad específica"""
        unidad_id = request.query_params.get('unidad_id')
        if not unidad_id:
            return Response({'error': 'unidad_id requerido'}, status=status.HTTP_400_BAD_REQUEST)
        
        cargos = self.queryset.filter(unidad_id=unidad_id)
        serializer = self.get_serializer(cargos, many=True)
        
        # Calcular totales
        total_cargos = cargos.aggregate(total=Sum('monto'))['total'] or 0
        pendientes = cargos.filter(estado='pendiente').aggregate(total=Sum('monto'))['total'] or 0
        
        return Response({
            'cargos': serializer.data,
            'total_cargos': float(total_cargos),
            'total_pendiente': float(pendientes)
        })
    
    @action(detail=False, methods=['post'])
    def generar_expensas(self, request):
        """Genera expensas automáticas para todas las unidades según configuración"""
        periodo = request.data.get('periodo')  # Formato: YYYY-MM-DD
        
        if not periodo:
            return Response({'error': 'Período requerido'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            periodo_date = datetime.strptime(periodo, '%Y-%m-%d').date()
        except ValueError:
            return Response({'error': 'Formato de período inválido (use YYYY-MM-DD)'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Obtener configuraciones activas
        configuraciones = ConfiguracionExpensa.objects.filter(activo=True)
        
        if not configuraciones.exists():
            return Response({'error': 'No hay configuraciones de expensas activas'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Obtener todas las unidades activas
        unidades = Unidad.objects.filter(is_active=True)
        
        cargos_creados = 0
        errores = []
        
        for config in configuraciones:
            for unidad in unidades:
                # Verificar si ya existe un cargo para este período
                existe = Cargo.objects.filter(
                    unidad=unidad,
                    concepto=config.concepto,
                    periodo=periodo_date
                ).exists()
                
                if existe:
                    continue
                
                try:
                    # Calcular monto según tipo
                    if config.tipo == 'fijo':
                        monto = config.monto_base
                    elif config.tipo == 'variable':
                        # Aquí podrías agregar lógica para calcular según características de la unidad
                        monto = config.monto_base
                    else:  # porcentaje
                        # Calcular porcentaje sobre alguna base
                        monto = config.monto_base
                    
                    # Calcular fecha de vencimiento
                    fecha_vencimiento = periodo_date + timedelta(days=config.dias_vencimiento)
                    
                    # Crear cargo
                    Cargo.objects.create(
                        unidad=unidad,
                        concepto=config.concepto,
                        descripcion=config.descripcion or config.nombre,
                        monto=monto,
                        periodo=periodo_date,
                        fecha_vencimiento=fecha_vencimiento,
                        estado='pendiente',
                        created_by=request.user,
                        updated_by=request.user
                    )
                    cargos_creados += 1
                    
                except Exception as e:
                    errores.append(f"Error en unidad {unidad.code}: {str(e)}")
        
        return Response({
            'mensaje': 'Expensas generadas exitosamente',
            'cargos_creados': cargos_creados,
            'total_unidades': unidades.count(),
            'errores': errores
        })
    
    @action(detail=False, methods=['post'])
    def enviar_recordatorios(self, request):
        """Envía recordatorios de pago para cargos próximos a vencer o vencidos"""
        dias_anticipacion = int(request.data.get('dias_anticipacion', 5))
        
        hoy = timezone.now().date()
        fecha_limite = hoy + timedelta(days=dias_anticipacion)
        
        # Cargos próximos a vencer
        cargos_proximos = Cargo.objects.filter(
            estado='pendiente',
            fecha_vencimiento__lte=fecha_limite,
            fecha_vencimiento__gte=hoy
        )
        
        # Cargos vencidos
        cargos_vencidos = Cargo.objects.filter(
            estado='pendiente',
            fecha_vencimiento__lt=hoy
        )
        
        recordatorios_creados = 0
        
        # Crear recordatorios para próximos vencimientos
        for cargo in cargos_proximos:
            # Verificar si ya se envió recordatorio
            if not Recordatorio.objects.filter(cargo=cargo, tipo='proximo_vencimiento').exists():
                mensaje = f"Recordatorio: Su cargo de {cargo.concepto} por ${cargo.monto} vence el {cargo.fecha_vencimiento}"
                Recordatorio.objects.create(
                    cargo=cargo,
                    tipo='proximo_vencimiento',
                    mensaje=mensaje,
                    enviado=True,
                    created_by=request.user,
                    updated_by=request.user
                )
                recordatorios_creados += 1
        
        # Crear recordatorios para vencidos
        for cargo in cargos_vencidos:
            # Actualizar estado
            cargo.estado = 'vencido'
            cargo.save()
            
            # Verificar si ya se envió recordatorio
            if not Recordatorio.objects.filter(cargo=cargo, tipo='vencido').exists():
                mensaje = f"URGENTE: Su cargo de {cargo.concepto} por ${cargo.monto} está vencido desde el {cargo.fecha_vencimiento}"
                Recordatorio.objects.create(
                    cargo=cargo,
                    tipo='vencido',
                    mensaje=mensaje,
                    enviado=True,
                    created_by=request.user,
                    updated_by=request.user
                )
                recordatorios_creados += 1
        
        return Response({
            'mensaje': 'Recordatorios enviados exitosamente',
            'recordatorios_creados': recordatorios_creados,
            'cargos_proximos_vencer': cargos_proximos.count(),
            'cargos_vencidos': cargos_vencidos.count()
        })


class PagoViewSet(viewsets.ModelViewSet):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        pago = serializer.save(created_by=self.request.user, updated_by=self.request.user)
        
        # Auto-asignar pago a cargos pendientes de la misma unidad
        cargos_pendientes = Cargo.objects.filter(
            unidad=pago.unidad,
            estado='pendiente'
        ).order_by('periodo')
        
        monto_restante = pago.monto
        
        for cargo in cargos_pendientes:
            if monto_restante <= 0:
                break
            
            if monto_restante >= cargo.monto:
                # Pago completo del cargo
                PagoCargo.objects.create(
                    pago=pago,
                    cargo=cargo,
                    monto=cargo.monto,
                    created_by=self.request.user,
                    updated_by=self.request.user
                )
                cargo.estado = 'pagado'
                cargo.save()
                monto_restante -= cargo.monto
            else:
                # Pago parcial
                PagoCargo.objects.create(
                    pago=pago,
                    cargo=cargo,
                    monto=monto_restante,
                    created_by=self.request.user,
                    updated_by=self.request.user
                )
                monto_restante = 0
    
    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)


class PagoCargoViewSet(viewsets.ModelViewSet):
    queryset = PagoCargo.objects.all()
    serializer_class = PagoCargoSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)


class ConfiguracionExpensaViewSet(viewsets.ModelViewSet):
    queryset = ConfiguracionExpensa.objects.all()
    serializer_class = ConfiguracionExpensaSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)


class RecordatorioViewSet(viewsets.ModelViewSet):
    queryset = Recordatorio.objects.all()
    serializer_class = RecordatorioSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)
