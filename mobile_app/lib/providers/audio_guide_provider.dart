import 'package:flutter/foundation.dart';
import 'package:audioplayers/audioplayers.dart';
import '../models/place_model.dart';

class AudioGuideProvider with ChangeNotifier {
  final AudioPlayer _player = AudioPlayer();

  bool _isPlaying = false;
  Duration _duration = Duration.zero;
  Duration _position = Duration.zero;
  HistoryContent? _currentAudio;
  String _selectedLanguage = 'English';

  bool get isPlaying => _isPlaying;
  Duration get duration => _duration;
  Duration get position => _position;
  HistoryContent? get currentAudio => _currentAudio;
  String get selectedLanguage => _selectedLanguage;

  AudioGuideProvider() {
    _player.onPlayerStateChanged.listen((state) {
      _isPlaying = state == PlayerState.playing;
      notifyListeners();
    });

    _player.onDurationChanged.listen((d) {
      _duration = d;
      notifyListeners();
    });

    _player.onPositionChanged.listen((p) {
      _position = p;
      notifyListeners();
    });

    _player.onPlayerComplete.listen((_) {
      _position = Duration.zero;
      _isPlaying = false;
      notifyListeners();
    });
  }

  /// Select audio track by language
  void selectAudioForLanguage(List<HistoryContent> audioList, String language) {
    _selectedLanguage = language;
    final match = audioList.firstWhere(
      (a) => a.language.toLowerCase() == language.toLowerCase(),
      orElse: () => audioList.isNotEmpty
          ? audioList.first
          : HistoryContent(
              language: 'English',
              mediaType: 'audio',
              title: 'Heritage Narration',
              mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
              narrator: 'Historical Guide',
              duration: '3m 00s',
            ),
    );
    _currentAudio = match;
    notifyListeners();
  }

  /// Play or Pause the selected audio narration
  Future<void> togglePlayPause() async {
    if (_isPlaying) {
      await _player.pause();
    } else {
      if (_currentAudio != null && _currentAudio!.mediaUrl.isNotEmpty) {
        await _player.play(UrlSource(_currentAudio!.mediaUrl));
      }
    }
    notifyListeners();
  }

  /// Seek audio
  Future<void> seek(Duration newPosition) async {
    await _player.seek(newPosition);
  }

  /// Stop audio when leaving screen
  Future<void> stop() async {
    await _player.stop();
    _isPlaying = false;
    _position = Duration.zero;
    notifyListeners();
  }

  @override
  void dispose() {
    _player.dispose();
    super.dispose();
  }
}
