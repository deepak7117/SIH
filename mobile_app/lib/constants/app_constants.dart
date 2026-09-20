class AppConstants {
  // App Info
  static const String appName = 'SIH Heritage Tourism';
  static const String appTagline = 'Discover India\'s Timeless Heritage';

  // Backend API URL (defaults to localhost:5000 for Android emulator 10.0.2.2 or production)
  static const String baseUrl = 'http://10.0.2.2:5000/api';
  static const String fallbackLocalUrl = 'http://localhost:5000/api';

  // Storage Keys
  static const String jwtTokenKey = 'sih_jwt_auth_token';
  static const String userDataKey = 'sih_user_data';
  static const String travelPointsKey = 'sih_travel_points';

  // Points Gamification
  static const int pointsPerExploredPlace = 25;

  // Heritage Categories
  static const List<Map<String, String>> categories = [
    {'id': 'all', 'label': 'All Experiences'},
    {'id': 'ancient', 'label': 'Ancient & Spiritual'},
    {'id': 'wildlife', 'label': 'Wildlife & Nature'},
    {'id': 'heritage', 'label': 'Heritage & Culture'},
    {'id': 'trek', 'label': 'Trek & Adventure'},
  ];

  // Default Center for Heritage Maps (Nashik / Maharashtra region)
  static const double defaultLat = 19.9975;
  static const double defaultLng = 73.7898;
}
