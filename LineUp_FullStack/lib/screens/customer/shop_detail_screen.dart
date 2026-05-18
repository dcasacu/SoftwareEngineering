import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/shops_provider.dart';
import '../../providers/queue_provider.dart';
import '../../providers/auth_provider.dart';
import '../../models/shop.dart';
import '../../services/notification_service.dart';
import '../../widgets/position_badge.dart';
import '../../widgets/queue_list_tile.dart';
import '../../widgets/queue_notification_overlay.dart';

class ShopDetailScreen extends StatefulWidget {
  final String shopId;

  const ShopDetailScreen({super.key, required this.shopId});

  @override
  State<ShopDetailScreen> createState() => _ShopDetailScreenState();
}

class _ShopDetailScreenState extends State<ShopDetailScreen> {
  StreamSubscription<CalledNotification>? _calledSub;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = context.read<AuthProvider>();
      final queueProvider = context.read<QueueProvider>();
      context.read<ShopsProvider>().selectShop(widget.shopId);
      queueProvider.fetchQueue(widget.shopId);
      if (auth.userId != null) {
        queueProvider.fetchMyEntry(widget.shopId, auth.userId!);
        queueProvider.startPolling(auth.userId!);
      }
      _calledSub = queueProvider.calledStream.listen((notification) {
        final shopsProv = context.read<ShopsProvider>();
        final shop = shopsProv.shops.firstWhere(
          (s) => s.id == notification.shopId,
          orElse: () => Shop(id: '', name: 'Unknown Shop', category: '', isOpen: false, avgServiceTime: 300, ownerId: ''),
        );
        NotificationService.feedbackYourTurn();
        QueueNotificationOverlay.show(context, shop.name);
      });
    });
  }

  @override
  void dispose() {
    _calledSub?.cancel();
    super.dispose();
  }

  String _getCategoryEmoji(String cat) {
    const emojis = {
      'Fruits & Veg': '🥕', 'Meat': '🥩', 'Fish': '🐟',
      'Bakery': '🥖', 'Dairy': '🧀', 'Spices': '🌶️', 'Flowers': '🌸',
    };
    return emojis[cat] ?? '🛒';
  }

  @override
  Widget build(BuildContext context) {
    final shopsProvider = context.watch<ShopsProvider>();
    final queueProvider = context.watch<QueueProvider>();
    final auth = context.watch<AuthProvider>();
    final shop = shopsProvider.selectedShop;
    final queue = queueProvider.queueForShop(widget.shopId);
    final myEntry = queueProvider.myEntryForShop(widget.shopId);
    final activeQueue = queue.where((e) => e.status == 'waiting' || e.status == 'called').toList();

    if (shop == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [AppTheme.blue, AppTheme.blueDark],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              padding: const EdgeInsets.fromLTRB(20, 50, 20, 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  TextButton.icon(
                    onPressed: () => context.go('/customer/map'),
                    icon: const Icon(Icons.arrow_back, color: Colors.white),
                    label: const Text('Back', style: TextStyle(color: Colors.white)),
                    style: TextButton.styleFrom(padding: EdgeInsets.zero),
                  ),
                  const SizedBox(height: 8),
                  Text(_getCategoryEmoji(shop.category), style: const TextStyle(fontSize: 40)),
                  const SizedBox(height: 8),
                  Text(shop.name, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Colors.white)),
                  const SizedBox(height: 4),
                  Text(shop.category, style: const TextStyle(fontSize: 14, color: Colors.white70)),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                        decoration: BoxDecoration(
                          color: shop.isOpen ? AppTheme.green.withValues(alpha: 0.2) : AppTheme.red.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          shop.isOpen ? '● Open' : '● Closed',
                          style: TextStyle(color: shop.isOpen ? AppTheme.green : AppTheme.red, fontWeight: FontWeight.w700, fontSize: 12),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          '~${shop.avgServiceMinutes} min/customer',
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 12),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (myEntry != null) ...[
                    const Text('Your Queue Status', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.gray600)),
                    const SizedBox(height: 8),
                    PositionBadge(position: myEntry.position, total: activeQueue.length, avgMinutes: shop.avgServiceMinutes),
                    const SizedBox(height: 16),
                  ],
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Current Queue', style: TextStyle(fontWeight: FontWeight.w800, color: AppTheme.gray900)),
                          const SizedBox(height: 12),
                          if (activeQueue.isEmpty)
                            const Padding(
                              padding: EdgeInsets.symmetric(vertical: 16),
                              child: Center(child: Text('No one in queue — join now!', style: TextStyle(color: AppTheme.gray400))),
                            )
                          else
                            ...activeQueue.asMap().entries.map((entry) {
                              final e = entry.value;
                              final isMe = e.userId == auth.userId;
                              return QueueListTile(
                                entry: e,
                                isMe: isMe,
                                isFirst: entry.key == 0,
                                avgMinutes: shop.avgServiceMinutes,
                                isLast: entry.key == activeQueue.length - 1,
                              );
                            }),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  if (shop.isOpen) ...[
                    if (myEntry != null)
                      OutlinedButton(
                        onPressed: () async {
                          final shopName = shop.name;
                          await context.read<QueueProvider>().leaveQueue(widget.shopId, auth.userId ?? '');
                          final q = context.read<QueueProvider>();
                          if (q.error != null && context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text(q.error!), backgroundColor: AppTheme.red),
                            );
                          } else {
                            NotificationService.feedbackLeave();
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('You left the queue at $shopName'),
                                  backgroundColor: AppTheme.orange,
                                  duration: const Duration(seconds: 3),
                                ),
                              );
                              context.go('/customer/map');
                            }
                          }
                        },
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppTheme.red,
                          minimumSize: const Size.fromHeight(48),
                          side: const BorderSide(color: AppTheme.red),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: const Text('Leave Queue', style: TextStyle(fontWeight: FontWeight.w700)),
                      )
                    else
                      ElevatedButton(
                        onPressed: () async {
                          final qp = context.read<QueueProvider>();
                          final shopName = shop.name;
                          await qp.joinQueue(widget.shopId, auth.userId ?? '');
                          if (qp.error != null && context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text(qp.error!), backgroundColor: AppTheme.red),
                            );
                          } else {
                            final entry = qp.myEntryForShop(widget.shopId);
                            final pos = entry?.position ?? 1;
                            NotificationService.feedbackJoin();
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('🛒 Joined queue at $shopName! You\'re #$pos'),
                                  backgroundColor: AppTheme.green,
                                  duration: const Duration(seconds: 4),
                                ),
                              );
                            }
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.orange,
                          minimumSize: const Size.fromHeight(48),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: const Text('Join Queue →', style: TextStyle(fontWeight: FontWeight.w700)),
                      ),
                  ] else
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Center(child: Text('This shop is currently closed', style: TextStyle(color: AppTheme.gray400))),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}