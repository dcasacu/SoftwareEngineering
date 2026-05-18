import 'dart:convert';
import 'api_service.dart';
import '../models/shop.dart';

class ShopService {
  static Future<List<Shop>> getShops() async {
    final response = await ApiService.get('/shops');
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Shop.fromJson(json)).toList();
    }
    throw Exception('Failed to fetch shops');
  }

  static Future<Shop> getShop(String id) async {
    final response = await ApiService.get('/shops/$id');
    if (response.statusCode == 200) {
      return Shop.fromJson(jsonDecode(response.body));
    }
    throw Exception('Failed to fetch shop');
  }

  static Future<List<Shop>> searchShops({String? query, String? category}) async {
    final params = <String, String>{};
    if (query != null && query.isNotEmpty) params['q'] = query;
    if (category != null && category.isNotEmpty && category != 'All') params['category'] = category;

    final uri = Uri.parse('/shops/search').replace(queryParameters: params);
    final response = await ApiService.get(uri.toString());
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Shop.fromJson(json)).toList();
    }
    throw Exception('Failed to search shops');
  }

  static Future<Shop> toggleStatus(String shopId, bool isOpen) async {
    final response = await ApiService.patch('/shops/$shopId/status', body: {
      'isOpen': isOpen,
    });
    if (response.statusCode == 200) {
      return Shop.fromJson(jsonDecode(response.body));
    }
    throw Exception('Failed to toggle shop status');
  }
}