class TravelHistoryItem {
  final String id;
  final String placeId;
  final String title;
  final String image;
  final String location;
  final String date;
  final String points;
  final String category;
  final String status;

  TravelHistoryItem({
    required this.id,
    required this.placeId,
    required this.title,
    required this.image,
    required this.location,
    required this.date,
    required this.points,
    required this.category,
    required this.status,
  });

  factory TravelHistoryItem.fromJson(Map<String, dynamic> json) {
    return TravelHistoryItem(
      id: json['id'] ?? json['_id'] ?? '',
      placeId: json['placeId'] ?? '',
      title: json['title'] ?? '',
      image: json['image'] ?? '',
      location: json['location'] ?? '',
      date: json['date'] ?? 'Today',
      points: json['points'] ?? '+25 pts',
      category: json['category'] ?? 'Explored Destination',
      status: json['status'] ?? 'Explored',
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'placeId': placeId,
        'title': title,
        'image': image,
        'location': location,
        'date': date,
        'points': points,
        'category': category,
        'status': status,
      };
}

class UserModel {
  final String id;
  final String name;
  final String email;
  final String? phone;
  final String? photoUrl;
  final String role;
  final int loyaltyPoints;
  final String? jwtToken;
  final List<TravelHistoryItem> history;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
    this.photoUrl,
    this.role = 'traveler',
    this.loyaltyPoints = 50,
    this.jwtToken,
    this.history = const [],
  });

  factory UserModel.fromJson(Map<String, dynamic> json, {String? token}) {
    var historyList = <TravelHistoryItem>[];
    if (json['history'] != null) {
      historyList = (json['history'] as List<dynamic>)
          .map((item) => TravelHistoryItem.fromJson(item))
          .toList();
    }

    return UserModel(
      id: json['_id'] ?? json['id'] ?? json['uid'] ?? '',
      name: json['name'] ?? json['displayName'] ?? 'Heritage Traveler',
      email: json['email'] ?? '',
      phone: json['phone'],
      photoUrl: json['photoUrl'] ?? json['photoURL'],
      role: json['role'] ?? 'traveler',
      loyaltyPoints: json['loyaltyPoints'] ?? 50,
      jwtToken: token ?? json['token'] ?? json['jwtToken'],
      history: historyList,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        'phone': phone,
        'photoUrl': photoUrl,
        'role': role,
        'loyaltyPoints': loyaltyPoints,
        'jwtToken': jwtToken,
        'history': history.map((e) => e.toJson()).toList(),
      };

  UserModel copyWith({
    String? id,
    String? name,
    String? email,
    String? phone,
    String? photoUrl,
    String? role,
    int? loyaltyPoints,
    String? jwtToken,
    List<TravelHistoryItem>? history,
  }) {
    return UserModel(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      photoUrl: photoUrl ?? this.photoUrl,
      role: role ?? this.role,
      loyaltyPoints: loyaltyPoints ?? this.loyaltyPoints,
      jwtToken: jwtToken ?? this.jwtToken,
      history: history ?? this.history,
    );
  }
}
