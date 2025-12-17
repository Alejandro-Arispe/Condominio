import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'dart:async';
import 'dart:convert';
import 'package:crypto/crypto.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';
import '../config/api_config.dart';
import 'login_screen.dart';
import 'finanzas_screen.dart';
import 'comunicados_screen.dart';
import 'reservas_screen.dart';
import 'perfil_screen.dart';
import 'historial_accesos_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _qrData = '';
  Timer? _qrTimer;
  int _countdown = 30;
  bool _accessGranted = false; // Nuevo: indica si ya se validó el acceso

  @override
  void initState() {
    super.initState();
    _generateQR();
    _checkRecentAccess(); // Verificar si ya tiene acceso reciente
  }

  @override
  void dispose() {
    _qrTimer?.cancel();
    super.dispose();
  }

  Future<void> _checkRecentAccess() async {
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      final apiService = ApiService();
      
      // Consultar historial de accesos
      final response = await apiService.get(ApiConfig.myAccessHistory);
      
      if (response.statusCode == 200 && response.data is List) {
        final accesos = response.data as List;
        
        if (accesos.isNotEmpty) {
          final ultimoAcceso = accesos.first;
          final timestamp = DateTime.parse(ultimoAcceso['timestamp']);
          final diff = DateTime.now().difference(timestamp);
          
          // Si el último acceso fue hace menos de 5 minutos, marcar como validado
          if (diff.inMinutes < 5 && ultimoAcceso['sentido'] == 'in') {
            _markAccessGranted();
          }
        }
      }
    } catch (e) {
      // Ignorar errores silenciosamente
      print('Error checking access: $e');
    }
    
    // Verificar cada 5 segundos si no está validado
    if (!_accessGranted) {
      Future.delayed(const Duration(seconds: 5), () {
        if (mounted && !_accessGranted) {
          _checkRecentAccess();
        }
      });
    }
  }

  void _generateQR() {
    if (_accessGranted) return; // No regenerar si ya tiene acceso
    
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final userId = authProvider.user?.id ?? 0;
    final timestamp = (DateTime.now().millisecondsSinceEpoch / 1000).floor();
    
    // Generar token único (SHA256 simplificado)
    final tokenData = '$userId:$timestamp';
    final bytes = utf8.encode(tokenData);
    final digest = sha256.convert(bytes);
    final token = digest.toString().substring(0, 16);
    
    // Generar QR dinámico: CONDOSMART:user_id:timestamp:token
    setState(() {
      _qrData = 'CONDOSMART:$userId:$timestamp:$token';
      _countdown = 30;
    });

    // Regenerar cada 30 segundos
    _qrTimer?.cancel();
    _qrTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_accessGranted) {
        timer.cancel();
        return;
      }
      
      if (_countdown > 0) {
        setState(() {
          _countdown--;
        });
      } else {
        _generateQR();
      }
    });
  }

  void _markAccessGranted() {
    setState(() {
      _accessGranted = true;
      _qrTimer?.cancel();
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('✓ Acceso registrado - Bienvenido'),
        backgroundColor: Colors.green,
        duration: Duration(seconds: 3),
      ),
    );
  }

  Future<void> _logout() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    await authProvider.logout();
    if (mounted) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const LoginScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.user;

    return Scaffold(
      appBar: AppBar(
        title: const Text('CondoSmart'),
        backgroundColor: Colors.blue.shade700,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _logout,
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Header con info del usuario
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.blue.shade700, Colors.blue.shade900],
                ),
              ),
              child: Column(
                children: [
                  GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const PerfilScreen()),
                      );
                    },
                    child: CircleAvatar(
                      radius: 40,
                      backgroundColor: Colors.white,
                      child: Text(
                        user?.fullName.isNotEmpty == true
                            ? user!.fullName[0].toUpperCase()
                            : 'U',
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                          color: Colors.blue.shade700,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    user?.fullName ?? user?.username ?? 'Usuario',
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  Text(
                    user?.email ?? '',
                    style: const TextStyle(
                      fontSize: 14,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ),

            // QR de Acceso
            Container(
              margin: const EdgeInsets.all(20),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 10,
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        _accessGranted ? 'Acceso Validado ✓' : 'Código de Acceso',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: _accessGranted ? Colors.green.shade700 : Colors.black,
                        ),
                      ),
                      if (!_accessGranted)
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: _countdown > 10
                                ? Colors.green.shade100
                                : Colors.red.shade100,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Row(
                            children: [
                              Icon(
                                Icons.timer,
                                size: 16,
                                color: _countdown > 10
                                    ? Colors.green.shade700
                                    : Colors.red.shade700,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                '${_countdown}s',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: _countdown > 10
                                      ? Colors.green.shade700
                                      : Colors.red.shade700,
                                ),
                              ),
                            ],
                          ),
                        )
                      else
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.green.shade100,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Row(
                            children: [
                              Icon(
                                Icons.check_circle,
                                size: 16,
                                color: Colors.green.shade700,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                'Dentro',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  color: Colors.green.shade700,
                                ),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.blue.shade200, width: 2),
                    ),
                    child: QrImageView(
                      data: _qrData,
                      version: QrVersions.auto,
                      size: 200.0,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Muestra este código en el lector de entrada',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 12),
                  ElevatedButton.icon(
                    onPressed: () async {
                      await Clipboard.setData(ClipboardData(text: _qrData));
                      if (mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Código QR copiado al portapapeles'),
                            duration: Duration(seconds: 2),
                            backgroundColor: Colors.green,
                          ),
                        );
                      }
                    },
                    icon: const Icon(Icons.copy),
                    label: const Text('Copiar Código'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue.shade700,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 12,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Accesos rápidos
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: 2,
                mainAxisSpacing: 16,
                crossAxisSpacing: 16,
                children: [
                  _buildQuickAccessCard(
                    icon: Icons.account_balance_wallet,
                    title: 'Finanzas',
                    color: Colors.green,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const FinanzasScreen()),
                      );
                    },
                  ),
                  _buildQuickAccessCard(
                    icon: Icons.announcement,
                    title: 'Comunicados',
                    color: Colors.orange,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const ComunicadosScreen()),
                      );
                    },
                  ),
                  _buildQuickAccessCard(
                    icon: Icons.calendar_today,
                    title: 'Reservas',
                    color: Colors.purple,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const ReservasScreen()),
                      );
                    },
                  ),
                  _buildQuickAccessCard(
                    icon: Icons.build,
                    title: 'Mantenimiento',
                    color: Colors.blue,
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Próximamente')),
                      );
                    },
                  ),
                  _buildQuickAccessCard(
                    icon: Icons.history,
                    title: 'Historial',
                    color: Colors.indigo,
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const HistorialAccesosScreen()),
                      );
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickAccessCard({
    required IconData icon,
    required String title,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  icon,
                  size: 40,
                  color: color,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
