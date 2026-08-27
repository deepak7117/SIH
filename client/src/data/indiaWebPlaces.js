//Curated rich web catalog of India's prominent tourist places, temples, forts, and wonders
//Enables instant spelling suggestions(e.g., 'tri' -> Trimbakeshwar, Triveni Sangam, etc.)
//and instant interactive modal details / external web links.

export const indiaWebPlaces = [
  {
    id: 'trimbakeshwar',
    name: 'Trimbakeshwar Shiva Temple',
    category: 'ancient',
    tag: 'Jyotirlinga & Ancient Architecture',
    rating: 4.9,
    reviews: 1240,
    location: 'Trimbak, Nashik, Maharashtra',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkVPM0TI9q-WGsejNuAsHYX4djfx4FnRPhgtRdJ2L4QQ&s=10',
    description: 'One of the twelve sacred Jyotirlingas, nestled at the foothills of Brahmagiri mountain, famous for origin of River Godavari and black stone architecture built by Peshwa Balaji Baji Rao.',
    bestTime: 'Oct - Mar',
    host: 'Nashik Heritage Guides',
    highlights: ['12 Jyotirlingas', 'Brahmagiri Hill Origin', 'Kushavarta Kund', 'Hemadpanthi Architecture'],
    webUrl: 'https://en.wikipedia.org/wiki/Trimbakeshwar_Shiva_Temple',
    aliases: ['trimbak', 'trimbkeshwar', 'trimkeshwar', 'tryambakeshwar', 'tri']
  },
  {
    id: 'saptashrungi',
    name: 'Saptashrungi Devi Gad (Vani)',
    category: 'ancient',
    tag: 'Holy Shakti Peetha & 7 Hills',
    rating: 4.9,
    reviews: 1820,
    location: 'Nanduri, Vani, Nashik, Maharashtra',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsIIxJc-GaA0zwVgCuXW8pJZk7p4b8TMrRjBpmSvgq3g&s=10',
    description: 'A revered Shakti Peetha surrounded by seven mountain peaks (Saptashringa). Home to the 10-foot tall idol of Goddess Saptashrungi Nivasini with 18 arms holding divine weapons.',
    bestTime: 'Sept - April',
    host: 'Saptashrungi Shrine Board',
    highlights: ['51 Shakti Peethas', 'Funicular Trolley Ride', '7 Mountain Pinnacles', 'Chaitra Navratri Festival'],
    webUrl: 'https://en.wikipedia.org/wiki/Saptashrungi',
    aliases: ['saptashringi', 'saptashrung', 'vani devi', 'gad']
  },
  {
    id: 'harihar',
    name: 'Harihar Fort (Harishgad)',
    category: 'trek',
    tag: 'Iconic 80° Vertical Rock-cut Stairs',
    rating: 4.9,
    reviews: 2100,
    location: 'Harshewadi, Nashik, Maharashtra',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrOUoexMHwYG_eIBof8ajJH2y9P6Io460q8_WczQah3g&s=10',
    description: 'Renowned worldwide for its thrilling nearly 80-degree vertical stone-cut stairs carved directly into the prism rock face, offering panoramic views of the Sahyadris.',
    bestTime: 'Oct - Feb',
    host: 'Sahyadri Trekkers Club',
    highlights: ['Vertical Rock Steps', '360° Sahyadri Vista', 'Storage Cisterns', 'Historical Bastions'],
    webUrl: 'https://en.wikipedia.org/wiki/Harihar_fort',
    aliases: ['harishgad', 'harihar trek', 'vertical stairs']
  },
  {
    id: 'pandavleni',
    name: 'Pandavleni Caves (Trirashmi)',
    category: 'heritage',
    tag: '2nd Century BCE Rock-cut Caves',
    rating: 4.7,
    reviews: 890,
    location: 'Trirashmi Hills, Nashik, Maharashtra',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuKJqsW8QF4pUXPvEEdXKNWK05GSXUR5Qrq1ZY8sXe_Q&s=10',
    description: 'A group of 24 rock-cut caves carved between the 2nd century BCE and 5th century CE, depicting Hinayana Buddhist architecture, intricate viharas, and inscriptions.',
    bestTime: 'July - Feb',
    host: 'Sahyadri History Guild',
    highlights: ['Ancient Water Cisterns', 'Panoramic City View', 'Intricate Carvings', 'Buddhist Stupas'],
    webUrl: 'https://en.wikipedia.org/wiki/Pandavleni_Caves',
    aliases: ['trirashmi caves', 'pandav leni', 'nashik caves', 'tri']
  },
  {
    id: 'anjeneri',
    name: 'Anjaneri Fort & Hills',
    category: 'trek',
    tag: 'Birthplace of Lord Hanuman & Trek',
    rating: 4.8,
    reviews: 950,
    location: 'Trimbak Road, Nashik, Maharashtra',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHI57Cle2igx_xpZvVekmKPG1YQWRIh6jRbsCeiwo1Nw&s=10',
    description: 'Believed to be the holy birthplace of Lord Hanuman. A scenic trek through Sahyadri ranges with breathtaking cliff views, Jain temples, and reverse waterfall phenomenon in monsoons.',
    bestTime: 'June - Jan',
    host: 'Adventure Nashik Hosts',
    highlights: ['Hanuman Temple at Summit', 'Scenic Sahyadri Trek', 'Monsoon Waterfalls', 'Jain Cave Temples'],
    webUrl: 'https://en.wikipedia.org/wiki/Anjaneri',
    aliases: ['hanuman birthplace', 'anjaneri hill', 'anjani']
  },
  {
    id: 'panchavati',
    name: 'Panchavati & Sita Gufa',
    category: 'ancient',
    tag: 'Ramayana Era Sacred Heritage',
    rating: 4.8,
    reviews: 1530,
    location: 'Godavari Riverbank, Nashik, Maharashtra',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq3BHPcI0cUDEThi8zJMwkzO5qZS3Z2fePtJeTAZODkw&s=10',
    description: 'The legendary place where Lord Rama, Sita, and Lakshmana stayed during their exile. Includes the sacred 5 Banyan trees, Kalaram Temple, and holy Ramkund ghat.',
    bestTime: 'Year-round',
    host: 'Panchavati Pilgrim Trust',
    highlights: ['5 Sacred Banyan Trees', 'Kalaram Temple', 'Ramkund Ghat', 'Sita Gumpha'],
    webUrl: 'https://en.wikipedia.org/wiki/Panchavati',
    aliases: ['ramkund', 'kalaram', 'sita gupha', 'sita gumpha']
  },
  {
    id: 'gangapur-wildlife',
    name: 'Gangapur Backwaters & Grasslands',
    category: 'wildlife',
    tag: 'Migratory Birds & Nature Haven',
    rating: 4.6,
    reviews: 620,
    location: 'Gangapur Dam, Nashik, Maharashtra',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    description: 'Expansive serene waters and grasslands attracting flamingos, painted storks, kingfishers, and diverse flora. Perfect for tranquil sunsets and bird watching expeditions.',
    bestTime: 'Nov - Mar',
    host: 'Nashik Eco Tourism',
    highlights: ['Bird Watching', 'Sunset Viewpoint', 'Water Sports Complex', 'Vineyard Landscapes'],
    webUrl: 'https://en.wikipedia.org/wiki/Gangapur_Dam',
    aliases: ['gangapur dam', 'nashik backwaters', 'sula backwaters']
  },
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    category: 'heritage',
    tag: 'Wonder of the World & Mughal Architecture',
    rating: 4.9,
    reviews: 58400,
    location: 'Agra, Uttar Pradesh, India',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2000&q=85',
    description: 'An ivory-white marble mausoleum on the right bank of the river Yamuna, commissioned in 1631 by Mughal Emperor Shah Jahan. A UNESCO World Heritage site and global symbol of eternal love.',
    bestTime: 'Oct - March',
    host: 'Archeological Survey of India',
    highlights: ['UNESCO World Heritage', 'White Makrana Marble', 'Mughal Gardens', 'Yamuna Riverbank'],
    webUrl: 'https://en.wikipedia.org/wiki/Taj_Mahal',
    aliases: ['taj', 'tajmahal', 'agra', 'mumtaz mahal']
  },
  {
    id: 'raigad-fort',
    name: 'Raigad Fort (Raygad)',
    category: 'heritage',
    tag: 'Capital of Maratha Empire',
    rating: 4.9,
    reviews: 14200,
    location: 'Mahad, Raigad, Maharashtra',
    image: 'https://i.pinimg.com/736x/52/85/9b/52859b4f3dc06bbfeb6183951cd8bfab.jpg',
    description: 'The invincible hill fortress chosen by Chhatrapati Shivaji Maharaj as the capital of the Maratha Empire in 1674. Features the royal coronation throne, Maha Darwaja, and Hirkani Buruj.',
    bestTime: 'July - Feb',
    host: 'Maharashtra State Tourism (MTDC)',
    highlights: ['Shivaji Maharaj Coronation Throne', 'Raigad Ropeway', 'Maha Darwaja', 'Hirkani Cliff'],
    webUrl: 'https://en.wikipedia.org/wiki/Raigad_Fort',
    aliases: ['raigad', 'raygad', 'shivaji maharaj capital', 'mahad fort']
  },
  {
    id: 'india-gate',
    name: 'India Gate',
    category: 'heritage',
    tag: 'National War Memorial & Monument',
    rating: 4.8,
    reviews: 32900,
    location: 'Rajpath, New Delhi, India',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=2000&q=85',
    description: 'A 42-metre high war memorial archway designed by Sir Edwin Lutyens honoring Indian soldiers. Surrounded by lush lawns and the Amar Jawan Jyoti flame.',
    bestTime: 'Oct - Mar',
    host: 'Delhi Tourism Board',
    highlights: ['Amar Jawan Jyoti', 'Kartavya Path', 'Evening Light Show', 'Canopy & Lawns'],
    webUrl: 'https://en.wikipedia.org/wiki/India_Gate',
    aliases: ['delhi gate', 'indiagate', 'national memorial']
  },

];

// Helper to fuzzy match and find matching places strictly within database placesList
export function searchTouristDestinations(query, databasePlaces = []) {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();

  // Strictly filter only the places that exist in the database (passed in databasePlaces)
  const matches = databasePlaces.filter((place) => {
    if (!place) return false;
    const name = (place.name || '').toLowerCase();
    const location = (place.location || '').toLowerCase();
    const tag = (place.tag || '').toLowerCase();
    const category = (place.category || '').toLowerCase();
    const description = (place.description || '').toLowerCase();

    // Standard containment & prefix checks
    const nameMatch = name.includes(q);
    const locationMatch = location.includes(q);
    const tagMatch = tag.includes(q);
    const categoryMatch = category.includes(q);
    const descMatch = description.includes(q);

    // Check aliases if defined on place
    const aliasMatch = place.aliases?.some(
      (a) => a.toLowerCase().includes(q) || q.includes(a.toLowerCase())
    );

    // Phonetic / fuzzy matching for common typos (e.g., 'trimbkeshwar' matching 'Trimbakeshwar')
    const cleanQ = q.replace(/[^a-z0-9]/g, '');
    const cleanName = name.replace(/[^a-z0-9]/g, '');
    const normalizedMatch =
      cleanName.includes(cleanQ) ||
      cleanQ.includes(cleanName) ||
      (cleanQ.length >= 3 && cleanName.startsWith(cleanQ.slice(0, 3)));

    const startsWithName = name.startsWith(q);
    const startsWithWord = name.split(' ').some((w) => w.startsWith(q));

    return (
      startsWithName ||
      startsWithWord ||
      nameMatch ||
      locationMatch ||
      tagMatch ||
      categoryMatch ||
      descMatch ||
      aliasMatch ||
      normalizedMatch
    );
  });

  // Sort by relevance (exact prefix matches first, then higher ratings)
  return matches.sort((a, b) => {
    const aName = (a.name || '').toLowerCase();
    const bName = (b.name || '').toLowerCase();
    const aStarts = aName.startsWith(q) || aName.split(' ').some((w) => w.startsWith(q));
    const bStarts = bName.startsWith(q) || bName.split(' ').some((w) => w.startsWith(q));
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return (b.rating || 0) - (a.rating || 0);
  });
}

