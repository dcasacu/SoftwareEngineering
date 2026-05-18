import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/shops_provider.dart';
import '../../providers/queue_provider.dart';
import '../../providers/auth_provider.dart';
import '../../models/shop.dart';
import '../../widgets/shop_card.dart';
import '../../widgets/category_filter.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<ShopsProvider>().fetchShops();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
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
        actions: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppTheme.orange.withOpacity(0.2,
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Text(
              'Customer',
              style: TextStyle(color: AppTheme.orange, fontWeight: FontWeight.w700, fontSize: 12),
            ),
          ),
          const SizedBox(width: 8),
          IconButton(
            icon: const Icon(Icons.swap_horiz, color: Colors.white),
            onPressed: () => context.go('/'),
          ),
        ],
      ),
      body: _currentIndex == 0 ? const _MapContent() : const _QueuesContent(),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (i) => setState(() => _currentIndex = i),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.map), label: 'Map'),
          BottomNavigationBarItem(icon: Icon(Icons.confirmation_num), label: 'My Queues'),
        ],
      ),
    );
  }
}

class _MapContent extends StatelessWidget {
  const _MapContent();

  @override
  Widget build(BuildContext context) {
    final shopsProvider = context.watch<ShopsProvider>();
    final shops = shopsProvider.filteredShops;

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
          child: TextField(
            decoration: InputDecoration(
              hintText: '🔍  Search shops...',
              prefixIcon: null,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            onChanged: (v) => context.read<ShopsProvider>().setSearchQuery(v),
          ),
        ),
        CategoryFilter(
          categories: ShopsProvider.categories,
          selected: shopsProvider.categoryFilter,
          onSelected: (c) => context.read<ShopsProvider>().setCategoryFilter(c),
        ),
        Expanded(
          child: shopsProvider.isLoading
              ? const Center(child: CircularProgressIndicator())
              : RefreshIndicator(
                  onRefresh: () => context.read<ShopsProvider>().fetchShops(),
                  child: ListView(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: Text(
                          '${shops.length} shop${shops.length != 1 ? 's' : ''} found',
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppTheme.gray400),
                        ),
                      ),
                      ...shops.map((shop) => ShopCard(
                        shop: shop,
                        onTap: () => context.go('/customer/shop/${shop.id}'),
                      )),
                    ],
                  ),
                ),
        ),
      ],
    );
  }
}

class _QueuesContent extends StatelessWidget {
  const _QueuesContent();

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final queueProvider = context.watch<QueueProvider>();
    final shopsProvider = context.read<ShopsProvider>();

    final activeEntries = <MapEntry<String, QueueEntry?>>{};
    queueProvider.myEntries.forEach((shopId, entry) {
      if (entry != null) activeEntries[shopId] = entry;
    });

    if (activeEntries.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('🛒', style: TextStyle(fontSize: 48)),
              const SizedBox(height: 16),
              const Text(
                'No active queues',
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16, color: AppTheme.gray600),
              ),
              const SizedBox(height: 8),
              const Text(
                'Go to the Map tab to browse shops and join a queue.',
                style: TextStyle(fontSize: 14, color: AppTheme.gray400),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      );
    }

    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        const Text('My Queues', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppTheme.gray900)),
        const SizedBox(height: 12),
        ...activeEntries.entries.map((e) {
          final shop = shopsProvider.shops.firstWhere((s) => s.id == e.key, orElse: () => Shop(id: '', name: 'Unknown', category: '', isOpen: false, avgServiceTime: 300, ownerId: ''));
          final entry = e.value!;
          final queue = queueProvider.queueForShop(e.key);
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          '${_getCategoryEmoji(shop.category)} ${shop.name}',
                          style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: AppTheme.gray900),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                        decoration: BoxDecoration(color: AppTheme.greenLight, borderRadius: BorderRadius.circular(20)),
                        child: const Text('Active', style: TextStyle(color: AppTheme.green, fontWeight: FontWeight.w700, fontSize: 12)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  _PositionBadge(position: entry.position, total: queue.length, avgMinutes: shop.avgServiceMinutes),
                  const SizedBox(height: 14),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () => context.go('/customer/shop/${shop.id}'),
                          child: const Text('View Shop'),
                        ),
                      ),
                      const SizedBox(width: 8),
                      OutlinedButton(
                        onPressed: () async {
                          await context.read<QueueProvider>().leaveQueue(shop.id, auth.userId ?? '');
                        },
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppTheme.red,
                          side: const BorderSide(color: AppTheme.red),
                        ),
                        child: const Text('Leave'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        }),
      ],
    );
  }

  String _getCategoryEmoji(String cat) {
    const emojis = {
      'Fruits & Veg': '🥕', 'Meat': '🥩', 'Fish': '🐟',
      'Bakery': '🥖', 'Dairy': '🧀', 'Spices': '🌶️', 'Flowers': '🌸',
    };
    return emojis[cat] ?? '🛒';
  }
}

class _PositionBadge extends StatelessWidget {
  final int position;
  final int total;
  final int avgMinutes;

  const _PositionBadge({required this.position, required this.total, required this.avgMinutes});

  @override
  Widget build(BuildContext context) {
    final waitMinutes = avgMinutes > 0 ? (position - 1) * avgMinutes : 0;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.blueLight,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.blue.withOpacity(0.13),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Your position', style: TextStyle(fontSize: 13, color: AppTheme.gray600, fontWeight: FontWeight.w600)),
              Text('#$position', style: const TextStyle(fontSize: 38, fontWeight: FontWeight.w900, color: AppTheme.blue, height: 1)),
              Text('of $total in queue', style: const TextStyle(fontSize: 12, color: AppTheme.gray400)),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              const Text('Est. wait', style: TextStyle(fontSize: 13, color: AppTheme.gray600, fontWeight: FontWeight.w600)),
              Text('${waitMinutes}m', style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w900, color: AppTheme.orange, height: 1)),
              const Text('minutes', style: TextStyle(fontSize: 12, color: AppTheme.gray400)),
            ],
          ),
        ],
      ),
    );
  }
}