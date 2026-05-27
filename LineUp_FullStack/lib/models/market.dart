class Market {
  final String id;
  final String name;
  final double lat;
  final double lng;
  final String address;
  final String operatingHours;
  final String description;
  final String mapImageUrl;

  Market({
    required this.id,
    required this.name,
    required this.lat,
    required this.lng,
    required this.address,
    required this.operatingHours,
    required this.description,
    required this.mapImageUrl,
  });

  factory Market.fromJson(Map<String, dynamic> json) {
    return Market(
      id: json['id'] as String,
      name: json['name'] as String,
      lat: (json['lat'] as num).toDouble(),
      lng: (json['lng'] as num).toDouble(),
      address: json['address'] as String? ?? '',
      operatingHours: json['operatingHours'] as String? ?? json['operating_hours'] as String? ?? '',
      description: json['description'] as String? ?? '',
      mapImageUrl: json['mapImageUrl'] as String? ?? json['map_image_url'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'lat': lat,
      'lng': lng,
      'address': address,
      'operatingHours': operatingHours,
      'description': description,
      'mapImageUrl': mapImageUrl,
    };
  }
}
