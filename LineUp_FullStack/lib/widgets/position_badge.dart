import 'package:flutter/material.dart';
import '../config/theme.dart';

class PositionBadge extends StatelessWidget {
  final int position;
  final int total;
  final int avgMinutes;

  const PositionBadge({
    super.key,
    required this.position,
    required this.total,
    required this.avgMinutes,
  });

  @override
  Widget build(BuildContext context) {
    final waitMinutes = avgMinutes > 0 ? (position - 1) * avgMinutes : 0;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.blueLight,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.blue.withOpacity(0.13),
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