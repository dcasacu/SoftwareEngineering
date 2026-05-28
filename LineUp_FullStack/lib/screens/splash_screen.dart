import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../providers/auth_provider.dart';
import '../widgets/login_dialog.dart';
import '../widgets/register_dialog.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  String? _error;
  bool _hasRedirected = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = context.read<AuthProvider>();
      auth.addListener(_onAuthChanged);
      _checkRedirect(auth);
    });
  }

  @override
  void dispose() {
    context.read<AuthProvider>().removeListener(_onAuthChanged);
    super.dispose();
  }

  void _onAuthChanged() {
    _checkRedirect(context.read<AuthProvider>());
  }

  void _checkRedirect(AuthProvider auth) {
    if (_hasRedirected) return;
    if (auth.isLoggedIn && auth.currentUser?.role != 'anon') {
      _hasRedirected = true;
      if (auth.isOwner) {
        context.go('/owner/dashboard');
      } else {
        context.go('/customer/map');
      }
    }
  }

  Future<void> _showLoginDialog() async {
    await showDialog(
      context: context,
      builder: (_) => const LoginDialog(),
    );
  }

  Future<void> _continueWithoutLogin() async {
    setState(() => _error = null);
    final auth = context.read<AuthProvider>();
    if (auth.userId == null) {
      try {
        await auth.createAnonUser();
      } catch (e) {
        if (mounted) {
          setState(() => _error = 'Could not connect to server. Make sure the backend is running on port 4000.');
        }
        return;
      }
    }
    if (mounted) context.go('/customer/map');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.blue,
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text('🛒', style: TextStyle(fontSize: 64)),
                const SizedBox(height: 8),
                RichText(
                  text: const TextSpan(
                    style: TextStyle(fontSize: 42, fontWeight: FontWeight.w900, letterSpacing: -1),
                    children: [
                      TextSpan(text: 'Line '),
                      TextSpan(text: 'Up', style: TextStyle(color: AppTheme.orange)),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
                const Text('Smart market queues', style: TextStyle(color: Colors.white70, fontSize: 16)),
                const SizedBox(height: 64),
                const Text(
                  'Welcome',
                  style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Log in to manage your queues or continue as a guest.',
                  style: TextStyle(color: Colors.white60, fontSize: 14),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 32),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _showLoginDialog,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.orange,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    child: const Text('Log In', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: () async {
                      await showDialog(context: context, builder: (_) => const RegisterDialog());
                    },
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.white,
                      side: const BorderSide(color: Colors.white38),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    child: const Text('Sign Up', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton(
                    onPressed: _continueWithoutLogin,
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.white,
                      side: const BorderSide(color: Colors.white38),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                    child: const Text('Continue without logging in', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
                  ),
                ),
                if (_error != null) ...[
                  const SizedBox(height: 16),
                  Text(_error!, style: const TextStyle(color: Colors.redAccent, fontSize: 13), textAlign: TextAlign.center),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
