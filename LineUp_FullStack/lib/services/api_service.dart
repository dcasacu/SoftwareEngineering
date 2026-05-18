import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

class ApiService {
  static const String baseUrl = ApiConfig.baseUrl;

  static Map<String, String> get _headers => {
        'Content-Type': 'application/json; charset=UTF-8',
      };

  static Future<http.Response> get(String path) async {
    return await http.get(
      Uri.parse('$baseUrl$path'),
      headers: _headers,
    );
  }

  static Future<http.Response> post(String path, {Map<String, dynamic>? body}) async {
    return await http.post(
      Uri.parse('$baseUrl$path'),
      headers: _headers,
      body: body != null ? jsonEncode(body) : null,
    );
  }

  static Future<http.Response> patch(String path, {Map<String, dynamic>? body}) async {
    return await http.patch(
      Uri.parse('$baseUrl$path'),
      headers: _headers,
      body: body != null ? jsonEncode(body) : null,
    );
  }

  static Future<http.Response> delete(String path) async {
    return await http.delete(
      Uri.parse('$baseUrl$path'),
      headers: _headers,
    );
  }
}