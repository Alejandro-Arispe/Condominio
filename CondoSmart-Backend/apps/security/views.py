# -*- coding: utf-8 -*-
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Visita, Incidente, Acceso
from .serializers import VisitaSerializer, IncidenteSerializer, AccesoSerializer


class VisitaViewSet(viewsets.ModelViewSet):
    queryset = Visita.objects.all()
    serializer_class = VisitaSerializer
    permission_classes = [IsAuthenticated]


class IncidenteViewSet(viewsets.ModelViewSet):
    queryset = Incidente.objects.all()
    serializer_class = IncidenteSerializer
    permission_classes = [IsAuthenticated]


class AccesoViewSet(viewsets.ModelViewSet):
    queryset = Acceso.objects.all()
    serializer_class = AccesoSerializer
    permission_classes = [IsAuthenticated]
