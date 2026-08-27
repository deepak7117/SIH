import { GoogleGenAI } from '@google/genai';

/**
 * Service to generate complete, structured tourism & heritage destination cards
 * using Google Gemini 2.5 Flash SDK.
 */
export const generateTouristPlaceWithAI = async (placeName) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in server/.env file. Please add your free key from https://aistudio.google.com/');
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are an expert Indian Heritage & Tourism Guide.
    Create a complete, authentic, and verified tourist destination entry for: "${placeName}".
    
    CRITICAL: Output ONLY a single strictly valid JSON object matching this schema. Do not include markdown code block backticks.
    {
      "name": "Standard recognizable name of the place",
      "category": "ancient / heritage / trek / wildlife",
      "tag": "Short badge (e.g., 'UNESCO World Heritage', '12 Jyotirlinga', '7th Century Monolith')",
      "rating": 4.8,
      "reviews": 1250,
      "location": "City/District, State",
      "image": "Direct working high quality Wikimedia or Unsplash landscape photo URL for this specific place",
      "description": "2-3 sentences engaging architectural and visitor summary.",
      "detailedDescription": "A comprehensive, in-depth multi-paragraph (30 to 50 lines) heritage and tourist guide covering: 1. Geographical setting and terrain, 2. Ancient origin and mythological/royal foundation, 3. Architectural style and stone engineering, 4. Major historical events, sieges, or restorations, 5. Cultural and religious significance, 6. Key sanctums and points of interest, 7. Famous festivals and auspicious timings, 8. Modern conservation, 9. Panoramic viewpoints, 10. Visitor guidelines and ticket/timing tips.",
      "bestTime": "e.g., Oct - Mar",
      "host": "Local Tourism Office or Temple Trust",
      "highlights": ["Highlight 1", "Highlight 2", "Highlight 3", "Highlight 4"],
      "isTopTrending": true,
      "hiddenHistory": "A unique historical legend, hidden architectural trick, or lesser-known anecdote.",
      "historyContent": [
        {
          "language": "English",
          "mediaType": "audio",
          "title": "Comprehensive Audio Guide & Legend",
          "narrator": "Heritage Audio Guild",
          "duration": "4m 15s"
        },
        {
          "language": "Hindi",
          "mediaType": "audio",
          "title": "इतिहास व पौराणिक कथा",
          "narrator": "पर्यटन मार्गदर्शक",
          "duration": "4m 50s"
        }
      ],
      "visualTimeline": [
        {
          "year": "Historical Era / Year (e.g., 1000 CE)",
          "title": "Origin / Construction Milestone",
          "imageUrl": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80 (OR leave as empty string \"\" if verified real photo is not available)",
          "description": "Historical construction narrative"
        },
        {
          "year": "Later Era (e.g., 1750 CE)",
          "title": "Restoration / Historical Battle",
          "imageUrl": "Leave as empty string \"\" if verified real photo of this era is not available",
          "description": "Historical development during empire reign"
        },
        {
          "year": "Modern Era (e.g., 1951 CE)",
          "title": "National Heritage Preservation",
          "imageUrl": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80 (OR \"\" if not available)",
          "description": "Archaeological Survey preservation and modern tourist facilities."
        }
      ],
      "nearbyPlaces": [
        {
          "name": "Nearby Attraction 1 within 15km",
          "distance": "e.g. 1.2 km",
          "category": "Historical Monument / Temple",
          "imageUrl": "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80"
        },
        {
          "name": "Nearby Attraction 2 within 15km",
          "distance": "e.g. 4.5 km",
          "category": "Scenic Viewpoint / Nature",
          "imageUrl": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80"
        },
        {
          "name": "Nearby Attraction 3 within 15km",
          "distance": "e.g. 8.0 km",
          "category": "Heritage Museum / Lake",
          "imageUrl": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=400&q=80"
        },
        {
          "name": "Nearby Attraction 4 within 15km",
          "distance": "e.g. 12.0 km",
          "category": "Sacred Shrine / Fort",
          "imageUrl": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80"
        }
      ],
      "coRelatedPlaces": [
        {
          "name": "Sister Heritage Monument in India",
          "circuit": "Heritage Circuit Name (e.g., Chola Dynasty Circuit / Ramayana Circuit)",
          "connection": "Detailed synergy explaining how these places connect culturally or historically."
        },
        {
          "name": "Another Linked Heritage Landmark",
          "circuit": "National Pilgrimage / Architectural Circuit",
          "connection": "Shared architectural style, empire builders, or sacred trails."
        }
      ],
      "webUrl": "https://en.wikipedia.org/wiki/${encodeURIComponent(placeName.replace(/\\s+/g, '_'))}",
      "aliases": ["${placeName.toLowerCase()}", "${placeName.toLowerCase().replace(/\\s+/g, '')}"]
    }
  `;

  // Active available models
  const modelsToTry = [
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-2.5-flash'
  ];

  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`[Gemini AI] 🚀 Generating place with model: ${modelName}...`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      let rawText = response.text || '{}';
      // Clean any accidental markdown backticks
      rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

      const parsedData = JSON.parse(rawText);

      // Fallback image if AI provides empty string
      if (!parsedData.image) {
        parsedData.image = 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80';
      }

      console.log(`[Gemini AI] ✅ Successfully generated content using: ${modelName}`);
      parsedData._aiModelUsed = modelName;

      return parsedData;
    } catch (err) {
      console.warn(`[Gemini AI] ⚠️ Model ${modelName} returned: ${err.message}. Checking next option...`);
      lastError = err;
    }
  }

  console.error('All Gemini AI model options failed:', lastError?.message);
  throw new Error(`AI generation rate limit reached: Please wait 30 seconds or update GEMINI_API_KEY in server/.env`);
};
