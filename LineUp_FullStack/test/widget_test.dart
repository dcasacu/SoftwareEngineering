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

      expect(find.text('LineUp'), findsOneWidget);
      expect(
        find.text('Skip the wait, join the queue digitally.'),
        findsOneWidget,
      );
    });

    testWidgets('Initial screen shows login and guest access options', (WidgetTester tester) async {
      await tester.pumpWidget(const LineUpApp());
      await tester.pumpAndSettle();

      expect(find.text('Owner Login'), findsOneWidget);
      expect(find.text('Continue as Guest'), findsOneWidget);
    });
  });
}
