from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AreaComunViewSet, ReservaViewSet, SuministroViewSet

router = DefaultRouter()
router.register(r'areas', AreaComunViewSet, basename='area')
router.register(r'reservas', ReservaViewSet, basename='reserva')
router.register(r'suministros', SuministroViewSet, basename='suministro')

urlpatterns = [
    path('', include(router.urls)),
]
