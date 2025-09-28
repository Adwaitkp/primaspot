const mongoose = require('mongoose');

const influencerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  profilePicUrl: {
    type: String,
    default: ''
  },
  instagramId: {
    type: String,
    default: ''
  },
  biography: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  followers: {
    type: Number,
    default: 0
  },
  following: {
    type: Number,
    default: 0
  },
  postsCount: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['lifestyle', 'fashion', 'food', 'travel', 'fitness', 'beauty', 'tech', 'business', 'other'],
    default: 'other'
  },
  analytics: {
    averageLikes: {
      type: Number,
      default: 0
    },
    averageComments: {
      type: Number,
      default: 0
    },
    engagementRate: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  lastScraped: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate engagement rate before saving
influencerSchema.pre('save', function(next) {
  if (this.followers > 0) {
    const totalEngagement = this.analytics.averageLikes + this.analytics.averageComments;
    this.analytics.engagementRate = ((totalEngagement / this.followers) * 100).toFixed(2);
  }
  next();
});

// Index for efficient queries
influencerSchema.index({ followers: -1 });
influencerSchema.index({ 'analytics.engagementRate': -1 });

module.exports = mongoose.model('Influencer', influencerSchema);