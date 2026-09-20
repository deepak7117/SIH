import 'package:flutter/foundation.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';
import '../services/jwt_storage_service.dart';

class AuthProvider with ChangeNotifier {
  final AuthService _authService = AuthService();

  UserModel? _currentUser;
  bool _isLoading = false;
  String? _jwtToken;

  UserModel? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _currentUser != null;
  String? get jwtToken => _jwtToken;

  /// Check stored JWT session on launch
  Future<void> checkAuthSession() async {
    _isLoading = true;
    notifyListeners();

    try {
      final token = await JwtStorageService.getToken();
      if (token != null && token.isNotEmpty) {
        _jwtToken = token;
        // Restore existing traveler session
        _currentUser = UserModel(
          id: 'traveler_session_01',
          name: 'Verified Explorer',
          email: 'traveler@sih.gov.in',
          photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          jwtToken: token,
          loyaltyPoints: 125,
        );
      }
    } catch (_) {}

    _isLoading = false;
    notifyListeners();
  }

  /// Trigger Google Sign-In
  Future<bool> signInWithGoogle() async {
    _isLoading = true;
    notifyListeners();

    try {
      final user = await _authService.signInWithGoogle();
      if (user != null) {
        _currentUser = user;
        _jwtToken = user.jwtToken;
        _isLoading = false;
        notifyListeners();
        return true;
      }
    } catch (e) {
      print('Auth error: $e');
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  /// Guest Login
  Future<void> signInAsGuest() async {
    _isLoading = true;
    notifyListeners();

    final user = await _authService.signInAsGuest();
    _currentUser = user;
    _jwtToken = user.jwtToken;

    _isLoading = false;
    notifyListeners();
  }

  /// Add loyalty reward points (+25 pts)
  void addLoyaltyPoints(int points) {
    if (_currentUser != null) {
      _currentUser = _currentUser!.copyWith(
        loyaltyPoints: _currentUser!.loyaltyPoints + points,
      );
      notifyListeners();
    }
  }

  /// Sign out
  Future<void> signOut() async {
    _isLoading = true;
    notifyListeners();

    await _authService.signOut();
    _currentUser = null;
    _jwtToken = null;

    _isLoading = false;
    notifyListeners();
  }
}
