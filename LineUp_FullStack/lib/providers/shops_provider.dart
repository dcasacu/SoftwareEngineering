import 'package:flutter/material.dart';
import '../models/shop.dart';
import '../services/shop_service.dart';

class ShopsProvider extends ChangeNotifier {
  List<Shop> _shops = [];
  Shop? _selectedShop;
  String _searchQuery = '';
  String _categoryFilter = 'All';
  bool _isLoading = false;
  String? _error;

  List<Shop> get shops => _shops;
  Shop? get selectedShop => _selectedShop;
  String get searchQuery => _searchQuery;
  String get categoryFilter => _categoryFilter;
  bool get isLoading => _isLoading;
  String? get error => _error;

  List<Shop> get filteredShops {
    var result = _shops;
    if (_categoryFilter != 'All') {
      result = result.where((s) => s.category == _categoryFilter).toList();
    }
    if (_searchQuery.isNotEmpty) {
      final q = _searchQuery.toLowerCase();
      result = result.where((s) =>
        s.name.toLowerCase().contains(q) ||
        s.category.toLowerCase().contains(q)
      ).toList();
    }
    return result;
  }

  static const categories = ['All', 'Fruits & Veg', 'Meat', 'Fish', 'Bakery', 'Dairy', 'Spices', 'Flowers'];

  Future<void> fetchShops() async {
    _isLoading = true;
    notifyListeners();

    try {
      _shops = await ShopService.getShops();
      _error = null;
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> searchShops({String? query, String? category}) async {
    _isLoading = true;
    notifyListeners();

    try {
      _shops = await ShopService.searchShops(query: query, category: category);
      _error = null;
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> selectShop(String shopId) async {
    try {
      _selectedShop = await ShopService.getShop(shopId);
      notifyListeners();
    } catch (e) {
      _error = e.toString();
    }
  }

  void clearSelectedShop() {
    _selectedShop = null;
    notifyListeners();
  }

  Future<void> toggleShopStatus(String shopId, bool isOpen) async {
    try {
      final updated = await ShopService.toggleStatus(shopId, isOpen);
      final idx = _shops.indexWhere((s) => s.id == shopId);
      if (idx >= 0) {
        _shops[idx] = updated;
      }
      if (_selectedShop?.id == shopId) {
        _selectedShop = updated;
      }
      notifyListeners();
    } catch (e) {
      _error = e.toString();
    }
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void setCategoryFilter(String category) {
    _categoryFilter = category;
    notifyListeners();
  }
}