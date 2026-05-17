import 'package:shared_preferences/shared_preferences.dart';

Future<void> saveValue(String key, String value) async {
  final prefs = await SharedPreferences.getInstance();
  prefs.setString(key, value);
}

Future<String?> loadValue(String key) async {
  final prefs = await SharedPreferences.getInstance();
  return prefs.getString(key);
}
