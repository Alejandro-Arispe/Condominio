from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings


class BaseModel(models.Model):
    """Modelo base abstracto con campos comunes"""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(class)s_created',
        verbose_name='Creado por'
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(class)s_updated',
        verbose_name='Actualizado por'
    )
    
    class Meta:
        abstract = True


class CustomUser(AbstractUser):
    """
    Custom User model extending Django's AbstractUser
    """
    ROLE_CHOICES = [
        ('admin', 'Administrador'),
        ('residente', 'Residente'),
        ('propietario', 'Propietario'),
        ('seguridad', 'Seguridad'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='residente')
    phone = models.CharField(max_length=20, blank=True, null=True)
    photo_key = models.CharField(max_length=500, blank=True, null=True, help_text='S3 key or local path')
    photo_url = models.URLField(max_length=500, blank=True, null=True)
    ci = models.CharField(max_length=20, blank=True, null=True, verbose_name='Cédula de Identidad')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'accounts_customuser'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username
