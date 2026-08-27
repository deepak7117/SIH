import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Place from '../models/Place.js';

dotenv.config();

const detailedPlaces = [
  {
    name: 'Trimbakeshwar Shiva Temple',
    category: 'ancient',
    tag: 'Jyotirlinga & Ancient Architecture',
    rating: 4.9,
    reviews: 1240,
    location: 'Trimbak, Nashik',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkVPM0TI9q-WGsejNuAsHYX4djfx4FnRPhgtRdJ2L4QQ&s=10',
    description: 'One of the twelve sacred Jyotirlingas, nestled at the foothills of Brahmagiri mountain, famous for origin of River Godavari and black stone architecture built by Peshwa Balaji Baji Rao.',
    detailedDescription: `1. Geographical Location & Mountain Setting:
Trimbakeshwar is situated approximately 28 kilometers from Nashik city at the foot of the picturesque Brahmagiri and Gangadwar hills in Maharashtra.

2. Unique Three-Faced Jyotirlinga Iconography:
Unlike other Jyotirlinga shrines which feature a single lingam representing Lord Shiva, the sanctum at Trimbakeshwar houses a three-faced lingam embodying the holy trinity: Lord Brahma (the Creator), Lord Vishnu (the Preserver), and Lord Shiva (the Destroyer).

3. Mythological Genesis & Sage Gautama Penance:
According to Vedic lore in the Shiva Purana, Sage Gautama performed rigorous penance (tapasya) on the peaks of Brahmagiri to propitiate Lord Shiva after unintentional sin involving a cow.

4. Descent of Dakshin Ganga (Godavari):
Pleased by Sage Gautama's devotion, Lord Shiva released the celestial Ganga River upon the Brahmagiri ranges, manifesting as the sacred Godavari River, revered across South India as the Dakshin Ganga.

5. Sacred Kushavarta Teerth & Kumbh Mela Rituals:
The river waters flow down to the sanctum and emerge into Kushavarta Kund, a stone-embanked sacred reservoir where millions of pilgrims, ascetics, and sadhus take a holy dip during the Maha Kumbh Mela every twelve years.

6. Historical Architectural Commissioning:
The monumental black basalt temple seen today was commissioned in 1755 CE by Peshwa Balaji Baji Rao (Nana Saheb) of the Maratha Empire and took 31 years of master craftsmanship to complete.

7. Hemadpanthi Basalt Stone Craftsmanship:
Constructed entirely in the classic Hemadpanthi style using interlocked black basalt stone slabs, the temple structure rises with an imposing shikhara, carved pillared sabha mandap, and intricate floral and divine carvings.

8. The Divine Gem-Encrusted Golden Crown (Mukut):
The temple preserves a priceless historic gold crown encrusted with diamonds, rubies, and emeralds, believed to date back to the Pandava era, displayed exclusively on Mondays during evening aarti.

9. Spiritual Pilgrimage & Ritual Significance:
Trimbakeshwar is a world-renowned destination for specialized Vedic astrological and ancestral rituals, notably Narayan Nagbali, Kalsarpa Shanti, and Tripindi Shraddha performed along the sacred banks of Kushavarta.

10. Visitor Guide & Temple Etiquette:
The temple gates open at 5:30 AM with Mangala Aarti and remain open until 9:00 PM. Pilgrims can access special VIP darshan passes or general queues, with strict traditional attire dress codes enforced inside the inner sanctum (Garbhagriha).`,
    bestTime: 'Oct - Mar',
    host: 'Nashik Heritage Guides',
    highlights: ['12 Jyotirlingas', 'Brahmagiri Hill Origin', 'Kushavarta Kund', 'Hemadpanthi Architecture'],
    isTopTrending: true,
    hiddenHistory: 'Origin point of sacred River Godavari where Sage Gautama worshipped Lord Shiva to atone for sins, giving birth to the sacred Kushavarta Kund.',
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
    detailedDescription: `1. Geographical Eminence & Seven Peaks:
Perched atop a cliff 1,230 meters above sea level in the Kalwan taluka of Nashik district, Saptashrungi Gad is encircled by seven majestic Sahyadri mountain pinnacles, earning the sanctuary its name 'Saptashringa' (Abode of Seven Peaks).

2. Revered Shakti Peetha & Divine Feminine Power:
The shrine is universally recognized as one of the prominent Shakti Peethas and forms an essential part of the auspicious 'Three and a Half Shakti Peethas' (Sade Teen Shaktipeeth) of Maharashtra.

3. Colossal Eighteen-Armed Swayambhu Deity:
Carved into the sheer vertical cliff rock is the self-manifested (Swayambhu) 10-foot tall idol of Goddess Saptashrungi Nivasini, sculpted with eighteen divine arms holding weapons bestowed by the devas to vanquish evil forces.

4. Mythological Victory over Mahishasura:
According to the Markandeya Purana and Devi Mahatmya, this holy peak is the exact battlefield where the supreme Goddess defeated and slew the buffalo demon Mahishasura after fierce celestial combat.

5. Sage Markandeya Penance & Rishi Ashram:
The sage Markandeya chose the opposite hill peak to recite hymns and meditate upon the Mother Goddess, composing holy verses of the Chandi Path in this sacred mountain environment.

6. Historical Stone Steps by Maratha Royalty:
In 1738 CE, Maratha Subhedar carved 510 stone steps directly into the precipitous rock face, allowing devotees to climb up from the base village of Nanduri to the cliffside sanctum.

7. High-Speed Modern Funicular Trolley System:
To assist senior citizens and pilgrims with mobility challenges, a modern dual-track cliff funicular trolley operates on a steep incline, ascending the cliff in less than 3 minutes.

8. Vibrant Chaitra & Ashvin Navratri Festivals:
The hill shrine hosts massive annual Navratri fairs attracting hundreds of thousands of warkaris and pilgrims who walk on foot bearing flags, traditional coconuts, and sindoor offerings.

9. Panoramic Sahyadri Valley Views:
The temple circumambulation path (pradakshina marg) provides 360-degree panoramic views of deep valleys, surrounding waterfalls in monsoon, and lush agricultural plains of the Girna and Markandeya basins.

10. Pilgrim Amenities & Shrine Logistics:
Open daily from 5:00 AM to 9:30 PM with continuous Mahaprasad dining facilities, modern guest houses at Nanduri base, and dedicated parking zones operated by the Saptashrungi Shrine Trust.`,
    bestTime: 'Sept - April',
    host: 'Saptashrungi Shrine Board',
    highlights: ['51 Shakti Peethas', 'Funicular Trolley Ride', '7 Mountain Pinnacles', 'Chaitra Navratri Festival'],
    isTopTrending: true,
    hiddenHistory: 'The supreme Goddess slew the buffalo demon Mahishasura on these 7 hills after he escaped as a buffalo.',
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
    detailedDescription: `1. Geographical Location & Sahyadri Ridge:
Harihar Fort, also known historically as Harishgad, stands at an altitude of 3,676 feet (1,120 m) in the Trimbak range of the Western Ghats, roughly 40 kilometers southwest of Nashik.

2. Iconic 80-Degree Rock-Cut Staircase:
The fort is globally celebrated among mountaineers for its gravity-defying, nearly 80-degree near-vertical staircase chiselled straight into a monolithic volcanic basalt scarp.

3. Unique Notch-Handgrip Engineering:
Every individual stone step features hollowed-out handhold notches on both flanks, ingeniously designed by ancient military architects so ascending warriors could climb securely even under adverse conditions.

4. Yadava Dynasty Fortification & Strategic Trade Route:
Constructed during the Seuna (Yadava) dynasty in the 12th century, the fortress guarded the vital Gondha ghat trade corridor connecting the Deccan plateau to the Konkan coastal ports.

5. Maratha Military Takeover (1636 CE):
General Shahaji Bhosale along with regional Maratha garrisons captured and fortified the citadel, later becoming a strategic defense bastion during the reign of Chhatrapati Shivaji Maharaj.

6. British Conquest & Survey (1818 CE):
Following the fall of Trimbak fort during the Third Anglo-Maratha War, Captain Briggs surrendered the garrison in 1818, documenting its formidable and impregnable natural ramparts.

7. Summit Plateaus, Shiva Shrine & Water Cisterns:
The expansive summit plateau houses an ancient Lord Shiva lingam shrine, a small pond called Secret Talav, and over a dozen rock-cut potable water storage cisterns that maintain cool water year-round.

8. Twin Ascent Routes (Harshewadi & Nirgudpada):
Trekkers can access the trail via the village of Harshewadi (closer and scenic) or Nirgudpada base, winding through dense forest trails, ridge walks, and plateau campsites before tackling the main vertical staircase.

9. Sahyadri Range Panoramic Vistas:
From the highest bastion, climbers enjoy unobstructed 360-degree views of Brahmagiri, Basgad (Bhaskargad), Anjaneri, and Utwad peaks rising above misty clouds in monsoon and winter.

10. Safety Recommendations & Trek Logistics:
Best visited between October and February. Trekkers should wear footwear with aggressive rubber grip, carry hydration packs, avoid ascending during torrential downpours, and strictly adhere to single-file climbing protocols.`,
    bestTime: 'Oct - Feb',
    host: 'Sahyadri Trekkers Club',
    highlights: ['Vertical Rock Steps', '360° Sahyadri Vista', 'Storage Cisterns', 'Historical Bastions'],
    isTopTrending: true,
    hiddenHistory: 'Served as an impregnable military watchpost under Yadava dynasty and later captured by the Marathas in 1636.',
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
    detailedDescription: `1. Geographic Setting & Trirashmi Mountain:
Located approximately 8 kilometers south of central Nashik on the historic Trirashmi hill, Pandavleni comprises a group of 24 remarkable rock-cut Buddhist caves facing northeast.

2. Chronological Antiquity (2nd Century BCE to 5th Century CE):
Excavated over six centuries spanning the Hinayana and later Mahayana Buddhist traditions, these caves represent some of the earliest monastic complexes in Western India.

3. Royal Satavahana & Western Kshatrapa Inscriptions:
The caves house over 25 crucial Brahmi epigraphs and inscriptions recording royal grants and merchant endowments made by Satavahana emperor Gautamiputra Satakarni, Queen Balashri, and Western Kshatrapa ruler Nahapana.

4. Architectural Masterpiece - Cave No. 3 (Gautamiputra Vihara):
Cave 3 is a grand monastery (vihara) featuring a large central pillared pillared courtyard, six ornate entryway pillars carved with elephants and lions, and eighteen monk residential cells.

5. Sacred Chaityagriha - Cave No. 18:
Cave 18 is an early Hinayana prayer hall (chaitya) exhibiting a classical wooden-style vaulted arched stone ceiling, intricate chaitya window facade, and a central monolithic stupa for veneration.

6. Ancient Water Harvesting Cistern Engineering:
Monks engineered sophisticated rainwater harvesting cisterns cut into the basalt rock beds, ensuring clean natural drinking water during harsh dry summer months.

7. Trade Route Nexus on Ancient Dakshinapatha:
Situated along the great ancient Dakshinapatha trade artery, the monastery provided shelter and meditation sanctuaries for traveling Buddhist monks, merchants, and caravan traders.

8. Modern Misnomer & Mahabharata Legend:
Though historically authentic Buddhist monastic viharas, local folklore colloquially named them 'Pandavleni', associating their monolithic construction with the legendary Pandavas of the Mahabharata.

9. Panoramic Nashik City Viewpoint:
A well-maintained flight of roughly 250 stone steps leads visitors up to the cave terrace, offering sweeping vistas of Nashik city, lush farms, and surrounding mountain silhouettes.

10. Visitor Logistics & Museum Complex:
Open daily from 8:00 AM to 6:00 PM under Archaeological Survey of India (ASI) heritage preservation, with the Dadasaheb Phalke Smarak and botanical gardens situated right at the base.`,
    bestTime: 'July - Feb',
    host: 'Sahyadri History Guild',
    highlights: ['Ancient Water Cisterns', 'Panoramic City View', 'Intricate Carvings', 'Buddhist Stupas'],
    isTopTrending: true,
    hiddenHistory: 'Inscriptions mention donations by Satavahana Kings Gautamiputra Satakarni and Kshatrapa ruler Nahapana.',
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
    detailedDescription: `1. Divine Birthplace Legend of Lord Hanuman:
Anjaneri hill is revered across India as the sacred birthplace of Lord Hanuman, named after his mother Mata Anjani, who performed intense penance here to receive the blessing of Lord Shiva.

2. Topographical Grandeur & Plateau Ecosystem:
Rising to an elevation of 4,264 feet (1,300 meters) between Nashik and Trimbak, Anjaneri features a massive two-tiered plateau tableland hosting unique endemic wildflower meadows.

3. Ancient Seuna Yadava Jain Caves & Temples:
The base and middle tiers of the hill preserve a cluster of over 108 historical Digambara Jain rock temples dating back to the 11th and 12th century Yadava dynasty, adorned with intricate Tirthankara relief carvings.

4. Mata Anjani & Child Hanuman Summit Shrine:
At the topmost crest of the mountain sits the holy Anjani Mata temple, housing ancient idols of Goddess Anjani cradling the infant Hanuman (Bal Hanuman).

5. Extraordinary Reverse Waterfall Phenomenon:
During heavy monsoons, the tremendous updraft of wind striking the sheer perpendicular cliffs forces cascading streams to spray upwards into the sky, creating the famous 'Reverse Waterfall' spectacle.

6. Mythological Ramayana Trail Significance:
The mountain forms an essential spiritual landmark on the sacred Ramayana Dandakaranya circuit, connecting nearby Panchavati where Lord Rama spent his exile.

7. Biological Diversity & Rare Ceropegia Plant Species:
The plateau is home to critically endangered plant species, notably Ceropegia anjanerica, found exclusively on these rocky hillocks, leading to its declaration as a Conservation Reserve.

8. Trekking Ascent & Stone Stairways:
The trek begins from Anjaneri base village, taking roughly 2.5 to 3 hours over well-marked trails, ancient stone-cut steps, and grassy plateau paths suitable for beginners and families alike.

9. Scenic Lake & Natural Footprint Rock:
Near the summit plateau lies a serene waterbody shaped naturally like a footprint, known locally as Hanuman Paduka lake, reflecting the open blue skies.

10. Eco-Tourism & Visitor Tips:
The best trekking season spans from July (for monsoons and waterfalls) through January (for clear skies). Visitors are encouraged to maintain ecological cleanliness and carry sufficient drinking water.`,
    bestTime: 'June - Jan',
    host: 'Adventure Nashik Hosts',
    highlights: ['Hanuman Temple at Summit', 'Scenic Sahyadri Trek', 'Monsoon Waterfalls', 'Jain Cave Temples'],
    isTopTrending: true,
    hiddenHistory: 'Named after Goddess Anjani (mother of Hanuman), hosting over 108 Jain temples and caves at the plateau.',
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
    detailedDescription: `1. Legendary Tapovan & Ramayana Exile Sanctuary:
Panchavati, located along the northern banks of the sacred Godavari River in Nashik, is the legendary forest sanctuary where Lord Rama, Goddess Sita, and Lakshmana resided during their 14-year vanvas (exile).

2. Five Sacred Banyan Trees (Pancha-Vati):
The locality derives its holy name from the five ancient auspicious Banyan (Vat) trees that have shaded and sheltered saints and hermits since Vedic antiquity.

3. Sita Gufa (Cave of Mother Sita):
A narrow ancient cavern passage leads down to Sita Gufa, believed to be the subterranean prayer sanctuary where Goddess Sita worshiped Lord Shiva and from where the demon king Ravana abducted her in disguise.

4. Monumental Black Stone Kalaram Temple:
Constructed in 1782 CE by Sardar Rangrao Odhekar of the Maratha Empire, Kalaram Temple is built entirely out of pitch-black stone sourced from Ramshej, featuring 2-meter tall black idols of Lord Rama, Sita, and Lakshmana.

5. Sacred Ramkund Ghat & Godavari Aarti:
Ramkund is the central holy immersion pool where Lord Rama performed ancestral rites (Shraddha) for King Dasharatha; today it hosts daily evening Godavari Maha Aarti and holy dips during the Kumbh Mela.

6. Historical Kumbh Mela Epicenter:
Every twelve years, millions of saints, Naga sadhus, and international pilgrims converge at Ramkund and Tapovan for the sacred Simhastha Kumbh Mela to attain spiritual liberation.

7. Historic Kalaram Temple Satyagraha (1930):
Panchavati is also the historic battleground for social equality where Dr. B.R. Ambedkar led the famous non-violent Kalaram Satyagraha in 1930, fighting for universal temple entry rights.

8. Sundarnarayan & Kapaleshwar Shrines:
Surrounding Panchavati are architecturally marvelous temples like Kapaleshwar (the rare Shiva temple without a Nandi bull) and Sundarnarayan Temple aligned perfectly with equinox sun rays.

9. Vibrant Ghat Cultural Life:
The riverfront ghats remain active with Vedic Sanskrit pathshalas, floral markets, spiritual bookstalls, and evening classical music renditions.

10. Visitor Guide & Pilgrimage Access:
Located within 3 kilometers of Nashik central bus station, the temple circuit is accessible on foot with shoe stalls, locker facilities, and guided heritage walking tours available daily.`,
    bestTime: 'Year-round',
    host: 'Panchavati Pilgrim Trust',
    highlights: ['5 Sacred Banyan Trees', 'Kalaram Temple', 'Ramkund Ghat', 'Sita Gumpha'],
    isTopTrending: true,
    hiddenHistory: 'Site of Kumbh Mela every 12 years where holy dip in Ramkund is said to grant salvation (Moksha).',
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
    detailedDescription: `1. Geographic Setting & Godavari Reservoir:
Located roughly 15 kilometers northwest of Nashik city, Gangapur Dam spans across the River Godavari, creating a vast catchment reservoir and serene wetland ecosystem.

2. Engineering Heritage - Maharashtra's First Earthen Dam:
Constructed in 1954 under post-independence irrigation development, it holds historical prominence as the first major all-earthen embankment dam built in Maharashtra.

3. Rich Avian Sanctuary & Migratory Flamingo Haven:
During winter months (November to March), the sprawling grasslands and shallow backwaters attract dozens of migratory bird species, including greater flamingos, painted storks, bar-headed geese, and Brahminy ducks.

4. India's Wine Capital Lakeside Country:
The fertile microclimate surrounding Gangapur Lake fostered India’s premier viticulture industry, surrounded by internationally celebrated vineyards such as Sula, York, and Soma with tasting cellars.

5. MTDC International Boat Club & Adventure Sports:
The Maharashtra Tourism Development Corporation (MTDC) developed a state-of-the-art water sports complex offering speedboating, jet skiing, banana rides, bumper tubes, and kayak rentals.

6. Grassland Eco-Tourism & Sunset Photography:
The sweeping shoreline grasslands provide idyllic spots for nature photography, sunset gazing over the Western Ghats mountain ridges, and serene bird-watching camps.

7. Someshwar Waterfall & Ancient Shiva Temple Nexus:
Just downstream from the backwaters lies the historic Someshwar Temple along the Godavari, famous for its picturesque seasonal Dudhsagar waterfall and tranquil river gardens.

8. Cycling & Eco-Trails:
The scenic paved lakeside boulevard has become a favorite route for endurance cyclists, morning joggers, and nature enthusiasts seeking crisp fresh air away from urban bustle.

9. Lakeside Eco-Resorts & Culinary Tourism:
A vibrant hospitality corridor lines the lake perimeter, offering boutique farmstays, lake-facing infinity pools, vineyard bistros, and authentic Maharashtrian rural dining.

10. Visitor Logistics & Timing:
The lake viewpoints and MTDC boat club are open daily from 9:00 AM to 6:30 PM, with dedicated car parking, cafeteria services, and life-jacket safety protocols for all water activities.`,
    bestTime: 'Nov - Mar',
    host: 'Nashik Eco Tourism',
    highlights: ['Bird Watching', 'Sunset Viewpoint', 'Water Sports Complex', 'Vineyard Landscapes'],
    isTopTrending: true,
    hiddenHistory: 'Built in 1954 across River Godavari, it is an earthen dam creating one of Maharashtra’s premier bird sanctuaries.',
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

const updateAllDetailedInfo = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas!');

    console.log('Updating all destinations with comprehensive 50-line detailed descriptions...');
    await Place.deleteMany({});
    await Place.insertMany(detailedPlaces);

    const count = await Place.countDocuments();
    console.log(`✅ Successfully saved and updated ${count} destinations with in-depth 50-line detailed heritage descriptions in MongoDB Atlas!`);
    process.exit(0);
  } catch (err) {
    console.error('Error saving detailed descriptions:', err.message);
    process.exit(1);
  }
};

updateAllDetailedInfo();
