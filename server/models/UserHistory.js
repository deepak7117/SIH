import mongoose from 'mongoose';

const userHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    userIdentifier: {
      type: String, // phone or email
      required: true,
      index: true
    },
    placeId: {
      type: String
    },
    title: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    location: {
      type: String
    },
    points: {
      type: String,
      default: '+25 pts'
    },
    category: {
      type: String,
      default: 'Searched Destination'
    },
    status: {
      type: String,
      default: 'Searched & Explored'
    },
    placeData: {
      type: mongoose.Schema.Types.Mixed
    },
    searchedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const UserHistory = mongoose.model('UserHistory', userHistorySchema);
export default UserHistory;
