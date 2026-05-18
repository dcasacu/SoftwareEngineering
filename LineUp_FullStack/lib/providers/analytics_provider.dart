import 'package:flutter/material.dart';
import '../models/shop_analytics.dart';
import '../services/analytics_service.dart';

class AnalyticsProvider extends ChangeNotifier {
  ShopAnalytics? _analytics;
  bool _isLoading = false;
  String? _error;

  ShopAnalytics? get analytics => _analytics;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchAnalytics(String shopId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _analytics = await AnalyticsService.getAnalytics(shopId);
      _error = null;
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }
}