from django.db import models
from django.contrib.auth import get_user_model
from apps.housing.models import BaseModel

User = get_user_model()


class Comunicado(BaseModel):
    """Announcement/Communication model"""
    TIPO_CHOICES = [
        ('general', 'General'),
        ('urgente', 'Urgente'),
        ('mantenimiento', 'Mantenimiento'),
        ('evento', 'Evento'),
    ]
    
    titulo = models.CharField(max_length=200)
    contenido = models.TextField()
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='general')
    fecha_publicacion = models.DateTimeField(auto_now_add=True)
    fecha_expiracion = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'communications_comunicado'
        verbose_name = 'Comunicado'
        verbose_name_plural = 'Comunicados'
        ordering = ['-fecha_publicacion']
    
    def __str__(self):
        return f"{self.titulo} - {self.tipo}"
