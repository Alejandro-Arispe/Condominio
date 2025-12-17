# -*- coding: utf-8 -*-
from rest_framework import serializers
from .models import Comunicado


class ComunicadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comunicado
        fields = '__all__'
    
    def validate_titulo(self, value):
        if len(value) < 5:
            raise serializers.ValidationError(
                "El título debe tener al menos 5 caracteres"
            )
        if len(value) > 200:
            raise serializers.ValidationError(
                "El título no puede exceder 200 caracteres"
            )
        return value
    
    def validate_contenido(self, value):
        if len(value) < 20:
            raise serializers.ValidationError(
                "El contenido debe tener al menos 20 caracteres"
            )
        return value
    
    def validate_tipo(self, value):
        tipos_validos = ['general', 'urgente', 'mantenimiento', 'evento']
        if value not in tipos_validos:
            raise serializers.ValidationError(
                f"Tipo inválido. Opciones: {', '.join(tipos_validos)}"
            )
        return value
