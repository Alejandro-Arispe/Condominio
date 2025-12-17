from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CondominioViewSet, UnidadViewSet, ResidencyViewSet,
    VehiculoViewSet, MascotaViewSet, ContratoViewSet
)

router = DefaultRouter()
router.register(r'condominios', CondominioViewSet, basename='condominio')
router.register(r'unidades', UnidadViewSet, basename='unidad')
router.register(r'ocupantes', ResidencyViewSet, basename='ocupante')
router.register(r'vehiculos', VehiculoViewSet, basename='vehiculo')
router.register(r'mascotas', MascotaViewSet, basename='mascota')
router.register(r'contratos', ContratoViewSet, basename='contrato')

urlpatterns = [
    path('', include(router.urls)),
]
