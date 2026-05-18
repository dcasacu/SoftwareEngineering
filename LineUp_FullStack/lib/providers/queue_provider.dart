import 'package:flutter/material.dart';
import '../models/queue_entry.dart';
import '../services/queue_service.dart';

class QueueProvider extends ChangeNotifier {
  Map<String, List<QueueEntry>> _shopQueues = {};
  Map<String, QueueEntry?> _myEntries = {};
  bool _isLoading = false;
  String? _error;

  Map<String, List<QueueEntry>> get shopQueues => _shopQueues;
  Map<String, QueueEntry?> get myEntries => _myEntries;
  bool get isLoading => _isLoading;
  String? get error => _error;

  List<QueueEntry> queueForShop(String shopId) => _shopQueues[shopId] ?? [];
  QueueEntry? myEntryForShop(String shopId) => _myEntries[shopId];

  List<QueueEntry> waitingEntries(String shopId) {
    return queueForShop(shopId).where((e) => e.status == 'waiting' || e.status == 'called').toList();
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
    _isLoading = true;
    notifyListeners();

    try {
      final entry = await QueueService.joinQueue(shopId, userId);
      _myEntries[shopId] = entry;
      await fetchQueue(shopId);
    } catch (e) {
      _error = e.toString();
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

  Future<void> closeQueue(String shopId) async {
    try {
      await QueueService.closeQueue(shopId);
      _shopQueues[shopId] = [];
      notifyListeners();
    } catch (e) {
      _error = e.toString();
    }
  }

  void clearMyEntries() {
    _myEntries = {};
    notifyListeners();
  }
}