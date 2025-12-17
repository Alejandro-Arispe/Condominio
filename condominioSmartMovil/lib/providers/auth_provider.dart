import 'dart:convert';
import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/api_service.dart';
import '../config/api_config.dart';

class AuthProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  User? _user;
  bool _isLoading = false;
  String? _error;
  
  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;
  
  // Login
  Future<bool> login(String username, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      final response = await _apiService.post(
        ApiConfig.login,
        data: {
          'username': username,
          'password': password,
        },
      );
      
      if (response.statusCode == 200) {
        final data = response.data as Map<String, dynamic>?;
        
        if (data == null) {
          _error = 'Respuesta inválida del servidor';
          _isLoading = false;
          notifyListeners();
          return false;
        }
        
        // Guardar token
        if (data['access'] != null) {
          await _apiService.saveToken(data['access']);
        }
        
        // Guardar usuario
        if (data['user'] != null) {
          _user = User.fromJson(data['user'] as Map<String, dynamic>);
          await _apiService.saveUser(jsonEncode(_user!.toJson()));
        }
        
        _isLoading = false;
        notifyListeners();
        return true;
      }
      
      _error = 'Credenciales inválidas';
      _isLoading = false;
      notifyListeners();
      return false;
    } catch (e) {
      _error = 'Error de conexión: ${e.toString()}';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
  
  // Logout
  Future<void> logout() async {
    await _apiService.logout();
    _user = null;
    notifyListeners();
  }
  
  // Cargar usuario guardado
  Future<void> loadSavedUser() async {
    final userData = await _apiService.getUser();
    if (userData != null) {
      _user = User.fromJson(jsonDecode(userData));
      notifyListeners();
    }
  }
  
  // Verificar si hay sesión activa
  Future<bool> checkAuth() async {
    final token = await _apiService.getToken();
    if (token != null) {
      await loadSavedUser();
      return true;
    }
    return false;
  }
}
