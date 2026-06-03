import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'storage_stub.dart' if (dart.library.html) 'storage_web.dart' as web_storage;

class StorageHelper {
  static Future<void> saveValue(String key, String value) async {
    if (kIsWeb) {
      await web_storage.saveValue(key, value);
      return;
    }

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(key, value);
  }

  static Future<String?> loadValue(String key) async {
    if (kIsWeb) {
      return await web_storage.loadValue(key);
    }

    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(key);
  }

  static Future<void> saveBool(String key, bool value) async {
    if (kIsWeb) {
      await web_storage.saveBool(key, value);
      return;
    }

    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(key, value);
  }

  static Future<bool?> loadBool(String key) async {
    if (kIsWeb) {
      return await web_storage.loadBool(key);
    }

    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(key);
  }

  static Future<void> removeValue(String key) async {
    if (kIsWeb) {
      await web_storage.removeValue(key);
      return;
    }

    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(key);
  }
}