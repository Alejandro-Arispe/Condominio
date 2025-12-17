from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserCreateSerializer

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for User operations
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return super().get_permissions()
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user info"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='with-photos')
    def users_with_photos(self, request):
        """Get all users that have photos"""
        users = User.objects.exclude(photo_url__isnull=True).exclude(photo_url='')
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def upload_photo(self, request, pk=None):
        """Upload user photo"""
        user = self.get_object()
        photo = request.FILES.get('foto')
        
        if not photo:
            return Response(
                {'error': 'No se proporcionó ninguna foto'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # For now, save locally (can be extended to S3)
        user.photo_url = f"/media/users/{user.id}/{photo.name}"
        user.photo_key = f"users/{user.id}/{photo.name}"
        user.save()
        
        return Response({
            'photo_key': user.photo_key,
            'photo_url': user.photo_url,
            'mensaje': 'Foto actualizada exitosamente'
        })


# Custom JWT Token View
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Agregar información del usuario a la respuesta
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'is_staff': self.user.is_staff,
        }
        
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
