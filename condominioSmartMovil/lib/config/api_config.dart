class ApiConfig {
  static const String baseUrl = 'http://localhost:8000/api/v1'; // Web/Chrome
  // static const String baseUrl = 'http://10.0.2.2:8000/api/v1'; // Android emulator
  // static const String baseUrl = 'http://192.168.1.X:8000/api/v1'; // Dispositivo físico
  
  static const int timeout = 30000; // 30 segundos
  
  // Endpoints
  static const String login = '/auth/login/';
  static const String register = '/auth/register/';
  static const String refresh = '/auth/refresh/';
  
  static const String usuarios = '/usuarios/';
  static const String unidades = '/unidades/';
  static const String cargos = '/cargos/';
  static const String pagos = '/pagos/';
  static const String comunicados = '/comunicados/';
  static const String reservas = '/reservas/';
  static const String accesos = '/accesos/';
  static const String incidentes = '/incidentes/';
  static const String tickets = '/tickets/';
  
  // Mobile endpoints
  static const String generateQR = '/generate-access-qr/';
  static const String validateQR = '/validate-qr/';
  static const String myAccessHistory = '/my-access-history/';
  static const String myCharges = '/my-charges/';
  static const String myReservations = '/reservas/';
  static const String areasComunes = '/areas-comunes/';
  static const String uploadProfilePhoto = '/upload-profile-photo/';
}
