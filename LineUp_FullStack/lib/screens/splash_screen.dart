import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../providers/auth_provider.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

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
                const Text('🛒', style: TextStyle(fontSize: 52)),
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
                const SizedBox(height: 48),
                const Text(
                  'CHOOSE YOUR MODE',
                  style: TextStyle(color: Colors.white60, fontSize: 12, fontWeight: FontWeight.w700, letterSpacing: 1),
                ),
                const SizedBox(height: 16),
                _ModeCard(
                  icon: '🧺',
                  title: 'Customer',
                  subtitle: 'Browse shops, join queues, track your turn',
                  color: Colors.white,
                  textColor: AppTheme.gray900,
                  onTap: () async {
                    final auth = context.read<AuthProvider>();
                    if (auth.userId == null) {
                      await auth.createAnonUser();
                    }
                    if (context.mounted) {
                      context.go('/customer/map');
                    }
                  },
                ),
                const SizedBox(height: 12),
                _ModeCard(
                  icon: '🏪',
                  title: 'Shop Owner',
                  subtitle: 'Manage your queue & serving turns',
                  color: AppTheme.orange,
                  textColor: Colors.white,
                  onTap: () {
                    context.go('/owner/dashboard');
                  },
                ),
                const SizedBox(height: 16),
                const Text('Demo mode · No login required', style: TextStyle(color: Colors.white38, fontSize: 12)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _ModeCard extends StatelessWidget {
  final String icon;
  final String title;
  final String subtitle;
  final Color color;
  final Color textColor;
  final VoidCallback onTap;

  const _ModeCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.textColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 22),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Row(
          children: [
            Text(icon, style: const TextStyle(fontSize: 36)),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: textColor)),
                  const SizedBox(height: 2),
                  Text(subtitle, style: TextStyle(fontSize: 13, color: textColor.withValues(alpha: 0.7))),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}