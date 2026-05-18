import 'dart:async';
import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:vibration/vibration.dart';

class NotificationService {
  static final AudioPlayer _player = AudioPlayer();

  static Future<void> feedbackJoin() async {
    if (kIsWeb) {
      await _player.play(AssetSource('join.wav'));
    } else {
      try {
        final hasVibrator = await Vibration.hasVibrator();
        if (hasVibrator == true) {
          await Vibration.vibrate(duration: 200);
        } else {
          await _player.play(AssetSource('join.wav'));
        }
      } catch (_) {
        await _player.play(AssetSource('join.wav'));
      }
    }
  }

  static Future<void> feedbackLeave() async {
    if (kIsWeb) {
      await _player.play(AssetSource('join.wav'));
    } else {
      try {
        final hasVibrator = await Vibration.hasVibrator();
        if (hasVibrator == true) {
          await Vibration.vibrate(duration: 200);
        } else {
          await _player.play(AssetSource('join.wav'));
        }
      } catch (_) {
        await _player.play(AssetSource('join.wav'));
      }
    }
  }

  static Future<void> feedbackYourTurn() async {
    if (kIsWeb) {
      await _player.play(AssetSource('notification.wav'));
    } else {
      try {
        final hasVibrator = await Vibration.hasVibrator();
        if (hasVibrator == true) {
          await Vibration.vibrate(pattern: [0, 200, 100, 200, 100, 200]);
        } else {
          await _player.play(AssetSource('notification.wav'));
        }
      } catch (_) {
        await _player.play(AssetSource('notification.wav'));
      }
    }
  }

  static void dispose() {
    _player.dispose();
  }
}