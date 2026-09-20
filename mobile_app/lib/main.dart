import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'constants/app_colors.dart';
import 'constants/app_constants.dart';
import 'providers/auth_provider.dart';
import 'providers/places_provider.dart';
import 'providers/audio_guide_provider.dart';
import 'screens/main_nav_screen.dart';
import 'screens/auth/login_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Firebase (safely catches if google-services.json is pending)
  try {
    await Firebase.initializeApp();
  } catch (e) {
    print('Firebase initialization notice: $e');
  }

  runApp(const SihHeritageApp());
}

class SihHeritageApp extends StatelessWidget {
  const SihHeritageApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()..checkAuthSession()),
        ChangeNotifierProvider(create: (_) => PlacesProvider()..loadPlaces()),
        ChangeNotifierProvider(create: (_) => AudioGuideProvider()),
      ],
      child: Consumer<AuthProvider>(
        builder: (context, authProvider, _) {
          return MaterialApp(
            title: AppConstants.appName,
            debugShowCheckedModeBanner: false,
            theme: ThemeData(
              brightness: Brightness.dark,
              primaryColor: AppColors.primary,
              scaffoldBackgroundColor: AppColors.background,
              colorScheme: const ColorScheme.dark(
                primary: AppColors.primary,
                secondary: AppColors.accentGold,
                surface: AppColors.surface,
              ),
              appBarTheme: const AppBarTheme(
                backgroundColor: AppColors.primaryDark,
                elevation: 0,
                centerTitle: false,
              ),
              useMaterial3: true,
            ),
            home: authProvider.isLoading
                ? const Scaffold(
                    backgroundColor: AppColors.background,
                    body: Center(
                      child: CircularProgressIndicator(
                        color: AppColors.accentGold,
                      ),
                    ),
                  )
                : authProvider.isAuthenticated
                    ? const MainNavScreen()
                    : const LoginScreen(),
          );
        },
      ),
    );
  }
}
