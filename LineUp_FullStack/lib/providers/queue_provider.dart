import 'dart:async';
import 'package:flutter/material.dart';
import '../models/queue_entry.dart';
import '../services/queue_service.dart';

class CalledNotification {
  final String shopId;
  final String shopName;
  final DateTime timestamp;

  CalledNotification({required this.shopId, required this.shopName, DateTime? timestamp})
      : timestamp = timestamp ?? DateTime.now();
}

class QueueProvider extends ChangeNotifier {
  Map<String, List<QueueEntry>> _shopQueues = {};
  Map<String, QueueEntry?> _myEntries = {};
  bool _isLoading = false;
  String? _error;

  Timer? _pollTimer;
  String? _userId;
  final StreamController<CalledNotification> _calledController = StreamController<CalledNotification>.broadcast();

  Stream<CalledNotification> get calledStream => _calledController.stream;

  Map<String, List<QueueEntry>> get shopQueues => _shopQueues;
  Map<String, QueueEntry?> get myEntries => _myEntries;
  bool get isLoading => _isLoading;
  String? get error => _error;

  List<QueueEntry> queueForShop(String shopId) => _shopQueues[shopId] ?? [];
  QueueEntry? myEntryForShop(String shopId) => _myEntries[shopId];

  List<QueueEntry> waitingEntries(String shopId) {
    return queueForShop(shopId).where((e) => e.status == 'waiting' || e.status == 'called').toList();
  }

  void startPolling(String userId) {
    _userId = userId;
    _restartPolling();
  }

  void _restartPolling() {
    _pollTimer?.cancel();
    final hasActive = _myEntries.values.any((e) => e != null && (e.status == 'waiting' || e.status == 'called'));
    if (hasActive && _userId != null) {
      _pollTimer = Timer.periodic(const Duration(seconds: 5), (_) => _pollMyEntries());
    }
  }

  Future<void> _pollMyEntries() async {
    if (_userId == null) return;
    for (final entry in _myEntries.entries.toList()) {
      final shopId = entry.key;
      final currentEntry = entry.value;
      if (currentEntry == null) continue;
      if (currentEntry.status != 'waiting') continue;

      try {
        final newEntry = await QueueService.getMyEntry(shopId, _userId!);
        if (newEntry != null && newEntry.status == 'called' && currentEntry.status == 'waiting') {
          _myEntries[shopId] = newEntry;
          String shopName = shopId;
          _calledController.add(CalledNotification(shopId: shopId, shopName: shopName));
          notifyListeners();
        } else if (newEntry != null) {
          _myEntries[shopId] = newEntry;
          notifyListeners();
        }
      } catch (_) {}
    }
    _restartPolling();
  }

  Future<void> fetchQueue(String shopId) async {
    try {
      final entries = await QueueService.getQueue(shopId);
      _shopQueues[shopId] = entries;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
    }
  }

  Future<void> fetchMyEntry(String shopId, String userId) async {
    try {
      final entry = await QueueService.getMyEntry(shopId, userId);
      _myEntries[shopId] = entry;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
    }
  }

  Future<void> joinQueue(String shopId, String userId) async {
    if (_myEntries[shopId] != null) return;

    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final entry = await QueueService.joinQueue(shopId, userId);
      _myEntries[shopId] = entry;
      await fetchQueue(shopId);
      _userId = userId;
      _restartPolling();
    } catch (e) {
      _error = e.toString();
      await fetchMyEntry(shopId, userId);
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> leaveQueue(String shopId, String userId) async {
    _isLoading = true;
    notifyListeners();

    try {
      await QueueService.leaveQueue(shopId, userId);
      _myEntries[shopId] = null;
      await fetchQueue(shopId);
      _restartPolling();
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> callNext(String shopId) async {
    try {
      await QueueService.callNext(shopId);
      await fetchQueue(shopId);
    } catch (e) {
      _error = e.toString();
    }
  }

  Future<void> attend(String shopId) async {
    try {
      await QueueService.attend(shopId);
      await fetchQueue(shopId);
    } catch (e) {
      _error = e.toString();
    }
  }

  Future<void> skip(String shopId, String reason) async {
    try {
      await QueueService.skip(shopId, reason);
      await fetchQueue(shopId);
    } catch (e) {
      _error = e.toString();
    }
  }

  Future<Map<String, dynamic>?> closeQueue(String shopId) async {
    try {
      final stats = await QueueService.closeQueue(shopId);
      _shopQueues[shopId] = [];
      notifyListeners();
      return stats;
    } catch (e) {
      _error = e.toString();
      return null;
    }
  }

  void clearMyEntries() {
    _myEntries = {};
    _pollTimer?.cancel();
    notifyListeners();
  }

  @override
  void dispose() {
    _pollTimer?.cancel();
    _calledController.close();
    super.dispose();
  }
}