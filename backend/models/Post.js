const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  influencer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Influencer',
    required: true
  },
  postId: {
    type: String,
    required: true,
    unique: true
  },
  shortcode: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['photo', 'video', 'carousel'],
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  displayUrl: {
    type: String,
    default: ''
  },
  caption: {
    type: String,
    default: ''
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0 // For video posts
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
  location: {
    name: String,
    latitude: Number,
    longitude: Number
  },
  // Image Analysis Results
  analysis: {
    tags: [{
      tag: String,
      confidence: Number
    }],
    vibe: {
      type: String,
      enum: ['casual', 'aesthetic', 'luxury', 'energetic', 'minimalist', 'vintage', 'professional', 'fun'],
      default: 'casual'
    },
    quality: {
      lighting: {
        type: String,
        enum: ['excellent', 'good', 'average', 'poor'],
        default: 'average'
      },
      composition: {
        type: String,
        enum: ['excellent', 'good', 'average', 'poor'],
        default: 'average'
      },
      visualAppeal: {
        type: Number,
        min: 1,
        max: 10,
        default: 5
      }
    },
    colors: [{
      color: String,
      percentage: Number
    }],
    objects: [{
      object: String,
      confidence: Number,
      boundingBox: {
        x: Number,
        y: Number,
        width: Number,
        height: Number
      }
    }],
    faces: {
      count: {
        type: Number,
        default: 0
      },
      emotions: [{
        emotion: String,
        confidence: Number
      }]
    }
  },
  performance: {
    engagementRate: {
      type: Number,
      default: 0
    },
    likesToFollowersRatio: {
      type: Number,
      default: 0
    },
    commentsToLikesRatio: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Calculate performance metrics before saving
postSchema.pre('save', async function(next) {
  if (this.likes > 0) {
    // Get influencer to calculate ratios
    const Influencer = mongoose.model('Influencer');
    const influencer = await Influencer.findById(this.influencer);
    
    if (influencer) {
      this.performance.engagementRate = (((this.likes + this.comments) / influencer.followers) * 100).toFixed(2);
      this.performance.likesToFollowersRatio = ((this.likes / influencer.followers) * 100).toFixed(2);
      if (this.likes > 0) {
        this.performance.commentsToLikesRatio = ((this.comments / this.likes) * 100).toFixed(2);
      }
    }
  }
  next();
});

// Indexes for efficient queries
postSchema.index({ influencer: 1, timestamp: -1 });
postSchema.index({ timestamp: -1 });
postSchema.index({ likes: -1 });
postSchema.index({ 'analysis.tags.tag': 1 });

module.exports = mongoose.model('Post', postSchema);