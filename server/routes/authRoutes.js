import express from 'express';
import {
  adminLogin,
  getAdminProfile,
  sendOtpForUser,
  registerUser,
  loginUser,
  loginUserWithOtp,
  getAllUsersForAdmin,
  getUserProfile,
} from '../controllers/authController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin Routes
router.post('/admin-login', adminLogin);
router.get('/me', protectAdmin, getAdminProfile);
router.get('/admin/users', protectAdmin, getAllUsersForAdmin);

// User / Traveler Routes
router.post('/user/send-otp', sendOtpForUser);
router.post('/user/register', registerUser);
router.post('/user/login', loginUser);
router.post('/user/login-with-otp', loginUserWithOtp);
router.get('/user/profile', getUserProfile);

export default router;
