import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';
import '../config/api_config.dart';

class HistorialAccesosScreen extends StatefulWidget {
  const HistorialAccesosScreen({super.key});

  @override
  State<HistorialAccesosScreen> createState() => _HistorialAccesosScreenState();
}

class _HistorialAccesosScreenState extends State<HistorialAccesosScreen> {
  final ApiService _apiService = ApiService();
  List<Map<String, dynamic>> _accesos = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadAccesos();
  }

  Future<void> _loadAccesos() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final response = await _apiService.get(ApiConfig.myAccessHistory);
      
      if (response.statusCode == 200 && response.data is List) {
        setState(() {
          _accesos = List<Map<String, dynamic>>.from(response.data);
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Error al cargar historial: ${e.toString()}';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Historial de Accesos'),
        backgroundColor: Colors.indigo.shade700,
        foregroundColor: Colors.white,
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
                        onPressed: _loadAccesos,
                        child: const Text('Reintentar'),
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _loadAccesos,
                  child: _accesos.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.history,
                                size: 80,
                                color: Colors.grey.shade300,
                              ),
                              const SizedBox(height: 16),
                              const Text(
                                'No hay accesos registrados',
                                style: TextStyle(
                                  fontSize: 18,
                                  color: Colors.grey,
                                ),
                              ),
                            ],
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: _accesos.length,
                          itemBuilder: (context, index) {
                            final acceso = _accesos[index];
                            return _buildAccesoCard(acceso);
                          },
                        ),
                ),
    );
  }

  Widget _buildAccesoCard(Map<String, dynamic> acceso) {
    final tipo = acceso['tipo'] ?? 'manual';
    final sentido = acceso['sentido'] ?? 'in';
    final permitido = acceso['permitido'] ?? false;
    final timestamp = acceso['timestamp'];
    final confianza = acceso['confianza'];

    IconData icon;
    Color color;
    String tipoText;

    switch (tipo) {
      case 'qr':
        icon = Icons.qr_code;
        color = Colors.blue;
        tipoText = 'Código QR';
        break;
      case 'facial':
        icon = Icons.face;
        color = Colors.green;
        tipoText = 'Reconocimiento Facial';
        break;
      case 'placa':
        icon = Icons.directions_car;
        color = Colors.orange;
        tipoText = 'Reconocimiento de Placa';
        break;
      default:
        icon = Icons.login;
        color = Colors.grey;
        tipoText = 'Manual';
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 2,
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: color, size: 28),
        ),
        title: Row(
          children: [
            Expanded(
              child: Text(
                tipoText,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
            ),
            Icon(
              sentido == 'in' ? Icons.arrow_downward : Icons.arrow_upward,
              size: 20,
              color: sentido == 'in' ? Colors.green : Colors.red,
            ),
            const SizedBox(width: 4),
            Text(
              sentido == 'in' ? 'Entrada' : 'Salida',
              style: TextStyle(
                fontSize: 14,
                color: sentido == 'in' ? Colors.green : Colors.red,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.access_time, size: 16, color: Colors.grey),
                const SizedBox(width: 4),
                Text(
                  _formatDateTime(timestamp),
                  style: const TextStyle(fontSize: 14),
                ),
              ],
            ),
            if (confianza != null) ...[
              const SizedBox(height: 4),
              Row(
                children: [
                  const Icon(Icons.verified, size: 16, color: Colors.grey),
                  const SizedBox(width: 4),
                  Text(
                    'Confianza: ${confianza.toStringAsFixed(1)}%',
                    style: const TextStyle(fontSize: 12),
                  ),
                ],
              ),
            ],
          ],
        ),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: permitido ? Colors.green.shade100 : Colors.red.shade100,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            permitido ? 'PERMITIDO' : 'DENEGADO',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: permitido ? Colors.green.shade700 : Colors.red.shade700,
            ),
          ),
        ),
      ),
    );
  }

  String _formatDateTime(String? dateStr) {
    if (dateStr == null) return '';
    try {
      final date = DateTime.parse(dateStr);
      return DateFormat('dd/MM/yyyy HH:mm').format(date);
    } catch (e) {
      return dateStr;
    }
  }
}
