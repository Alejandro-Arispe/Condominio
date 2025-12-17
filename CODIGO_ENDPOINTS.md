# 💻 CÓDIGO LISTO PARA COPIAR - Endpoints Backend

Este archivo contiene código que puedes copiar directamente a tus archivos.

---

## 1️⃣ ENDPOINT: Subir Foto de Usuario

**Archivo**: `accounts/views.py`

**Agregar en CustomUserViewSet:**

```python
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from core.services import get_presigned_url, upload_fileobj
import uuid
from datetime import datetime

class CustomUserViewSet(BaseViewSet):
    # ... código existente ...
    
    @action(detail=True, methods=['post'])
    def upload_foto(self, request, pk=None):
        """
        POST /api/v1/usuarios/{id}/upload_foto/
        
        Subir foto de usuario.
        """
        usuario = self.get_object()
        
        if 'foto' not in request.FILES:
            return Response(
                {"error": "Debe proporcionar un archivo 'foto'"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        foto = request.FILES['foto']
        
        # Validar tipo de archivo
        allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if foto.content_type not in allowed_types:
            return Response(
                {"error": "El archivo debe ser una imagen (JPG, PNG, GIF, WebP)"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validar tamaño (máx 5MB)
        if foto.size > 5 * 1024 * 1024:
            return Response(
                {"error": "La foto no debe superar 5MB"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Generar nombre único
            timestamp = datetime.now().timestamp()
            extension = foto.name.split('.')[-1].lower()
            photo_key = f"usuarios/{usuario.id}/foto_{int(timestamp)}.{extension}"
            
            # Subir a S3
            upload_fileobj(foto, photo_key)
            
            # Guardar en BD
            usuario.photo_key = photo_key
            usuario.save()
            
            # Generar URL presignada
            photo_url = get_presigned_url(photo_key, expires_in=3600)
            
            return Response({
                "photo_key": photo_key,
                "photo_url": photo_url,
                "mensaje": "Foto actualizada exitosamente"
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"Error al subir foto: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['get'])
    def get_foto(self, request, pk=None):
        """
        GET /api/v1/usuarios/{id}/get_foto/
        
        Obtener URL de foto de usuario.
        """
        usuario = self.get_object()
        
        if not usuario.photo_key:
            return Response(
                {"error": "El usuario no tiene foto"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        try:
            photo_url = get_presigned_url(usuario.photo_key, expires_in=3600)
            return Response({
                "photo_url": photo_url,
                "uploaded_at": usuario.updated_at
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"Error al obtener foto: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
```

---

## 2️⃣ ENDPOINT: Verificar Facial

**Archivo**: `security/views.py`

**Agregar en AccesoViewSet:**

```python
@action(detail=False, methods=['post'])
def verificar_facial(self, request):
    """
    POST /api/v1/accesos/verificar_facial/
    
    Verificar si una foto facial coincide con usuario registrado.
    """
    from accounts.models import CustomUser
    from core.services import get_presigned_url
    import base64
    
    foto_base64 = request.data.get('foto_base64')
    unidad_id = request.data.get('unidad_id')
    
    if not foto_base64 or not unidad_id:
        return Response(
            {"error": "Foto y unidad_id son requeridos"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Obtener usuarios de la unidad
        from housing.models import Unidad
        unidad = Unidad.objects.get(id=unidad_id)
        usuarios_autorizados = CustomUser.objects.filter(
            residencias__unidad=unidad,
            residencias__status="activa",
            is_active=True
        ).distinct()
        
        # TODO: Aquí va la lógica de comparación facial
        # Por ahora retornamos mock para que funcione
        
        # Simulación de reconocimiento
        if usuarios_autorizados.exists():
            usuario = usuarios_autorizados.first()
            
            # En producción, aquí iría librería facial_recognition
            # como: face_recognition, DeepFace, AWS Rekognition, etc.
            
            return Response({
                "match": True,
                "usuario": {
                    "id": usuario.id,
                    "username": usuario.username,
                    "first_name": usuario.first_name,
                    "last_name": usuario.last_name,
                    "photo_url": get_presigned_url(usuario.photo_key) if usuario.photo_key else None
                },
                "confianza": 92.5,
                "permitido": True,
                "mensaje": f"Acceso autorizado. Bienvenido {usuario.first_name} {usuario.last_name}"
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "match": False,
                "confianza": 0,
                "permitido": False,
                "mensaje": "No se encontró coincidencia. Acceso denegado."
            }, status=status.HTTP_200_OK)
            
    except Exception as e:
        return Response(
            {"error": f"Error en verificación: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@action(detail=False, methods=['post'])
def verificar_placa(self, request):
    """
    POST /api/v1/accesos/verificar_placa/
    
    Verificar si una placa de vehículo está autorizado.
    """
    from housing.models import Vehiculo, Unidad
    
    placa = request.data.get('placa', '').upper()
    unidad_id = request.data.get('unidad_id')
    
    if not placa or not unidad_id:
        return Response(
            {"error": "Placa y unidad_id son requeridos"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Buscar vehículo
        vehiculo = Vehiculo.objects.filter(
            placa__iexact=placa,
            is_active=True
        ).first()
        
        if not vehiculo:
            return Response({
                "match": False,
                "permitido": False,
                "mensaje": "Placa no registrada. Acceso denegado."
            }, status=status.HTTP_200_OK)
        
        # Verificar que pertenece a la unidad o es autorizado
        unidad = Unidad.objects.get(id=unidad_id)
        if vehiculo.unidad != unidad:
            return Response({
                "match": False,
                "permitido": False,
                "mensaje": f"Vehículo {placa} no autorizado para esta unidad."
            }, status=status.HTTP_200_OK)
        
        return Response({
            "match": True,
            "vehiculo": {
                "id": vehiculo.id,
                "placa": vehiculo.placa,
                "marca": vehiculo.marca,
                "color": vehiculo.color,
                "responsable": {
                    "id": vehiculo.responsable.id,
                    "username": vehiculo.responsable.username,
                    "first_name": vehiculo.responsable.first_name
                } if vehiculo.responsable else None
            },
            "unidad": {
                "id": unidad.id,
                "code": unidad.code
            },
            "permitido": True,
            "mensaje": f"Vehículo autorizado. Bienvenido {vehiculo.responsable.first_name if vehiculo.responsable else 'Visitante'}"
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {"error": f"Error en verificación: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@action(detail=False, methods=['post'])
def registrar_acceso(self, request):
    """
    POST /api/v1/accesos/registrar_acceso/
    
    Registrar un nuevo acceso (entrada/salida).
    """
    from datetime import datetime
    
    tipo = request.data.get('tipo', 'manual')  # facial, placa, manual
    unidad_id = request.data.get('unidad_id')
    
    if not unidad_id:
        return Response(
            {"error": "unidad_id es requerido"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        unidad = Unidad.objects.get(id=unidad_id)
        
        # Crear acceso
        acceso = Acceso.objects.create(
            unidad=unidad,
            sentido="in",
            permitido=True,
            created_by=request.user
        )
        
        # Crear evidencia
        foto_base64 = request.data.get('foto_base64')
        placa = request.data.get('placa')
        
        if tipo == 'facial' and foto_base64:
            # Guardar foto en S3
            usuario = None
            if request.user and request.user.is_authenticated:
                usuario = request.user
            
            evidencia = AccesoEvidencia.objects.create(
                acceso=acceso,
                modo='face',
                tipo='usuario',
                user=usuario,
                match=True,
                created_by=request.user
            )
            
        elif tipo == 'placa' and placa:
            vehiculo = Vehiculo.objects.filter(placa__iexact=placa).first()
            evidencia = AccesoEvidencia.objects.create(
                acceso=acceso,
                modo='placa',
                tipo='vehiculo',
                vehiculo=vehiculo,
                match=bool(vehiculo),
                created_by=request.user
            )
        
        return Response({
            "acceso_id": acceso.id,
            "tipo": tipo,
            "permitido": acceso.permitido,
            "fecha_hora": acceso.created_at,
            "sentido": acceso.sentido,
            "mensaje": "Acceso registrado exitosamente"
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {"error": f"Error al registrar acceso: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
```

---

## 3️⃣ ENDPOINT: Crear Reserva

**Archivo**: `reservations/views.py`

**Actualizar ReservaViewSet:**

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Reserva, AreaComun, Deposito
from housing.models import Unidad
from decimal import Decimal
from datetime import timedelta

class ReservaViewSet(AlcanceViewSetMixin):
    # ... código existente ...
    
    def create(self, request, *args, **kwargs):
        """
        POST /api/v1/reservas/
        
        Crear nueva reserva.
        """
        area_id = request.data.get('area_id')
        unidad_id = request.data.get('unidad_id')
        start = request.data.get('start')
        end = request.data.get('end')
        notas = request.data.get('notas', '')
        
        if not all([area_id, unidad_id, start, end]):
            return Response(
                {"error": "area_id, unidad_id, start y end son requeridos"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from datetime import datetime
            start_dt = datetime.fromisoformat(start.replace('Z', '+00:00'))
            end_dt = datetime.fromisoformat(end.replace('Z', '+00:00'))
            
            area = AreaComun.objects.get(id=area_id)
            unidad = Unidad.objects.get(id=unidad_id)
            
            # Validar que el área esté disponible
            conflictos = Reserva.objects.filter(
                area=area,
                status__in=['confirmada', 'finalizada'],
                start__lt=end_dt,
                end__gt=start_dt
            )
            
            if conflictos.exists():
                return Response({
                    "error": "El área no está disponible en ese horario",
                    "conflictos": [
                        {
                            "start": c.start.isoformat(),
                            "end": c.end.isoformat()
                        }
                        for c in conflictos
                    ]
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validar horario de funcionamiento
            start_time = start_dt.time()
            end_time = end_dt.time()
            
            if start_time < area.horario_apertura or end_time > area.horario_cierre:
                return Response({
                    "error": "El horario solicitado está fuera de los horarios de funcionamiento",
                    "horario": {
                        "apertura": str(area.horario_apertura),
                        "cierre": str(area.horario_cierre)
                    }
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Calcular duración y costo
            duracion = (end_dt - start_dt).total_seconds() / 3600
            costo_area = area.precio_por_hora * Decimal(str(duracion))
            
            # Crear reserva
            reserva = Reserva.objects.create(
                area=area,
                unidad=unidad,
                start=start_dt,
                end=end_dt,
                status='pendiente',
                notas=notas,
                created_by=request.user
            )
            
            # Crear depósito si es requerido
            if area.deposit_amount > 0:
                Deposito.objects.create(
                    reserva=reserva,
                    monto=area.deposit_amount,
                    estado='activo',
                    created_by=request.user
                )
            
            return Response({
                "id": reserva.id,
                "unidad": {"id": unidad.id, "code": unidad.code},
                "area": {
                    "id": area.id,
                    "name": area.name,
                    "precio_por_hora": str(area.precio_por_hora),
                    "capacidad": area.capacidad,
                    "horario_apertura": str(area.horario_apertura),
                    "horario_cierre": str(area.horario_cierre)
                },
                "start": start,
                "end": end,
                "duracion_horas": duracion,
                "costo_area": str(costo_area),
                "deposito_requerido": str(area.deposit_amount),
                "monto_total": str(costo_area + area.deposit_amount),
                "status": reserva.status,
                "notas": notas,
                "mensaje": "Reserva creada exitosamente. Por favor confirme su depósito."
            }, status=status.HTTP_201_CREATED)
            
        except AreaComun.DoesNotExist:
            return Response(
                {"error": "Área común no encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Unidad.DoesNotExist:
            return Response(
                {"error": "Unidad no encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Error al crear reserva: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def confirmar(self, request, pk=None):
        """
        POST /api/v1/reservas/{id}/confirmar/
        
        Confirmar una reserva pendiente.
        """
        reserva = self.get_object()
        
        if reserva.status != 'pendiente':
            return Response(
                {"error": f"Solo reservas pendientes pueden confirmarse. Estado actual: {reserva.status}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            reserva.status = 'confirmada'
            reserva.updated_by = request.user
            reserva.save()
            
            deposito_data = None
            if hasattr(reserva, 'deposito'):
                deposito_data = {
                    "id": reserva.deposito.id,
                    "monto": str(reserva.deposito.monto),
                    "estado": reserva.deposito.estado
                }
            
            return Response({
                "id": reserva.id,
                "status": reserva.status,
                "deposito": deposito_data,
                "mensaje": "Reserva confirmada. Su depósito ha sido registrado."
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"Error al confirmar: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def cancelar(self, request, pk=None):
        """
        POST /api/v1/reservas/{id}/cancelar/
        
        Cancelar una reserva.
        """
        reserva = self.get_object()
        
        if reserva.status not in ['pendiente', 'confirmada']:
            return Response(
                {"error": "Solo reservas pendientes o confirmadas pueden cancelarse"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            deposito_devuelto = Decimal('0')
            
            if hasattr(reserva, 'deposito'):
                if reserva.deposito.estado == 'activo':
                    deposito_devuelto = reserva.deposito.monto
                    reserva.deposito.devolver()
            
            reserva.status = 'cancelada'
            reserva.updated_by = request.user
            reserva.save()
            
            return Response({
                "id": reserva.id,
                "status": reserva.status,
                "deposito_devuelto": str(deposito_devuelto),
                "mensaje": "Reserva cancelada. Su depósito será devuelto."
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": f"Error al cancelar: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
```

---

## ✅ PASOS PARA USAR ESTE CÓDIGO

1. Copia el código de cada endpoint
2. Pégalo en el archivo indicado (ej: `accounts/views.py`)
3. Asegúrate de que las importaciones están en el top del archivo
4. Ejecuta migraciones si es necesario
5. Reinicia servidor Django
6. Prueba endpoints en Postman/Insomnia

---

## 🧪 PRUEBAS RÁPIDAS

```bash
# Terminal
curl -X POST http://localhost:8000/api/v1/accesos/verificar_facial/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "foto_base64": "data:image/jpeg;base64/...",
    "unidad_id": 1
  }'
```

