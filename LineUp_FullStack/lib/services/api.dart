// ALL HTTP REQUESTS TO THE BACKEND API ARE MADE IN THIS FILE

import 'dart:convert';
import 'package:http/http.dart' as http;

const baseUrl = 'http://localhost:4000/api';

// Logs in as an anonymous user and returns the user ID (which is stored in local storage for future requests)
Future<String> anonLogin() async {
    final response = await http.post(
        Uri.parse('$baseUrl/auth/anon'),
    );
    if (response.statusCode == 200 || response.statusCode == 201) {
        return jsonDecode(response.body)['id'];
    } else {
        throw Exception('Failed to log in as anonymous user');
    }
}



// Joins the queue for a specific shop and returns the user's position in the queue (shop name is already known and will be shown in the UI with the position)
Future<int> joinQueue(String shopId, String userId) async{
    final response = await http.post(
        Uri.parse('$baseUrl/shops/$shopId/join'),
        headers: <String, String>{'Content-Type': 'application/json; charset=UTF-8',},
        body: jsonEncode(<String, String>{'userId': userId,}),
    );
    if (response.statusCode == 200 || response.statusCode == 201) {
        return jsonDecode(response.body)['position'];
    } else {
        throw Exception('Failed to join queue');
    }
}

// Leaves the queue for a specific shop (shop name is already known and will be shown in the UI)
Future<void> leaveQueue(String shopId, String userId) async{
    final response = await http.post(
        Uri.parse('$baseUrl/shops/$shopId/leave'),
        headers: <String, String>{'Content-Type': 'application/json; charset=UTF-8',},
        body: jsonEncode(<String, String>{'userId': userId,}),
    );
    if (response.statusCode != 200 && response.statusCode != 201) {
        throw Exception('Failed to leave queue');
    }
}

