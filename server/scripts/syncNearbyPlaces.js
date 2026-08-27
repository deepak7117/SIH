import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Place from '../models/Place.js';

dotenv.config();

const placesData = [
  {
    name: 'Trimbakeshwar Shiva Temple',
    category: 'ancient',
    tag: 'Jyotirlinga & Ancient Architecture',
    rating: 4.9,
    reviews: 1240,
    location: 'Trimbak, Nashik',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkVPM0TI9q-WGsejNuAsHYX4djfx4FnRPhgtRdJ2L4QQ&s=10',
    description: 'One of the twelve sacred Jyotirlingas, nestled at the foothills of Brahmagiri mountain, famous for origin of River Godavari and black stone architecture built by Peshwa Balaji Baji Rao.',
    bestTime: 'Oct - Mar',
    host: 'Nashik Heritage Guides',
    highlights: ['12 Jyotirlingas', 'Brahmagiri Hill Origin', 'Kushavarta Kund', 'Hemadpanthi Architecture'],
    isTopTrending: true,
    hiddenHistory: 'Origin point of sacred River Godavari where Sage Gautama worshipped Lord Shiva to atone for sins, giving birth to the sacred Kushavarta Kund.',
    historyContent: [
      { language: 'English', mediaType: 'audio', title: 'Origin of River Godavari & Kushavarta Story', narrator: 'Pt. Vidyadhar Shastri', duration: '4m 30s' },
      { language: 'Marathi', mediaType: 'audio', title: 'त्र्यंबकेश्वर ज्योतिर्लिंग व कुशावर्त महात्म्य', narrator: 'आचार्य जोशी', duration: '5m 10s' },
      { language: 'Hindi', mediaType: 'audio', title: 'श्री त्र्यंबकेश्वर ज्योतिर्लिंग इतिहास व कथा', narrator: 'पं. रमेश शर्मा', duration: '4m 45s' }
    ],
    visualTimeline: [
      { year: '1200 BCE', title: 'Sage Gautama Penance Era', imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80', description: 'Sage Gautama performed intense tapasya on Brahmagiri Hill bringing the sacred Godavari River to earth.' },
      { year: '1755 CE', title: 'Peshwa Balaji Baji Rao Reconstruction', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkVPM0TI9q-WGsejNuAsHYX4djfx4FnRPhgtRdJ2L4QQ&s=10', description: 'Peshwa Nana Saheb reconstructed the entire temple using intricately carved black basalt stone architecture.' },
      { year: '1954 CE', title: 'Modern Conservation & Gold Kalash', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80', description: 'National heritage conservation and restoration of the sacred three-faced Shiva Lingam adorned with gems.' }
    ],
    nearbyPlaces: [
      { name: 'Kushavarta Kund', distance: '0.4 km', category: 'Holy Sacred Reservoir', imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80' },
      { name: 'Brahmagiri Hill & Godavari Origin', distance: '1.8 km', category: 'Scenic Hill Trek & Temple', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80' },
      { name: 'Sant Nivruttinath Maharaj Samadhi Temple', distance: '1.2 km', category: 'Warkari Spiritual Shrine', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80' },
      { name: 'Anjaneri Hill (Hanuman Janmasthan)', distance: '8.5 km', category: 'Heritage Fort & Trek', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHI57Cle2igx_xpZvVekmKPG1YQWRIh6jRbsCeiwo1Nw&s=10' }
    ],
    coRelatedPlaces: [
      { name: 'Grishneshwar Jyotirlinga (Ellora)', circuit: '12 Jyotirlinga Heritage Circuit', connection: 'Jyotirlinga circuit built with black stone architecture by Maratha rulers' },
      { name: 'Bhimashankar Jyotirlinga', circuit: 'Maharashtra Jyotirlinga Yatra', connection: 'Sahyadri mountain holy Shiva shrines connected through ancient pilgrimage paths' }
    ]
  },
  {
    name: 'Saptashrungi Devi Gad (Vani)',
    category: 'ancient',
    tag: 'Holy Shakti Peetha & 7 Hills',
    rating: 4.9,
    reviews: 1820,
    location: 'Nanduri, Vani, Nashik',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsIIxJc-GaA0zwVgCuXW8pJZk7p4b8TMrRjBpmSvgq3g&s=10',
    description: 'A revered Shakti Peetha surrounded by seven mountain peaks (Saptashringa). Home to the 10-foot tall idol of Goddess Saptashrungi Nivasini with 18 arms holding divine weapons.',
    bestTime: 'Sept - April',
    host: 'Saptashrungi Shrine Board',
    highlights: ['51 Shakti Peethas', 'Funicular Trolley Ride', '7 Mountain Pinnacles', 'Chaitra Navratri Festival'],
    isTopTrending: true,
    hiddenHistory: 'The supreme Goddess slew the buffalo demon Mahishasura on these 7 hills after he escaped as a buffalo.',
    historyContent: [
      { language: 'Marathi', mediaType: 'audio', title: 'सप्तशृंगी देवी महात्म्य व अठराभुजा अवतार कथा', narrator: 'श्री विवेक कुलकर्णी', duration: '6m 15s' },
      { language: 'Hindi', mediaType: 'audio', title: 'मां सप्तशृंगी निवासिनी शक्तिपीठ महिमा', narrator: 'सुनीता दीक्षित', duration: '5m 30s' }
    ],
    visualTimeline: [
      { year: '500 BCE', title: 'Saptashringa Vedic Pilgrimage', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', description: 'Ancient sages worship the self-manifested (Swayambhu) 10-foot tall rock idol amidst seven mountain peaks.' },
      { year: '1738 CE', title: 'Peshwa Chhatrapati Stone Steps Construction', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsIIxJc-GaA0zwVgCuXW8pJZk7p4b8TMrRjBpmSvgq3g&s=10', description: 'Subhedar of Maratha Empire carved 510 stone steps into the vertical cliff face leading to the holy sanctum.' },
      { year: '2020 CE', title: 'High-Speed Funicular Trolley Commissioning', imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80', description: 'State-of-the-art funicular cliff trolley system installed to transport pilgrims to the shrine in under 3 minutes.' }
    ],
    nearbyPlaces: [
      { name: 'Markandeya Hill & Rishi Ashram', distance: '4.5 km', category: 'Ancient Penance Cave & Peak', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
      { name: 'Funicular Ropeway Trolley Base', distance: '0.2 km', category: 'Hill Transport & Viewpoint', imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80' },
      { name: 'Shivalaya Teerth & Kund', distance: '1.0 km', category: 'Sacred Water Pool', imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80' },
      { name: 'Ahivant Fort (Historical Maratha Fort)', distance: '12.0 km', category: 'Historical Twin Fort Trek', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80' }
    ],
    coRelatedPlaces: [
      { name: 'Mahalakshmi Temple (Kolhapur)', circuit: '51 Sacred Shakti Peethas', connection: 'Revered Shakti Peetha circuit across Maharashtra representing divine feminine power' },
      { name: 'Tuljapur Bhavani Temple', circuit: 'Maharashtra Sade Teen Shaktipeeth', connection: 'Patron deity of Chhatrapati Shivaji Maharaj and sacred mother goddess circuits' }
    ]
  },
  {
    name: 'Harihar Fort (Harishgad)',
    category: 'trek',
    tag: 'Iconic 80° Vertical Rock-cut Stairs',
    rating: 4.9,
    reviews: 2100,
    location: 'Harshewadi, Nashik',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrOUoexMHwYG_eIBof8ajJH2y9P6Io460q8_WczQah3g&s=10',
    description: 'Renowned worldwide for its thrilling nearly 80-degree vertical stone-cut stairs carved directly into the prism rock face, offering panoramic views of the Sahyadris.',
    bestTime: 'Oct - Feb',
    host: 'Sahyadri Trekkers Club',
    highlights: ['Vertical Rock Steps', '360° Sahyadri Vista', 'Storage Cisterns', 'Historical Bastions'],
    isTopTrending: true,
    hiddenHistory: 'Served as an impregnable military watchpost under Yadava dynasty and later captured by the Marathas in 1636.',
    historyContent: [
      { language: 'English', mediaType: 'audio', title: 'Architecture of 80 Degree Vertical Rock Steps', narrator: 'Trekkers Guild Audio', duration: '3m 45s' },
      { language: 'Marathi', mediaType: 'audio', title: 'हरिहर किल्ल्याचा दुर्गम इतिहास व दगडी पायऱ्या', narrator: 'दुर्गप्रेमी ओंकार', duration: '4m 20s' }
    ],
    visualTimeline: [
      { year: '1200 CE', title: 'Yadava Dynasty Fortress Construction', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80', description: 'Yadava kings carved the iconic notch-step staircase into solid basalt rock to defend the trade route.' },
      { year: '1636 CE', title: 'Shahaji Maharaj & Maratha Era', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrOUoexMHwYG_eIBof8ajJH2y9P6Io460q8_WczQah3g&s=10', description: 'Fort captured and reinforced by Maratha forces to safeguard northern Sahyadri border garrisons.' },
      { year: '1818 CE', title: 'British Capture & Modern Trek Era', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', description: 'British Captain Briggs took possession; now world-famous as one of the most thrilling climbs in Asia.' }
    ],
    nearbyPlaces: [
      { name: 'Trimbakeshwar Shiva Temple', distance: '13.0 km', category: '12 Jyotirlinga Shrine', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkVPM0TI9q-WGsejNuAsHYX4djfx4FnRPhgtRdJ2L4QQ&s=10' },
      { name: 'Harshewadi Camping Grounds', distance: '1.5 km', category: 'Base Village & Camp Site', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
      { name: 'Basgad / Bhaskargad Fort', distance: '7.5 km', category: 'Historical Sahyadri Fort', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80' },
      { name: 'Brahma Hill Vista', distance: '4.0 km', category: 'Panoramic Mountain Ridge', imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80' }
    ],
    coRelatedPlaces: [
      { name: 'Salher Fort', circuit: 'Highest Forts of Sahyadri', connection: 'Strategic Maratha defense watchpoints built to withstand long sieges' },
      { name: 'Torna Fort (Prachandagad)', circuit: 'Maratha Hill Fortresses', connection: 'First fort captured by Chhatrapati Shivaji Maharaj sharing rock-cut defenses' }
    ]
  },
  {
    name: 'Pandavleni Caves (Trirashmi)',
    category: 'heritage',
    tag: '2nd Century BCE Rock-cut Caves',
    rating: 4.7,
    reviews: 890,
    location: 'Trirashmi Hills, Nashik',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuKJqsW8QF4pUXPvEEdXKNWK05GSXUR5Qrq1ZY8sXe_Q&s=10',
    description: 'A group of 24 rock-cut caves carved between the 2nd century BCE and 5th century CE, depicting Hinayana Buddhist architecture, intricate viharas, and inscriptions.',
    bestTime: 'July - Feb',
    host: 'Sahyadri History Guild',
    highlights: ['Ancient Water Cisterns', 'Panoramic City View', 'Intricate Carvings', 'Buddhist Stupas'],
    isTopTrending: true,
    hiddenHistory: 'Inscriptions mention donations by Satavahana Kings Gautamiputra Satakarni and Kshatrapa ruler Nahapana.',
    historyContent: [
      { language: 'English', mediaType: 'audio', title: 'Satavahana Inscriptions & Cave No. 3, 10, 18 Viharas', narrator: 'Dr. Arundhati Joshi', duration: '5m 15s' },
      { language: 'Marathi', mediaType: 'audio', title: 'पांडवलेणी बौद्ध लेणींचा इतिहास व सातवाहन शिलालेख', narrator: 'प्रा. कुलकर्णी', duration: '4m 50s' }
    ],
    visualTimeline: [
      { year: '150 BCE', title: 'Hinayana Buddhist Monks Settlement', imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80', description: 'Buddhist monks carved rock cisterns and viharas on Trirashmi hill as monsoon retreat (Vassa).' },
      { year: '130 CE', title: 'Gautamiputra Satakarni Royal Patronage', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuKJqsW8QF4pUXPvEEdXKNWK05GSXUR5Qrq1ZY8sXe_Q&s=10', description: 'Queen Mother Gautami Balashri inscribed the famous Nashik Prasasti chronicling royal Satavahana victories.' },
      { year: '1860 CE', title: 'ASI Archaeological Survey & Preservation', imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80', description: 'Archaeological Survey of India documented all 24 caves, preserving the ancient Chaitya and stupas.' }
    ],
    nearbyPlaces: [
      { name: 'Dadasaheb Phalke Smarak', distance: '0.8 km', category: 'Memorial Garden & Film Museum', imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=400&q=80' },
      { name: 'Buddha Smarak & Park', distance: '0.5 km', category: 'Peace Memorial Park', imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80' },
      { name: 'Shubham Water World', distance: '11.0 km', category: 'Amusement & Recreation', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80' },
      { name: 'City Centre Mall Nashik', distance: '6.2 km', category: 'Shopping & Dining Hub', imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=400&q=80' }
    ],
    coRelatedPlaces: [
      { name: 'Ajanta & Ellora Caves', circuit: 'Ancient Maharashtra Rock-Cut Cave Circuit', connection: 'Contemporary Satavahana and Rashtrakuta rock architecture along the ancient Dakshinapatha trade route' },
      { name: 'Karla & Bhaja Caves (Lonavala)', circuit: 'Buddhist Chaitya Circuit', connection: 'Early Hinayana wooden-style stone chaityas with similar Satavahana merchant donor inscriptions' }
    ]
  },
  {
    name: 'Anjaneri Fort & Hills',
    category: 'trek',
    tag: 'Birthplace of Lord Hanuman & Trek',
    rating: 4.8,
    reviews: 950,
    location: 'Trimbak Road, Nashik',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHI57Cle2igx_xpZvVekmKPG1YQWRIh6jRbsCeiwo1Nw&s=10',
    description: 'Believed to be the holy birthplace of Lord Hanuman. A scenic trek through Sahyadri ranges with breathtaking cliff views, Jain temples, and reverse waterfall phenomenon in monsoons.',
    bestTime: 'June - Jan',
    host: 'Adventure Nashik Hosts',
    highlights: ['Hanuman Temple at Summit', 'Scenic Sahyadri Trek', 'Monsoon Waterfalls', 'Jain Cave Temples'],
    isTopTrending: true,
    hiddenHistory: 'Named after Goddess Anjani (mother of Hanuman), hosting over 108 Jain temples and caves at the plateau.',
    historyContent: [
      { language: 'English', mediaType: 'audio', title: 'Anjaneri Holy Summit & 108 Jain Temples History', narrator: 'Heritage Walks Audio', duration: '4m 10s' },
      { language: 'Hindi', mediaType: 'audio', title: 'हनुमान जन्मस्थान अंजनेरी पर्वत की कथा', narrator: 'पं. शास्त्री', duration: '5m 05s' }
    ],
    visualTimeline: [
      { year: 'Treta Yuga', title: 'Birthplace of Lord Hanuman', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80', description: 'Revered in Ramayana lore where Mata Anjani meditated and gave birth to Lord Hanuman on the mountain peak.' },
      { year: '1100 CE', title: 'Seuna Yadava Jain Temples Construction', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHI57Cle2igx_xpZvVekmKPG1YQWRIh6jRbsCeiwo1Nw&s=10', description: 'Yadava rulers built a cluster of beautifully sculpted Digambara Jain cave temples on the upper plateau.' },
      { year: '2022 CE', title: 'Declared Conservation Reserve', imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=600&q=80', description: 'Designated as a biological conservation reserve to protect endemic flora and reverse waterfall habitats.' }
    ],
    nearbyPlaces: [
      { name: 'Coin Museum (IIRNS)', distance: '2.5 km', category: 'Numismatics Heritage Museum', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80' },
      { name: 'Trimbakeshwar Shiva Temple', distance: '7.0 km', category: 'Jyotirlinga Temple Complex', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkVPM0TI9q-WGsejNuAsHYX4djfx4FnRPhgtRdJ2L4QQ&s=10' },
      { name: 'Pahine Waterfall Point', distance: '9.0 km', category: 'Monsoon Eco Tourism', imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=400&q=80' },
      { name: 'Gargoti Mineral Museum', distance: '14.5 km', category: 'Natural Zeolite Crystal Gemstones', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80' }
    ],
    coRelatedPlaces: [
      { name: 'Hampi (Kishkindha)', circuit: 'Ramayana Pilgrimage Circuit', connection: 'Sacred Monkey Kingdom of Sugriva and Hanuman connected via ancient Dandakaranya routes' },
      { name: 'Kishkindha Anjanadri Hill', circuit: 'Hanuman Sacred Shrines', connection: 'Sister pilgrimage sites associated with the divine childhood of Lord Hanuman' }
    ]
  },
  {
    name: 'Panchavati & Sita Gufa',
    category: 'ancient',
    tag: 'Ramayana Era Sacred Heritage',
    rating: 4.8,
    reviews: 1530,
    location: 'Godavari Riverbank, Nashik',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq3BHPcI0cUDEThi8zJMwkzO5qZS3Z2fePtJeTAZODkw&s=10',
    description: 'The legendary place where Lord Rama, Sita, and Lakshmana stayed during their exile. Includes the sacred 5 Banyan trees, Kalaram Temple, and holy Ramkund ghat.',
    bestTime: 'Year-round',
    host: 'Panchavati Pilgrim Trust',
    highlights: ['5 Sacred Banyan Trees', 'Kalaram Temple', 'Ramkund Ghat', 'Sita Gumpha'],
    isTopTrending: true,
    hiddenHistory: 'Site of Kumbh Mela every 12 years where holy dip in Ramkund is said to grant salvation (Moksha).',
    historyContent: [
      { language: 'English', mediaType: 'audio', title: 'Panchavati Exile Legend & Godavari Aarti Traditions', narrator: 'Pilgrim Trust Guides', duration: '4m 45s' },
      { language: 'Hindi', mediaType: 'audio', title: 'पंचवटी सीता गुफा व कालाराम मंदिर इतिहास', narrator: 'पं. रामानंद मिश्रा', duration: '5m 20s' }
    ],
    visualTimeline: [
      { year: 'Treta Yuga', title: 'Lord Rama 14-Year Exile Stay', imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80', description: 'Lord Rama built a hut under 5 Banyan trees (Panchavati) during his exile with Sita and Lakshmana.' },
      { year: '1782 CE', title: 'Sardar Odhekar Kalaram Temple Construction', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq3BHPcI0cUDEThi8zJMwkzO5qZS3Z2fePtJeTAZODkw&s=10', description: 'Built by Sardar Rangrao Odhekar using black stone retrieved from Ramshej fort, costing 23 lakh rupees.' },
      { year: '1930 CE', title: 'Dr. B.R. Ambedkar Kalaram Satyagraha', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80', description: 'Historical non-violent civil rights movement led by Dr. B.R. Ambedkar for equal entry into temples.' }
    ],
    nearbyPlaces: [
      { name: 'Kalaram Mandir (Black Stone Architecture)', distance: '0.3 km', category: 'Historic Ram Temple', imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80' },
      { name: 'Ramkund Godavari Ghat', distance: '0.4 km', category: 'Sacred Bathing Ghat & Aarti', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80' },
      { name: 'Sundarnarayan Temple', distance: '0.6 km', category: 'Sun Alignment Temple Architecture', imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80' },
      { name: 'Muktidham Temple Complex', distance: '8.0 km', category: 'Makrana White Marble Shrine', imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=400&q=80' }
    ],
    coRelatedPlaces: [
      { name: 'Ayodhya Ram Janmabhoomi', circuit: 'Holy Ramayana Circuit', connection: 'Path traversed during the 14-year exile connecting Northern and Southern sacred heritage trails' },
      { name: 'Rameshwaram Ramanathaswamy Temple', circuit: 'Ramayana Mahatirth Circuit', connection: 'Pilgrimage route where Lord Rama worshipped Lord Shiva after the exile' }
    ]
  },
  {
    name: 'Gangapur Backwaters & Grasslands',
    category: 'wildlife',
    tag: 'Migratory Birds & Nature Haven',
    rating: 4.6,
    reviews: 620,
    location: 'Gangapur Dam, Nashik',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    description: 'Expansive serene waters and grasslands attracting flamingos, painted storks, kingfishers, and diverse flora. Perfect for tranquil sunsets and bird watching expeditions.',
    bestTime: 'Nov - Mar',
    host: 'Nashik Eco Tourism',
    highlights: ['Bird Watching', 'Sunset Viewpoint', 'Water Sports Complex', 'Vineyard Landscapes'],
    isTopTrending: true,
    hiddenHistory: 'Built in 1954 across River Godavari, it is an earthen dam creating one of Maharashtra’s premier bird sanctuaries.',
    historyContent: [
      { language: 'English', mediaType: 'audio', title: 'Godavari Basin Eco-System & Migratory Birds Guide', narrator: 'Eco Wildlife Guides', duration: '3m 50s' }
    ],
    visualTimeline: [
      { year: '1949 CE', title: 'Earthen Dam Engineering Begins', imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80', description: 'Post-independence engineering milestone creating Maharashtra’s first major earthen reservoir across Godavari.' },
      { year: '2000 CE', title: 'Wine Capital Vineyard Boom', imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=80', description: 'Surrounding fertile valleys developed into India’s premier wine country with lakeside tasting rooms.' },
      { year: '2021 CE', title: 'MTDC International Boat Club & Water Sports', imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', description: 'Government developed modern eco-tourism jetty, kayaking, speedboat facilities, and floating restaurants.' }
    ],
    nearbyPlaces: [
      { name: 'Sula Vineyards & Tasting Cellars', distance: '3.2 km', category: 'Wine Tourism & Vineyard Tour', imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=400&q=80' },
      { name: 'York Winery & Tasting Room', distance: '3.8 km', category: 'Lakeside Vineyard & Sunset Lounge', imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=400&q=80' },
      { name: 'Nashik Boat Club (MTDC)', distance: '1.2 km', category: 'Water Sports, Jet Ski & Kayaking', imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80' },
      { name: 'Someshwar Temple & Waterfall', distance: '5.5 km', category: 'Godavari River Shiva Shrine', imageUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=400&q=80' }
    ],
    coRelatedPlaces: [
      { name: 'Nandur Madhmeshwar Bird Sanctuary', circuit: 'Maharashtra Wetlands & Birding Circuit', connection: 'Godavari backwaters migratory bird sanctuary known as the Bharatpur of Maharashtra' },
      { name: 'Kashyapi & Gautami Dam Backwaters', circuit: 'Nashik Lake District Circuit', connection: 'Chain of serene valley reservoirs framing the Western Ghats mountain backdrop' }
    ]
  }
];

const syncDatabaseDirect = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas!');

    // First, clear and re-populate all 7 places to ensure 100% clean schema with all modules populated
    console.log('Refreshing places in MongoDB Atlas with complete Google Data...');
    await Place.deleteMany({});
    await Place.insertMany(placesData);

    const count = await Place.countDocuments();
    console.log(`Successfully updated and saved all ${count} destinations with full Google Nearby Places, Audio, Timeline, and Co-Related Circuits!`);
    process.exit(0);
  } catch (err) {
    console.error('Error syncing:', err.message);
    process.exit(1);
  }
};

syncDatabaseDirect();
