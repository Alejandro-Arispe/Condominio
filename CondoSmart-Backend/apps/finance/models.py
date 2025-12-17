# -*- coding: utf-8 -*-
from django.db import models
from apps.housing.models import Unidad
from apps.accounts.models import BaseModel


class Cargo(BaseModel):
    """Modelo para cargos/expensas"""
    CONCEPTO_CHOICES = [
        ('cuota', 'Cuota Ordinaria'),
        ('multa', 'Multa'),
        ('extraordinaria', 'Cuota Extraordinaria'),
        ('servicio', 'Servicio Adicional'),
    ]
    
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('pagado', 'Pagado'),
        ('vencido', 'Vencido'),
    ]
    
    unidad = models.ForeignKey(Unidad, on_delete=models.CASCADE, related_name='cargos')
    concepto = models.CharField(max_length=50, choices=CONCEPTO_CHOICES)
    descripcion = models.TextField()
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    periodo = models.DateField()
    fecha_vencimiento = models.DateField()
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    
    class Meta:
        db_table = 'finance_cargo'
        verbose_name = 'Cargo'
        verbose_name_plural = 'Cargos'
        ordering = ['-periodo']
    
    def __str__(self):
        return f"{self.concepto} - {self.unidad.code} - {self.periodo}"


class Pago(BaseModel):
    """Modelo para pagos realizados"""
    unidad = models.ForeignKey(Unidad, on_delete=models.CASCADE, related_name='pagos')
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateTimeField(auto_now_add=True)
    metodo = models.CharField(max_length=50)
    comprobante = models.CharField(max_length=100, blank=True, null=True)
    
    class Meta:
        db_table = 'finance_pago'
        verbose_name = 'Pago'
        verbose_name_plural = 'Pagos'
        ordering = ['-fecha']
    
    def __str__(self):
        return f"Pago {self.unidad.code} - ${self.monto}"


class PagoCargo(BaseModel):
    """Relación entre pagos y cargos"""
    pago = models.ForeignKey(Pago, on_delete=models.CASCADE, related_name='detalles')
    cargo = models.ForeignKey(Cargo, on_delete=models.CASCADE, related_name='pagos')
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        db_table = 'finance_pago_cargo'
        verbose_name = 'Detalle de Pago'
        verbose_name_plural = 'Detalles de Pagos'
    
    def __str__(self):
        return f"Pago {self.pago.id} -> Cargo {self.cargo.id}"


class ConfiguracionExpensa(BaseModel):
    """Configuración de expensas automáticas"""
    TIPO_CHOICES = [
        ('fijo', 'Monto Fijo'),
        ('variable', 'Variable por Unidad'),
        ('porcentaje', 'Porcentaje'),
    ]
    
    nombre = models.CharField(max_length=100)
    concepto = models.CharField(max_length=50, choices=Cargo.CONCEPTO_CHOICES)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    monto_base = models.DecimalField(max_digits=10, decimal_places=2)
    descripcion = models.TextField(blank=True)
    activo = models.BooleanField(default=True)
    dia_generacion = models.IntegerField(default=1, help_text="Día del mes para generar el cargo (1-28)")
    dias_vencimiento = models.IntegerField(default=15, help_text="Días después de generación para vencimiento")
    
    class Meta:
        db_table = 'finance_configuracion_expensa'
        verbose_name = 'Configuración de Expensa'
        verbose_name_plural = 'Configuraciones de Expensas'
    
    def __str__(self):
        return f"{self.nombre} - {self.tipo}"


class Recordatorio(BaseModel):
    """Recordatorios de pago"""
    TIPO_CHOICES = [
        ('proximo_vencimiento', 'Próximo Vencimiento'),
        ('vencido', 'Vencido'),
        ('segundo_aviso', 'Segundo Aviso'),
    ]
    
    cargo = models.ForeignKey(Cargo, on_delete=models.CASCADE, related_name='recordatorios')
    tipo = models.CharField(max_length=30, choices=TIPO_CHOICES)
    fecha_envio = models.DateTimeField(auto_now_add=True)
    enviado = models.BooleanField(default=False)
    mensaje = models.TextField()
    
    class Meta:
        db_table = 'finance_recordatorio'
        verbose_name = 'Recordatorio'
        verbose_name_plural = 'Recordatorios'
        ordering = ['-fecha_envio']
    
    def __str__(self):
        return f"Recordatorio {self.tipo} - Cargo {self.cargo.id}"
