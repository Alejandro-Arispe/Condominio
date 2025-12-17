# -*- coding: utf-8 -*-
from rest_framework import serializers
from .models import Cargo, Pago, PagoCargo, ConfiguracionExpensa, Recordatorio
from decimal import Decimal


class CargoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cargo
        fields = '__all__'
    
    def validate_monto(self, value):
        if value <= 0:
            raise serializers.ValidationError("El monto debe ser mayor a 0")
        if value > 999999.99:
            raise serializers.ValidationError("El monto excede el límite permitido")
        return value
    
    def validate_concepto(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("El concepto debe tener al menos 3 caracteres")
        return value
    
    def validate(self, data):
        # Validar que no haya cargos duplicados para la misma unidad y período
        unidad = data.get('unidad')
        concepto = data.get('concepto')
        periodo = data.get('periodo')
        
        if unidad and concepto and periodo:
            existing = Cargo.objects.filter(
                unidad=unidad,
                concepto=concepto,
                periodo=periodo
            )
            if self.instance:
                existing = existing.exclude(pk=self.instance.pk)
            
            if existing.exists():
                raise serializers.ValidationError(
                    'Ya existe un cargo con el mismo concepto para esta unidad en este período'
                )
        
        # Validar que fecha_vencimiento sea posterior a periodo
        periodo = data.get('periodo')
        fecha_vencimiento = data.get('fecha_vencimiento')
        
        if periodo and fecha_vencimiento and fecha_vencimiento < periodo:
            raise serializers.ValidationError({
                'fecha_vencimiento': 'La fecha de vencimiento debe ser posterior al período'
            })
        
        return data


class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = '__all__'
    
    def validate_monto(self, value):
        if value <= 0:
            raise serializers.ValidationError("El monto debe ser mayor a 0")
        if value > 999999.99:
            raise serializers.ValidationError("El monto excede el límite permitido")
        return value
    
    def validate_metodo(self, value):
        metodos_validos = ['efectivo', 'transferencia', 'tarjeta', 'cheque']
        if value not in metodos_validos:
            raise serializers.ValidationError(
                f"Método de pago inválido. Opciones: {', '.join(metodos_validos)}"
            )
        return value


class PagoCargoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PagoCargo
        fields = '__all__'
    
    def validate(self, data):
        pago = data.get('pago')
        cargo = data.get('cargo')
        monto = data.get('monto')
        
        # Validar que el monto no exceda el cargo
        if cargo and monto and monto > cargo.monto:
            raise serializers.ValidationError({
                'monto': 'El monto no puede exceder el monto del cargo'
            })
        
        # Validar que el pago y cargo sean de la misma unidad
        if pago and cargo and pago.unidad != cargo.unidad:
            raise serializers.ValidationError(
                'El pago y el cargo deben ser de la misma unidad'
            )
        
        # Validar que no se exceda el monto del pago
        if pago and monto:
            total_asignado = PagoCargo.objects.filter(pago=pago).aggregate(
                total=serializers.models.Sum('monto')
            )['total'] or Decimal('0')
            
            if self.instance:
                total_asignado -= self.instance.monto
            
            if total_asignado + monto > pago.monto:
                raise serializers.ValidationError({
                    'monto': 'El monto total asignado excede el monto del pago'
                })
        
        return data


class ConfiguracionExpensaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfiguracionExpensa
        fields = '__all__'
    
    def validate_nombre(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("El nombre debe tener al menos 3 caracteres")
        return value
    
    def validate_monto_base(self, value):
        if value < 0:
            raise serializers.ValidationError("El monto base no puede ser negativo")
        return value
    
    def validate_dia_generacion(self, value):
        if value < 1 or value > 28:
            raise serializers.ValidationError("El día de generación debe estar entre 1 y 28")
        return value
    
    def validate_dias_vencimiento(self, value):
        if value < 1 or value > 90:
            raise serializers.ValidationError("Los días de vencimiento deben estar entre 1 y 90")
        return value


class RecordatorioSerializer(serializers.ModelSerializer):
    cargo_info = CargoSerializer(source='cargo', read_only=True)
    
    class Meta:
        model = Recordatorio
        fields = '__all__'
    
    def validate_mensaje(self, value):
        if len(value) < 10:
            raise serializers.ValidationError("El mensaje debe tener al menos 10 caracteres")
        return value
