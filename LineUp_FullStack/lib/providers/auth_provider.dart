import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/auth_service.dart';
import '../utils/storage.dart';

class AuthProvider extends ChangeNotifier {
  User? _currentUser;
  bool _isLoading = false;
  String? _error;

  User? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isLoggedIn => _currentUser != null;
  bool get isOwner => _currentUser?.isOwner ?? false;
  String? get userId => _currentUser?.id;

  AuthProvider() {
    _init();
  }

  Future<void> _init() async {
    final storedUserId = await StorageHelper.loadValue('user_id');
    final storedName = await StorageHelper.loadValue('user_name');
    final storedEmail = await StorageHelper.loadValue('user_email');
    final storedRole = await StorageHelper.loadValue('user_role');

    if (storedUserId != null) {
      _currentUser = User(
        id: storedUserId,
        name: storedName,
        email: storedEmail,
        role: storedRole ?? 'anon',
      );
      notifyListeners();
    }
  }

  Future<void> createAnonUser() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final user = await AuthService.createAnonUser();
      _currentUser = user;
      await _persistUser();
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> register({
    required String name,
    required String email,
    required String password,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      if (_currentUser == null) await createAnonUser();
      final user = await AuthService.register(
        anonUserId: _currentUser!.id,
        name: name,
        email: email,
        password: password,
      );
      _currentUser = user;
      await _persistUser();
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> login({
    required String email,
    required String password,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final anonUserId = _currentUser?.role == 'anon' ? _currentUser!.id : null;
      final user = await AuthService.login(
        email: email,
        password: password,
        anonUserId: anonUserId,
      );
      _currentUser = user;
      await _persistUser();
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> logout() async {
    await AuthService.logout();
    _currentUser = null;
    await _clearUser();
    notifyListeners();
  }

  Future<void> deleteAnonUser() async {
    if (_currentUser != null) {
      await AuthService.deleteAnonUser(_currentUser!.id);
    }
    _currentUser = null;
    await _clearUser();
    notifyListeners();
  }

  Future<void> _persistUser() async {
    if (_currentUser == null) return;
    await StorageHelper.saveValue('user_id', _currentUser!.id);
    await StorageHelper.saveValue('user_name', _currentUser!.name ?? '');
    await StorageHelper.saveValue('user_email', _currentUser!.email ?? '');
    await StorageHelper.saveValue('user_role', _currentUser!.role);
  }

  Future<void> _clearUser() async {
    await StorageHelper.removeValue('user_id');
    await StorageHelper.removeValue('user_name');
    await StorageHelper.removeValue('user_email');
    await StorageHelper.removeValue('user_role');
  }
}
