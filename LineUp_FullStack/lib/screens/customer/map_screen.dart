import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:go_router/go_router.dart';
import 'package:latlong2/latlong.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:geolocator/geolocator.dart';
import '../../config/theme.dart';
import '../../providers/shops_provider.dart';
import '../../providers/markets_provider.dart';
import '../../providers/queue_provider.dart';
import '../../providers/auth_provider.dart';
import '../../models/shop.dart';
import '../../models/market.dart';
import '../../models/queue_entry.dart';
import '../../services/notification_service.dart';
import '../../widgets/category_filter.dart';
import '../../widgets/queue_notification_overlay.dart';
import '../../widgets/login_dialog.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  int _currentIndex = 0;
  StreamSubscription<CalledNotification>? _calledSub;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      final shopsProv = context.read<ShopsProvider>();
      final marketsProv = context.read<MarketsProvider>();
      final queueProv = context.read<QueueProvider>();
      final auth = context.read<AuthProvider>();

      _calledSub = queueProv.calledStream.listen((notification) {
        final shopsProv = context.read<ShopsProvider>();
        final shop = shopsProv.shops.firstWhere(
          (s) => s.id == notification.shopId,
          orElse: () => Shop(id: '', name: 'Unknown Shop', category: '', isOpen: false, avgServiceTime: 300, ownerId: ''),
        );
        NotificationService.feedbackYourTurn();
        QueueNotificationOverlay.show(context, shop.name);
      });

      await shopsProv.fetchShops();
      await marketsProv.fetchMarkets();

      if (!mounted) return;

      if (auth.userId != null) {
        queueProv.startPolling(auth.userId!);
        await queueProv.refreshUserQueues(
          auth.userId!,
          shopsProv.shops.map((shop) => shop.id),
        );
      }
    });
  }

  Future<void> _loadInitialData() async {
    final shopsProvider = context.read<ShopsProvider>();
    final queueProv = context.read<QueueProvider>();

    _calledSub = queueProv.calledStream.listen((notification) {
      final shopsProv = context.read<ShopsProvider>();
      final shop = shopsProv.shops.firstWhere(
        (s) => s.id == notification.shopId,
        orElse: () => Shop(id: '', name: 'Unknown Shop', category: '', isOpen: false, avgServiceTime: 300, ownerId: ''),
      );
      NotificationService.feedbackYourTurn();
      QueueNotificationOverlay.show(context, shop.name);
    });

    await shopsProvider.fetchShops();
    if (!mounted) return;

    final auth = context.read<AuthProvider>();
    if (auth.userId != null) {
      await queueProv.refreshUserQueues(
        auth.userId!,
        shopsProvider.shops.map((shop) => shop.id),
      );
    }
  }

  @override
  void dispose() {
    _calledSub?.cancel();
    super.dispose();
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
          Consumer<AuthProvider>(
            builder: (context, auth, _) {
              if (auth.isLoggedIn && auth.currentUser?.role != 'anon') {
                // logged in — show account + log out
                return Row(children: [
                  IconButton(
                    icon: const Icon(Icons.account_circle, color: Colors.white),
                    tooltip: 'My account',
                    onPressed: () {
                      context.go('/customer/profile');
                    },
                  ),
                  Text(
                    auth.currentUser?.name ?? 'Customer',
                    style: const TextStyle(color: Colors.white70, fontSize: 13),
                  ),
                  const SizedBox(width: 4),
                  IconButton(
                    icon: const Icon(Icons.logout, color: Colors.white),
                    tooltip: 'Log out',
                    onPressed: () async {
                      await context.read<AuthProvider>().logout();
                      if (context.mounted) context.go('/');
                    },
                  ),
                ]);
              } else {
                // anon — show log in button
                return Row(children: [
                  TextButton(
                    onPressed: () async {
                      await showDialog(
                        context: context,
                        builder: (_) => LoginDialog(),
                      );
                      final a = context.read<AuthProvider>();
                      if (a.isLoggedIn && a.currentUser?.role != 'anon' && context.mounted) {
                        if (a.isOwner) {
                          context.go('/owner/dashboard');
                        }
                        // if customer just stays on map
                      }
                    },
                    child: const Text('Log In', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
                  ),
                ]);
              }
            },
          ),
        ],
      ),
      body: _currentIndex == 0 ? const _MapView() : const _QueuesContent(),
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

class _MapView extends StatefulWidget {
  const _MapView();

  @override
  State<_MapView> createState() => _MapViewState();
}

class _MapViewState extends State<_MapView> {
  static const _barcelonaCenter = LatLng(41.3825, 2.1769);
  static const _defaultZoom = 15.0;
  static const _minZoom = 12.0;
  static const _maxZoom = 19.0;

  Shop? _selectedShop;
  Market? _selectedMarket;
  LatLng? _userLocation;
  bool _locationLoading = false;
  final MapController _mapController = MapController();
  int _tabIndex = 0;

  @override
  void dispose() {
    _mapController.dispose();
    super.dispose();
  }

  void _selectShop(Shop shop) {
    setState(() => _selectedShop = shop);
    if (shop.lat != null && shop.lng != null) {
      _mapController.move(LatLng(shop.lat!, shop.lng!), _defaultZoom);
    }
  }

  void _clearSelection() {
    setState(() {
      _selectedShop = null;
      _selectedMarket = null;
    });
  }

  void _selectMarket(Market market) {
    setState(() => _selectedMarket = market);
    _mapController.move(LatLng(market.lat, market.lng), _defaultZoom);
  }

  void _zoomIn() {
    final newZoom = (_mapController.camera.zoom + 1).clamp(_minZoom, _maxZoom);
    _mapController.move(_mapController.camera.center, newZoom);
  }

  void _zoomOut() {
    final newZoom = (_mapController.camera.zoom - 1).clamp(_minZoom, _maxZoom);
    _mapController.move(_mapController.camera.center, newZoom);
  }

  Future<void> _getUserLocation() async {
    setState(() => _locationLoading = true);

    try {
      final serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Location services are disabled. Please enable them.'),
              backgroundColor: AppTheme.red,
            ),
          );
        }
        setState(() => _locationLoading = false);
        return;
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Location permission denied.'),
                backgroundColor: AppTheme.red,
              ),
            );
          }
          setState(() => _locationLoading = false);
          return;
        }
      }

      if (permission == LocationPermission.deniedForever) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Location permission permanently denied. Please enable in settings.'),
              backgroundColor: AppTheme.red,
            ),
          );
        }
        setState(() => _locationLoading = false);
        return;
      }

      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(accuracy: LocationAccuracy.high),
      );

      setState(() {
        _userLocation = LatLng(position.latitude, position.longitude);
        _locationLoading = false;
      });

      _mapController.move(_userLocation!, _defaultZoom);
    } catch (e) {
      setState(() => _locationLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Could not get location: $e'),
            backgroundColor: AppTheme.red,
          ),
        );
      }
    }
  }

  Future<void> _openDirections(Shop shop) async {
    if (shop.lat == null || shop.lng == null) return;
    final url = Uri.parse(
      'https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}',
    );
    try {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Could not open maps: $e'), backgroundColor: AppTheme.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final shopsProvider = context.watch<ShopsProvider>();
    final marketsProvider = context.watch<MarketsProvider>();
    final shops = shopsProvider.filteredShops;
    final markets = marketsProvider.markets;
    final screenHeight = MediaQuery.of(context).size.height;
    final mapHeight = screenHeight * 0.42;

    final allMarkers = <Marker>[];

    if (_userLocation != null) {
      allMarkers.add(
        Marker(
          point: _userLocation!,
          width: 24,
          height: 24,
          child: Container(
            decoration: BoxDecoration(
              color: AppTheme.blue,
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 3),
              boxShadow: [
                BoxShadow(color: AppTheme.blue.withValues(alpha: 0.3), blurRadius: 8, offset: const Offset(0, 2)),
              ],
            ),
            child: const Center(
              child: Icon(Icons.person, color: Colors.white, size: 12),
            ),
          ),
        ),
      );
    }

    // Add shop markers
    allMarkers.addAll(
      shops.where((s) => s.lat != null && s.lng != null).map((shop) {
        final isSelected = _selectedShop?.id == shop.id;
        return Marker(
          point: LatLng(shop.lat!, shop.lng!),
          width: isSelected ? 50 : 40,
          height: isSelected ? 50 : 40,
          child: GestureDetector(
            onTap: () => _selectShop(shop),
            child: _ShopMarker(shop: shop, isSelected: isSelected),
          ),
        );
      }),
    );

    // Add market markers
    allMarkers.addAll(
      markets.map((market) {
        final isSelected = _selectedMarket?.id == market.id;
        return Marker(
          point: LatLng(market.lat, market.lng),
          width: isSelected ? 50 : 40,
          height: isSelected ? 50 : 40,
          child: GestureDetector(
            onTap: () => _selectMarket(market),
            child: _MarketMarker(market: market, isSelected: isSelected),
          ),
        );
      }),
    );

    return Column(
      children: [
        SizedBox(
          height: mapHeight,
          child: Stack(
            children: [
              FlutterMap(
                mapController: _mapController,
                options: MapOptions(
                  initialCenter: _barcelonaCenter,
                  initialZoom: _defaultZoom,
                  minZoom: _minZoom,
                  maxZoom: _maxZoom,
                  onTap: (_, __) => _clearSelection(),
                ),
                children: [
                  TileLayer(
                    urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                    userAgentPackageName: 'com.example.lineup',
                  ),
                  MarkerLayer(markers: allMarkers),
                ],
              ),
              Positioned(
                right: 12,
                bottom: 12,
                child: Column(
                  children: [
                    _ZoomButton(icon: Icons.add, onTap: _zoomIn, tooltip: 'Zoom in'),
                    const SizedBox(height: 6),
                    _ZoomButton(icon: Icons.remove, onTap: _zoomOut, tooltip: 'Zoom out'),
                    const SizedBox(height: 6),
                    _ZoomButton(
                      icon: _locationLoading
                          ? Icons.hourglass_empty
                          : Icons.my_location,
                      onTap: _locationLoading ? () {} : _getUserLocation,
                      tooltip: 'My location',
                      isLoading: _locationLoading,
                    ),
                  ],
                ),
              ),
              if (shopsProvider.isLoading)
                Positioned(
                  top: 12,
                  left: 0,
                  right: 0,
                  child: Center(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.6),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          SizedBox(
                            width: 16,
                            height: 16,
                            child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                          ),
                          SizedBox(width: 8),
                          Text('Loading shops...', style: TextStyle(color: Colors.white, fontSize: 13)),
                        ],
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
        const Divider(height: 1, thickness: 1),
        Expanded(
          child: Column(
            children: [
              // Tabs
              Container(
                decoration: BoxDecoration(
                  border: Border(bottom: BorderSide(color: AppTheme.gray200, width: 1)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _tabIndex = 0),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            border: _tabIndex == 0
                                ? Border(bottom: BorderSide(color: AppTheme.orange, width: 3))
                                : null,
                          ),
                          child: Center(
                            child: Text(
                              'Shops',
                              style: TextStyle(
                                fontWeight: FontWeight.w700,
                                color: _tabIndex == 0 ? AppTheme.orange : AppTheme.gray400,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _tabIndex = 1),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            border: _tabIndex == 1
                                ? Border(bottom: BorderSide(color: AppTheme.orange, width: 3))
                                : null,
                          ),
                          child: Center(
                            child: Text(
                              'Markets',
                              style: TextStyle(
                                fontWeight: FontWeight.w700,
                                color: _tabIndex == 1 ? AppTheme.orange : AppTheme.gray400,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              // Tab content
              Expanded(
                child: _tabIndex == 0
                    ? _ShopListSection(
                        shops: shops,
                        selectedShop: _selectedShop,
                        shopsProvider: shopsProvider,
                        onSelectFromList: _selectShop,
                        onClear: _clearSelection,
                        onViewDetails: (shopId) => context.go('/customer/shop/$shopId'),
                        onJoinQueue: () async {
                          final auth = context.read<AuthProvider>();
                          final queueProv = context.read<QueueProvider>();
                          if (_selectedShop != null) {
                            await queueProv.joinQueue(_selectedShop!.id, auth.userId ?? '');
                            if (queueProv.error != null && context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text(queueProv.error!), backgroundColor: AppTheme.red),
                              );
                            } else if (context.mounted) {
                              final entry = queueProv.myEntryForShop(_selectedShop!.id);
                              final pos = entry?.position ?? 1;
                              NotificationService.feedbackJoin();
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('🛒 Joined queue at ${_selectedShop!.name}! You\'re #$pos'),
                                  backgroundColor: AppTheme.green,
                                  duration: const Duration(seconds: 4),
                                ),
                              );
                            }
                          }
                        },
                        onGetDirections: _openDirections,
                      )
                    : _MarketListSection(
                        markets: markets,
                        selectedMarket: _selectedMarket,
                        marketsProvider: marketsProvider,
                        onSelectFromList: _selectMarket,
                        onClear: _clearSelection,
                        onViewDetails: (marketId) => context.go('/customer/market/$marketId'),
                      ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _ZoomButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  final String tooltip;
  final bool isLoading;

  const _ZoomButton({
    required this.icon,
    required this.onTap,
    required this.tooltip,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      elevation: 3,
      borderRadius: BorderRadius.circular(8),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Tooltip(
          message: tooltip,
          child: Container(
            width: 40,
            height: 40,
            alignment: Alignment.center,
            child: isLoading
                ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2))
                : Icon(icon, size: 20, color: AppTheme.gray600),
          ),
        ),
      ),
    );
  }
}

class _ShopMarker extends StatelessWidget {
  final Shop shop;
  final bool isSelected;

  const _ShopMarker({required this.shop, required this.isSelected});

  @override
  Widget build(BuildContext context) {
    final color = shop.isOpen ? AppTheme.green : AppTheme.red;
    return AnimatedContainer(
      duration: const Duration(milliseconds: 150),
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
        border: Border.all(
          color: isSelected ? AppTheme.orange : Colors.white,
          width: isSelected ? 3 : 2,
        ),
        boxShadow: [
          BoxShadow(
            color: (isSelected ? AppTheme.orange : Colors.black).withValues(alpha: 0.3),
            blurRadius: isSelected ? 8 : 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Center(
        child: Text(
          _getCategoryEmoji(shop.category),
          style: TextStyle(fontSize: isSelected ? 22 : 18),
        ),
      ),
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

class _ShopListSection extends StatelessWidget {
  final List<Shop> shops;
  final Shop? selectedShop;
  final ShopsProvider shopsProvider;
  final void Function(Shop) onSelectFromList;
  final VoidCallback onClear;
  final void Function(String) onViewDetails;
  final VoidCallback onJoinQueue;
  final void Function(Shop) onGetDirections;

  const _ShopListSection({
    required this.shops,
    required this.selectedShop,
    required this.shopsProvider,
    required this.onSelectFromList,
    required this.onClear,
    required this.onViewDetails,
    required this.onJoinQueue,
    required this.onGetDirections,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        if (selectedShop != null) _buildSelectedShopBanner(selectedShop!),
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
          child: TextField(
            decoration: InputDecoration(
              hintText: '🔍  Search shops...',
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            ),
            onChanged: (v) => shopsProvider.setSearchQuery(v),
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 0),
          child: CategoryFilter(
            categories: ShopsProvider.categories,
            selected: shopsProvider.categoryFilter,
            onSelected: (c) => shopsProvider.setCategoryFilter(c),
          ),
        ),
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 6, 16, 0),
          child: Row(
            children: [
              Text(
                '${shops.length} shop${shops.length != 1 ? 's' : ''} found',
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.gray400),
              ),
            ],
          ),
        ),
        Expanded(
          child: shops.isEmpty
              ? const Center(child: Text('No shops match your search', style: TextStyle(color: AppTheme.gray400)))
              : ListView.builder(
                  padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                  itemCount: shops.length,
                  itemBuilder: (context, i) => _ShopListTile(
                    shop: shops[i],
                    isSelected: selectedShop?.id == shops[i].id,
                    onTap: () => onSelectFromList(shops[i]),
                    onViewDetails: () => onViewDetails(shops[i].id),
                  ),
                ),
        ),
      ],
    );
  }

  Widget _buildSelectedShopBanner(Shop shop) {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 8, 16, 0),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: shop.isOpen ? AppTheme.greenLight : AppTheme.redLight,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: shop.isOpen ? AppTheme.green.withValues(alpha: 0.3) : AppTheme.red.withValues(alpha: 0.3)),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Text(_getCategoryEmoji(shop.category), style: const TextStyle(fontSize: 28)),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(shop.name, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        Container(
                          width: 8, height: 8,
                          decoration: BoxDecoration(shape: BoxShape.circle, color: shop.isOpen ? AppTheme.green : AppTheme.red),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          shop.isOpen ? 'Open · ~${shop.avgServiceMinutes} min/customer' : 'Closed',
                          style: TextStyle(fontSize: 12, color: shop.isOpen ? AppTheme.green : AppTheme.red),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close, size: 20),
                onPressed: onClear,
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
                color: AppTheme.gray400,
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  onPressed: shop.isOpen ? onJoinQueue : null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.orange,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Join Queue', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                ),
              ),
              const SizedBox(width: 6),
              Expanded(
                child: OutlinedButton(
                  onPressed: shop.lat != null ? () => onGetDirections(shop) : null,
                  style: OutlinedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.directions, size: 16),
                      SizedBox(width: 4),
                      Text('Directions', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 6),
              Expanded(
                child: OutlinedButton(
                  onPressed: () => onViewDetails(shop.id),
                  style: OutlinedButton.styleFrom(shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
                  child: const Text('Details', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                ),
              ),
            ],
          ),
        ],
      ),
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

class _ShopListTile extends StatelessWidget {
  final Shop shop;
  final bool isSelected;
  final VoidCallback onTap;
  final VoidCallback onViewDetails;

  const _ShopListTile({
    required this.shop,
    required this.isSelected,
    required this.onTap,
    required this.onViewDetails,
  });

  @override
  Widget build(BuildContext context) {
    final color = shop.isOpen ? AppTheme.green : AppTheme.red;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.blueLight : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isSelected ? AppTheme.blue : AppTheme.gray200),
        ),
        child: Row(
          children: [
            Container(
              width: 44, height: 44,
              decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
              child: Center(child: Text(_getCategoryEmoji(shop.category), style: const TextStyle(fontSize: 22))),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(shop.name, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                  const SizedBox(height: 2),
                  Text(shop.category, style: const TextStyle(fontSize: 12, color: AppTheme.gray400)),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                shop.isOpen ? '● Open' : '● Closed',
                style: TextStyle(color: color, fontWeight: FontWeight.w700, fontSize: 11),
              ),
            ),
            const SizedBox(width: 4),
            IconButton(
              icon: const Icon(Icons.arrow_forward_ios, size: 14),
              onPressed: onViewDetails,
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints(),
              color: AppTheme.gray400,
            ),
          ],
        ),
      ),
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

class _MarketMarker extends StatelessWidget {
  final Market market;
  final bool isSelected;

  const _MarketMarker({required this.market, required this.isSelected});

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 150),
      decoration: BoxDecoration(
        color: AppTheme.purple,
        shape: BoxShape.circle,
        border: Border.all(
          color: isSelected ? AppTheme.orange : Colors.white,
          width: isSelected ? 3 : 2,
        ),
        boxShadow: [
          BoxShadow(
            color: (isSelected ? AppTheme.orange : Colors.black).withValues(alpha: 0.3),
            blurRadius: isSelected ? 8 : 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: const Center(
        child: Text('🏪', style: TextStyle(fontSize: 20)),
      ),
    );
  }
}

class _MarketListSection extends StatelessWidget {
  final List<Market> markets;
  final Market? selectedMarket;
  final MarketsProvider marketsProvider;
  final void Function(Market) onSelectFromList;
  final VoidCallback onClear;
  final void Function(String) onViewDetails;

  const _MarketListSection({
    required this.markets,
    required this.selectedMarket,
    required this.marketsProvider,
    required this.onSelectFromList,
    required this.onClear,
    required this.onViewDetails,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        if (selectedMarket != null) _buildSelectedMarketBanner(selectedMarket!),
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
          child: Row(
            children: [
              Text(
                '${markets.length} market${markets.length != 1 ? 's' : ''} found',
                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppTheme.gray400),
              ),
            ],
          ),
        ),
        Expanded(
          child: markets.isEmpty
              ? const Center(child: Text('No markets available', style: TextStyle(color: AppTheme.gray400)))
              : ListView.builder(
                  padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                  itemCount: markets.length,
                  itemBuilder: (context, i) => _MarketListTile(
                    market: markets[i],
                    isSelected: selectedMarket?.id == markets[i].id,
                    onTap: () => onSelectFromList(markets[i]),
                    onViewDetails: () => onViewDetails(markets[i].id),
                  ),
                ),
        ),
      ],
    );
  }

  Widget _buildSelectedMarketBanner(Market market) {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 8, 16, 0),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppTheme.purpleLight,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.purple.withValues(alpha: 0.3)),
      ),
      child: Column(
        children: [
          Row(
            children: [
              const Text('🏪', style: TextStyle(fontSize: 28)),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(market.name, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
                    const SizedBox(height: 2),
                    Text(market.address, style: const TextStyle(fontSize: 12, color: AppTheme.gray400)),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close, size: 20),
                onPressed: onClear,
                padding: EdgeInsets.zero,
                constraints: const BoxConstraints(),
                color: AppTheme.gray400,
              ),
            ],
          ),
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () => onViewDetails(market.id),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.orange,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: const Text('View Market', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
            ),
          ),
        ],
      ),
    );
  }
}

class _MarketListTile extends StatelessWidget {
  final Market market;
  final bool isSelected;
  final VoidCallback onTap;
  final VoidCallback onViewDetails;

  const _MarketListTile({
    required this.market,
    required this.isSelected,
    required this.onTap,
    required this.onViewDetails,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.purpleLight : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isSelected ? AppTheme.purple : AppTheme.gray200),
        ),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: AppTheme.purple.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Center(child: Text('🏪', style: TextStyle(fontSize: 22))),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(market.name, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                  const SizedBox(height: 2),
                  Text(market.address, style: const TextStyle(fontSize: 12, color: AppTheme.gray400)),
                ],
              ),
            ),
            IconButton(
              icon: const Icon(Icons.arrow_forward_ios, size: 14),
              onPressed: onViewDetails,
              padding: EdgeInsets.zero,
              constraints: const BoxConstraints(),
              color: AppTheme.gray400,
            ),
          ],
        ),
      ),
    );
  }
}

class _QueuesContent extends StatefulWidget {
  const _QueuesContent();

  @override
  State<_QueuesContent> createState() => _QueuesContentState();
}

class _QueuesContentState extends State<_QueuesContent> {
  StreamSubscription<CalledNotification>? _calledSub;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final queueProv = context.read<QueueProvider>();
      _calledSub = queueProv.calledStream.listen((notification) {
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

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final queueProvider = context.watch<QueueProvider>();
    final shopsProvider = context.read<ShopsProvider>();

    final activeEntries = <MapEntry<String, QueueEntry?>>[];
    queueProvider.myEntries.forEach((shopId, entry) {
      if (entry != null) {
        activeEntries.add(MapEntry(shopId, entry));
      }
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
              const Text('No active queues', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16, color: AppTheme.gray600)),
              const SizedBox(height: 8),
              const Text('Go to the Map tab to browse shops and join a queue.', style: TextStyle(fontSize: 14, color: AppTheme.gray400), textAlign: TextAlign.center),
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
        ...activeEntries.map((e) {
          final shopId = e.key;
          final queueEntry = e.value!;
          final shop = shopsProvider.shops.firstWhere(
            (s) => s.id == shopId,
            orElse: () => Shop(id: '', name: 'Unknown', category: '', isOpen: false, avgServiceTime: 300, ownerId: ''),
          );
          final queue = queueProvider.queueForShop(shopId);
          final active = queue.where((q) => q.status == 'waiting' || q.status == 'called').toList();

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
                  _PositionBadge(position: queueEntry.position, total: active.length, avgMinutes: shop.avgServiceMinutes),
                  const SizedBox(height: 14),
                  Row(
                    children: [
                      Expanded(child: ElevatedButton(onPressed: () => context.go('/customer/shop/$shopId'), child: const Text('View Shop'))),
                      const SizedBox(width: 8),
                      OutlinedButton(
                        onPressed: () async {
                          final shopName = shop.name;
                          await context.read<QueueProvider>().leaveQueue(shopId, auth.userId ?? '');
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
                            }
                          }
                        },
                        style: OutlinedButton.styleFrom(foregroundColor: AppTheme.red, side: const BorderSide(color: AppTheme.red)),
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

  String _emoji(String cat) {
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
        border: Border.all(color: AppTheme.blue.withValues(alpha: 0.13)),
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
