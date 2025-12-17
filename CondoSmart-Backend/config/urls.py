"""
URL configuration for CondoSmart project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from apps.accounts.views import CustomTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API v1
    path('api/v1/', include([
        # Authentication
        path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
        path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
        
        # Apps
        path('', include('apps.accounts.urls')),
        path('', include('apps.housing.urls')),
        path('', include('apps.finance.urls')),
        path('', include('apps.security.urls')),
        path('', include('apps.reservations.urls')),
        path('', include('apps.maintenance.urls')),
        path('', include('apps.communications.urls')),
    ])),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
