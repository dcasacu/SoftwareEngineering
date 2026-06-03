import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/shops_provider.dart';
import '../../providers/queue_provider.dart';
import '../../providers/auth_provider.dart';
import '../../models/shop.dart';
import '../../services/vibration_service.dart';

class MyQueuesScreen extends StatefulWidget {
  const MyQueuesScreen({super.key});

  @override
  State<MyQueuesScreen> createState() => _MyQueuesScreenState();
}

class _MyQueuesScreenState extends State<MyQueuesScreen> {
  final VibrationService _vibrationService = const VibrationService();
  final Set<String> _notifiedQueues = {};

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final auth = context.read<AuthProvider>();
      final shopsProvider = context.read<ShopsProvider>();
      final queueProvider = context.read<QueueProvider>();

      if (auth.userId != null) {
        for (final shop in shopsProvider.shops) {
          queueProvider.fetchMyEntry(shop.id, auth.userId!);
        }
      }
    });
  }

  Future<void> _checkTurnNotification(String shopId, int position) async {
    if (position == 1 && !_notifiedQueues.contains(shopId)) {
      _notifiedQueues.add(shopId);
      await _vibrationService.notifyTurn();
    }

    if (position > 1 && _notifiedQueues.contains(shopId)) {
      _notifiedQueues.remove(shopId);
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final queueProvider = context.watch<QueueProvider>();
    final shopsProvider = context.watch<ShopsProvider>();

    final activeEntries = queueProvider.myEntries.entries.where((e) => e.value != null).toList();

    return Scaffold(
      appBar: AppBar(title: const Text('My Queues')),
      body: activeEntries.isEmpty
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('🛒', style: TextStyle(fontSize: 48)),
                    const SizedBox(height: 16),
                    const Text('No active queues', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16, color: AppTheme.gray600)),
                    const SizedBox(height: 8),
                    const Text('Go to the Map tab to browse shops and join a queue.', style: TextStyle(fontSize: 14, color: AppTheme.gray400), textAlign: TextAlign.center),
                  ],
                ),
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: activeEntries.length,
              itemBuilder: (context, index) {
                final entry = activeEntries[index];
                final shopId = entry.key;
                final queueEntry = entry.value!;
                
                WidgetsBinding.instance.addPostFrameCallback((_) {
                  _checkTurnNotification(shopId, queueEntry.position);
                });

                final shop = shopsProvider.shops.firstWhere(
                  (s) => s.id == shopId,
                  orElse: () => Shop(id: '', name: 'Unknown', category: '', isOpen: false, avgServiceTime: 300, ownerId: ''),
                );
                final queue = queueProvider.queueForShop(shopId);
                final active = queue.where((e) => e.status == 'waiting' || e.status == 'called').toList();

                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: const BorderSide(color: AppTheme.blueLight, width: 2),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(child: Text('${_emoji(shop.category)} ${shop.name}', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: AppTheme.gray900))),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                              decoration: BoxDecoration(color: AppTheme.greenLight, borderRadius: BorderRadius.circular(20)),
                              child: const Text('Active', style: TextStyle(color: AppTheme.green, fontWeight: FontWeight.w700, fontSize: 12)),
                            ),
                          ],
                        ),
                        const SizedBox(height: 14),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                              const Text('Your position', style: TextStyle(fontSize: 13, color: AppTheme.gray600, fontWeight: FontWeight.w600)),
                              Text('#${queueEntry.position}', style: const TextStyle(fontSize: 38, fontWeight: FontWeight.w900, color: AppTheme.blue, height: 1)),
                              Text('of ${active.length} in queue', style: const TextStyle(fontSize: 12, color: AppTheme.gray400)),
                            ]),
                            Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
                              const Text('Est. wait', style: TextStyle(fontSize: 13, color: AppTheme.gray600, fontWeight: FontWeight.w600)),
                              Text('${(queueEntry.position - 1) * shop.avgServiceMinutes}m', style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: AppTheme.orange, height: 1)),
                              const Text('minutes', style: TextStyle(fontSize: 12, color: AppTheme.gray400)),
                            ]),
                          ],
                        ),
                        const SizedBox(height: 14),
                        Row(children: [
                          Expanded(child: ElevatedButton(onPressed: () => context.go('/customer/shop/$shopId'), child: const Text('View Shop'))),
                          const SizedBox(width: 8),
                          OutlinedButton(
                            onPressed: () async {
                              final confirmed = await showDialog<bool>(
                                context: context,
                                builder: (ctx) => AlertDialog(
                                  title: const Text('Leave Queue'),
                                  content: const Text('Are you sure you want to leave the queue?'),
                                  actions: [
                                    TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
                                    TextButton(
                                      onPressed: () => Navigator.pop(ctx, true),
                                      style: TextButton.styleFrom(foregroundColor: AppTheme.red),
                                      child: const Text('Leave'),
                                    ),
                                  ],
                                ),
                              );
                              if (confirmed == true) {
                                await context.read<QueueProvider>().leaveQueue(shopId, auth.userId ?? '');
                              }
                            },
                            style: OutlinedButton.styleFrom(foregroundColor: AppTheme.red, side: const BorderSide(color: AppTheme.red)),
                            child: const Text('Leave'),
                          ),
                        ]),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }

  String _emoji(String cat) {
    const emojis = {
      'Fruits & Veg': '🥕', 'Meat': '🥩', 'Fish': '🐟',
      'Bakery': '🥖', 'Dairy': '🧀', 'Spices': '🌶️', 'Flowers': '🌸',
    };
    return emojis[cat] ?? '🛒';
  }
}
