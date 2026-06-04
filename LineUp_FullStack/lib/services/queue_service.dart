import 'dart:convert';
import 'api_service.dart';
import '../models/queue_entry.dart';

class QueueService {
  static Future<List<QueueEntry>> getQueue(String shopId) async {
    final response = await ApiService.get('/shops/$shopId/queue');
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((json) => QueueEntry.fromJson(json)).toList();
    }
    throw Exception('Failed to fetch queue');
  }

  static Future<QueueEntry?> getMyEntry(String shopId, String userId) async {
    final response = await ApiService.get('/shops/$shopId/queue/my-entry?userId=$userId');
    if (response.statusCode == 200) {
      final body = response.body;
      if (body == 'null' || body.isEmpty) return null;
      return QueueEntry.fromJson(jsonDecode(body));
    }
    return null;
  }

  static Future<QueueEntry> joinQueue(String shopId, String userId) async {
    final response = await ApiService.post('/shops/$shopId/join', body: {
      'userId': userId,
    });
    if (response.statusCode == 200 || response.statusCode == 201) {
      return QueueEntry.fromJson(jsonDecode(response.body));
    }
    if (response.statusCode == 409) {
      final body = jsonDecode(response.body);
      return QueueEntry.fromJson(body['entry']);
    }
    throw Exception('Failed to join queue');
  }

  static Future<void> leaveQueue(String shopId, String userId) async {
    final response = await ApiService.post('/shops/$shopId/leave', body: {
      'userId': userId,
    });
    print('Leave response: ${response.statusCode} ${response.body}');
    if (response.statusCode != 200) {
      throw Exception('Failed to leave queue');
    }
  }

  static Future<QueueEntry> callNext(String shopId) async {
    final response = await ApiService.post('/shops/$shopId/call-next');
    if (response.statusCode == 200) {
      return QueueEntry.fromJson(jsonDecode(response.body));
    }
    throw Exception('Failed to call next');
  }

  static Future<QueueEntry> attend(String shopId) async {
    final response = await ApiService.post('/shops/$shopId/attend');
    if (response.statusCode == 200) {
      return QueueEntry.fromJson(jsonDecode(response.body));
    }
    throw Exception('Failed to attend');
  }

  static Future<QueueEntry> skip(String shopId, String reason) async {
    final response = await ApiService.post('/shops/$shopId/skip', body: {
      'reason': reason,
    });
    if (response.statusCode == 200) {
      return QueueEntry.fromJson(jsonDecode(response.body));
    }
    throw Exception('Failed to skip');
  }

  static Future<Map<String, dynamic>> endShift(String shopId) async {
    final response = await ApiService.post('/shops/$shopId/end-shift');
    if (response.statusCode == 200) {
      final body = jsonDecode(response.body);
      return body['stats'] as Map<String, dynamic>;
    }
    throw Exception('Failed to end shift');
  }
}