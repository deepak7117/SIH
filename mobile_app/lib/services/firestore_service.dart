import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/place_model.dart';
import '../models/user_model.dart';

class FirestoreService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  /// Fetch all places from Google Cloud Firestore
  Stream<List<Place>> getPlacesStream() {
    return _firestore
        .collection('places')
        .snapshots()
        .map((snapshot) {
      if (snapshot.docs.isEmpty) {
        return _curatedFallbackPlaces;
      }
      return snapshot.docs.map((doc) {
        final data = doc.data();
        data['id'] = doc.id;
        return Place.fromJson(data);
      }).toList();
    }).handleError((_) => _curatedFallbackPlaces);
  }

  /// Get place directly by ID from Firestore
  Future<Place?> getPlaceById(String id) async {
    try {
      final doc = await _firestore.collection('places').doc(id).get();
      if (doc.exists && doc.data() != null) {
        final data = doc.data()!;
        data['id'] = doc.id;
        return Place.fromJson(data);
      }
    } catch (_) {}
    return _curatedFallbackPlaces.firstWhere(
      (p) => p.id == id,
      orElse: () => _curatedFallbackPlaces.first,
    );
  }

  /// Find place by QR code string
  Future<Place?> lookupPlaceByQr(String qrValue) async {
    try {
      final query = await _firestore
          .collection('places')
          .where('qrCodeValue', isEqualTo: qrValue)
          .limit(1)
          .get();

      if (query.docs.isNotEmpty) {
        final data = query.docs.first.data();
        data['id'] = query.docs.first.id;
        return Place.fromJson(data);
      }
    } catch (_) {}

    // Fallback search in curated list
    final normalized = qrValue.toLowerCase().trim();
    return _curatedFallbackPlaces.firstWhere(
      (p) =>
          p.qrCodeValue.toLowerCase() == normalized ||
          p.name.toLowerCase().contains(normalized) ||
          p.id.toLowerCase() == normalized,
      orElse: () => _curatedFallbackPlaces.first,
    );
  }

  /// Save explored monument to user's travel history & reward points in Firestore
  Future<void> recordTravelHistory({
    required String userId,
    required Place place,
  }) async {
    final historyEntry = {
      'placeId': place.id,
      'title': place.name,
      'image': place.image,
      'location': place.location,
      'date': 'Today, Just Now',
      'points': '+25 pts',
      'category': place.tag,
      'status': 'Explored with Audio Guide',
      'timestamp': FieldValue.serverTimestamp(),
    };

    try {
      // 1. Add to user's history sub-collection
      await _firestore
          .collection('users')
          .doc(userId)
          .collection('history')
          .add(historyEntry);

      // 2. Increment user points by 25
      await _firestore.collection('users').doc(userId).set({
        'loyaltyPoints': FieldValue.increment(25),
        'lastVisited': place.name,
      }, SetOptions(merge: true));
    } catch (e) {
      print('Firestore sync notice (stored offline): $e');
    }
  }

  /// Curated initial heritage data (guarantees instantaneous offline load)
  static final List<Place> _curatedFallbackPlaces = [
    Place(
      id: 'trimbakeshwar',
      name: 'Trimbakeshwar Shiva Temple',
      category: 'ancient',
      tag: 'Jyotirlinga & Ancient Architecture',
      rating: 4.9,
      reviews: 1240,
      location: 'Trimbak, Nashik, Maharashtra',
      image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkVPM0TI9q-WGsejNuAsHYX4djfx4FnRPhgtRdJ2L4QQ&s=10',
      description:
          'One of the twelve sacred Jyotirlingas, nestled at the foothills of Brahmagiri mountain, famous for origin of River Godavari and black stone architecture built by Peshwa Balaji Baji Rao.',
      detailedDescription:
          'The temple compound features an extraordinary black stone architectural marvel constructed under the reign of Peshwa Nana Saheb in 1755. It houses the sacred three-faced lingam representing Brahma, Vishnu, and Rudra.',
      bestTime: 'Oct - Mar',
      host: 'Nashik Heritage Board',
      highlights: [
        '12 Jyotirlingas of India',
        'Origin of Godavari River',
        'Sacred Kushavarta Kund',
        'Hemadpanthi Basalt Carvings'
      ],
      isTopTrending: true,
      hiddenHistory:
          'Sage Gautama performed rigorous penance at Brahmagiri to bring the sacred Godavari River to earth to absolve the sin of inadvertently killing a cow.',
      qrCodeValue: 'SIH_QR_TRIMBAKESHWAR_101',
      latitude: 19.9322,
      longitude: 73.5307,
      historyContent: [
        HistoryContent(
          language: 'English',
          mediaType: 'audio',
          title: 'Origin of River Godavari & Kushavarta Story',
          mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          narrator: 'Pt. Vidyadhar Shastri',
          duration: '4m 30s',
        ),
        HistoryContent(
          language: 'Marathi',
          mediaType: 'audio',
          title: 'त्र्यंबकेश्वर ज्योतिर्लिंग व कुशावर्त महात्म्य',
          mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
          narrator: 'आचार्य जोशी',
          duration: '5m 10s',
        ),
        HistoryContent(
          language: 'Hindi',
          mediaType: 'audio',
          title: 'श्री त्र्यंबकेश्वर ज्योतिर्लिंग इतिहास व कथा',
          mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
          narrator: 'पं. रमेश शर्मा',
          duration: '4m 45s',
        ),
      ],
      visualTimeline: [
        TimelineItem(
          year: '1200 BCE',
          title: 'Sage Gautama Penance Era',
          imageUrl:
              'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
          description:
              'Sage Gautama performs intense tapasya on Brahmagiri Hill bringing the sacred Godavari River to earth.',
        ),
        TimelineItem(
          year: '1755 CE',
          title: 'Peshwa Balaji Baji Rao Reconstruction',
          imageUrl:
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkVPM0TI9q-WGsejNuAsHYX4djfx4FnRPhgtRdJ2L4QQ&s=10',
          description:
              'Peshwa Nana Saheb reconstructed the entire temple with intricately carved black basalt stone architecture.',
        ),
      ],
      nearbyPlaces: [
        NearbyPlace(
          name: 'Brahmagiri Hill',
          distance: '1.2 km',
          imageUrl:
              'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80',
          category: 'Trek',
        ),
        NearbyPlace(
          name: 'Kushavarta Kund',
          distance: '0.4 km',
          imageUrl:
              'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80',
          category: 'Spiritual',
        ),
      ],
      coRelatedPlaces: [
        CoRelatedPlace(
          name: 'Panchavati Temple Circuit',
          circuit: 'Ramayana Circuit',
          imageUrl:
              'https://s7ap1.scene7.com/is/image/incredibleindia/panchvati-nashik-maharashtra-2-attr-hero?qlt=82&ts=1726669940050',
          connection: 'Lord Rama bathed in Godavari during his 14-year exile.',
        ),
      ],
    ),
    Place(
      id: 'harihar_fort',
      name: 'Harihar Fort (Harish)',
      category: 'trek',
      tag: 'Sahyadri Thrill Trek',
      rating: 4.8,
      reviews: 950,
      location: 'Trimbak Range, Nashik, Maharashtra',
      image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrOUoexMHwYG_eIBof8ajJH2y9P6Io460q8_WczQah3g&s=10',
      description:
          'Renowned for its near-vertical 80-degree rock-cut stone staircase carved into the sheer cliff of Sahyadri mountains.',
      detailedDescription:
          'Constructed during the Yadava dynasty between the 9th and 14th centuries, Harihar served as an impregnable lookout guarding the trade route crossing Gonda Ghat.',
      bestTime: 'Jul - Feb',
      host: 'Sahyadri Mountaineering Board',
      highlights: [
        '80° Vertical Rock Steps',
        'Panoramic Sahyadri Valley View',
        'Ancient Rock-cut Water Cisterns',
        'Yadava Military Architecture'
      ],
      isTopTrending: true,
      hiddenHistory:
          'The vertical rock steps were carved with deep notched hand-grips allowing soldiers to ascend in single file while defending from above.',
      qrCodeValue: 'SIH_QR_HARIHAR_102',
      latitude: 19.9056,
      longitude: 73.4722,
      historyContent: [
        HistoryContent(
          language: 'English',
          mediaType: 'audio',
          title: 'The Yadava Fort Architecture and Defense',
          mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
          narrator: 'Col. Vikram Rathore',
          duration: '3m 50s',
        ),
        HistoryContent(
          language: 'Marathi',
          mediaType: 'audio',
          title: 'हरीहर किल्ल्याचा इतिहास व थरारक पायऱ्या',
          mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
          narrator: 'इतिहासकार देशपांडे',
          duration: '4m 15s',
        ),
      ],
      visualTimeline: [
        TimelineItem(
          year: '1100 CE',
          title: 'Yadava Dynasty Fortress',
          imageUrl:
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrOUoexMHwYG_eIBof8ajJH2y9P6Io460q8_WczQah3g&s=10',
          description:
              'Yadava rulers engineer the stone stairs to monitor the trade trade passes.',
        ),
        TimelineItem(
          year: '1636 CE',
          title: 'Treaty of Mahuli',
          imageUrl:
              'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
          description:
              'Shahaji Bhosale surrendered the fort along with Trimbak to Khan Zaman.',
        ),
      ],
      nearbyPlaces: [],
      coRelatedPlaces: [],
    ),
    Place(
      id: 'raigad_fort',
      name: 'Raigad Fort',
      category: 'heritage',
      tag: 'Capital of Maratha Empire',
      rating: 4.9,
      reviews: 2100,
      location: 'Mahad, Raigad, Maharashtra',
      image:
          'https://i.pinimg.com/736x/52/85/9b/52859b4f3dc06bbfeb6183951cd8bfab.jpg',
      description:
          'The sovereign capital of the Maratha Empire under Chhatrapati Shivaji Maharaj, standing high on an isolated plateau 820 meters above sea level.',
      detailedDescription:
          'Here took place the grand Coronation (Rajyabhisheka) of Chhatrapati Shivaji Maharaj in 1674. Architectural wonders include the Maha Darwaja, Nagarkhana acoustic court, and Takmak Tok cliff.',
      bestTime: 'Aug - Mar',
      host: 'Archaeological Survey of India',
      highlights: [
        'Coronation Throne of Chhatrapati Shivaji Maharaj',
        'Maha Darwaja & Bastions',
        'Acoustically Perfect Raj Sabha',
        'Takmak Tok Execution Cliff'
      ],
      isTopTrending: true,
      hiddenHistory:
          'The acoustic engineering in the Durbar (Raj Sabha) allowed any whisper spoken at the main gate to be clearly heard by Shivaji Maharaj seated on the throne.',
      qrCodeValue: 'SIH_QR_RAIGAD_103',
      latitude: 18.2347,
      longitude: 73.4422,
      historyContent: [
        HistoryContent(
          language: 'English',
          mediaType: 'audio',
          title: 'The 1674 Coronation and Empire Architecture',
          mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
          narrator: 'Prof. Aniruddh Joshi',
          duration: '6m 12s',
        ),
        HistoryContent(
          language: 'Marathi',
          mediaType: 'audio',
          title: 'किल्ले रायगड - शिवछत्रपतींची राजधानी',
          mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
          narrator: 'शिवशाहीर भोसले',
          duration: '7m 40s',
        ),
      ],
      visualTimeline: [
        TimelineItem(
          year: '1674 CE',
          title: 'Coronation of Chhatrapati Shivaji Maharaj',
          imageUrl:
              'https://i.pinimg.com/736x/52/85/9b/52859b4f3dc06bbfeb6183951cd8bfab.jpg',
          description:
              'Chhatrapati Shivaji Maharaj is formally crowned as the Chhatrapati of the Maratha Kingdom.',
        ),
      ],
      nearbyPlaces: [],
      coRelatedPlaces: [],
    ),
    Place(
      id: 'panchavati',
      name: 'Panchavati & Sita Gufa',
      category: 'ancient',
      tag: 'Ramayana Sacred Heritage',
      rating: 4.7,
      reviews: 1420,
      location: 'Godavari Banks, Nashik, Maharashtra',
      image:
          'https://s7ap1.scene7.com/is/image/incredibleindia/panchvati-nashik-maharashtra-2-attr-hero?qlt=82&ts=1726669940050',
      description:
          'Sacred grove named after the five auspicious banyan trees where Lord Rama, Sita, and Lakshmana stayed during their exile.',
      detailedDescription:
          'Located on the peaceful banks of River Godavari, Panchavati includes Ram Kund, Kalaram Temple built with black stone, and the Sita Gufa cave.',
      bestTime: 'Sep - Mar',
      host: 'Nashik Municipal Corporation',
      highlights: [
        '5 Sacred Banyan Trees (Panch Vata)',
        'Sita Gufa Cave',
        'Kalaram Temple Architecture',
        'Ram Kund Holy Bath'
      ],
      isTopTrending: true,
      hiddenHistory:
          'It is the site where Lakshmana built a hut for Lord Rama and Sita, and where the pivotal event of Surpanakha occurred in the epic Ramayana.',
      qrCodeValue: 'SIH_QR_PANCHAVATI_104',
      latitude: 20.0076,
      longitude: 73.7958,
      historyContent: [
        HistoryContent(
          language: 'English',
          mediaType: 'audio',
          title: 'Panchavati in the Ramayana Epoch',
          mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
          narrator: 'Dr. Radhakrishnan',
          duration: '5m 05s',
        ),
      ],
      visualTimeline: [],
      nearbyPlaces: [],
      coRelatedPlaces: [],
    ),
    Place(
      id: 'saptashrungi_devi',
      name: 'Saptashrungi Devi Gad',
      category: 'ancient',
      tag: '51 Sacred Shakti Peethas',
      rating: 4.9,
      reviews: 1870,
      location: 'Vani, Nashik, Maharashtra',
      image:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsIIxJc-GaA0zwVgCuXW8pJZk7p4b8TMrRjBpmSvgq3g&s=10',
      description:
          'One of the three and a half Shakti Peethas of Maharashtra, perched dramatically amidst seven mountain peaks surrounded by 108 water ponds.',
      detailedDescription:
          'The colossal 8-foot-tall idol of the Goddess is carved directly out of the sheer cliff face, possessing eighteen arms holding celestial weapons.',
      bestTime: 'Aug - Apr',
      host: 'Saptashrungi Temple Trust',
      highlights: [
        '3.5 Shakti Peethas of Maharashtra',
        'Seven Cliff Peaks Panorama',
        '108 Natural Kunds (Ponds)',
        'Funicular Cable Car Ride'
      ],
      isTopTrending: true,
      hiddenHistory:
          'Sage Markandeya wrote the sacred Devi Mahatmya on this peak, where the Goddess vanquished the demon Mahishasura.',
      qrCodeValue: 'SIH_QR_SAPTASHRUNGI_105',
      latitude: 20.3956,
      longitude: 73.9048,
      historyContent: [
        HistoryContent(
          language: 'English',
          mediaType: 'audio',
          title: 'The Legends of Seven Peaks and Shakti Peetha',
          mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
          narrator: 'Acharya Shastri',
          duration: '4m 50s',
        ),
      ],
      visualTimeline: [],
      nearbyPlaces: [],
      coRelatedPlaces: [],
    ),
  ];
}
