class QueueEntry {
  final String id;
  final String shopId;
  final String userId;
  final String? userName;
  final int position;
  final String status;
  final String? joinedAt;
  final String? calledAt;

  QueueEntry({
    required this.id,
    required this.shopId,
    required this.userId,
    this.userName,
    required this.position,
    required this.status,
    this.joinedAt,
    this.calledAt,
  });

  factory QueueEntry.fromJson(Map<String, dynamic> json) {
    return QueueEntry(
      id: json['id'] as String,
      shopId: json['shopId'] as String? ?? json['shop_id'] as String? ?? '',
      userId: json['userId'] as String? ?? json['user_id'] as String? ?? '',
      userName: json['userName'] as String? ?? json['user_name'] as String?,
      position: json['position'] as int,
      status: json['status'] as String,
      joinedAt: json['joinedAt'] as String? ?? json['joined_at'] as String?,
      calledAt: json['calledAt'] as String? ?? json['called_at'] as String?,
    );
  }

  bool get isWaiting => status == 'waiting';
  bool get isCalled => status == 'called';
}