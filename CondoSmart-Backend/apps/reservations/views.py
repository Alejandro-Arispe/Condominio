# -*- coding: utf-8 -*-
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import datetime
from .models import AreaComun, Reserva, Suministro
from .serializers import AreaComunSerializer, ReservaSerializer, SuministroSerializer


class AreaComunViewSet(viewsets.ModelViewSet):
    queryset = AreaComun.objects.all()
    serializer_class = AreaComunSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)
    
    @action(detail=True, methods=['get'])
    def disponibilidad(self, request, pk=None):
        """Verifica disponibilidad de un área en una fecha específica"""
        area = self.get_object()
        fecha = request.query_params.get('fecha')
        
        if not fecha:
            return Response({'error': 'Fecha requerida'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            fecha_obj = datetime.fromisoformat(fecha)
        except ValueError:
            return Response({'error': 'Formato de fecha inválido'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Buscar reservas para esa fecha
        reservas = Reserva.objects.filter(
            area=area,
            start__date=fecha_obj.date(),
            status__in=['pendiente', 'confirmada', 'en_curso']
        ).order_by('start')
        
        horarios_ocupados = [
            {
                'inicio': r.start.isoformat(),
                'fin': r.end.isoformat(),
                'reserva_id': r.id
            }
            for r in reservas
        ]
        
        return Response({
            'area': area.name,
            'fecha': fecha,
            'horarios_ocupados': horarios_ocupados,
            'disponible': len(horarios_ocupados) == 0
        })


class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        # Validar disponibilidad
        area = serializer.validated_data['area']
        start = serializer.validated_data['start']
        end = serializer.validated_data['end']
        
        # Verificar que no haya conflictos
        conflictos = Reserva.objects.filter(
            area=area,
            status__in=['pendiente', 'confirmada', 'en_curso']
        ).filter(
            start__lt=end,
            end__gt=start
        )
        
        if conflictos.exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError('El área no está disponible en ese horario')
        
        # Calcular costo
        duracion_horas = (end - start).total_seconds() / 3600
        costo_total = area.precio_por_hora * duracion_horas
        
        serializer.save(
            created_by=self.request.user,
            updated_by=self.request.user,
            costo_total=costo_total
        )
    
    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def confirmar(self, request, pk=None):
        """Confirma una reserva pendiente"""
        reserva = self.get_object()
        if reserva.status != 'pendiente':
            return Response(
                {'error': 'Solo se pueden confirmar reservas pendientes'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reserva.status = 'confirmada'
        reserva.save()
        
        return Response({'status': 'Reserva confirmada'})
    
    @action(detail=True, methods=['post'])
    def cancelar(self, request, pk=None):
        """Cancela una reserva"""
        reserva = self.get_object()
        if reserva.status in ['completada', 'cancelada']:
            return Response(
                {'error': 'No se puede cancelar una reserva completada o ya cancelada'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reserva.status = 'cancelada'
        reserva.save()
        
        return Response({'status': 'Reserva cancelada'})


class SuministroViewSet(viewsets.ModelViewSet):
    queryset = Suministro.objects.all()
    serializer_class = SuministroSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)
    
    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)
