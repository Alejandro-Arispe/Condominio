import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';
import '../config/api_config.dart';
import '../models/cargo.dart';

class FinanzasScreen extends StatefulWidget {
  const FinanzasScreen({super.key});

  @override
  State<FinanzasScreen> createState() => _FinanzasScreenState();
}

class _FinanzasScreenState extends State<FinanzasScreen> {
  final ApiService _apiService = ApiService();
  List<Cargo> _cargos = [];
  bool _isLoading = true;
  String? _error;
  
  final currencyFormat = NumberFormat.currency(symbol: 'Bs. ', decimalDigits: 2);

  @override
  void initState() {
    super.initState();
    _loadCargos();
  }

  Future<void> _loadCargos() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final response = await _apiService.get(ApiConfig.myCharges);
      
      if (response.statusCode == 200) {
        final List cargosList = response.data is List 
            ? response.data 
            : (response.data['results'] ?? []);
        
        setState(() {
          _cargos = cargosList
              .map((json) => Cargo.fromJson(json as Map<String, dynamic>))
              .where((cargo) => cargo.isPendiente)
              .toList();
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Error al cargar cargos: ${e.toString()}';
        _isLoading = false;
      });
    }
  }

  double get _totalPendiente {
    return _cargos.fold(0, (sum, cargo) => sum + cargo.monto);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Finanzas'),
        backgroundColor: Colors.green.shade700,
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
                        onPressed: _loadCargos,
                        child: const Text('Reintentar'),
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _loadCargos,
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    child: Column(
                      children: [
                        // Resumen
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [Colors.green.shade700, Colors.green.shade900],
                            ),
                          ),
                          child: Column(
                            children: [
                              const Text(
                                'Total Pendiente',
                                style: TextStyle(
                                  color: Colors.white70,
                                  fontSize: 16,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                currencyFormat.format(_totalPendiente),
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 36,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 16),
                              Text(
                                '${_cargos.length} cargo(s) pendiente(s)',
                                style: const TextStyle(
                                  color: Colors.white70,
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                        ),

                        // Lista de cargos
                        if (_cargos.isEmpty)
                          Padding(
                            padding: const EdgeInsets.all(40),
                            child: Column(
                              children: [
                                Icon(
                                  Icons.check_circle,
                                  size: 80,
                                  color: Colors.green.shade300,
                                ),
                                const SizedBox(height: 16),
                                const Text(
                                  '¡No tienes cargos pendientes!',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          )
                        else
                          ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            padding: const EdgeInsets.all(16),
                            itemCount: _cargos.length,
                            itemBuilder: (context, index) {
                              final cargo = _cargos[index];
                              return _buildCargoCard(cargo);
                            },
                          ),
                      ],
                    ),
                  ),
                ),
      floatingActionButton: _cargos.isNotEmpty
          ? FloatingActionButton.extended(
              onPressed: () {
                // TODO: Implementar pago
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Función de pago en desarrollo'),
                  ),
                );
              },
              backgroundColor: Colors.green.shade700,
              icon: const Icon(Icons.payment, color: Colors.white),
              label: const Text(
                'Pagar Todo',
                style: TextStyle(color: Colors.white),
              ),
            )
          : null,
    );
  }

  Widget _buildCargoCard(Cargo cargo) {
    final isVencido = cargo.isVencido;
    
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      elevation: 2,
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: isVencido ? Colors.red.shade100 : Colors.green.shade100,
            shape: BoxShape.circle,
          ),
          child: Icon(
            isVencido ? Icons.warning : Icons.receipt,
            color: isVencido ? Colors.red.shade700 : Colors.green.shade700,
          ),
        ),
        title: Text(
          cargo.concepto,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            if (cargo.descripcion != null)
              Text(
                cargo.descripcion!,
                style: const TextStyle(fontSize: 12),
              ),
            const SizedBox(height: 4),
            Row(
              children: [
                Icon(
                  Icons.calendar_today,
                  size: 14,
                  color: isVencido ? Colors.red : Colors.grey,
                ),
                const SizedBox(width: 4),
                Text(
                  cargo.fechaVencimiento != null
                      ? 'Vence: ${_formatDate(cargo.fechaVencimiento!)}'
                      : 'Sin vencimiento',
                  style: TextStyle(
                    fontSize: 12,
                    color: isVencido ? Colors.red : Colors.grey,
                    fontWeight: isVencido ? FontWeight.bold : FontWeight.normal,
                  ),
                ),
              ],
            ),
          ],
        ),
        trailing: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              currencyFormat.format(cargo.monto),
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: isVencido ? Colors.red.shade700 : Colors.green.shade700,
              ),
            ),
            if (isVencido)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: Colors.red.shade100,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  'VENCIDO',
                  style: TextStyle(
                    fontSize: 10,
                    color: Colors.red.shade700,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  String _formatDate(String dateStr) {
    try {
      final date = DateTime.parse(dateStr);
      return DateFormat('dd/MM/yyyy').format(date);
    } catch (e) {
      return dateStr;
    }
  }
}
