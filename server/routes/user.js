const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('activeParties');
    
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { username, avatar } = req.body;
    const updateFields = {};

    if (username) updateFields.username = username;
    if (avatar) updateFields.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add streaming service authentication
router.post('/streaming-service', authenticate, async (req, res) => {
  try {
    const { service, accessToken, refreshToken, expiresAt } = req.body;

    const user = await User.findById(req.userId);

    // Check if service already exists
    const serviceIndex = user.streamingServices.findIndex(s => s.service === service);

    const serviceData = {
      service,
      accessToken,
      refreshToken,
      expiresAt,
      isAuthenticated: true
    };

    if (serviceIndex >= 0) {
      user.streamingServices[serviceIndex] = serviceData;
    } else {
      user.streamingServices.push(serviceData);
    }

    await user.save();

    res.json({
      message: 'Streaming service authenticated successfully',
      streamingServices: user.streamingServices
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get streaming services
router.get('/streaming-services', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('streamingServices');
    res.json({ streamingServices: user.streamingServices });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
