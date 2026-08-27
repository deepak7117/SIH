import Admin from '../models/Admin.js';
import User from '../models/User.js';
import OtpVerification from '../models/OtpVerification.js';
import jwt from 'jsonwebtoken';
import { sendSMS } from '../config/smsService.js';

// Helper to generate JWT token
const generateToken = (id, role = 'traveler') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// ==========================================
// 1. ADMIN AUTHENTICATION
// ==========================================

// @desc    Admin login & verify against MongoDB
// @route   POST /api/auth/admin-login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if any admin exists at all; if database is empty, seed default master admin
    let admin = await Admin.findOne({ email: cleanEmail });

    if (!admin && cleanEmail === 'admin1@tourism.in' && password === 'admin123') {
      console.log('⚡ Initializing master admin account into MongoDB Atlas...');
      admin = await Admin.create({
        name: 'Master Tourism Admin',
        email: 'admin1@tourism.in',
        password: 'admin123',
        department: 'Nashik Municipal Tourism Board',
      });
    }

    if (admin && (await admin.matchPassword(password))) {
      console.log(`✅ Admin logged in successfully: ${admin.email}`);
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        department: admin.department,
        token: generateToken(admin._id, 'admin'),
      });
    } else {
      res.status(401).json({ message: 'Invalid Admin credentials or unauthorized account' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current logged in admin profile
// @route   GET /api/auth/me
// @access  Private (Admin only)
export const getAdminProfile = async (req, res) => {
  if (req.admin) {
    res.json(req.admin);
  } else {
    res.status(404).json({ message: 'Admin not found' });
  }
};

// ==========================================
// 2. USER / TRAVELER AUTHENTICATION & SMS OTP
// ==========================================

// @desc    Generate & send OTP to phone number via SMS
// @route   POST /api/auth/user/send-otp
// @access  Public
export const sendOtpForUser = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || phone.trim().length < 10) {
      return res.status(400).json({ message: 'Please provide a valid 10-digit phone number' });
    }

    const cleanPhone = phone.trim();

    // Generate random 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove any previous existing OTPs for this phone number
    await OtpVerification.deleteMany({ phone: cleanPhone });

    // Store in Mongo with 10-min TTL
    await OtpVerification.create({
      phone: cleanPhone,
      otp,
    });

    // Send SMS via SMS Service
    console.log('\n======================================================');
    console.log(`🚀 [SERVER OTP EVENT] OTP GENERATED FOR USER`);
    console.log(`📱 Phone Number: +91 ${cleanPhone}`);
    console.log(`🔑 Verification OTP Code: >>> [ ${otp} ] <<<`);
    console.log(`⏳ Expiration: 10 Minutes (Saved to MongoDB Atlas)`);
    console.log('======================================================\n');

    await sendSMS(cleanPhone, otp);

    res.status(200).json({
      success: true,
      message: `OTP generated and sent to server console & SMS for +91 ${cleanPhone}`,
      demoOtp: otp,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to send OTP' });
  }
};

// @desc    Register a new user & save to MongoDB Atlas after OTP validation
// @route   POST /api/auth/user/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, otp } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Please provide all required fields: name, email, password, phone' });
    }

    if (!otp) {
      return res.status(400).json({ message: 'Please provide the SMS verification OTP' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim();

    // 1. Verify the OTP record from MongoDB
    const otpRecord = await OtpVerification.findOne({ phone: cleanPhone, otp: otp.trim() });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP code. Please request a new one.' });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({
      $or: [{ email: cleanEmail }, { phone: cleanPhone }],
    });

    if (userExists) {
      return res.status(400).json({
        message: userExists.email === cleanEmail
          ? 'An account with this email already exists'
          : 'An account with this phone number already exists',
      });
    }

    console.log('📝 Registering user:', { name: name.trim(), email: cleanEmail, phone: cleanPhone, otp: otp.trim() });

    // 3. Create and save new User to MongoDB Atlas
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: password,
      phone: cleanPhone,
      isPhoneVerified: true,
    });

    // Clear used OTP record
    await OtpVerification.deleteMany({ phone: cleanPhone });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isPhoneVerified: user.isPhoneVerified,
      role: 'traveler',
      token: generateToken(user._id, 'traveler'),
      message: 'Account created and verified successfully!',
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(400).json({ message: error.message || 'Server registration error' });
  }
};

// @desc    User Login via Email and Password
// @route   POST /api/auth/user/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ message: 'Please provide email/phone and password' });
    }

    const identifier = emailOrPhone.trim();

    // Check if user exists by email or phone
    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
    });

    if (!user) {
      console.log('❌ User not found with identifier:', identifier);
      return res.status(401).json({ message: 'Invalid credentials. User not found with this email/phone.' });
    }

    const isMatch = await user.matchPassword(password);
    console.log(`🔍 Checking password for ${user.email}: match =`, isMatch);

    if (isMatch) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isPhoneVerified: user.isPhoneVerified,
        role: 'traveler',
        token: generateToken(user._id, 'traveler'),
        message: 'Login successful',
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials. Please check your password.' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Server login error' });
  }
};

// @desc    User Login via SMS OTP directly
// @route   POST /api/auth/user/login-with-otp
// @access  Public
export const loginUserWithOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: 'Please provide phone number and OTP' });
    }

    const cleanPhone = phone.trim();

    const otpRecord = await OtpVerification.findOne({ phone: cleanPhone, otp: otp.trim() });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    // Find the user
    let user = await User.findOne({ phone: cleanPhone });
    if (!user) {
      return res.status(404).json({ message: 'No registered user found with this phone number. Please Sign Up.' });
    }

    // Clear used OTP
    await OtpVerification.deleteMany({ phone: cleanPhone });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isPhoneVerified: user.isPhoneVerified,
      role: 'traveler',
      token: generateToken(user._id, 'traveler'),
      message: 'Logged in successfully via SMS OTP',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all registered users for Admin Dashboard
// @route   GET /api/auth/admin/users
// @access  Private (Admin)
export const getAllUsersForAdmin = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch registered users' });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/user/profile
// @access  Private (User)
export const getUserProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};
