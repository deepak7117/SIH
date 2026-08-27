import express from 'express';
import {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  generateLivePlace,
  generatePlaceQr,
  getPlaceQrPreview,
  downloadPlaceQr,
  lookupPlaceByQr,
} from '../controllers/placeController.js';

import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes for travelers & live generation
router.get('/', getPlaces);
router.post('/generate-live', generateLivePlace);

// QR routes — must come BEFORE '/:id' so 'qr' isn't swallowed as an :id value
router.get('/qr/lookup/:value', lookupPlaceByQr);
router.get('/:id/qr/preview', getPlaceQrPreview);
router.get('/:id/qr/download', downloadPlaceQr);
router.post('/:id/qr', protectAdmin, generatePlaceQr);

router.get('/:id', getPlaceById);

// Protected routes for Municipal Admins
router.post('/', protectAdmin, createPlace);
router.put('/:id', protectAdmin, updatePlace);
router.delete('/:id', protectAdmin, deletePlace);

export default router;
