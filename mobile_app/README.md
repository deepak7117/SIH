# SIH Heritage Tourism Android Application (Flutter & Dart)

A modern, high-performance Flutter Android application created for the **Smart India Hackathon (SIH) Heritage & Tourism** project.

---

## 🌟 Key Features

1. **Google Maps Heritage Explorer (`google_maps_flutter`)**:
   - Interactive full-screen map with color-coded custom markers for historical temples, hill forts, caves, and pilgrimage sites.
   - Real-time GPS location tracking and distance calculation from the user's position.
   - One-tap "Open Route in Google Maps" turn-by-turn driving directions.

2. **Google Authentication & Firebase Auth (`google_sign_in`, `firebase_auth`)**:
   - One-tap Google Sign-In dialog.
   - Seamless traveler profile linking with Google avatar, display name, and email.
   - Guest explorer mode for offline testing.

3. **Secure JWT Token Handling (`flutter_secure_storage`)**:
   - Hardware-backed encrypted shared preferences storage for JWT tokens.
   - Bearer token authentication headers attached to all REST requests to the Node.js backend.
   - Automatic session restoration on launch.

4. **Google Cloud Firestore Database (`cloud_firestore`)**:
   - Real-time cloud database syncing of heritage destinations, categories, reviews, and ratings.
   - User exploration history and loyalty reward points (`+25 pts` per explored monument) synced to `users/{uid}/history`.
   - Curated offline database guarantees instant load even without internet.

5. **Multi-Language Audio Tour Guide (`audioplayers`)**:
   - Live historical audio player supporting **English, Marathi, and Hindi** narrations.
   - Interactive scrub bar, play/pause controls, and narrator credits.

6. **On-Site Monument QR Code Scanner (`mobile_scanner`)**:
   - Camera-based viewfinder to scan physical QR plaques on heritage monuments.
   - Instant monument lookup and auto-play of historical audio guide.

---

## 📁 Project Architecture

```
mobile_app/
├── android/
│   └── app/src/main/AndroidManifest.xml   # Permissions, Camera, Maps API key
├── lib/
│   ├── constants/
│   │   ├── app_colors.dart                # Royal Indigo, Gold, Midnight theme
│   │   └── app_constants.dart             # API endpoints, categories, storage keys
│   ├── models/
│   │   ├── place_model.dart               # Heritage place, audio narrations, timeline
│   │   └── user_model.dart                # Traveler profile, history, loyalty points
│   ├── services/
│   │   ├── auth_service.dart              # Google Sign-In & Firebase Auth
│   │   ├── jwt_storage_service.dart       # Encrypted JWT token persistence
│   │   ├── firestore_service.dart         # Google Cloud Firestore CRUD & offline cache
│   │   ├── api_service.dart               # Node.js backend REST client with Bearer JWT
│   │   └── location_service.dart          # GPS position & distance calculations
│   ├── providers/
│   │   ├── auth_provider.dart             # Authentication & session state
│   │   ├── places_provider.dart           # Heritage sites, categories & search
│   │   └── audio_guide_provider.dart      # Multi-language audio player state
│   ├── widgets/
│   │   ├── place_card.dart                # Vertical & horizontal monument cards
│   │   ├── audio_player_widget.dart       # Multi-language audio tour player
│   │   ├── timeline_view.dart             # Chronological era timeline stepper
│   │   └── custom_button.dart             # Themed action buttons
│   ├── screens/
│   │   ├── auth/login_screen.dart         # Google Sign-In screen
│   │   ├── home/home_screen.dart          # Hero carousel, trending sites, search
│   │   ├── map/map_screen.dart            # Interactive Google Map with markers
│   │   ├── details/place_detail_screen.dart # Audio tour, timeline & history
│   │   ├── scanner/qr_scanner_screen.dart # Camera QR scanner
│   │   ├── profile/profile_screen.dart    # Gamified loyalty score & travel history
│   │   └── main_nav_screen.dart           # Bottom navigation bar
│   └── main.dart                          # App entrypoint & MultiProvider setup
└── pubspec.yaml
```

---

## 🚀 Setup & Running Instructions

### 1. Prerequisites
- [Flutter SDK](https://docs.flutter.dev/get-started/install) installed and added to PATH.
- Android Studio with Android SDK (API 34) & an Android Device or Emulator.

### 2. Configure Google Maps API Key
1. Obtain an API Key from the [Google Cloud Console](https://console.cloud.google.com/google/maps-apis).
2. Open `android/app/src/main/AndroidManifest.xml`.
3. Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual Google Maps API key:
   ```xml
   <meta-data
       android:name="com.google.android.geo.API_KEY"
       android:value="AIzaSyYourActualKeyHere..." />
   ```

### 3. Configure Google Sign-In & Firebase
1. In the [Firebase Console](https://console.firebase.google.com/), create a project.
2. Enable **Authentication -> Google Provider**.
3. Enable **Cloud Firestore Database**.
4. Download `google-services.json` and place it in `mobile_app/android/app/google-services.json`.

*(Note: The app is equipped with smart fallbacks, so you can explore and run it immediately even before adding cloud keys!)*

### 4. Run the Application
In your terminal, navigate to the `mobile_app` folder:
```bash
cd mobile_app
flutter pub get
flutter run
```
