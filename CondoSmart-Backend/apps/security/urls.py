from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VisitaViewSet, IncidenteViewSet, AccesoViewSet
from .api_views import (
    generate_access_qr,
    validate_qr,
    my_access_history,
    my_charges,
    upload_profile_photo,
    get_users_with_photos,
)

router = DefaultRouter()
router.register(r'visitas', VisitaViewSet, basename='visita')
router.register(r'incidentes', IncidenteViewSet, basename='incidente')
router.register(r'accesos', AccesoViewSet, basename='acceso')

urlpatterns = [
    path('', include(router.urls)),
    
    # Mobile API endpoints
    path('generate-access-qr/', generate_access_qr, name='generate-access-qr'),
    path('validate-qr/', validate_qr, name='validate-qr'),
    path('my-access-history/', my_access_history, name='my-access-history'),
    path('my-charges/', my_charges, name='my-charges'),
    path('upload-profile-photo/', upload_profile_photo, name='upload-profile-photo'),
    path('users-with-photos/', get_users_with_photos, name='users-with-photos'),
]
