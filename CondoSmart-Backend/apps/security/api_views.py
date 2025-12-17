from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
import hashlib
import time

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_access_qr(request):
    """
    Genera un código QR temporal para acceso del usuario
    """
    user = request.user
    timestamp = int(time.time())
    
    # Generar token único
    token_data = f"{user.id}:{timestamp}"
    token = hashlib.sha256(token_data.encode()).hexdigest()[:16]
    
    # El QR contiene: CONDOSMART:user_id:timestamp:token
    qr_data = f"CONDOSMART:{user.id}:{timestamp}:{token}"
    
    return Response({
        'qr_data': qr_data,
        'expires_in': 30,  # segundos
        'user_id': user.id,
        'user_name': user.get_full_name() or user.username,
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def validate_qr(request):
    """
    Valida un código QR escaneado y registra el acceso
    """
    qr_data = request.data.get('qr_data')
    
    if not qr_data:
        return Response(
            {'error': 'QR data is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Limpiar espacios y saltos de línea
    qr_data = qr_data.strip()
    
    try:
        # Parsear QR: CONDOSMART:user_id:timestamp:token
        parts = qr_data.split(':')
        
        print(f"DEBUG - QR Data: {qr_data}")
        print(f"DEBUG - Parts: {parts}")
        print(f"DEBUG - Parts length: {len(parts)}")
        
        if len(parts) != 4 or parts[0] != 'CONDOSMART':
            return Response(
                {
                    'error': 'Invalid QR format',
                    'received': qr_data,
                    'expected_format': 'CONDOSMART:user_id:timestamp:token'
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user_id = int(parts[1])
        timestamp = int(parts[2])
        token = parts[3]
        
        # Verificar expiración (30 segundos)
        current_time = int(time.time())
        time_diff = current_time - timestamp
        
        print(f"DEBUG - Time diff: {time_diff} seconds")
        
        if time_diff > 30:
            return Response(
                {
                    'error': 'QR code expired',
                    'expired_seconds_ago': time_diff - 30
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar token
        expected_token = hashlib.sha256(f"{user_id}:{timestamp}".encode()).hexdigest()[:16]
        if token != expected_token:
            return Response(
                {'error': 'Invalid QR token'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Obtener usuario
        from apps.accounts.models import CustomUser
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Registrar acceso
        from apps.security.models import Acceso
        acceso = Acceso.objects.create(
            user=user,
            tipo='qr',
            sentido='in',
            permitido=True,
            confianza=100.0,
        )
        
        return Response({
            'success': True,
            'message': 'Access granted',
            'user': {
                'id': user.id,
                'name': user.get_full_name() or user.username,
                'email': user.email,
            },
            'access_id': acceso.id,
            'timestamp': acceso.created_at.isoformat(),
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_access_history(request):
    """
    Obtiene el historial de accesos del usuario autenticado
    """
    from apps.security.models import Acceso
    
    # Filtrar accesos del usuario
    accesos = Acceso.objects.filter(
        user=request.user
    ).order_by('-created_at')[:50]
    
    data = [{
        'id': acceso.id,
        'tipo': acceso.tipo,
        'sentido': acceso.sentido,
        'permitido': acceso.permitido,
        'timestamp': acceso.created_at.isoformat(),
        'confianza': acceso.confianza,
    } for acceso in accesos]
    
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_charges(request):
    """
    Obtiene los cargos del usuario autenticado
    """
    from apps.finance.models import Cargo
    from apps.housing.models import Residente
    
    try:
        # Obtener residente asociado al usuario
        residente = Residente.objects.filter(usuario=request.user, vigente=True).first()
        
        if not residente:
            return Response([])
        
        # Obtener cargos de la unidad del residente
        cargos = Cargo.objects.filter(
            unidad=residente.unidad,
            estado='pendiente'
        ).order_by('-fecha_vencimiento')
        
        from apps.finance.serializers import CargoSerializer
        serializer = CargoSerializer(cargos, many=True)
        return Response(serializer.data)
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_profile_photo(request):
    """
    Sube la foto de perfil del usuario para reconocimiento facial
    """
    import base64
    import os
    from django.core.files.base import ContentFile
    from django.conf import settings
    
    try:
        user = request.user
        photo_data = request.data.get('photo')
        
        if not photo_data:
            return Response(
                {'error': 'No photo data provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Si viene en base64, decodificar
        if isinstance(photo_data, str) and photo_data.startswith('data:image'):
            format, imgstr = photo_data.split(';base64,')
            ext = format.split('/')[-1]
            if ext == 'jpeg':
                ext = 'jpg'
            
            # Decodificar imagen
            image_data = base64.b64decode(imgstr)
            
            # Crear directorio si no existe
            media_root = settings.MEDIA_ROOT if hasattr(settings, 'MEDIA_ROOT') else 'media'
            user_dir = os.path.join(media_root, 'users', str(user.id))
            os.makedirs(user_dir, exist_ok=True)
            
            # Guardar archivo
            filename = f'profile.{ext}'
            filepath = os.path.join(user_dir, filename)
            
            with open(filepath, 'wb') as f:
                f.write(image_data)
            
            # Actualizar usuario
            photo_key = f"users/{user.id}/{filename}"
            photo_url = f"/media/{photo_key}"
            
            user.photo_key = photo_key
            user.photo_url = photo_url
            user.save()
            
            return Response({
                'success': True,
                'message': 'Foto de perfil actualizada',
                'photo_url': photo_url,
                'photo_key': photo_key,
            })
        else:
            return Response(
                {'error': 'Invalid photo format'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
    except Exception as e:
        print(f"Error uploading photo: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users_with_photos(request):
    """
    Obtiene lista de usuarios con fotos registradas para reconocimiento facial
    """
    from apps.accounts.models import CustomUser
    
    try:
        # Obtener usuarios con foto
        users = CustomUser.objects.filter(photo_url__isnull=False).exclude(photo_url='')
        
        data = [{
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'photo_url': user.photo_url,
            'photo_key': user.photo_key,
        } for user in users]
        
        return Response(data)
        
    except Exception as e:
        print(f"Error getting users with photos: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
