class HistoryContent {
  final String language;
  final String mediaType;
  final String title;
  final String mediaUrl;
  final String narrator;
  final String duration;

  HistoryContent({
    required this.language,
    required this.mediaType,
    required this.title,
    required this.mediaUrl,
    required this.narrator,
    required this.duration,
  });

  factory HistoryContent.fromJson(Map<String, dynamic> json) {
    return HistoryContent(
      language: json['language'] ?? 'English',
      mediaType: json['mediaType'] ?? 'audio',
      title: json['title'] ?? '',
      mediaUrl: json['mediaUrl'] ?? '',
      narrator: json['narrator'] ?? '',
      duration: json['duration'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
        'language': language,
        'mediaType': mediaType,
        'title': title,
        'mediaUrl': mediaUrl,
        'narrator': narrator,
        'duration': duration,
      };
}

class TimelineItem {
  final String year;
  final String title;
  final String imageUrl;
  final String description;

  TimelineItem({
    required this.year,
    required this.title,
    required this.imageUrl,
    required this.description,
  });

  factory TimelineItem.fromJson(Map<String, dynamic> json) {
    return TimelineItem(
      year: json['year'] ?? '',
      title: json['title'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
      description: json['description'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
        'year': year,
        'title': title,
        'imageUrl': imageUrl,
        'description': description,
      };
}

class NearbyPlace {
  final String name;
  final String distance;
  final String imageUrl;
  final String category;

  NearbyPlace({
    required this.name,
    required this.distance,
    required this.imageUrl,
    required this.category,
  });

  factory NearbyPlace.fromJson(Map<String, dynamic> json) {
    return NearbyPlace(
      name: json['name'] ?? '',
      distance: json['distance'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
      category: json['category'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
        'name': name,
        'distance': distance,
        'imageUrl': imageUrl,
        'category': category,
      };
}

class CoRelatedPlace {
  final String name;
  final String circuit;
  final String imageUrl;
  final String connection;

  CoRelatedPlace({
    required this.name,
    required this.circuit,
    required this.imageUrl,
    required this.connection,
  });

  factory CoRelatedPlace.fromJson(Map<String, dynamic> json) {
    return CoRelatedPlace(
      name: json['name'] ?? '',
      circuit: json['circuit'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
      connection: json['connection'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
        'name': name,
        'circuit': circuit,
        'imageUrl': imageUrl,
        'connection': connection,
      };
}

class Place {
  final String id;
  final String name;
  final String category;
  final String tag;
  final double rating;
  final int reviews;
  final String location;
  final String image;
  final String description;
  final String detailedDescription;
  final String bestTime;
  final String host;
  final List<String> highlights;
  final bool isTopTrending;
  final String hiddenHistory;
  final String qrCodeValue;
  final double latitude;
  final double longitude;
  final List<HistoryContent> historyContent;
  final List<TimelineItem> visualTimeline;
  final List<NearbyPlace> nearbyPlaces;
  final List<CoRelatedPlace> coRelatedPlaces;

  Place({
    required this.id,
    required this.name,
    required this.category,
    required this.tag,
    required this.rating,
    required this.reviews,
    required this.location,
    required this.image,
    required this.description,
    required this.detailedDescription,
    required this.bestTime,
    required this.host,
    required this.highlights,
    required this.isTopTrending,
    required this.hiddenHistory,
    required this.qrCodeValue,
    required this.latitude,
    required this.longitude,
    required this.historyContent,
    required this.visualTimeline,
    required this.nearbyPlaces,
    required this.coRelatedPlaces,
  });

  factory Place.fromJson(Map<String, dynamic> json) {
    // Parse coordinates with smart fallbacks if not explicitly provided
    double lat = (json['latitude'] != null)
        ? (json['latitude'] as num).toDouble()
        : _extractLatitudeFromName(json['name'] ?? '', json['location'] ?? '');

    double lng = (json['longitude'] != null)
        ? (json['longitude'] as num).toDouble()
        : _extractLongitudeFromName(json['name'] ?? '', json['location'] ?? '');

    return Place(
      id: json['_id'] ?? json['id'] ?? '',
      name: json['name'] ?? '',
      category: json['category'] ?? 'ancient',
      tag: json['tag'] ?? 'Heritage',
      rating: (json['rating'] != null) ? (json['rating'] as num).toDouble() : 4.8,
      reviews: json['reviews'] ?? 100,
      location: json['location'] ?? '',
      image: json['image'] ?? '',
      description: json['description'] ?? '',
      detailedDescription: json['detailedDescription'] ?? '',
      bestTime: json['bestTime'] ?? 'Oct - Mar',
      host: json['host'] ?? 'Municipal Tourism Board',
      highlights: (json['highlights'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
      isTopTrending: json['isTopTrending'] ?? true,
      hiddenHistory: json['hiddenHistory'] ?? '',
      qrCodeValue: json['qrCodeValue'] ?? json['name'] ?? '',
      latitude: lat,
      longitude: lng,
      historyContent: (json['historyContent'] as List<dynamic>?)
              ?.map((item) => HistoryContent.fromJson(item))
              .toList() ??
          [],
      visualTimeline: (json['visualTimeline'] as List<dynamic>?)
              ?.map((item) => TimelineItem.fromJson(item))
              .toList() ??
          [],
      nearbyPlaces: (json['nearbyPlaces'] as List<dynamic>?)
              ?.map((item) => NearbyPlace.fromJson(item))
              .toList() ??
          [],
      coRelatedPlaces: (json['coRelatedPlaces'] as List<dynamic>?)
              ?.map((item) => CoRelatedPlace.fromJson(item))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'category': category,
        'tag': tag,
        'rating': rating,
        'reviews': reviews,
        'location': location,
        'image': image,
        'description': description,
        'detailedDescription': detailedDescription,
        'bestTime': bestTime,
        'host': host,
        'highlights': highlights,
        'isTopTrending': isTopTrending,
        'hiddenHistory': hiddenHistory,
        'qrCodeValue': qrCodeValue,
        'latitude': latitude,
        'longitude': longitude,
        'historyContent': historyContent.map((e) => e.toJson()).toList(),
        'visualTimeline': visualTimeline.map((e) => e.toJson()).toList(),
        'nearbyPlaces': nearbyPlaces.map((e) => e.toJson()).toList(),
        'coRelatedPlaces': coRelatedPlaces.map((e) => e.toJson()).toList(),
      };

  // Helper coordinate mapping for well-known heritage places
  static double _extractLatitudeFromName(String name, String location) {
    final lower = (name + ' ' + location).toLowerCase();
    if (lower.contains('trimbakeshwar') || lower.contains('trimbak')) return 19.9322;
    if (lower.contains('raigad')) return 18.2347;
    if (lower.contains('harihar')) return 19.9056;
    if (lower.contains('saptashrungi') || lower.contains('vani')) return 20.3956;
    if (lower.contains('panchavati') || lower.contains('godavari')) return 20.0076;
    if (lower.contains('taj mahal') || lower.contains('agra')) return 27.1751;
    if (lower.contains('india gate') || lower.contains('delhi')) return 28.6129;
    return 19.9975; // Default Nashik center
  }

  static double _extractLongitudeFromName(String name, String location) {
    final lower = (name + ' ' + location).toLowerCase();
    if (lower.contains('trimbakeshwar') || lower.contains('trimbak')) return 73.5307;
    if (lower.contains('raigad')) return 73.4422;
    if (lower.contains('harihar')) return 73.4722;
    if (lower.contains('saptashrungi') || lower.contains('vani')) return 73.9048;
    if (lower.contains('panchavati') || lower.contains('godavari')) return 73.7958;
    if (lower.contains('taj mahal') || lower.contains('agra')) return 78.0421;
    if (lower.contains('india gate') || lower.contains('delhi')) return 77.2295;
    return 73.7898; // Default Nashik center
  }
}
