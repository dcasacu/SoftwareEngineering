import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../providers/shops_provider.dart';
import '../../providers/auth_provider.dart';
import '../../models/market.dart';
import '../../models/shop.dart';

class MarketDetailScreen extends StatefulWidget {
  final String marketId;

  const MarketDetailScreen({
    super.key,
    required this.marketId,
  });

  @override
  State<MarketDetailScreen> createState() => _MarketDetailScreenState();
}

class _MarketDetailScreenState extends State<MarketDetailScreen> {
  // Mock markets data - replace with real data from provider
  final Map<String, Market> _mockMarkets = {
    'market_1': Market(
      id: 'market_1',
      name: 'La Boqueria',
      lat: 41.3817,
      lng: 2.1744,
      address: 'La Rambla, 91, Barcelona',
      operatingHours: '8:00 AM - 8:00 PM',
      description: 'Traditional Barcelona market with fresh produce',
      mapImageUrl: 'assets/markets/boqueria_map.png',
    ),
    'market_2': Market(
      id: 'market_2',
      name: 'Sant Antoni Market',
      lat: 41.3794,
      lng: 2.1692,
      address: 'Carrer del Parlament, 58, Barcelona',
      operatingHours: '7:00 AM - 2:00 PM',
      description: 'Historic market in the Sant Antoni neighborhood',
      mapImageUrl: 'assets/markets/sant_antoni_map.png',
    ),
    'market_3': Market(
      id: 'market_3',
      name: 'Mercat de Sant Josep',
      lat: 41.3870,
      lng: 2.1693,
      address: 'Plaça de la Independència, Barcelona',
      operatingHours: '8:00 AM - 9:00 PM',
      description: 'Modern market with variety of shops',
      mapImageUrl: 'assets/markets/sant_josep_map.png',
    ),
    'market_4': Market(
      id: 'market_4',
      name: 'Mercat de Provençals',
      lat: 41.3951,
      lng: 2.1933,
      address: 'Carrer de Provençals, Barcelona',
      operatingHours: '7:00 AM - 3:00 PM',
      description: 'Local neighborhood market',
      mapImageUrl: 'assets/markets/provencals_map.png',
    ),
  };

  late Market market;

  @override
  void initState() {
    super.initState();
    market = _mockMarkets[widget.marketId] ??
        Market(
          id: widget.marketId,
          name: 'Unknown Market',
          lat: 41.3825,
          lng: 2.1769,
          address: 'Barcelona',
          operatingHours: '',
          description: '',
          mapImageUrl: '',
        );
  }

  @override
  Widget build(BuildContext context) {
    final shopsProvider = context.watch<ShopsProvider>();
    
    // Filter shops that belong to this market
    final marketShops = shopsProvider.shops
        .where((shop) => shop.marketId == widget.marketId)
        .toList();

    return Scaffold(
      appBar: AppBar(
        title: Text(market.name),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Market Map Image
            Container(
              width: double.infinity,
              height: 250,
              color: AppTheme.gray100,
              child: market.mapImageUrl.isNotEmpty
                  ? Image.asset(
                      market.mapImageUrl,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.map, size: 48, color: AppTheme.gray400),
                              const SizedBox(height: 8),
                              const Text(
                                'Market map image not available',
                                style: TextStyle(color: AppTheme.gray400),
                              ),
                            ],
                          ),
                        );
                      },
                    )
                  : Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.map, size: 48, color: AppTheme.gray400),
                          const SizedBox(height: 8),
                          const Text(
                            'No map image available',
                            style: TextStyle(color: AppTheme.gray400),
                          ),
                        ],
                      ),
                    ),
            ),
            // Market Info
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    market.name,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.location_on, size: 16, color: AppTheme.gray400),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          market.address,
                          style: const TextStyle(
                            fontSize: 14,
                            color: AppTheme.gray600,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      const Icon(Icons.access_time, size: 16, color: AppTheme.gray400),
                      const SizedBox(width: 6),
                      Text(
                        market.operatingHours,
                        style: const TextStyle(
                          fontSize: 14,
                          color: AppTheme.gray600,
                        ),
                      ),
                    ],
                  ),
                  if (market.description.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    Text(
                      market.description,
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppTheme.gray600,
                        height: 1.5,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            // Shops in Market
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Shops in this market (${marketShops.length})',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 12),
                  if (marketShops.isEmpty)
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppTheme.gray100,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text(
                        'No shops available in this market yet',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: AppTheme.gray400),
                      ),
                    )
                  else
                    ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: marketShops.length,
                      itemBuilder: (context, index) {
                        final shop = marketShops[index];
                        final color = shop.isOpen ? AppTheme.green : AppTheme.red;
                        return _ShopInMarketTile(shop: shop, color: color);
                      },
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ShopInMarketTile extends StatelessWidget {
  final Shop shop;
  final Color color;

  const _ShopInMarketTile({
    required this.shop,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.gray200),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Center(
              child: Text(_getCategoryEmoji(shop.category), style: const TextStyle(fontSize: 22)),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  shop.name,
                  style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                ),
                const SizedBox(height: 2),
                Row(
                  children: [
                    Container(
                      width: 6,
                      height: 6,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: color,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      shop.isOpen ? 'Open' : 'Closed',
                      style: TextStyle(fontSize: 12, color: color),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '~${shop.avgServiceMinutes} min/customer',
                      style: const TextStyle(fontSize: 12, color: AppTheme.gray400),
                    ),
                  ],
                ),
              ],
            ),
          ),
          TextButton(
            onPressed: () => context.go('/customer/shop/${shop.id}'),
            child: const Text('View'),
          ),
        ],
      ),
    );
  }

  String _getCategoryEmoji(String cat) {
    const emojis = {
      'Fruits & Veg': '🥕',
      'Meat': '🥩',
      'Fish': '🐟',
      'Bakery': '🥖',
      'Dairy': '🧀',
      'Spices': '🌶️',
      'Flowers': '🌸',
    };
    return emojis[cat] ?? '🛒';
  }
}
