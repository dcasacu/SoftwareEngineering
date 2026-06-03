import 'dart:convert';
import 'api_service.dart';
import '../models/shop.dart';

class ShopService {
  // Mock shops data with marketId
  static final List<Map<String, dynamic>> _mockShopsData = [
    // La Boqueria (market_1) shops
    {
      'id': 'shop_1',
      'name': 'Fresh Produce Stand',
      'category': 'Fruits & Veg',
      'lat': 41.3817,
      'lng': 2.1744,
      'isOpen': 1,
      'avgServiceTime': 120,
      'ownerId': 'owner_1',
      'marketId': 'market_1',
    },
    {
      'id': 'shop_2',
      'name': 'Quality Meats',
      'category': 'Meat',
      'lat': 41.3818,
      'lng': 2.1745,
      'isOpen': 1,
      'avgServiceTime': 180,
      'ownerId': 'owner_2',
      'marketId': 'market_1',
    },
    {
      'id': 'shop_3',
      'name': 'Fresh Fish Market',
      'category': 'Fish',
      'lat': 41.3816,
      'lng': 2.1743,
      'isOpen': 1,
      'avgServiceTime': 150,
      'ownerId': 'owner_3',
      'marketId': 'market_1',
    },
    // Sant Antoni Market (market_2) shops
    {
      'id': 'shop_4',
      'name': 'Traditional Bakery',
      'category': 'Bakery',
      'lat': 41.3794,
      'lng': 2.1692,
      'isOpen': 1,
      'avgServiceTime': 90,
      'ownerId': 'owner_4',
      'marketId': 'market_2',
    },
    {
      'id': 'shop_5',
      'name': 'Dairy Delights',
      'category': 'Dairy',
      'lat': 41.3795,
      'lng': 2.1691,
      'isOpen': 1,
      'avgServiceTime': 120,
      'ownerId': 'owner_5',
      'marketId': 'market_2',
    },
    // Mercat de Sant Josep (market_3) shops
    {
      'id': 'shop_6',
      'name': 'Spice Paradise',
      'category': 'Spices',
      'lat': 41.3870,
      'lng': 2.1693,
      'isOpen': 1,
      'avgServiceTime': 200,
      'ownerId': 'owner_6',
      'marketId': 'market_3',
    },
    {
      'id': 'shop_7',
      'name': 'Flower Boutique',
      'category': 'Flowers',
      'lat': 41.3871,
      'lng': 2.1694,
      'isOpen': 0,
      'avgServiceTime': 60,
      'ownerId': 'owner_7',
      'marketId': 'market_3',
    },
    {
      'id': 'shop_8',
      'name': 'Market Vegetables',
      'category': 'Fruits & Veg',
      'lat': 41.3869,
      'lng': 2.1692,
      'isOpen': 1,
      'avgServiceTime': 100,
      'ownerId': 'owner_8',
      'marketId': 'market_3',
    },
    // Mercat de Provençals (market_4) shops
    {
      'id': 'shop_9',
      'name': 'Local Bakery',
      'category': 'Bakery',
      'lat': 41.3951,
      'lng': 2.1933,
      'isOpen': 1,
      'avgServiceTime': 110,
      'ownerId': 'owner_9',
      'marketId': 'market_4',
    },
    {
      'id': 'shop_10',
      'name': 'Butcher Shop',
      'category': 'Meat',
      'lat': 41.3952,
      'lng': 2.1934,
      'isOpen': 0,
      'avgServiceTime': 160,
      'ownerId': 'owner_10',
      'marketId': 'market_4',
    },
  ];

  static Future<List<Shop>> getShops() async {
    try {
      final response = await ApiService.get('/shops');
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => Shop.fromJson(json)).toList();
      }
    } catch (e) {
      print('Error fetching shops from API: $e, using mock data');
    }
    
    // Return mock data
    return _mockShopsData.map((json) => Shop.fromJson(json)).toList();
  }

  static Future<Shop> getShop(String id) async {
    try {
      final response = await ApiService.get('/shops/$id');
      if (response.statusCode == 200) {
        return Shop.fromJson(jsonDecode(response.body));
      }
    } catch (e) {
      print('Error fetching shop from API: $e, using mock data');
    }
    
    // Return mock data
    final mockShop = _mockShopsData.firstWhere(
      (s) => s['id'] == id,
      orElse: () => _mockShopsData.first,
    );
    return Shop.fromJson(mockShop);
  }

  static Future<List<Shop>> searchShops({String? query, String? category}) async {
    try {
      final params = <String, String>{};
      if (query != null && query.isNotEmpty) params['q'] = query;
      if (category != null && category.isNotEmpty && category != 'All') params['category'] = category;

      final uri = Uri.parse('/shops/search').replace(queryParameters: params);
      final response = await ApiService.get(uri.toString());
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => Shop.fromJson(json)).toList();
      }
    } catch (e) {
      print('Error searching shops from API: $e, using mock data with filters');
    }
    
    // Filter mock data
    var result = _mockShopsData;
    
    if (category != null && category.isNotEmpty && category != 'All') {
      result = result.where((s) => s['category'] == category).toList();
    }
    
    if (query != null && query.isNotEmpty) {
      final q = query.toLowerCase();
      result = result.where((s) =>
        (s['name'] as String).toLowerCase().contains(q) ||
        (s['category'] as String).toLowerCase().contains(q)
      ).toList();
    }
    
    return result.map((json) => Shop.fromJson(json)).toList();
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