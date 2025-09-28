const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
  influencer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Influencer',
    required: true
  },
  reelId: {
    type: String,
    required: true,
    unique: true
  },
  shortcode: {
    type: String,
    required: true,
    unique: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: ''
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    required: true
  },
  hashtags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  mentions: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  music: {
    title: String,
    artist: String,
    url: String
  },
  // Video Analysis Results
  analysis: {
    tags: [{
      tag: String,
      confidence: Number,
      timestamp: Number // When in video this appears
    }],
    vibe: {
      type: String,
      enum: ['party', 'travel', 'luxury', 'casual', 'energetic', 'calm', 'romantic', 'funny', 'educational', 'inspirational'],
      default: 'casual'
    },
    classification: {
      type: String,
      enum: ['dance', 'tutorial', 'lifestyle', 'comedy', 'travel', 'food', 'fashion', 'fitness', 'music', 'other'],
      default: 'other'
    },
    objects: [{
      object: String,
      confidence: Number,
      timestamps: [Number] // Multiple timestamps where object appears
    }],
    scenes: [{
      scene: String,
      startTime: Number,
      endTime: Number,
      confidence: Number
    }],
    faces: {
      count: {
        type: Number,
        default: 0
      },
      emotions: [{
        emotion: String,
        confidence: Number,
        timestamp: Number
      }]
    },
    activities: [{
      activity: String,
      confidence: Number,
      startTime: Number,
      endTime: Number
    }],
    quality: {
      resolution: String,
      stability: {
        type: String,
        enum: ['excellent', 'good', 'average', 'shaky'],
        default: 'average'
      },
      lighting: {
        type: String,
        enum: ['excellent', 'good', 'average', 'poor'],
        default: 'average'
      },
      audioQuality: {
        type: String,
        enum: ['excellent', 'good', 'average', 'poor'],
        default: 'average'
      }
    }
  },
  performance: {
    engagementRate: {
      type: Number,
      default: 0
    },
    viewsToFollowersRatio: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    },
    shareRate: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Calculate performance metrics before saving
reelSchema.pre('save', async function(next) {
  if (this.views > 0) {
    // Get influencer to calculate ratios
    const Influencer = mongoose.model('Influencer');
    const influencer = await Influencer.findById(this.influencer);
    
    if (influencer) {
      this.performance.engagementRate = (((this.likes + this.comments + this.shares) / this.views) * 100).toFixed(2);
      this.performance.viewsToFollowersRatio = ((this.views / influencer.followers) * 100).toFixed(2);
      if (this.views > 0) {
        this.performance.shareRate = ((this.shares / this.views) * 100).toFixed(2);
      }
    }
  }
  next();
});

// Indexes for efficient queries
reelSchema.index({ influencer: 1, timestamp: -1 });
reelSchema.index({ timestamp: -1 });
reelSchema.index({ views: -1 });
reelSchema.index({ 'analysis.tags.tag': 1 });
reelSchema.index({ 'analysis.classification': 1 });

module.exports = mongoose.model('Reel', reelSchema);