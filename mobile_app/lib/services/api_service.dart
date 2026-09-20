import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants/app_constants.dart';
import '../models/place_model.dart';
import 'jwt_storage_service.dart';

class ApiService {
  final String baseUrl = AppConstants.baseUrl;

  /// Helper to generate JWT Authorization headers
  Future<Map<String, String>> _getAuthHeaders() async {
    final token = await JwtStorageService.getToken();
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  /// Fetch all places from REST API
  Future<List<Place>?> fetchPlaces() async {
    try {
      final headers = await _getAuthHeaders();
      final response = await http
          .get(Uri.parse('$baseUrl/places'), headers: headers)
          .timeout(const Duration(seconds: 4));

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => Place.fromJson(json)).toList();
      }
    } catch (e) {
      print('ApiService fetchPlaces fallback to local/Firestore: $e');
    }
    return null;
  }

  /// Sync user history to Node.js backend
  Future<bool> recordHistoryToBackend({
    required String placeId,
    required String title,
    required String location,
    required String image,
    required String category,
  }) async {
    try {
      final headers = await _getAuthHeaders();
      final body = json.encode({
        'placeId': placeId,
        'title': title,
        'location': location,
        'image': image,
        'points': '+25 pts',
        'category': category,
        'status': 'Explored with Mobile Audio Guide',
      });

      final response = await http
          .post(
            Uri.parse('$baseUrl/history'),
            headers: headers,
            body: body,
          )
          .timeout(const Duration(seconds: 4));

      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      print('ApiService recordHistory notice: $e');
      return false;
    }
  }
}
