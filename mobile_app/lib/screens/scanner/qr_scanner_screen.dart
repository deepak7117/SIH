import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:provider/provider.dart';
import '../../constants/app_colors.dart';
import '../../providers/places_provider.dart';
import '../details/place_detail_screen.dart';

class QrScannerScreen extends StatefulWidget {
  const QrScannerScreen({Key? key}) : super(key: key);

  @override
  State<QrScannerScreen> createState() => _QrScannerScreenState();
}

class _QrScannerScreenState extends State<QrScannerScreen> {
  final MobileScannerController _scannerController = MobileScannerController(
    detectionSpeed: DetectionSpeed.noDuplicates,
  );
  bool _isProcessing = false;

  void _onDetect(BarcodeCapture capture) async {
    if (_isProcessing) return;

    final List<Barcode> barcodes = capture.barcodes;
    for (final barcode in barcodes) {
      final String? rawValue = barcode.rawValue;
      if (rawValue != null && rawValue.isNotEmpty) {
        _isProcessing = true;
        await _processScannedQr(rawValue);
        break;
      }
    }
  }

  Future<void> _processScannedQr(String qrValue) async {
    final placesProvider = Provider.of<PlacesProvider>(context, listen: false);

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => const Center(
        child: CircularProgressIndicator(color: AppColors.accentGold),
      ),
    );

    final place = await placesProvider.lookupByQr(qrValue);

    if (mounted) {
      Navigator.pop(context); // Close loading dialog
      if (place != null) {
        placesProvider.selectPlace(place);
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => PlaceDetailScreen(place: place),
          ),
        ).then((_) {
          _isProcessing = false;
        });
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('No monument found for QR code: $qrValue'),
            backgroundColor: AppColors.error,
          ),
        );
        _isProcessing = false;
      }
    }
  }

  @override
  void dispose() {
    _scannerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          'Scan Monument QR Code',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: ValueListenableBuilder(
              valueListenable: _scannerController,
              builder: (context, state, child) {
                return Icon(
                  state.torchState == TorchState.on
                      ? Icons.flash_on
                      : Icons.flash_off,
                  color: AppColors.accentGold,
                );
              },
            ),
            onPressed: () => _scannerController.toggleTorch(),
          ),
          IconButton(
            icon: const Icon(Icons.flip_camera_android,
                color: AppColors.accentGold),
            onPressed: () => _scannerController.switchCamera(),
          ),
        ],
      ),
      body: Stack(
        children: [
          // 1. Mobile Camera Scanner
          MobileScanner(
            controller: _scannerController,
            onDetect: _onDetect,
            errorBuilder: (context, error, child) {
              return Center(
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Icon(Icons.camera_alt_outlined,
                          size: 50, color: AppColors.textMuted),
                      SizedBox(height: 12),
                      Text(
                        'Camera permission needed or running on emulator.\nYou can use test QR shortcuts below.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),

          // 2. Viewfinder Overlay Box
          Center(
            child: Container(
              width: 250,
              height: 250,
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.accentGold, width: 2.5),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Stack(
                children: [
                  Positioned(
                    top: 8,
                    left: 8,
                    child: Container(
                      width: 16,
                      height: 16,
                      decoration: const BoxDecoration(
                        color: AppColors.accentGold,
                        borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(8),
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 8,
                    right: 8,
                    child: Container(
                      width: 16,
                      height: 16,
                      decoration: const BoxDecoration(
                        color: AppColors.accentGold,
                        borderRadius: BorderRadius.only(
                          bottomRight: Radius.circular(8),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // 3. Instructions & Instant Simulator Test Buttons
          Positioned(
            left: 20,
            right: 20,
            bottom: 30,
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface.withOpacity(0.95),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.cardBorder),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text(
                    'Point camera at physical QR plaque on-site',
                    style: TextStyle(
                      color: AppColors.textPrimary,
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Instant multi-language audio narration & +25 pts rewarded',
                    style: TextStyle(
                      color: AppColors.accentGreen,
                      fontSize: 11,
                    ),
                  ),
                  const SizedBox(height: 12),
                  // Quick Test Chips for Testing
                  Wrap(
                    spacing: 8,
                    children: [
                      ActionChip(
                        backgroundColor: AppColors.surfaceLight,
                        label: const Text(
                          'Test: Trimbakeshwar QR',
                          style: TextStyle(
                            fontSize: 11,
                            color: AppColors.accentGold,
                          ),
                        ),
                        onPressed: () =>
                            _processScannedQr('SIH_QR_TRIMBAKESHWAR_101'),
                      ),
                      ActionChip(
                        backgroundColor: AppColors.surfaceLight,
                        label: const Text(
                          'Test: Harihar Fort QR',
                          style: TextStyle(
                            fontSize: 11,
                            color: AppColors.accentGold,
                          ),
                        ),
                        onPressed: () =>
                            _processScannedQr('SIH_QR_HARIHAR_102'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
