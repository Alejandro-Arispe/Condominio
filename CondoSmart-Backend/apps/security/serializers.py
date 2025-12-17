# -*- coding: utf-8 -*-
from rest_framework import serializers
from .models import Visita, Incidente, Acceso


class VisitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visita
        fields = '__all__'
    
    def validate_nombre(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("El nombre debe tener al menos 3 caracteres")
        return value
    
    def validate(self, data):
        # Validar que hora_salida sea posterior a hora_ingreso
        hora_ingreso = data.get('hora_ingreso')
        hora_salida = data.get('hora_salida')
        
        if hora_salida and hora_ingreso and hora_salida <= hora_ingreso:
            raise serializers.ValidationError({
                'hora_salida': 'La hora de salida debe ser posterior a la hora de ingreso'
            })
        
        return data


class IncidenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incidente
        fields = '__all__'
    
    def validate_tipo(self, value):
        tipos_validos = ['seguridad', 'ruido', 'vandalismo', 'otro']
        if value not in tipos_validos:
            raise serializers.ValidationError(
                f"Tipo inválido. Opciones: {', '.join(tipos_validos)}"
            )
        return value
    
    def validate_severidad(self, value):
        severidades_validas = ['baja', 'media', 'alta', 'critica']
        if value not in severidades_validas:
            raise serializers.ValidationError(
                f"Severidad inválida. Opciones: {', '.join(severidades_validas)}"
            )
        return value
    
    def validate_descripcion(self, value):
        if len(value) < 10:
            raise serializers.ValidationError(
                "La descripción debe tener al menos 10 caracteres"
            )
        return value


class AccesoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Acceso
        fields = '__all__'
    
    def validate_tipo(self, value):
        tipos_validos = ['facial', 'placa', 'manual', 'qr']
        if value not in tipos_validos:
            raise serializers.ValidationError(
                f"Tipo inválido. Opciones: {', '.join(tipos_validos)}"
            )
        return value
    
    def validate_sentido(self, value):
        sentidos_validos = ['in', 'out']
        if value not in sentidos_validos:
            raise serializers.ValidationError(
                f"Sentido inválido. Opciones: {', '.join(sentidos_validos)}"
            )
        return value
