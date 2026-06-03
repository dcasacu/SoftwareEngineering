import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:lineup/app.dart';

void main() {
  group('LineUp initial screen widget tests', () {
    testWidgets('App starts without crashing', (WidgetTester tester) async {
      await tester.pumpWidget(const LineUpApp());
      await tester.pumpAndSettle();

      expect(find.byType(MaterialApp), findsOneWidget);
    });

    testWidgets('Initial screen shows welcome content', (WidgetTester tester) async {
      await tester.pumpWidget(const LineUpApp());
      await tester.pumpAndSettle();

      expect(find.text('Line Up'), findsOneWidget);
      expect(find.text('Smart market queues'), findsOneWidget);
      expect(find.text('Welcome'), findsOneWidget);
      expect(
        find.text('Log in to manage your queues or continue as a guest.'),
        findsOneWidget,
      );
    });

    testWidgets('Initial screen shows login, signup and guest access options', (WidgetTester tester) async {
      await tester.pumpWidget(const LineUpApp());
      await tester.pumpAndSettle();

      expect(find.text('Log In'), findsOneWidget);
      expect(find.text('Sign Up'), findsOneWidget);
      expect(find.text('Continue without logging in'), findsOneWidget);
    });
  });
}
