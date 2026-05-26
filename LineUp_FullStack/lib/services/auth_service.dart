import 'dart:convert';
import '../services/api_service.dart';
import '../models/user.dart';

class AuthService {
  static Future<User> createAnonUser() async {
    final response = await ApiService.post('/auth/anon');
    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = jsonDecode(response.body);
      return User.fromJson(data);
    }
    throw Exception('Failed to create anonymous user');
  }

  static Future<User> register({
    required String anonUserId,
    required String name,
    required String email,
    required String password,
  }) async {
    final response = await ApiService.post('/auth/register', body: {
      'anonUserId': anonUserId,
      'name': name,
      'email': email,
      'password': password,
    });
    if (response.statusCode == 200) {
      return User.fromJson(jsonDecode(response.body));
    }
    final body = jsonDecode(response.body);
    final message = body is Map<String, dynamic> && body['error'] != null
        ? body['error'].toString()
        : 'Failed to register';
    throw Exception(message);
  }

  static Future<User> login({
    required String email,
    required String password,
  }) async {
    final response = await ApiService.post('/auth/login', body: {
      'email': email,
      'password': password,
    });
    if (response.statusCode == 200) {
      return User.fromJson(jsonDecode(response.body));
    }
    throw Exception('Invalid email or password');
  }

  static Future<void> logout() async {
    await ApiService.post('/auth/logout');
  }

  static Future<void> deleteAnonUser(String userId) async {
    await ApiService.delete('/auth/anon/$userId');
  }

  static Future<void> deleteAccount(String userId) async {
    await ApiService.delete('/auth/account/$userId');
  }
}