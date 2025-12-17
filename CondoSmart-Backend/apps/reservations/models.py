from django.db import models
from django.contrib.auth import get_user_model
from apps.housing.models import BaseModel, Unidad

User = get_user_model()


class AreaComun(BaseModel):
    """Common area model"""
    name = models.CharField(max_length=200)
    descripcion = models.TextField()
    capacidad = models.IntegerField()
    precio_por_hora = models.DecimalField(max_digits=10, decimal_places=2)
    horario_apertura = models.TimeField()
    horario_cierre = models.TimeField()
    deposit_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    class Meta:
        db_table = 'reservations_areacomun'
        verbose_name = 'Área Común'
        verbose_name_plural = 'Áreas Comunes'
    
    def __str__(self):
        return self.name


class Reserva(BaseModel):
    """Reservation model"""
    STATUS_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('confirmada', 'Confirmada'),
        ('cancelada', 'Cancelada'),
        ('completada', 'Completada'),
    ]
    
    unidad = models.ForeignKey(Unidad, on_delete=models.CASCADE, related_name='reservas')
    area = models.ForeignKey(AreaComun, on_delete=models.CASCADE, related_name='reservas')
    start = models.DateTimeField()
    end = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pendiente')
    notas = models.TextField(blank=True)
    
    class Meta:
        db_table = 'reservations_reserva'
        verbose_name = 'Reserva'
        verbose_name_plural = 'Reservas'
        ordering = ['-start']
    
    def __str__(self):
        return f"{self.area.name} - {self.unidad.code} - {self.start}"


class Suministro(BaseModel):
    """Supply/Equipment model for common areas"""
    areacomun = models.ForeignKey(AreaComun, on_delete=models.CASCADE, related_name='suministros')
    name = models.CharField(max_length=200)
    descripcion = models.TextField()
    cantidad_total = models.IntegerField()
    
    class Meta:
        db_table = 'reservations_suministro'
        verbose_name = 'Suministro'
        verbose_name_plural = 'Suministros'
    
    def __str__(self):
        return f"{self.name} - {self.areacomun.name}"
