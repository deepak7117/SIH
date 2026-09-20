import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../constants/app_colors.dart';
import '../models/place_model.dart';
import '../providers/audio_guide_provider.dart';

class AudioPlayerWidget extends StatefulWidget {
  final List<HistoryContent> historyContent;

  const AudioPlayerWidget({
    Key? key,
    required this.historyContent,
  }) : super(key: key);

  @override
  State<AudioPlayerWidget> createState() => _AudioPlayerWidgetState();
}

class _AudioPlayerWidgetState extends State<AudioPlayerWidget> {
  final List<String> _languages = ['English', 'Marathi', 'Hindi'];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final audioProvider =
          Provider.of<AudioGuideProvider>(context, listen: false);
      if (widget.historyContent.isNotEmpty) {
        audioProvider.selectAudioForLanguage(
          widget.historyContent,
          audioProvider.selectedLanguage,
        );
      }
    });
  }

  String _formatDuration(Duration duration) {
    String twoDigits(int n) => n.toString().padLeft(2, '0');
    final minutes = twoDigits(duration.inMinutes.remainder(60));
    final seconds = twoDigits(duration.inSeconds.remainder(60));
    return '$minutes:$seconds';
  }

  @override
  Widget build(BuildContext context) {
    final audioProvider = Provider.of<AudioGuideProvider>(context);
    final currentTrack = audioProvider.currentAudio;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header & Language selector
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: const [
                  Icon(Icons.record_voice_over,
                      color: AppColors.accentGold, size: 20),
                  SizedBox(width: 8),
                  Text(
                    'Audio Tour Guide',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                ],
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.accentGreen.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  'Active Guide',
                  style: TextStyle(
                    fontSize: 11,
                    color: AppColors.accentGreen,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Language Selector Chips
          Wrap(
            spacing: 8,
            children: _languages.map((lang) {
              final isSelected =
                  audioProvider.selectedLanguage.toLowerCase() ==
                      lang.toLowerCase();
              return ChoiceChip(
                label: Text(lang),
                selected: isSelected,
                selectedColor: AppColors.accentGold,
                backgroundColor: AppColors.surfaceLight,
                labelStyle: TextStyle(
                  color: isSelected ? Colors.black : AppColors.textSecondary,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                  fontSize: 12,
                ),
                onSelected: (selected) {
                  if (selected) {
                    audioProvider.selectAudioForLanguage(
                      widget.historyContent,
                      lang,
                    );
                  }
                },
              );
            }).toList(),
          ),
          const SizedBox(height: 12),

          // Track Title & Narrator
          if (currentTrack != null) ...[
            Text(
              currentTrack.title.isNotEmpty
                  ? currentTrack.title
                  : 'Historical Monument Guide',
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            if (currentTrack.narrator.isNotEmpty) ...[
              const SizedBox(height: 2),
              Text(
                'Narrator: ${currentTrack.narrator}',
                style: const TextStyle(
                  fontSize: 12,
                  color: AppColors.textMuted,
                ),
              ),
            ],
          ],
          const SizedBox(height: 8),

          // Audio Slider & Duration
          SliderTheme(
            data: SliderTheme.of(context).copyWith(
              thumbColor: AppColors.accentGold,
              activeTrackColor: AppColors.accentGold,
              inactiveTrackColor: AppColors.surfaceLight,
              trackHeight: 4,
              thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6),
            ),
            child: Slider(
              min: 0,
              max: audioProvider.duration.inSeconds.toDouble() > 0
                  ? audioProvider.duration.inSeconds.toDouble()
                  : 100,
              value: audioProvider.position.inSeconds
                  .toDouble()
                  .clamp(0, audioProvider.duration.inSeconds.toDouble() > 0 ? audioProvider.duration.inSeconds.toDouble() : 100),
              onChanged: (value) {
                audioProvider.seek(Duration(seconds: value.toInt()));
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 6),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  _formatDuration(audioProvider.position),
                  style: const TextStyle(
                      fontSize: 11, color: AppColors.textSecondary),
                ),
                Text(
                  _formatDuration(audioProvider.duration),
                  style: const TextStyle(
                      fontSize: 11, color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),

          // Play / Pause Control Button
          Center(
            child: IconButton(
              iconSize: 44,
              icon: Icon(
                audioProvider.isPlaying
                    ? Icons.pause_circle_filled
                    : Icons.play_circle_filled,
                color: AppColors.accentGold,
              ),
              onPressed: () {
                audioProvider.togglePlayPause();
              },
            ),
          ),
        ],
      ),
    );
  }
}
