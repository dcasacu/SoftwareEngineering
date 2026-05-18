import 'package:flutter/material.dart';
import '../../config/theme.dart';

class QueueNotificationOverlay {
  static OverlayEntry? _currentEntry;

  static void show(BuildContext context, String shopName, {Duration duration = const Duration(seconds: 8)}) {
    _currentEntry?.remove();

    final overlay = Overlay.of(context);
    late OverlayEntry entry;
    late _OverlayWidgetState widgetState;

    entry = OverlayEntry(
      builder: (context) => _OverlayWidget(
        shopName: shopName,
        onDismiss: () {
          widgetState.dismiss();
          Future.delayed(const Duration(milliseconds: 350), () {
            entry.remove();
            if (_currentEntry == entry) _currentEntry = null;
          });
        },
        onReady: (state) {
          widgetState = state;
        },
      ),
    );

    _currentEntry = entry;
    overlay.insert(entry);

    Future.delayed(duration, () {
      if (_currentEntry == entry) {
        try {
          widgetState.dismiss();
          Future.delayed(const Duration(milliseconds: 350), () {
            try {
              entry.remove();
            } catch (_) {}
            if (_currentEntry == entry) _currentEntry = null;
          });
        } catch (_) {}
      }
    });
  }

  static void dismiss() {
    _currentEntry?.remove();
    _currentEntry = null;
  }
}

class _OverlayWidget extends StatefulWidget {
  final String shopName;
  final VoidCallback onDismiss;
  final void Function(_OverlayWidgetState) onReady;

  const _OverlayWidget({
    required this.shopName,
    required this.onDismiss,
    required this.onReady,
  });

  @override
  State<_OverlayWidget> createState() => _OverlayWidgetState();
}

class _OverlayWidgetState extends State<_OverlayWidget> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<Offset> _slideAnimation;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, -1),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOut));
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(_controller);
    _controller.forward();
    widget.onReady(this);
  }

  void dismiss() {
    if (mounted) {
      _controller.reverse();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Positioned.fill(
      child: SlideTransition(
        position: _slideAnimation,
        child: FadeTransition(
          opacity: _fadeAnimation,
          child: Material(
            color: Colors.black54,
            child: GestureDetector(
              onTap: widget.onDismiss,
              child: Container(
                alignment: Alignment.topCenter,
                padding: const EdgeInsets.only(top: 80),
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 20),
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [AppTheme.orange, AppTheme.green],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: AppTheme.orange.withValues(alpha: 0.4),
                        blurRadius: 20,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text(
                        '🔔',
                        style: TextStyle(fontSize: 56),
                      ),
                      const SizedBox(height: 12),
                      const Text(
                        "It's Your Turn!",
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        widget.shopName,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          color: Colors.white70,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Text(
                          'Tap to dismiss',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}