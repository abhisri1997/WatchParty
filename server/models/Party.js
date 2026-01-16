const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const partySchema = new mongoose.Schema({
  partyCode: {
    type: String,
    required: true,
    unique: true,
    default: () => uuidv4().substring(0, 8).toUpperCase()
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  streamingService: {
    type: String,
    required: true,
    enum: ['netflix', 'hulu', 'disney-plus', 'prime-video', 'hbo-max', 'custom']
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    isAuthenticated: {
      type: Boolean,
      default: false
    }
  }],
  currentContent: {
    contentId: String,
    contentTitle: String,
    contentUrl: String,
    contentType: {
      type: String,
      enum: ['movie', 'series', 'custom']
    }
  },
  videoState: {
    isPlaying: {
      type: Boolean,
      default: false
    },
    currentTime: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  settings: {
    maxMembers: {
      type: Number,
      default: 10
    },
    allowMemberControl: {
      type: Boolean,
      default: true
    },
    requireAuth: {
      type: Boolean,
      default: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster lookups
partySchema.index({ partyCode: 1 });
partySchema.index({ host: 1 });

module.exports = mongoose.model('Party', partySchema);
