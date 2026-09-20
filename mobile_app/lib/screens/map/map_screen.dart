import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../constants/app_colors.dart';
import '../../constants/app_constants.dart';
import '../../models/place_model.dart';
import '../../providers/places_provider.dart';
import '../../services/location_service.dart';
import '../details/place_detail_screen.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({Key? key}) : super(key: key);

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  GoogleMapController? _mapController;
  Place? _selectedMarkerPlace;
  Set<Marker> _markers = {};

  static const CameraPosition _initialCamera = CameraPosition(
    target: LatLng(AppConstants.defaultLat, AppConstants.defaultLng),
    zoom: 9.5,
  );

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _buildMarkers();
    });
  }

  void _buildMarkers() {
    final placesProvider = Provider.of<PlacesProvider>(context, listen: false);
    final places = placesProvider.places;

    final Set<Marker> markers = {};
    for (final place in places) {
      markers.add(
        Marker(
          markerId: MarkerId(place.id),
          position: LatLng(place.latitude, place.longitude),
          infoWindow: InfoWindow(
            title: place.name,
            snippet: '${place.rating} ★ • ${place.tag}',
          ),
          icon: BitmapDescriptor.defaultMarkerWithHue(
            place.category == 'ancient'
                ? BitmapDescriptor.hueOrange
                : place.category == 'trek'
                    ? BitmapDescriptor.hueAzure
                    : BitmapDescriptor.hueViolet,
          ),
          onTap: () {
            setState(() {
              _selectedMarkerPlace = place;
            });
          },
        ),
      );
    }

    setState(() {
      _markers = markers;
    });
  }

  Future<void> _openGoogleMapsDirections(double lat, double lng) async {
    final uri = Uri.parse(
        'https://www.google.com/maps/dir/?api=1&destination=$lat,$lng');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    final placesProvider = Provider.of<PlacesProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          // 1. Google Map View
          GoogleMap(
            initialCameraPosition: _initialCamera,
            markers: _markers,
            myLocationEnabled: true,
            myLocationButtonEnabled: false,
            zoomControlsEnabled: false,
            compassEnabled: true,
            mapToolbarEnabled: false,
            onMapCreated: (controller) {
              _mapController = controller;
            },
            onTap: (_) {
              setState(() {
                _selectedMarkerPlace = null;
              });
            },
          ),

          // 2. Top Bar with Search & Title
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: AppColors.surface.withOpacity(0.95),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.cardBorder),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.3),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    const Icon(Icons.map,
                        color: AppColors.accentGold, size: 22),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Heritage Map Explorer (${placesProvider.places.length} Sites)',
                        style: const TextStyle(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // 3. Floating GPS Center Button
          Positioned(
            right: 16,
            bottom: _selectedMarkerPlace != null ? 220 : 30,
            child: FloatingActionButton.small(
              backgroundColor: AppColors.surface,
              foregroundColor: AppColors.accentGold,
              child: const Icon(Icons.my_location),
              onPressed: () {
                final userPos = placesProvider.userPosition;
                if (userPos != null && _mapController != null) {
                  _mapController!.animateCamera(
                    CameraUpdate.newLatLngZoom(
                      LatLng(userPos.latitude, userPos.longitude),
                      14,
                    ),
                  );
                } else if (_mapController != null) {
                  _mapController!.animateCamera(
                    CameraUpdate.newLatLngZoom(
                      const LatLng(AppConstants.defaultLat, AppConstants.defaultLng),
                      10,
                    ),
                  );
                }
              },
            ),
          ),

          // 4. Interactive Bottom Monument Card on Marker Click
          if (_selectedMarkerPlace != null)
            Positioned(
              left: 16,
              right: 16,
              bottom: 24,
              child: _buildMonumentPreviewCard(
                context,
                _selectedMarkerPlace!,
                placesProvider,
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildMonumentPreviewCard(
    BuildContext context,
    Place place,
    PlacesProvider provider,
  ) {
    double? distanceKm;
    if (provider.userPosition != null) {
      distanceKm = LocationService.calculateDistanceInKm(
        provider.userPosition!.latitude,
        provider.userPosition!.longitude,
        place.latitude,
        place.longitude,
      );
    }

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.cardBorder),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.5),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: CachedNetworkImage(
                  imageUrl: place.image,
                  width: 75,
                  height: 75,
                  fit: BoxFit.cover,
                  errorWidget: (_, __, ___) => Container(
                    width: 75,
                    height: 75,
                    color: AppColors.surfaceLight,
                    child: const Icon(Icons.place, color: Colors.white),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            place.name,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textPrimary,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close,
                              size: 18, color: AppColors.textMuted),
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                          onPressed: () {
                            setState(() {
                              _selectedMarkerPlace = null;
                            });
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      place.location,
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppColors.textSecondary,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        const Icon(Icons.star,
                            size: 13, color: AppColors.accentGold),
                        const SizedBox(width: 4),
                        Text(
                          '${place.rating} (${place.reviews})',
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        if (distanceKm != null) ...[
                          const SizedBox(width: 10),
                          const Icon(Icons.navigation,
                              size: 12, color: AppColors.accentGreen),
                          const SizedBox(width: 3),
                          Text(
                            '${distanceKm.toStringAsFixed(1)} km away',
                            style: const TextStyle(
                              fontSize: 11,
                              color: AppColors.accentGreen,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => PlaceDetailScreen(place: place),
                      ),
                    );
                  },
                  icon: const Icon(Icons.headphones, size: 16),
                  label: const Text('Audio Guide', style: TextStyle(fontSize: 12)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.accentGold,
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              OutlinedButton.icon(
                onPressed: () {
                  _openGoogleMapsDirections(place.latitude, place.longitude);
                },
                icon: const Icon(Icons.directions, size: 16),
                label: const Text('Navigate', style: TextStyle(fontSize: 12)),
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.textPrimary,
                  side: const BorderSide(color: AppColors.cardBorder),
                  padding:
                      const EdgeInsets.symmetric(vertical: 10, horizontal: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
