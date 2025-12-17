# -*- coding: utf-8 -*-
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CargoViewSet, PagoViewSet, PagoCargoViewSet,
    ConfiguracionExpensaViewSet, RecordatorioViewSet
)

router = DefaultRouter()
router.register(r'cargos', CargoViewSet, basename='cargo')
router.register(r'pagos', PagoViewSet, basename='pago')
router.register(r'pagos-cargos', PagoCargoViewSet, basename='pago-cargo')
router.register(r'configuraciones-expensas', ConfiguracionExpensaViewSet, basename='configuracion-expensa')
router.register(r'recordatorios', RecordatorioViewSet, basename='recordatorio')

urlpatterns = [
    path('', include(router.urls)),
]
