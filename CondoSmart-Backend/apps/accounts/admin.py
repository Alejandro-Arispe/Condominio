from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_active']
    list_filter = ['role', 'is_active', 'is_staff']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'ci']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Información Adicional', {'fields': ('role', 'phone', 'ci', 'photo_url', 'photo_key')}),
    )
