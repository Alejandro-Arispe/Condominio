from django.db import models
from django.contrib.auth import get_user_model
from apps.housing.models import BaseModel, Unidad

User = get_user_model()


class Visita(BaseModel):
    """Visitor model"""
    name = models.CharField(max_length=200)
    documento = models.CharField(max_length=50)
    telefono = models.CharField(max_length=20, blank=True)
    fecha_inicio = models.DateTimeField()
    dias_permiso = models.IntegerField(default=1)
    
    class Meta:
        db_table = 'security_visita'
        verbose_name = 'Visita'
        verbose_name_plural = 'Visitas'
        ordering = ['-fecha_inicio']
    
    def __str__(self):
        return f"{self.name} - {self.documento}"


class Incidente(BaseModel):
    """Incident model"""
    ESTADO_CHOICES = [
        ('abierto', 'Abierto'),
        ('en_progreso', 'En Progreso'),
        ('cerrado', 'Cerrado'),
    ]
    
    unidad = models.ForeignKey(Unidad, on_delete=models.CASCADE, related_name='incidentes')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='incidentes')
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='abierto')
    
    class Meta:
        db_table = 'security_incidente'
        verbose_name = 'Incidente'
        verbose_name_plural = 'Incidentes'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.titulo} - {self.unidad.code}"


class Acceso(BaseModel):
    """Access control model"""
    TIPO_CHOICES = [
        ('facial', 'Reconocimiento Facial'),
        ('placa', 'Reconocimiento de Placa'),
        ('manual', 'Manual'),
        ('qr', 'Código QR'),
    ]
    
    SENTIDO_CHOICES = [
        ('in', 'Entrada'),
        ('out', 'Salida'),
    ]
    
    unidad = models.ForeignKey(Unidad, on_delete=models.CASCADE, related_name='accesos', null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='accesos')
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    sentido = models.CharField(max_length=10, choices=SENTIDO_CHOICES, default='in')
    permitido = models.BooleanField(default=False)
    confianza = models.FloatField(null=True, blank=True)
    foto_key = models.CharField(max_length=500, blank=True)
    placa = models.CharField(max_length=20, blank=True)
    
    class Meta:
        db_table = 'security_acceso'
        verbose_name = 'Acceso'
        verbose_name_plural = 'Accesos'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.tipo} - {self.sentido} - {self.created_at}"
