import 'dart:convert';

import 'package:flutter/material.dart';
import '../models/shop.dart';
import '../models/user.dart';
import '../services/api_service.dart';
import '../providers/shops_provider.dart';

class UserProfileProvider extends ChangeNotifier {
  List<String> _favoriteShops = [];
  Map<String, int> _visitCount = {};
  Map<String, DateTime> _lastVisit = {};
  bool _isLoading = false;
  String? _error;

  List<String> get favoriteShops => _favoriteShops;
  Map<String, int> get visitCount => _visitCount;
  Map<String, DateTime> get lastVisit => _lastVisit;
  bool get isLoading => _isLoading;
  String? get error => _error;

  void setUserData(User user) {
    _favoriteShops = user.favoriteShops;
    _visitCount = user.visitCount;
    _lastVisit = user.lastVisit;
    notifyListeners();
  }

  Future<void> loadUserProfile(String userId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await ApiService.get('/users/$userId/profile');
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        _favoriteShops = List<String>.from(data['favoriteShops'] ?? []);
        _visitCount = Map<String, int>.from(data['visitCount'] ?? {});
        final lastVisitData = data['lastVisit'] as Map<String, dynamic>?;
        _lastVisit = lastVisitData == null
            ? {}
            : Map<String, DateTime>.fromEntries(
                lastVisitData.entries.map(
                  (entry) => MapEntry(
                    entry.key,
                    DateTime.parse(entry.value.toString()),
                  ),
                ),
              );
      } else {
        _error = 'Failed to load profile: ${response.statusCode}';
      }
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> toggleFavorite(String shopId) async {
    try {
      if (_favoriteShops.contains(shopId)) {
        _favoriteShops.remove(shopId);
      } else {
        _favoriteShops.add(shopId);
      }
      notifyListeners();

      await ApiService.post(
        '/users/favorites',
        body: {
          'shopId': shopId,
          'action': _favoriteShops.contains(shopId) ? 'add' : 'remove',
        },
      );
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  Future<void> recordVisit(String shopId) async {
    try {
      _visitCount[shopId] = (_visitCount[shopId] ?? 0) + 1;
      _lastVisit[shopId] = DateTime.now();
      notifyListeners();

      await ApiService.post(
        '/users/visits',
        body: {
          'shopId': shopId,
          'timestamp': DateTime.now().toIso8601String(),
        },
      );
    } catch (e) {
      _error = e.toString();
    }
  }

  List<MapEntry<String, int>> getTopShops(int limit) {
    final sorted = _visitCount.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));
    return sorted.take(limit).toList();
  }
}