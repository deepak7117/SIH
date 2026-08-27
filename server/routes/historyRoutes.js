import express from 'express';
import UserHistory from '../models/UserHistory.js';
import User from '../models/User.js';

const router = express.Router();

// GET /api/history/:userIdentifier - Retrieve full search & exploration history + reward points for user
router.get('/:userIdentifier', async (req, res) => {
  try {
    const { userIdentifier } = req.params;
    const history = await UserHistory.find({ userIdentifier })
      .sort({ createdAt: -1 })
      .limit(100);

    // Fetch user profile points if registered
    let rewardPoints = 0;
    const user = await User.findOne({
      $or: [{ phone: userIdentifier }, { email: userIdentifier }]
    });
    if (user && typeof user.rewardPoints === 'number') {
      rewardPoints = user.rewardPoints;
    }

    // Format response to match client expectations
    const formatted = history.map((item) => ({
      id: item._id.toString(),
      _dbId: item._id.toString(),
      placeId: item.placeId,
      title: item.title,
      image: item.image,
      location: item.location,
      date: item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ', ' + new Date(item.createdAt).toLocaleDateString() : 'Today',
      points: item.points || '+25 pts',
      category: item.category || 'Searched Destination',
      status: item.status || 'Searched & Explored',
      placeData: item.placeData
    }));

    res.json({ success: true, history: formatted, rewardPoints });
  } catch (error) {
    console.error('Error fetching user history:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/history/points/:userIdentifier - Persist updated reward points
router.put('/points/:userIdentifier', async (req, res) => {
  try {
    const { userIdentifier } = req.params;
    const { points } = req.body;
    if (typeof points === 'number') {
      await User.findOneAndUpdate(
        { $or: [{ phone: userIdentifier }, { email: userIdentifier }] },
        { $set: { rewardPoints: points } }
      );
    }
    res.json({ success: true, rewardPoints: points });
  } catch (error) {
    console.error('Error updating reward points:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/history - Save a new search or QR exploration event
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      userIdentifier,
      placeId,
      title,
      image,
      location,
      points,
      category,
      status,
      placeData
    } = req.body;

    if (!userIdentifier || !title) {
      return res.status(400).json({ success: false, message: 'userIdentifier and title are required.' });
    }

    const newHistory = new UserHistory({
      userId: userId || userIdentifier,
      userIdentifier,
      placeId,
      title,
      image,
      location,
      points: points || '+25 pts',
      category: category || 'Searched Destination',
      status: status || 'Searched & Explored',
      placeData
    });

    const saved = await newHistory.save();

    res.status(201).json({
      success: true,
      entry: {
        id: saved._id.toString(),
        _dbId: saved._id.toString(),
        placeId: saved.placeId,
        title: saved.title,
        image: saved.image,
        location: saved.location,
        date: new Date(saved.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ', Today',
        points: saved.points,
        category: saved.category,
        status: saved.status,
        placeData: saved.placeData
      }
    });
  } catch (error) {
    console.error('Error saving user history:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/history/:id - Delete single history entry
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await UserHistory.findByIdAndDelete(id);
    res.json({ success: true, message: 'History record deleted.' });
  } catch (error) {
    console.error('Error deleting user history item:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/history/clear/:userIdentifier - Clear all history for user
router.delete('/clear/:userIdentifier', async (req, res) => {
  try {
    const { userIdentifier } = req.params;
    await UserHistory.deleteMany({ userIdentifier });
    res.json({ success: true, message: 'All history cleared successfully.' });
  } catch (error) {
    console.error('Error clearing user history:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
