import 'package:go_router/go_router.dart';
import '../screens/splash_screen.dart';
import '../screens/customer/map_screen.dart';
import '../screens/customer/my_queues_screen.dart';
import '../screens/customer/shop_detail_screen.dart';
import '../screens/owner/dashboard_screen.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const SplashScreen(),
    ),
    GoRoute(
      path: '/customer/map',
      builder: (context, state) => const MapScreen(),
    ),
    GoRoute(
      path: '/customer/queues',
      builder: (context, state) => const MyQueuesScreen(),
    ),
    GoRoute(
      path: '/customer/shop/:id',
      builder: (context, state) {
        final shopId = state.pathParameters['id']!;
        return ShopDetailScreen(shopId: shopId);
      },
    ),
    GoRoute(
      path: '/owner/dashboard',
      builder: (context, state) {
        final shopId = state.uri.queryParameters['shopId'] ?? 'shop1';
        return DashboardScreen(shopId: shopId);
      },
    ),
  ],
);