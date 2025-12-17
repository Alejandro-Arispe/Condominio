# -*- coding: utf-8 -*-
from rest_framework import serializers
from .models import AreaComun, Reserva, Suministro
from datetime import datetime, timedelta


class AreaComunSerializer(serializers.ModelSerializer):
    class Meta:
        model = AreaComun
        fields = '__all__'
    
    def validate_name(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("El nombre debe tener al menos 3 caracteres")
        return value
    
    def validate_capacidad(self, value):
        if value <= 0:
            raise serializers.ValidationError("La capacidad debe ser mayor a 0")
        if value > 1000:
            raise serializers.ValidationError("La capacidad no puede exceder 1000 personas")
        return value
    
    def validate_precio_por_hora(self, value):
        if value < 0:
            raise serializers.ValidationError("El precio no puede ser negativo")
        if value > 10000:
            raise serializers.ValidationError("El precio excede el límite permitido")
        return value
    
    def validate(self, data):
        # Validar horarios
        apertura = data.get('horario_apertura')
        cierre = data.get('horario_cierre')
        
        if apertura and cierre:
            # Convertir a datetime para comparar
            apertura_time = datetime.strptime(str(apertura), '%H:%M:%S').time() if isinstance(apertura, str) else apertura
            cierre_time = datetime.strptime(str(cierre), '%H:%M:%S').time() if isinstance(cierre, str) else cierre
            
            if cierre_time <= apertura_time:
                raise serializers.ValidationError({
                    'horario_cierre': 'El horario de cierre debe ser posterior al de apertura'
                })
        
        return data


class ReservaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserva
        fields = '__all__'
    
    def validate(self, data):
        start = data.get('start')
        end = data.get('end')
        area = data.get('area')
        
        # Validar que end sea posterior a start
        if end and start and end <= start:
            raise serializers.ValidationError({
                'end': 'La hora de fin debe ser posterior a la hora de inicio'
            })
        
        # Validar duración mínima (30 minutos)
        if start and end:
            duracion = (end - start).total_seconds() / 3600
            if duracion < 0.5:
                raise serializers.ValidationError(
                    'La duración mínima de una reserva es 30 minutos'
                )
            
            # Validar duración máxima (12 horas)
            if duracion > 12:
                raise serializers.ValidationError(
                    'La duración máxima de una reserva es 12 horas'
                )
        
        # Validar que la reserva esté dentro del horario del área
        if area and start and end:
            start_time = start.time()
            end_time = end.time()
            
            if start_time < area.horario_apertura:
                raise serializers.ValidationError({
                    'start': f'El área abre a las {area.horario_apertura}'
                })
            
            if end_time > area.horario_cierre:
                raise serializers.ValidationError({
                    'end': f'El área cierra a las {area.horario_cierre}'
                })
        
        # Validar que no se reserve en el pasado
        if start and start < datetime.now(start.tzinfo):
            raise serializers.ValidationError({
                'start': 'No se pueden hacer reservas en el pasado'
            })
        
        return data


class SuministroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suministro
        fields = '__all__'
    
    def validate_nombre(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("El nombre debe tener al menos 3 caracteres")
        return value
    
    def validate_cantidad(self, value):
        if value < 0:
            raise serializers.ValidationError("La cantidad no puede ser negativa")
        return value
