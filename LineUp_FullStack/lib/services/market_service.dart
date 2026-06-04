import 'dart:convert';
import 'api_service.dart';
import '../models/market.dart';

class MarketService {
  // Mock markets data

  static Future<List<Market>> getMarkets() async {
    final response = await ApiService.get('/markets');
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => Market.fromJson(json)).toList();
    }
    throw Exception('Failed to fetch markets');
  }

  static Future<Market> getMarket(String id) async {
    final response = await ApiService.get('/markets/$id');
    if (response.statusCode == 200) {
      return Market.fromJson(jsonDecode(response.body));
    }
    throw Exception('Failed to fetch market');
  }
}
