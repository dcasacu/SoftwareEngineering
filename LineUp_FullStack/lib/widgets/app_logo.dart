import 'package:flutter/material.dart';
import '../config/theme.dart';

class AppLogo extends StatelessWidget {
  final VoidCallback? onTap;

  const AppLogo({super.key, this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text('🛒', style: TextStyle(fontSize: 22)),
          const SizedBox(width: 8),
          RichText(
            text: const TextSpan(
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800),
              children: [
                TextSpan(text: 'Line '),
                TextSpan(text: 'Up', style: TextStyle(color: AppTheme.orange)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
