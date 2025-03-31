import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', authUser);
router.post('/register', registerUser);
router.post('/forgot-password', forgotPassword);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router; 