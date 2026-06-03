class User {
  final String id;
  final String? name;
  final String? email;
  final String role;
  final List<String> favoriteShops;
  final Map<String, int> visitCount;
  final Map<String, DateTime> lastVisit;
  final DateTime? createdAt;

  User({
    required this.id,
    this.name,
    this.email,
    required this.role,
    this.favoriteShops = const [],
    this.visitCount = const {},
    this.lastVisit = const {},
    this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String,
      name: json['name'] as String?,
      email: json['email'] as String?,
      role: json['role'] as String? ?? 'anon',
      favoriteShops: List<String>.from(json['favoriteShops'] as List? ?? []),
      visitCount: Map<String, int>.from(json['visitCount'] as Map? ?? {}),
      lastVisit: (json['lastVisit'] as Map?)?.map(
        (key, value) => MapEntry(key as String, DateTime.parse(value as String)),
      ) ?? {},
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt'] as String) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'role': role,
      'favoriteShops': favoriteShops,
      'visitCount': visitCount,
      'lastVisit': lastVisit.map((key, value) => MapEntry(key, value.toIso8601String())),
      'createdAt': createdAt?.toIso8601String(),
    };
  }

  bool get isOwner => role == 'owner';
  bool get isCustomer => role == 'customer' || role == 'anon';
}