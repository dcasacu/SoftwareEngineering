import 'dart:convert';
import 'api_service.dart';
import '../models/shop_analytics.dart';

class AnalyticsService {
  static Future<ShopAnalytics> getAnalytics(String shopId) async {
    final response = await ApiService.get('/shops/$shopId/analytics');
    if (response.statusCode == 200) {
      return ShopAnalytics.fromJson(jsonDecode(response.body));
    }
    throw Exception('Failed to fetch analytics');
  }
}