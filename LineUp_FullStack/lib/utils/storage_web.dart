import 'dart:html' as html;

Future<void> saveValue(String key, String value) async {
  html.window.localStorage[key] = value;
  print('[DEBUG] storage_web: saveValue $key=$value');
}

Future<String?> loadValue(String key) async {
  final value = html.window.localStorage[key];
  print('[DEBUG] storage_web: loadValue $key=$value');
  return value;
}

Future<void> saveBool(String key, bool value) async {
  await saveValue(key, value ? 'true' : 'false');
}

Future<bool?> loadBool(String key) async {
  final value = await loadValue(key);
  if (value == null) return null;
  return value == 'true';
}

Future<void> removeValue(String key) async {
  html.window.localStorage.remove(key);
  print('[DEBUG] storage_web: removeValue $key');
}
