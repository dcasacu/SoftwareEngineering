class Shop {
  final String id;
  final String name;
  final String category;
  final double? locationX;
  final double? locationY;
  final double? lat;
  final double? lng;
  final bool isOpen;
  final int avgServiceTime;
  final String ownerId;
  final String? ownerName;

  Shop({
    required this.id,
    required this.name,
    required this.category,
    this.locationX,
    this.locationY,
    this.lat,
    this.lng,
    required this.isOpen,
    required this.avgServiceTime,
    required this.ownerId,
    this.ownerName,
  });

  factory Shop.fromJson(Map<String, dynamic> json) {
    return Shop(
      id: json['id'] as String,
      name: json['name'] as String,
      category: json['category'] as String,
      locationX: (json['locationX'] as num?)?.toDouble(),
      locationY: (json['locationY'] as num?)?.toDouble(),
      lat: (json['lat'] as num?)?.toDouble(),
      lng: (json['lng'] as num?)?.toDouble(),
      isOpen: (json['isOpen'] as num?) == 1 || json['isOpen'] == true,
      avgServiceTime: (json['avgServiceTime'] as num?)?.toInt() ?? 300,
      ownerId: json['ownerId'] as String? ?? json['owner_id'] as String? ?? '',
      ownerName: json['ownerName'] as String? ?? json['owner_name'] as String?,
    );
  }

  int get avgServiceMinutes => (avgServiceTime / 60).round();
}