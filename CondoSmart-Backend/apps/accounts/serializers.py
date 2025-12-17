# -*- coding: utf-8 -*-
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
import re

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'photo_url', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def validate_username(self, value):
        if len(value) < 3:
            raise serializers.ValidationError(
                "El nombre de usuario debe tener al menos 3 caracteres"
            )
        if not re.match(r'^[a-zA-Z0-9_]+$', value):
            raise serializers.ValidationError(
                "El nombre de usuario solo puede contener letras, números y guiones bajos"
            )
        return value
    
    def validate_email(self, value):
        # Validar formato de email
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', value):
            raise serializers.ValidationError("Formato de email inválido")
        
        # Validar que el email sea único
        if self.instance:
            if User.objects.exclude(pk=self.instance.pk).filter(email=value).exists():
                raise serializers.ValidationError("Este email ya está registrado")
        else:
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("Este email ya está registrado")
        
        return value
    
    def validate_phone(self, value):
        if value and not re.match(r'^\+?[\d\s-]{7,15}$', value):
            raise serializers.ValidationError(
                "Formato de teléfono inválido. Use: +591 12345678"
            )
        return value
    
    def validate_role(self, value):
        roles_validos = ['admin', 'propietario', 'residente', 'inquilino', 'vigilancia']
        if value not in roles_validos:
            raise serializers.ValidationError(
                f"Rol inválido. Opciones: {', '.join(roles_validos)}"
            )
        return value
    
    def validate_password(self, value):
        if value:
            validate_password(value)
        return value
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password_confirm = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'role', 'phone', 'password', 'password_confirm']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Las contraseñas no coinciden'
            })
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user
