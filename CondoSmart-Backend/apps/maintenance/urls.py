from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketMantenimientoViewSet, FotoTicketViewSet

router = DefaultRouter()
router.register(r'tickets', TicketMantenimientoViewSet, basename='ticket')
router.register(r'fotos-tickets', FotoTicketViewSet, basename='foto-ticket')

urlpatterns = [
    path('', include(router.urls)),
]
