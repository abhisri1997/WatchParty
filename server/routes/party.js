const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const Party = require('../models/Party');
const User = require('../models/User');

// Create a new party
router.post('/create', authenticate, async (req, res) => {
  try {
    const { name, streamingService, maxMembers, allowMemberControl } = req.body;

    const party = new Party({
      name,
      host: req.userId,
      streamingService,
      members: [{
        user: req.userId,
        isAuthenticated: true
      }],
      settings: {
        maxMembers: maxMembers || 10,
        allowMemberControl: allowMemberControl !== undefined ? allowMemberControl : true
      }
    });

    await party.save();

    // Add party to user's active parties
    await User.findByIdAndUpdate(req.userId, {
      $push: { activeParties: party._id }
    });

    const populatedParty = await Party.findById(party._id)
      .populate('host', 'username email avatar')
      .populate('members.user', 'username email avatar');

    res.status(201).json({
      message: 'Party created successfully',
      party: populatedParty
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Join a party by code
router.post('/join', authenticate, async (req, res) => {
  try {
    const { partyCode } = req.body;

    const party = await Party.findOne({ partyCode, isActive: true });

    if (!party) {
      return res.status(404).json({ error: 'Party not found' });
    }

    // Check if already a member
    const isMember = party.members.some(m => m.user.toString() === req.userId.toString());
    if (isMember) {
      return res.status(400).json({ error: 'Already a member of this party' });
    }

    // Check max members
    if (party.members.length >= party.settings.maxMembers) {
      return res.status(400).json({ error: 'Party is full' });
    }

    // Add member
    party.members.push({
      user: req.userId,
      isAuthenticated: false
    });

    await party.save();

    // Add party to user's active parties
    await User.findByIdAndUpdate(req.userId, {
      $push: { activeParties: party._id }
    });

    const populatedParty = await Party.findById(party._id)
      .populate('host', 'username email avatar')
      .populate('members.user', 'username email avatar');

    res.json({
      message: 'Joined party successfully',
      party: populatedParty
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get party details
router.get('/:partyCode', authenticate, async (req, res) => {
  try {
    const party = await Party.findOne({ partyCode: req.params.partyCode })
      .populate('host', 'username email avatar')
      .populate('members.user', 'username email avatar')
      .populate('videoState.lastUpdatedBy', 'username');

    if (!party) {
      return res.status(404).json({ error: 'Party not found' });
    }

    res.json({ party });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Leave party
router.post('/:partyCode/leave', authenticate, async (req, res) => {
  try {
    const party = await Party.findOne({ partyCode: req.params.partyCode });

    if (!party) {
      return res.status(404).json({ error: 'Party not found' });
    }

    // Remove member
    party.members = party.members.filter(m => m.user.toString() !== req.userId.toString());

    // If host leaves, assign new host or deactivate party
    if (party.host.toString() === req.userId.toString()) {
      if (party.members.length > 0) {
        party.host = party.members[0].user;
      } else {
        party.isActive = false;
      }
    }

    await party.save();

    // Remove from user's active parties
    await User.findByIdAndUpdate(req.userId, {
      $pull: { activeParties: party._id }
    });

    res.json({ message: 'Left party successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update party content
router.put('/:partyCode/content', authenticate, async (req, res) => {
  try {
    const { contentId, contentTitle, contentUrl, contentType } = req.body;

    const party = await Party.findOne({ partyCode: req.params.partyCode });

    if (!party) {
      return res.status(404).json({ error: 'Party not found' });
    }

    party.currentContent = {
      contentId,
      contentTitle,
      contentUrl,
      contentType
    };

    // Reset video state
    party.videoState = {
      isPlaying: false,
      currentTime: 0,
      lastUpdated: Date.now(),
      lastUpdatedBy: req.userId
    };

    await party.save();

    res.json({
      message: 'Content updated successfully',
      party
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's active parties
router.get('/user/active', authenticate, async (req, res) => {
  try {
    const parties = await Party.find({
      'members.user': req.userId,
      isActive: true
    })
      .populate('host', 'username email avatar')
      .populate('members.user', 'username email avatar')
      .sort({ createdAt: -1 });

    res.json({ parties });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
