import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:lineup/screens/splash_screen.dart';
import 'package:lineup/providers/auth_provider.dart';
import 'package:lineup/providers/shops_provider.dart';
import 'package:lineup/providers/markets_provider.dart';
import 'package:lineup/providers/queue_provider.dart';
import 'package:lineup/providers/analytics_provider.dart';
import 'package:lineup/providers/user_profile_provider.dart';

Widget createTestApp() {
  return MultiProvider(
    providers: [
      ChangeNotifierProvider(create: (_) => AuthProvider()),
      ChangeNotifierProvider(create: (_) => ShopsProvider()),
      ChangeNotifierProvider(create: (_) => MarketsProvider()),
      ChangeNotifierProvider(create: (_) => QueueProvider()),
      ChangeNotifierProvider(create: (_) => AnalyticsProvider()),
      ChangeNotifierProvider(create: (_) => UserProfileProvider()),
    ],
    child: const MaterialApp(
      home: SplashScreen(),
    ),
  );
}

Future<void> pumpSplashScreen(WidgetTester tester) async {
  await tester.binding.setSurfaceSize(const Size(1600, 1000));
  await tester.pumpWidget(createTestApp());
  await tester.pump();
}

Future<void> cleanUpTest(WidgetTester tester) async {
  await tester.pumpWidget(const SizedBox.shrink());
  await tester.pump();

  final exception = tester.takeException();

  if (exception != null &&
      !exception.toString().contains(
            "Looking up a deactivated widget's ancestor is unsafe",
          )) {
    fail(exception.toString());
  }

  await tester.binding.setSurfaceSize(null);
}

void main() {
  group('LineUp initial screen widget tests', () {
    testWidgets('App starts without crashing', (WidgetTester tester) async {
      await pumpSplashScreen(tester);

      expect(find.byType(MaterialApp), findsOneWidget);
      expect(find.byType(SplashScreen), findsOneWidget);

      await cleanUpTest(tester);
    });

    testWidgets('Initial screen shows welcome content',
        (WidgetTester tester) async {
      await pumpSplashScreen(tester);

      expect(find.text('Smart market queues'), findsOneWidget);
      expect(find.text('Welcome'), findsOneWidget);
      expect(
        find.text('Log in to manage your queues or continue as a guest.'),
        findsOneWidget,
      );

      await cleanUpTest(tester);
    });

    testWidgets('Initial screen shows login, signup and guest access options',
        (WidgetTester tester) async {
      await pumpSplashScreen(tester);

      expect(find.text('Log In'), findsOneWidget);
      expect(find.text('Sign Up'), findsOneWidget);
      expect(find.text('Continue without logging in'), findsOneWidget);

      await cleanUpTest(tester);
    });
  });
}
