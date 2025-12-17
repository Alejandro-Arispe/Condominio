from django.db import models
from django.contrib.auth import get_user_model
from apps.housing.models import BaseModel, Unidad

User = get_user_model()


class TicketMantenimiento(BaseModel):
    """Maintenance ticket model"""
    TIPO_CHOICES = [
        ('mantenimiento', 'Mantenimiento'),
        ('limpieza', 'Limpieza'),
        ('reparacion', 'Reparación'),
        ('plagas', 'Control de Plagas'),
        ('jardineria', 'Jardinería'),
    ]
    
    PRIORIDAD_CHOICES = [
        ('baja', 'Baja'),
        ('media', 'Media'),
        ('alta', 'Alta'),
        ('urgente', 'Urgente'),
    ]
    
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('en_progreso', 'En Progreso'),
        ('completado', 'Completado'),
        ('cancelado', 'Cancelado'),
    ]
    
    unidad = models.ForeignKey(Unidad, on_delete=models.CASCADE, related_name='tickets')
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    descripcion = models.TextField()
    prioridad = models.CharField(max_length=20, choices=PRIORIDAD_CHOICES, default='media')
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    fecha_atencion = models.DateTimeField(null=True, blank=True)
    observaciones = models.TextField(blank=True)
    
    class Meta:
        db_table = 'maintenance_ticket'
        verbose_name = 'Ticket de Mantenimiento'
        verbose_name_plural = 'Tickets de Mantenimiento'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.tipo} - {self.unidad.code} - {self.estado}"


class FotoTicket(BaseModel):
    """Photo evidence for maintenance tickets"""
    ticket = models.ForeignKey(TicketMantenimiento, on_delete=models.CASCADE, related_name='fotos')
    foto_key = models.CharField(max_length=500)
    foto_url = models.URLField(max_length=500)
    
    class Meta:
        db_table = 'maintenance_fototicket'
        verbose_name = 'Foto de Ticket'
        verbose_name_plural = 'Fotos de Tickets'
    
    def __str__(self):
        return f"Foto - Ticket {self.ticket.id}"
