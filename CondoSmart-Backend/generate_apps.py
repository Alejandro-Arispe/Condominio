"""
Script para generar automáticamente todas las apps del proyecto CondoSmart
"""
import os
import sys

# Apps a crear
APPS = [
    'housing',
    'finance',
    'security',
    'reservations',
    'maintenance',
    'communications'
]

# Templates para archivos
APPS_PY_TEMPLATE = """from django.apps import AppConfig


class {app_class}Config(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.{app_name}'
    verbose_name = '{verbose_name}'
"""

MODELS_TEMPLATE = """from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class BaseModel(models.Model):
    \"\"\"Abstract base model with common fields\"\"\"
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='%(class)s_created')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='%(class)s_updated')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True
"""

SERIALIZERS_TEMPLATE = """from rest_framework import serializers
"""

VIEWS_TEMPLATE = """from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
"""

URLS_TEMPLATE = """from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
]
"""

ADMIN_TEMPLATE = """from django.contrib import admin
"""

def create_app(app_name):
    """Create app structure"""
    app_path = f'apps/{app_name}'
    os.makedirs(app_path, exist_ok=True)
    
    # Determine verbose name
    verbose_names = {
        'housing': 'Vivienda',
        'finance': 'Finanzas',
        'security': 'Seguridad',
        'reservations': 'Reservas',
        'maintenance': 'Mantenimiento',
        'communications': 'Comunicaciones'
    }
    
    app_class = app_name.capitalize()
    verbose_name = verbose_names.get(app_name, app_name.capitalize())
    
    # Create files
    files = {
        '__init__.py': '# ' + app_name + ' app\n',
        'apps.py': APPS_PY_TEMPLATE.format(app_class=app_class, app_name=app_name, verbose_name=verbose_name),
        'models.py': MODELS_TEMPLATE,
        'serializers.py': SERIALIZERS_TEMPLATE,
        'views.py': VIEWS_TEMPLATE,
        'urls.py': URLS_TEMPLATE,
        'admin.py': ADMIN_TEMPLATE,
    }
    
    for filename, content in files.items():
        filepath = os.path.join(app_path, filename)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
    
    print(f"✅ Created app: {app_name}")

if __name__ == '__main__':
    print("🚀 Generando apps de CondoSmart...\n")
    
    for app in APPS:
        create_app(app)
    
    print("\n✅ Todas las apps creadas exitosamente!")
