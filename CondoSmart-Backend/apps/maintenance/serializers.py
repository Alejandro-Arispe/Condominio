# -*- coding: utf-8 -*-
from rest_framework import serializers
from .models import TicketMantenimiento, FotoTicket


class TicketMantenimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketMantenimiento
        fields = '__all__'
    
    def validate_tipo(self, value):
        tipos_validos = ['mantenimiento', 'limpieza', 'reparacion', 'plagas', 'jardineria']
        if value not in tipos_validos:
            raise serializers.ValidationError(
                f"Tipo inválido. Opciones: {', '.join(tipos_validos)}"
            )
        return value
    
    def validate_prioridad(self, value):
        prioridades_validas = ['baja', 'media', 'alta', 'urgente']
        if value not in prioridades_validas:
            raise serializers.ValidationError(
                f"Prioridad inválida. Opciones: {', '.join(prioridades_validas)}"
            )
        return value
    
    def validate_descripcion(self, value):
        if len(value) < 10:
            raise serializers.ValidationError(
                "La descripción debe tener al menos 10 caracteres"
            )
        return value
    
    def validate(self, data):
        # Validar que fecha_completado sea posterior a fecha_reporte
        fecha_reporte = data.get('fecha_reporte')
        fecha_completado = data.get('fecha_completado')
        
        if fecha_completado and fecha_reporte and fecha_completado < fecha_reporte:
            raise serializers.ValidationError({
                'fecha_completado': 'La fecha de completado no puede ser anterior a la fecha de reporte'
            })
        
        return data


class FotoTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = FotoTicket
        fields = '__all__'
    
    def validate_foto(self, value):
        # Validar tamaño de archivo (máximo 5MB)
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("El archivo no debe exceder 5MB")
        
        # Validar tipo de archivo
        allowed_types = ['image/jpeg', 'image/png', 'image/jpg']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError(
                "Solo se permiten archivos JPEG y PNG"
            )
        
        return value
