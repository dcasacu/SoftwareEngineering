import 'dart:convert';
import 'api_service.dart';
import '../models/market.dart';

class MarketService {
  // Mock markets data
  static final List<Map<String, dynamic>> _mockMarketsData = [
    {
      'id': 'market_1',
      'name': 'La Boqueria',
      'lat': 41.3817,
      'lng': 2.1744,
      'address': 'La Rambla, 91, Barcelona',
      'operatingHours': '8:00 AM - 8:00 PM',
      'description': 'Traditional Barcelona market with fresh produce, meat, fish, and flowers',
      'mapImageUrl': 'assets/markets/boqueria_map.png',
    },
    {
      'id': 'market_2',
      'name': 'Sant Antoni Market',
      'lat': 41.3794,
      'lng': 2.1692,
      'address': 'Carrer del Parlament, 58, Barcelona',
      'operatingHours': '7:00 AM - 2:00 PM (Mon-Sat)',
      'description': 'Historic market in the Sant Antoni neighborhood with local vendors',
      'mapImageUrl': 'assets/markets/sant_antoni_map.png',
    },
    {
      'id': 'market_3',
      'name': 'Mercat de Sant Josep',
      'lat': 41.3870,
      'lng': 2.1693,
      'address': 'Plaça de la Independència, Barcelona',
      'operatingHours': '8:00 AM - 9:00 PM',
      'description': 'Modern market with variety of shops and restaurants',
      'mapImageUrl': 'assets/markets/sant_josep_map.png',
    },
    {
      'id': 'market_4',
      'name': 'Mercat de Provençals',
      'lat': 41.3951,
      'lng': 2.1933,
      'address': 'Carrer de Provençals, 35, Barcelona',
      'operatingHours': '7:00 AM - 3:00 PM (Mon-Sat)',
      'description': 'Local neighborhood market with traditional vendors',
      'mapImageUrl': 'assets/markets/provencals_map.png',
    },
  ];

  static Future<List<Market>> getMarkets() async {
    try {
      // Try to fetch from API
      final response = await ApiService.get('/markets');
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => Market.fromJson(json)).toList();
      }
    } catch (e) {
      // Fall back to mock data
      print('Error fetching markets from API: $e, using mock data');
    }
    
    // Return mock data
    return _mockMarketsData.map((json) => Market.fromJson(json)).toList();
  }

  static Future<Market> getMarket(String id) async {
    try {
      // Try to fetch from API
      final response = await ApiService.get('/markets/$id');
      if (response.statusCode == 200) {
        return Market.fromJson(jsonDecode(response.body));
      }
    } catch (e) {
      // Fall back to mock data
      print('Error fetching market from API: $e, using mock data');
    }
    
    // Return mock data
    final mockMarket = _mockMarketsData.firstWhere(
      (m) => m['id'] == id,
      orElse: () => _mockMarketsData.first,
    );
    return Market.fromJson(mockMarket);
  }
}
