class User {
  final String id;
  final String? name;
  final String? email;
  final String role;

  User({
    required this.id,
    this.name,
    this.email,
    required this.role,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String,
      name: json['name'] as String?,
      email: json['email'] as String?,
      role: json['role'] as String? ?? 'anon',
    );
  }

  bool get isOwner => role == 'owner';
}