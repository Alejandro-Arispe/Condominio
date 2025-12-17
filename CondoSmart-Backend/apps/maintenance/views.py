# -*- coding: utf-8 -*-
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import TicketMantenimiento, FotoTicket
from .serializers import TicketMantenimientoSerializer, FotoTicketSerializer


class TicketMantenimientoViewSet(viewsets.ModelViewSet):
    queryset = TicketMantenimiento.objects.all()
    serializer_class = TicketMantenimientoSerializer
    permission_classes = [IsAuthenticated]


class FotoTicketViewSet(viewsets.ModelViewSet):
    queryset = FotoTicket.objects.all()
    serializer_class = FotoTicketSerializer
    permission_classes = [IsAuthenticated]
