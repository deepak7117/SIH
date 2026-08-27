import Place from '../models/Place.js';
import { buildQrValue, generateQrDataUrl, generateQrBuffer } from '../utils/qr.util.js';

// @desc    Get all historical tourism places from MongoDB
// @route   GET /api/places
// @access  Public
export const getPlaces = async (req, res) => {
  try {
    const places = await Place.find({}).sort({ createdAt: -1 });
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single place by ID
// @route   GET /api/places/:id
// @access  Public
export const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (place) {
      res.json(place);
    } else {
      res.status(404).json({ message: 'Place not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new tourist place
// @route   POST /api/places
// @access  Private (Admin only)
export const createPlace = async (req, res) => {
  try {
    const {
      name,
      category,
      tag,
      rating,
      reviews,
      location,
      image,
      description,
      detailedDescription,
      bestTime,
      host,
      highlights,
      isTopTrending,
      isPublished,
      hiddenHistory,
      historyContent,
      visualTimeline,
      nearbyPlaces,
      coRelatedPlaces,
    } = req.body;

    // Normalize and sanitize historyContent array to guarantee schema objects
    const sanitizedHistoryContent = Array.isArray(historyContent)
      ? historyContent
          .map((item) => {
            if (typeof item === 'string') {
              return { language: 'English', mediaType: 'audio', title: item, mediaUrl: '', narrator: '', duration: '' };
            }
            if (item && typeof item === 'object') {
              return {
                language: item.language || 'English',
                mediaType: ['audio', 'video', 'text'].includes(item.mediaType) ? item.mediaType : 'audio',
                title: item.title || '',
                mediaUrl: item.mediaUrl || '',
                narrator: item.narrator || '',
                duration: item.duration || '',
              };
            }
            return null;
          })
          .filter(Boolean)
      : [];

    // Normalize visualTimeline array
    const sanitizedVisualTimeline = Array.isArray(visualTimeline)
      ? visualTimeline
          .map((item) => {
            if (item && typeof item === 'object') {
              return {
                year: item.year || '',
                title: item.title || '',
                imageUrl: item.imageUrl || '',
                description: item.description || '',
              };
            }
            return null;
          })
          .filter(Boolean)
      : [];

    // Normalize nearbyPlaces array
    const sanitizedNearbyPlaces = Array.isArray(nearbyPlaces)
      ? nearbyPlaces
          .map((item) => {
            if (item && typeof item === 'object') {
              return {
                name: item.name || '',
                distance: item.distance || '',
                imageUrl: item.imageUrl || '',
                category: item.category || '',
              };
            }
            return null;
          })
          .filter(Boolean)
      : [];

    // Normalize coRelatedPlaces array
    const sanitizedCoRelatedPlaces = Array.isArray(coRelatedPlaces)
      ? coRelatedPlaces
          .map((item) => {
            if (item && typeof item === 'object') {
              return {
                name: item.name || '',
                circuit: item.circuit || '',
                imageUrl: item.imageUrl || '',
                connection: item.connection || '',
              };
            }
            return null;
          })
          .filter(Boolean)
      : [];

    const newPlace = new Place({
      name,
      category: category || 'ancient',
      tag,
      rating: rating || 4.8,
      reviews: reviews || 100,
      location,
      image,
      description,
      detailedDescription,
      bestTime,
      host: host || 'Nashik Municipal Tourism Board',
      highlights: highlights || [],
      isTopTrending: isTopTrending !== undefined ? Boolean(isTopTrending) : true,
      isPublished: isPublished !== undefined ? Boolean(isPublished) : (isTopTrending !== undefined ? Boolean(isTopTrending) : true),
      hiddenHistory: hiddenHistory || '',
      historyContent: sanitizedHistoryContent,
      visualTimeline: sanitizedVisualTimeline,
      nearbyPlaces: sanitizedNearbyPlaces,
      coRelatedPlaces: sanitizedCoRelatedPlaces,
      // Auto-generate the QR code value the moment a site is created, so an
      // admin never has to remember a separate "generate QR" step — the
      // Download QR button on the edit screen works immediately.
      qrCodeValue: buildQrValue(name),
      createdBy: req.admin._id,
    });

    const savedPlace = await newPlace.save();
    res.status(201).json(savedPlace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a tourist place
// @route   PUT /api/places/:id
// @access  Private (Admin only)
export const updatePlace = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (place) {
      place.name = req.body.name || place.name;
      place.category = req.body.category || place.category;
      place.tag = req.body.tag || place.tag;
      place.rating = req.body.rating !== undefined ? req.body.rating : place.rating;
      place.reviews = req.body.reviews !== undefined ? req.body.reviews : place.reviews;
      place.location = req.body.location || place.location;
      place.image = req.body.image || place.image;
      place.description = req.body.description || place.description;
      if (req.body.detailedDescription !== undefined) {
        place.detailedDescription = req.body.detailedDescription;
      }
      place.bestTime = req.body.bestTime || place.bestTime;
      place.host = req.body.host || place.host;
      place.highlights = req.body.highlights || place.highlights;
      if (req.body.isTopTrending !== undefined) {
        place.isTopTrending = Boolean(req.body.isTopTrending);
      }
      if (req.body.isPublished !== undefined) {
        place.isPublished = Boolean(req.body.isPublished);
      }
      if (req.body.hiddenHistory !== undefined) {
        place.hiddenHistory = req.body.hiddenHistory;
      }
      if (req.body.historyContent !== undefined) {
        place.historyContent = Array.isArray(req.body.historyContent)
          ? req.body.historyContent
              .map((item) => {
                if (typeof item === 'string') {
                  return { language: 'English', mediaType: 'audio', title: item, mediaUrl: '', narrator: '', duration: '' };
                }
                if (item && typeof item === 'object') {
                  return {
                    language: item.language || 'English',
                    mediaType: ['audio', 'video', 'text'].includes(item.mediaType) ? item.mediaType : 'audio',
                    title: item.title || '',
                    mediaUrl: item.mediaUrl || '',
                    narrator: item.narrator || '',
                    duration: item.duration || '',
                  };
                }
                return null;
              })
              .filter(Boolean)
          : [];
      }
      if (req.body.visualTimeline !== undefined) {
        place.visualTimeline = Array.isArray(req.body.visualTimeline)
          ? req.body.visualTimeline
              .map((item) => {
                if (item && typeof item === 'object') {
                  return {
                    year: item.year || '',
                    title: item.title || '',
                    imageUrl: item.imageUrl || '',
                    description: item.description || '',
                  };
                }
                return null;
              })
              .filter(Boolean)
          : [];
      }
      if (req.body.nearbyPlaces !== undefined) {
        place.nearbyPlaces = Array.isArray(req.body.nearbyPlaces)
          ? req.body.nearbyPlaces
              .map((item) => {
                if (item && typeof item === 'object') {
                  return {
                    name: item.name || '',
                    distance: item.distance || '',
                    imageUrl: item.imageUrl || '',
                    category: item.category || '',
                  };
                }
                return null;
              })
              .filter(Boolean)
          : [];
      }
      if (req.body.coRelatedPlaces !== undefined) {
        place.coRelatedPlaces = Array.isArray(req.body.coRelatedPlaces)
          ? req.body.coRelatedPlaces
              .map((item) => {
                if (item && typeof item === 'object') {
                  return {
                    name: item.name || '',
                    circuit: item.circuit || '',
                    imageUrl: item.imageUrl || '',
                    connection: item.connection || '',
                  };
                }
                return null;
              })
              .filter(Boolean)
          : [];
      }

      const updatedPlace = await place.save();
      res.json(updatedPlace);
    } else {
      res.status(404).json({ message: 'Place not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a tourist place
// @route   DELETE /api/places/:id
// @access  Private (Admin only)
export const deletePlace = async (req, res) => {
  try {
    const targetId = req.params.id;
    let place = null;

    // Check if valid 24-character hex MongoDB ObjectId
    if (/^[0-9a-fA-F]{24}$/.test(targetId)) {
      place = await Place.findById(targetId);
    }

    // Fallback: lookup by name or custom id field if not found by ObjectId
    if (!place) {
      place = await Place.findOne({
        $or: [
          { name: { $regex: new RegExp(`^${targetId}$`, 'i') } },
          { id: targetId }
        ]
      });
    }

    if (place) {
      await place.deleteOne();
      res.json({ message: `"${place.name}" removed successfully from database` });
    } else {
      res.status(404).json({ message: 'Place not found in database' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate a complete new tourist destination in real-time with Google Gemini AI
// @route   POST /api/places/generate-live
// @access  Public
export const generateLivePlace = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || !query.trim()) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const cleanQuery = query.trim();

    // 1. First check if this place already exists in MongoDB Atlas
    const existing = await Place.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${cleanQuery}$`, 'i') } },
        { location: { $regex: new RegExp(cleanQuery, 'i') } }
      ]
    });

    if (existing) {
      return res.json({
        place: existing,
        source: 'database',
        message: 'Loaded from existing database record'
      });
    }

    // 2. Dynamically import AI service to generate full structured data
    const { generateTouristPlaceWithAI } = await import('../services/aiPlaceService.js');
    const generatedData = await generateTouristPlaceWithAI(cleanQuery);

    // 3. Attach a unique runtime ID without writing/saving to MongoDB database
    const livePlace = {
      _id: `ai_${Date.now()}`,
      ...generatedData,
      isAiGenerated: true
    };

    res.status(200).json({
      place: livePlace,
      source: 'ai_generated',
      message: `Generated live preview for "${livePlace.name}" (not saved to database)`
    });
  } catch (error) {
    console.error('Error in generateLivePlace:', error.message);
    res.status(500).json({ message: error.message });
  }
};
// @desc    Generate (or regenerate) a QR code for a place
// @route   POST /api/places/:id/qr
// @access  Private (Admin only)
export const generatePlaceQr = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
 
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
 
    place.qrCodeValue = buildQrValue(place.name);
    const updatedPlace = await place.save();
 
    const qrDataUrl = await generateQrDataUrl(updatedPlace.qrCodeValue);
 
    res.json({ place: updatedPlace, qrDataUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
// @desc    Get a base64 QR preview for a place that already has a QR value
// @route   GET /api/places/:id/qr/preview
// @access  Public
export const getPlaceQrPreview = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
 
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
 
    if (!place.qrCodeValue) {
      return res.status(400).json({ message: 'This place has no QR code yet' });
    }
 
    const qrDataUrl = await generateQrDataUrl(place.qrCodeValue);
    res.json({ qrDataUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
// @desc    Download a place's QR code as a PNG file
// @route   GET /api/places/:id/qr/download
// @access  Public
export const downloadPlaceQr = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
 
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
 
    if (!place.qrCodeValue) {
      return res.status(400).json({ message: 'This place has no QR code yet' });
    }
 
    const buffer = await generateQrBuffer(place.qrCodeValue);
    const filename = place.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
 
    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="${filename}-qr.png"`,
    });
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
// @desc    Resolve a scanned QR value to its place (used by the QR scanner)
// @route   GET /api/places/qr/lookup/:value
// @access  Public
export const lookupPlaceByQr = async (req, res) => {
  try {
    const { value } = req.params;
 
    const place = await Place.findOne({ qrCodeValue: value, isPublished: true });
 
    if (!place) {
      return res.status(404).json({ message: 'No place found for that QR code.' });
    }
 
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

