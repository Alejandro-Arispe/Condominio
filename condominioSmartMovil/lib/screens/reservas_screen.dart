import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';
import '../config/api_config.dart';
import '../models/reserva.dart';

class ReservasScreen extends StatefulWidget {
  const ReservasScreen({super.key});

  @override
  State<ReservasScreen> createState() => _ReservasScreenState();
}

class _ReservasScreenState extends State<ReservasScreen> with SingleTickerProviderStateMixin {
  final ApiService _apiService = ApiService();
  late TabController _tabController;
  
  List<Reserva> _misReservas = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadReservas();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadReservas() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final response = await _apiService.get(ApiConfig.myReservations);
      
      if (response.statusCode == 200) {
        final List reservasList = response.data is List 
            ? response.data 
            : (response.data['results'] ?? []);
        
        setState(() {
          _misReservas = reservasList
              .map((json) => Reserva.fromJson(json as Map<String, dynamic>))
              .toList();
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Error al cargar reservas: ${e.toString()}';
        _isLoading = false;
      });
    }
  }

  List<Reserva> get _reservasActivas {
    return _misReservas.where((r) => 
      r.estado == 'confirmada' || r.estado == 'pendiente'
    ).toList();
  }

  List<Reserva> get _reservasPasadas {
    return _misReservas.where((r) => 
      r.estado == 'cancelada' || r.estado == 'completada'
    ).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mis Reservas'),
        backgroundColor: Colors.purple.shade700,
        foregroundColor: Colors.white,
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.white,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          tabs: const [
            Tab(text: 'Activas'),
            Tab(text: 'Historial'),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.error, size: 64, color: Colors.red),
                      const SizedBox(height: 16),
                      Text(_error!),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _loadReservas,
                        child: const Text('Reintentar'),
                      ),
                    ],
                  ),
                )
              : TabBarView(
                  controller: _tabController,
                  children: [
                    _buildReservasList(_reservasActivas, true),
                    _buildReservasList(_reservasPasadas, false),
                  ],
                ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Nueva reserva - Próximamente')),
          );
        },
        backgroundColor: Colors.purple.shade700,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text(
          'Nueva Reserva',
          style: TextStyle(color: Colors.white),
        ),
      ),
    );
  }

  Widget _buildReservasList(List<Reserva> reservas, bool isActive) {
    if (reservas.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              isActive ? Icons.event_available : Icons.history,
              size: 80,
              color: Colors.grey.shade300,
            ),
            const SizedBox(height: 16),
            Text(
              isActive 
                  ? 'No tienes reservas activas'
                  : 'No hay historial de reservas',
              style: const TextStyle(
                fontSize: 18,
                color: Colors.grey,
              ),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadReservas,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: reservas.length,
        itemBuilder: (context, index) {
          final reserva = reservas[index];
          return _buildReservaCard(reserva);
        },
      ),
    );
  }

  Widget _buildReservaCard(Reserva reserva) {
    Color statusColor;
    IconData statusIcon;
    String statusText;

    switch (reserva.estado) {
      case 'confirmada':
        statusColor = Colors.green;
        statusIcon = Icons.check_circle;
        statusText = 'Confirmada';
        break;
      case 'pendiente':
        statusColor = Colors.orange;
        statusIcon = Icons.pending;
        statusText = 'Pendiente';
        break;
      case 'cancelada':
        statusColor = Colors.red;
        statusIcon = Icons.cancel;
        statusText = 'Cancelada';
        break;
      default:
        statusColor = Colors.grey;
        statusIcon = Icons.info;
        statusText = reserva.estado;
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.purple.shade100,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.event,
                    color: Colors.purple.shade700,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        reserva.areaNombre,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(statusIcon, size: 16, color: statusColor),
                          const SizedBox(width: 4),
                          Text(
                            statusText,
                            style: TextStyle(
                              fontSize: 14,
                              color: statusColor,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const Divider(height: 24),
            Row(
              children: [
                const Icon(Icons.calendar_today, size: 16, color: Colors.grey),
                const SizedBox(width: 8),
                Text(
                  'Inicio: ${_formatDateTime(reserva.fechaInicio)}',
                  style: const TextStyle(fontSize: 14),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.event_busy, size: 16, color: Colors.grey),
                const SizedBox(width: 8),
                Text(
                  'Fin: ${_formatDateTime(reserva.fechaFin)}',
                  style: const TextStyle(fontSize: 14),
                ),
              ],
            ),
            if (reserva.monto != null) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.attach_money, size: 16, color: Colors.grey),
                  const SizedBox(width: 8),
                  Text(
                    'Monto: Bs. ${reserva.monto!.toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ],
            if (reserva.isPendiente || reserva.isConfirmada) ...[
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  if (reserva.isPendiente)
                    TextButton.icon(
                      onPressed: () => _cancelarReserva(reserva),
                      icon: const Icon(Icons.cancel, size: 18),
                      label: const Text('Cancelar'),
                      style: TextButton.styleFrom(
                        foregroundColor: Colors.red,
                      ),
                    ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  String _formatDateTime(String dateStr) {
    try {
      final date = DateTime.parse(dateStr);
      return DateFormat('dd/MM/yyyy HH:mm').format(date);
    } catch (e) {
      return dateStr;
    }
  }

  Future<void> _cancelarReserva(Reserva reserva) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Cancelar Reserva'),
        content: Text('¿Estás seguro de cancelar la reserva de ${reserva.areaNombre}?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('No'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Sí, Cancelar'),
          ),
        ],
      ),
    );

    if (confirm == true) {
      // TODO: Implementar cancelación en backend
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Función de cancelación en desarrollo')),
      );
    }
  }
}
