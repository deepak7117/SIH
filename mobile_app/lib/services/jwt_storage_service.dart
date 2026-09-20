import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../constants/app_constants.dart';

class JwtStorageService {
  static const _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(
      encryptedSharedPreferences: true,
    ),
  );

  /// Save JWT Token securely
  static Future<void> saveToken(String token) async {
    await _storage.write(key: AppConstants.jwtTokenKey, value: token);
  }

  /// Retrieve JWT Token
  static Future<String?> getToken() async {
    return await _storage.read(key: AppConstants.jwtTokenKey);
  }

  /// Delete JWT Token on logout
  static Future<void> clearToken() async {
    await _storage.delete(key: AppConstants.jwtTokenKey);
  }

  /// Check if user has a stored JWT Token
  static Future<bool> hasToken() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }
}
