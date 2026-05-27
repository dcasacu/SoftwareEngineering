import 'package:flutter/material.dart';
import '../models/market.dart';
import '../services/market_service.dart';

class MarketsProvider extends ChangeNotifier {
  List<Market> _markets = [];
  Market? _selectedMarket;
  bool _isLoading = false;
  String? _error;

  List<Market> get markets => _markets;
  Market? get selectedMarket => _selectedMarket;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchMarkets() async {
    _isLoading = true;
    notifyListeners();

    try {
      _markets = await MarketService.getMarkets();
      _error = null;
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> selectMarket(String marketId) async {
    try {
      _selectedMarket = await MarketService.getMarket(marketId);
      notifyListeners();
    } catch (e) {
      _error = e.toString();
    }
  }

  void clearSelectedMarket() {
    _selectedMarket = null;
    notifyListeners();
  }
}
