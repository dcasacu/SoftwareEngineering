import 'package:flutter/material.dart';

class AppTheme {
  static const blue = Color(0xFF2E5BBA);
  static const blueDark = Color(0xFF1A3A8A);
  static const blueLight = Color(0xFFEEF3FF);
  static const orange = Color(0xFFF47A20);
  static const orangeLight = Color(0xFFFFF3E8);
  static const white = Color(0xFFFFFFFF);
  static const gray50 = Color(0xFFF8F9FA);
  static const gray100 = Color(0xFFF0F2F5);
  static const gray200 = Color(0xFFE0E4EA);
  static const gray400 = Color(0xFF9BA3B0);
  static const gray600 = Color(0xFF5A6472);
  static const gray900 = Color(0xFF1A1D23);
  static const green = Color(0xFF22C55E);
  static const greenLight = Color(0xFFDCFCE7);
  static const red = Color(0xFFEF4444);
  static const redLight = Color(0xFFFEE2E2);

  static ThemeData get light => ThemeData(
        useMaterial3: true,
        colorSchemeSeed: blue,
        brightness: Brightness.light,
        scaffoldBackgroundColor: gray50,
        appBarTheme: const AppBarTheme(
          backgroundColor: blue,
          foregroundColor: white,
          elevation: 0,
        ),
        cardTheme: CardTheme(
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          color: white,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: blue,
            foregroundColor: white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 13),
            textStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
          ),
        ),
        textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
            foregroundColor: blue,
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: gray200, width: 2),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: gray200, width: 2),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: blue, width: 2),
          ),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        ),
      );
}