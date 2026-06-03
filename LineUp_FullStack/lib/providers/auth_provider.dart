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
    print('[DEBUG] AuthProvider._init() starting');
    final rememberMe = await StorageHelper.loadBool('remember_me') ?? false;
    print('[DEBUG] rememberMe flag loaded: $rememberMe');
    
    if (!rememberMe) {
      await _clearUser();
      notifyListeners();
      print('[DEBUG] rememberMe is false, cleared user data');
      return;
    }

    final storedUserId = await StorageHelper.loadValue('user_id');
    final storedName = await StorageHelper.loadValue('user_name');
    final storedEmail = await StorageHelper.loadValue('user_email');
    final storedRole = await StorageHelper.loadValue('user_role');

    print('[DEBUG] Loaded from storage - ID: $storedUserId, Email: $storedEmail, Role: $storedRole');

    if (storedUserId != null) {
      _currentUser = User(
        id: storedUserId,
        name: storedName,
        email: storedEmail,
        role: storedRole ?? 'anon',
      );
      print('[DEBUG] Restored user from storage: ${_currentUser!.email}');
    }
    notifyListeners();
  }

  Future<void> createAnonUser() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final user = await AuthService.createAnonUser();
      _currentUser = user;
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
      if (_currentUser == null) {
        await createAnonUser();
        if (_currentUser == null) {
          return;
        }
      }
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
    bool rememberMe = false,
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
      print('[DEBUG] Logged in as: ${user.email}, rememberMe: $rememberMe');
      if (rememberMe) {
        await _persistUser(rememberMe: true);
        print('[DEBUG] User data persisted with rememberMe=true');
      } else {
        await _clearUser();
        print('[DEBUG] User data cleared (rememberMe=false)');
      }
    } catch (e) {
      _error = e.toString();
      print('[DEBUG] Login error: $e');
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

  Future<void> deleteAccount() async {
    if (_currentUser == null) return;
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await AuthService.deleteAccount(_currentUser!.id);
      _currentUser = null;
      await _clearUser();
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
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

  Future<void> _persistUser({bool rememberMe = false}) async {
    if (_currentUser != null) {
      await StorageHelper.saveValue('user_id', _currentUser!.id);
      await StorageHelper.saveValue('user_name', _currentUser!.name ?? '');
      await StorageHelper.saveValue('user_email', _currentUser!.email ?? '');
      await StorageHelper.saveValue('user_role', _currentUser!.role);
      await StorageHelper.saveBool('remember_me', rememberMe);
    }
  }

  Future<void> _clearUser() async {
    await StorageHelper.removeValue('user_id');
    await StorageHelper.removeValue('user_name');
    await StorageHelper.removeValue('user_email');
    await StorageHelper.removeValue('user_role');
    await StorageHelper.removeValue('remember_me');
  }
}
