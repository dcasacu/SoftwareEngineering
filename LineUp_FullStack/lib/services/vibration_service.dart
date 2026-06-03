import 'package:flutter/services.dart';

class VibrationService {
  const VibrationService();

  Future<void> notifyTurn() async {
    await HapticFeedback.vibrate();
  }
}