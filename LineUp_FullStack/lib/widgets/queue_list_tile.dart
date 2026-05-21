import 'package:flutter/material.dart';
import '../config/theme.dart';
import '../models/queue_entry.dart';

class QueueListTile extends StatelessWidget {
  final QueueEntry entry;
  final bool isMe;
  final bool isFirst;
  final int avgMinutes;
  final bool isLast;
  final VoidCallback? onSkip;

  const QueueListTile({
    super.key,
    required this.entry,
    required this.isMe,
    required this.isFirst,
    required this.avgMinutes,
    required this.isLast,
    this.onSkip,
  });

  @override
  Widget build(BuildContext context) {
    final waitMinutes = avgMinutes > 0 ? (entry.position - 1) * avgMinutes : 0;

    return Container(
      decoration: BoxDecoration(
        color: isMe ? AppTheme.orangeLight : Colors.transparent,
        borderRadius: isMe ? BorderRadius.circular(8) : null,
      ),
      padding: isMe ? const EdgeInsets.symmetric(horizontal: 8) : EdgeInsets.zero,
      margin: const EdgeInsets.only(bottom: 4),
      child: Row(
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: isFirst ? AppTheme.blue : AppTheme.gray100,
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                '${entry.position}',
                style: TextStyle(
                  color: isFirst ? Colors.white : AppTheme.gray600,
                  fontWeight: FontWeight.w900,
                  fontSize: 13,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  isMe ? 'You 👋' : (entry.userName ?? "Anonymous User"),
                  style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                ),
                Text(
                  '~${waitMinutes}m wait',
                  style: const TextStyle(fontSize: 12, color: AppTheme.gray400),
                ),
              ],
            ),
          ),
          if (isFirst && entry.status == 'called')
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
              decoration: BoxDecoration(
                color: AppTheme.orangeLight,
                borderRadius: BorderRadius.circular(20),
              ),
              child: const Text('Next up', style: TextStyle(color: AppTheme.orange, fontWeight: FontWeight.w700, fontSize: 12)),
            ),
          if (onSkip != null && !isFirst)
            Padding(
              padding: const EdgeInsets.only(left: 4),
              child: TextButton(
                onPressed: onSkip,
                style: TextButton.styleFrom(
                  foregroundColor: AppTheme.red,
                  padding: const EdgeInsets.symmetric(horizontal: 8),
                  minimumSize: const Size(40, 32),
                ),
                child: const Text('✕', style: TextStyle(fontWeight: FontWeight.w700)),
              ),
            ),
        ],
      ),
    );
  }
}