
const express = require('express'); // packages should be imported according to new convention (import express from 'express')
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  googleAuthUser,
  getUserProfile, 
  updateUserProfile,
  getUsers 
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-auth', googleAuthUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Admin routes
router.get('/', protect, admin, getUsers);

module.exports = router;
