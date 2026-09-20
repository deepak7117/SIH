import 'package:flutter/foundation.dart';
import 'package:geolocator/geolocator.dart';
import '../models/place_model.dart';
import '../services/firestore_service.dart';
import '../services/api_service.dart';
import '../services/location_service.dart';

class PlacesProvider with ChangeNotifier {
  final FirestoreService _firestoreService = FirestoreService();
  final ApiService _apiService = ApiService();

  List<Place> _places = [];
  String _selectedCategory = 'all';
  String _searchQuery = '';
  Place? _selectedPlace;
  Position? _userPosition;
  bool _isLoading = false;

  List<Place> get places => _places;
  String get selectedCategory => _selectedCategory;
  String get searchQuery => _searchQuery;
  Place? get selectedPlace => _selectedPlace;
  Position? get userPosition => _userPosition;
  bool get isLoading => _isLoading;

  /// Top trending monuments
  List<Place> get topTrendingPlaces =>
      _places.where((p) => p.isTopTrending).toList();

  /// Filtered places according to category and search query
  List<Place> get filteredPlaces {
    return _places.where((place) {
      final matchesCategory = _selectedCategory == 'all' ||
          place.category.toLowerCase() == _selectedCategory.toLowerCase();

      final q = _searchQuery.toLowerCase().trim();
      final matchesSearch = q.isEmpty ||
          place.name.toLowerCase().contains(q) ||
          place.location.toLowerCase().contains(q) ||
          place.tag.toLowerCase().contains(q) ||
          place.highlights.any((h) => h.toLowerCase().contains(q));

      return matchesCategory && matchesSearch;
    }).toList();
  }

  /// Initialize and load places
  Future<void> loadPlaces() async {
    _isLoading = true;
    notifyListeners();

    // 1. Try fetching live from Node.js backend first
    final apiPlaces = await _apiService.fetchPlaces();
    if (apiPlaces != null && apiPlaces.isNotEmpty) {
      _places = apiPlaces;
    } else {
      // 2. Fetch from Google Cloud Firestore / curated heritage database
      _firestoreService.getPlacesStream().listen((placesList) {
        if (placesList.isNotEmpty) {
          _places = placesList;
          notifyListeners();
        }
      });
    }

    // 3. Acquire user GPS location asynchronously
    _fetchUserLocation();

    _isLoading = false;
    notifyListeners();
  }

  /// Update user location
  Future<void> _fetchUserLocation() async {
    final pos = await LocationService.getCurrentLocation();
    if (pos != null) {
      _userPosition = pos;
      notifyListeners();
    }
  }

  /// Filter Category
  void setCategory(String categoryId) {
    _selectedCategory = categoryId;
    notifyListeners();
  }

  /// Search Query
  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  /// Select specific Place
  void selectPlace(Place place) {
    _selectedPlace = place;
    notifyListeners();
  }

  /// Lookup Place by QR Code
  Future<Place?> lookupByQr(String qrValue) async {
    return await _firestoreService.lookupPlaceByQr(qrValue);
  }

  /// Record exploration and sync history
  Future<void> recordExploration({
    required String userId,
    required Place place,
  }) async {
    // 1. Save to Google Cloud Firestore
    await _firestoreService.recordTravelHistory(
      userId: userId,
      place: place,
    );

    // 2. Sync to Node.js Backend with JWT
    await _apiService.recordHistoryToBackend(
      placeId: place.id,
      title: place.name,
      location: place.location,
      image: place.image,
      category: place.tag,
    );
  }
}
