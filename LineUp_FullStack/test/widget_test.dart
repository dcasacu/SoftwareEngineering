import 'package:flutter_test/flutter_test.dart';
import 'package:lineup/app.dart';

void main() {
  testWidgets('App starts without error', (WidgetTester tester) async {
    await tester.pumpWidget(const LineUpApp());
    expect(find.text('Line'), findsWidgets);
  });
}