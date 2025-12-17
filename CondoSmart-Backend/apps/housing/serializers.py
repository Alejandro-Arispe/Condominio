# -*- coding: utf-8 -*-
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Condominio, Unidad, Residency, Vehiculo, Mascota, Contrato

User = get_user_model()


class UserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']


class CondominioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Condominio
        fields = '__all__'
    
    def validate_name(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("El nombre debe tener al menos 3 caracteres")
        return value


class UnidadSerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True, required=False, allow_null=True
    )
    
    class Meta:
        model = Unidad
        fields = '__all__'
    
    def validate(self, data):
        # Validar que el código sea único por condominio
        condominio = data.get('condominio')
        code = data.get('code')
        
        if condominio and code:
            existing = Unidad.objects.filter(condominio=condominio, code=code)
            if self.instance:
                existing = existing.exclude(pk=self.instance.pk)
            
            if existing.exists():
                raise serializers.ValidationError({
                    'code': 'Ya existe una unidad con este código en el condominio'
                })
        
        return data


class ResidencySerializer(serializers.ModelSerializer):
    user = UserBasicSerializer(read_only=True)
    unidad = UnidadSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )
    unidad_id = serializers.PrimaryKeyRelatedField(
        queryset=Unidad.objects.all(), source='unidad', write_only=True
    )
    
    class Meta:
        model = Residency
        fields = '__all__'
    
    def validate(self, data):
        # Validar que no haya residencias duplicadas activas
        user = data.get('user')
        unidad = data.get('unidad')
        
        if user and unidad:
            existing = Residency.objects.filter(
                user=user,
                unidad=unidad,
                fecha_salida__isnull=True
            )
            if self.instance:
                existing = existing.exclude(pk=self.instance.pk)
            
            if existing.exists():
                raise serializers.ValidationError(
                    'El usuario ya tiene una residencia activa en esta unidad'
                )
        
        # Validar fechas
        fecha_ingreso = data.get('fecha_ingreso')
        fecha_salida = data.get('fecha_salida')
        
        if fecha_salida and fecha_ingreso and fecha_salida < fecha_ingreso:
            raise serializers.ValidationError({
                'fecha_salida': 'La fecha de salida no puede ser anterior a la de ingreso'
            })
        
        return data


class VehiculoSerializer(serializers.ModelSerializer):
    responsable = UserBasicSerializer(read_only=True)
    responsable_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='responsable', write_only=True
    )
    
    class Meta:
        model = Vehiculo
        fields = '__all__'
    
    def validate_placa(self, value):
        # Validar formato de placa (ejemplo: ABC-1234)
        import re
        if not re.match(r'^[A-Z]{3}-\d{4}$', value.upper()):
            raise serializers.ValidationError(
                'Formato de placa inválido. Use: ABC-1234'
            )
        return value.upper()
    
    def validate(self, data):
        # Validar que la placa sea única
        placa = data.get('placa')
        if placa:
            existing = Vehiculo.objects.filter(placa=placa)
            if self.instance:
                existing = existing.exclude(pk=self.instance.pk)
            
            if existing.exists():
                raise serializers.ValidationError({
                    'placa': 'Ya existe un vehículo registrado con esta placa'
                })
        
        return data


class MascotaSerializer(serializers.ModelSerializer):
    responsable = UserBasicSerializer(read_only=True)
    responsable_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='responsable', write_only=True
    )
    
    class Meta:
        model = Mascota
        fields = '__all__'
    
    def validate_nombre(self, value):
        if len(value) < 2:
            raise serializers.ValidationError("El nombre debe tener al menos 2 caracteres")
        return value


class ContratoSerializer(serializers.ModelSerializer):
    duenno = UserBasicSerializer(read_only=True)
    inquilino = UserBasicSerializer(read_only=True)
    duenno_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='duenno', write_only=True
    )
    inquilino_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='inquilino', write_only=True
    )
    
    class Meta:
        model = Contrato
        fields = '__all__'
    
    def validate(self, data):
        # Validar que dueño e inquilino sean diferentes
        duenno = data.get('duenno')
        inquilino = data.get('inquilino')
        
        if duenno and inquilino and duenno == inquilino:
            raise serializers.ValidationError(
                'El dueño y el inquilino no pueden ser la misma persona'
            )
        
        # Validar fechas
        fecha_inicio = data.get('fecha_inicio')
        fecha_fin = data.get('fecha_fin')
        
        if fecha_fin and fecha_inicio and fecha_fin <= fecha_inicio:
            raise serializers.ValidationError({
                'fecha_fin': 'La fecha de fin debe ser posterior a la fecha de inicio'
            })
        
        # Validar monto
        monto = data.get('monto')
        if monto and monto <= 0:
            raise serializers.ValidationError({
                'monto': 'El monto debe ser mayor a 0'
            })
        
        return data
