# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class BaseModel(models.Model):
    """Abstract base model with common fields"""
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='%(class)s_created')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='%(class)s_updated')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True


class Condominio(BaseModel):
    """Condominium model"""
    TIPO_CHOICES = [
        ('vertical', 'Vertical'),
        ('horizontal', 'Horizontal'),
    ]
    
    name = models.CharField(max_length=200)
    direccion = models.CharField(max_length=500)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='vertical')
    
    class Meta:
        db_table = 'housing_condominio'
    
    def __str__(self):
        return self.name


class Unidad(BaseModel):
    """Housing unit model"""
    condominio = models.ForeignKey(Condominio, on_delete=models.CASCADE, related_name='unidades')
    code = models.CharField(max_length=20, unique=True)
    direccion = models.CharField(max_length=500)
    piso = models.IntegerField(default=1)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='unidades')
    
    class Meta:
        db_table = 'housing_unidad'
        ordering = ['code']
    
    def __str__(self):
        return f"{self.code} - {self.condominio.name}"


class Residency(BaseModel):
    """Residency relationship between user and unit"""
    TIPO_CHOICES = [
        ('propietario', 'Propietario'),
        ('residente', 'Residente'),
        ('inquilino', 'Inquilino'),
    ]
    
    STATUS_CHOICES = [
        ('activa', 'Activa'),
        ('inactiva', 'Inactiva'),
        ('suspendida', 'Suspendida'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='residencias')
    unidad = models.ForeignKey(Unidad, on_delete=models.CASCADE, related_name='residencias')
    tipo_ocupacion = models.CharField(max_length=20, choices=TIPO_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='activa')
    is_owner = models.BooleanField(default=False)
    start = models.DateField()
    end = models.DateField(null=True, blank=True)
    
    class Meta:
        db_table = 'housing_residency'
    
    def __str__(self):
        return f"{self.user.username} - {self.unidad.code}"


class Vehiculo(BaseModel):
    """Vehicle model"""
    unidad = models.ForeignKey(Unidad, on_delete=models.CASCADE, related_name='vehiculos')
    responsable = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vehiculos')
    placa = models.CharField(max_length=20, unique=True)
    marca = models.CharField(max_length=100)
    color = models.CharField(max_length=50)
    observacion = models.TextField(blank=True)
    
    class Meta:
        db_table = 'housing_vehiculo'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.placa} - {self.marca}"


class Mascota(BaseModel):
    """Pet model"""
    TIPO_CHOICES = [
        ('perro', 'Perro'),
        ('gato', 'Gato'),
        ('otro', 'Otro'),
    ]
    
    name = models.CharField(max_length=100)
    raza = models.CharField(max_length=100)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    desde = models.DateField()
    hasta = models.DateField(null=True, blank=True)
    responsable = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mascotas')
    
    class Meta:
        db_table = 'housing_mascota'
    
    def __str__(self):
        return f"{self.name} ({self.tipo})"


class Contrato(BaseModel):
    """Rental contract model"""
    unidad = models.ForeignKey(Unidad, on_delete=models.CASCADE, related_name='contratos')
    duenno = models.ForeignKey(User, on_delete=models.CASCADE, related_name='contratos_como_duenno')
    inquilino = models.ForeignKey(User, on_delete=models.CASCADE, related_name='contratos_como_inquilino')
    descripcion = models.TextField()
    start = models.DateField()
    end = models.DateField()
    monto_mensual = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        db_table = 'housing_contrato'
    
    def __str__(self):
        return f"Contrato {self.unidad.code} - {self.inquilino.username}"
