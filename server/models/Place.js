import mongoose from 'mongoose';


const placeSchema = new mongoose.Schema(
  {
    
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'ancient',
    },
    tag: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    reviews: {
      type: Number,
      default: 100,
    },
    location: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    detailedDescription: {
      type: String,
      default: '',
    },
    bestTime: {
      type: String,
      required: true,
    },
    host: {
      type: String,
      default: 'Nashik Municipal Tourism Board',
    },
    highlights: {
      type: [String],
      default: [],
    },
    isTopTrending: {
      type: Boolean,
      default: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    hiddenHistory: {
      type: String,
      default: '',
    },
    qrCodeValue:{
  type: String,
  unique: true,
  sparse: true,
  index: true,
},
    historyContent: [
      {
        language: { type: String, default: 'English' },
        mediaType: { type: String, enum: ['audio', 'video', 'text'], default: 'audio' },
        title: { type: String, default: '' },
        mediaUrl: { type: String, default: '' },
        narrator: { type: String, default: '' },
        duration: { type: String, default: '' },
      }
    ],
    visualTimeline: [
      {
        year: { type: String, default: '' },
        title: { type: String, default: '' },
        imageUrl: { type: String, default: '' },
        description: { type: String, default: '' },
      }
    ],
    nearbyPlaces: [
      {
        name: { type: String, default: '' },
        distance: { type: String, default: '' },
        imageUrl: { type: String, default: '' },
        category: { type: String, default: '' },
      }
    ],
    coRelatedPlaces: [
      {
        name: { type: String, default: '' },
        circuit: { type: String, default: '' },
        imageUrl: { type: String, default: '' },
        connection: { type: String, default: '' },
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    }
  },
  {
    timestamps: true,
  }
  
);

const Place = mongoose.model('Place', placeSchema);

export default Place;
