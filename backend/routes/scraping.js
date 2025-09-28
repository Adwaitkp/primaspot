const express = require('express');
const router = express.Router();
const Influencer = require('../models/Influencer');
const Post = require('../models/Post');
const Reel = require('../models/Reel');
const instagramService = require('../services/InstagramService');

// Scrape influencer profile and store in database
router.post('/profile/:username', async (req, res) => {
  try {
    let { username } = req.params;
    username = username.replace(/\s+/g, '.').toLowerCase();
    const { forceUpdate } = req.query;
    
    console.log(`🚀 Starting scrape for: ${username}`);
    
    // Check if influencer already exists
    let influencer = await Influencer.findOne({ 
      username: username
    });
    
    if (influencer && !forceUpdate) {
      // Check if data is recent (less than 24 hours old)
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (influencer.lastScraped > twentyFourHoursAgo) {
        return res.json({
          success: true,
          message: 'Using cached data',
          data: influencer
        });
      }
    }
    
    // Scrape profile data using Puppeteer
    let profileData;
    try {
      profileData = await instagramService.getProfile(username);
    } catch (error) {
      // Handle various scraping errors
      if (error.message.includes('Failed to scrape profile') || 
          error.message.includes('Could not extract profile') ||
          error.message.includes('Profile may be private') ||
          error.message.includes('timeout') ||
          error.message.includes('Navigation failed')) {
        return res.status(503).json({
          success: false,
          error: 'Unable to access this profile. It may be private, deleted, or Instagram is blocking access.',
          details: error.message,
          suggestion: 'Try again in a few minutes or verify the username is correct and public.'
        });
      }
      throw error; // Re-throw if it's a different error
    }
    
    if (!profileData || !profileData.username) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found or private'
      });
    }
    
    // Update or create influencer
    const updateData = {
      ...profileData,
      lastScraped: new Date()
    };
    
    if (influencer) {
      influencer = await Influencer.findByIdAndUpdate(
        influencer._id,
        updateData,
        { new: true }
      );
    } else {
      influencer = new Influencer(updateData);
      await influencer.save();
    }
    
    console.log(`✅ Profile scraped and saved: ${username}`);
    
    res.json({
      success: true,
      message: 'Profile scraped successfully',
      data: influencer
    });
    
  } catch (error) {
    console.error('❌ Error scraping profile:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Scrape posts for an influencer
router.post('/posts/:username', async (req, res) => {
  try {
    let { username } = req.params;
    username = username.replace(/\s+/g, '.').toLowerCase();
    const { limit = 12 } = req.query;
    
    console.log(`🚀 Starting posts scrape for: ${username}`);
    
    // Find influencer
    const influencer = await Influencer.findOne({ 
      username: username.toLowerCase() 
    });
    
    if (!influencer) {
      return res.status(404).json({
        success: false,
        error: 'Influencer not found. Please scrape profile first.'
      });
    }
    
    // Scrape posts using Puppeteer
    let postsData;
    try {
      postsData = await instagramService.getPosts(username, parseInt(limit));
    } catch (error) {
      // Handle scraping errors gracefully
      if (error.message.includes('Failed to scrape posts') || 
          error.message.includes('timeout') ||
          error.message.includes('Navigation failed')) {
        return res.json({
          success: true,
          message: 'Unable to retrieve posts at this time. The profile may be private or Instagram is limiting access.',
          data: [],
          warning: error.message
        });
      }
      throw error; // Re-throw if it's a different error
    }
    
    if (postsData.length === 0) {
      return res.json({
        success: true,
        message: 'No posts found',
        data: []
      });
    }
    
    const savedPosts = [];
    
    // Process each post
    for (const postData of postsData) {
      try {
        // Check if post already exists
        const existingPost = await Post.findOne({ postId: postData.postId });
        
        if (existingPost) {
          savedPosts.push(existingPost);
          continue;
        }
        
        // Create new post
        const post = new Post({
          ...postData,
          influencer: influencer._id,
          timestamp: postData.timestamp || new Date(),
          type: postData.type || 'photo'
        });
        
        await post.save();
        savedPosts.push(post);
        
        console.log(`✅ Post saved: ${postData.postId}`);
        
      } catch (error) {
        console.error(`❌ Error processing post ${postData.postId}:`, error.message);
      }
    }
    
    // Update influencer analytics
    if (savedPosts.length > 0) {
      const totalLikes = savedPosts.reduce((sum, post) => sum + post.likes, 0);
      const totalComments = savedPosts.reduce((sum, post) => sum + post.comments, 0);
      
      influencer.analytics.averageLikes = Math.round(totalLikes / savedPosts.length);
      influencer.analytics.averageComments = Math.round(totalComments / savedPosts.length);
      influencer.analytics.lastUpdated = new Date();
      
      await influencer.save();
    }
    
    console.log(`✅ Posts scraping completed: ${savedPosts.length} posts processed`);
    
    res.json({
      success: true,
      message: `${savedPosts.length} posts processed`,
      data: savedPosts
    });
    
  } catch (error) {
    console.error('❌ Error scraping posts:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Scrape reels for an influencer
router.post('/reels/:username', async (req, res) => {
  try {
    let { username } = req.params;
    username = username.replace(/\s+/g, '.').toLowerCase();
    const { limit = 5 } = req.query;
    
    console.log(`🚀 Starting reels scrape for: ${username}`);
    
    // Find influencer
    const influencer = await Influencer.findOne({ 
      username: username.toLowerCase() 
    });
    
    if (!influencer) {
      return res.status(404).json({
        success: false,
        error: 'Influencer not found. Please scrape profile first.'
      });
    }
    
    // Scrape reels using Puppeteer
    let reelsData;
    try {
      reelsData = await instagramService.getReels(username, parseInt(limit));
    } catch (error) {
      // Handle scraping errors gracefully
      if (error.message.includes('Failed to scrape reels') || 
          error.message.includes('timeout') ||
          error.message.includes('Navigation failed')) {
        return res.json({
          success: true,
          message: 'Unable to retrieve reels at this time. The profile may be private or Instagram is limiting access.',
          data: [],
          warning: error.message
        });
      }
      throw error; // Re-throw if it's a different error
    }
    
    if (reelsData.length === 0) {
      return res.json({
        success: true,
        message: 'No reels found',
        data: []
      });
    }
    
    const savedReels = [];
    
    // Process each reel
    for (const reelData of reelsData) {
      try {
        // Check if reel already exists
        const existingReel = await Reel.findOne({ reelId: reelData.reelId });
        
        if (existingReel) {
          savedReels.push(existingReel);
          continue;
        }
        
        // Create new reel
        const reel = new Reel({
          ...reelData,
          influencer: influencer._id,
          timestamp: reelData.timestamp || new Date(),
          duration: reelData.duration || 15
        });
        
        await reel.save();
        savedReels.push(reel);
        
        console.log(`✅ Reel saved: ${reelData.reelId}`);
        
      } catch (error) {
        console.error(`❌ Error processing reel ${reelData.reelId}:`, error.message);
      }
    }
    
    console.log(`✅ Reels scraping completed: ${savedReels.length} reels processed`);
    
    res.json({
      success: true,
      message: `${savedReels.length} reels processed`,
      data: savedReels
    });
    
  } catch (error) {
    console.error('❌ Error scraping reels:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Complete scraping (profile + posts + reels)
router.post('/complete/:username', async (req, res) => {
  try {
    let { username } = req.params;
    username = username.replace(/\s+/g, '.').toLowerCase();
    const {
      postsLimit = 12,
      reelsLimit = 5,
    } = req.query;

    console.log(`🚀 Starting complete scrape for: ${username}`);
    
    const results = {
      profile: null,
      posts: [],
      reels: [],
      errors: []
    };
    
    // Step 1: Scrape profile
    try {
      const profileData = await instagramService.getProfile(username);
      
      // Find or create influencer
      let influencer = await Influencer.findOne({ username: username });
      const updateData = {
        ...profileData,
        lastScraped: new Date()
      };
      
      if (influencer) {
        influencer = await Influencer.findByIdAndUpdate(
          influencer._id,
          updateData,
          { new: true }
        );
      } else {
        influencer = new Influencer(updateData);
        await influencer.save();
      }
      
      results.profile = influencer;
      console.log(`✅ Profile scraped: ${username}`);
    } catch (error) {
      results.errors.push(`Profile scraping failed: ${error.message}`);
      console.error(`❌ Profile scraping error for ${username}:`, error.message);
    }
    
    // Step 2: Scrape posts
    if (results.profile) {
      try {
        const postsData = await instagramService.getPosts(username, parseInt(postsLimit));
        const savedPosts = [];
        
        // Process and save posts
        for (const postData of postsData) {
          try {
            const existingPost = await Post.findOne({ postId: postData.postId });
            
            if (existingPost) {
              savedPosts.push(existingPost);
              continue;
            }
            
            const post = new Post({
              ...postData,
              influencer: results.profile._id,
              timestamp: postData.timestamp || new Date(),
              type: postData.type || 'photo'
            });
            
            await post.save();
            savedPosts.push(post);
          } catch (error) {
            console.error(`❌ Error processing post ${postData.postId}:`, error.message);
          }
        }
        
        results.posts = savedPosts;
        console.log(`✅ Posts scraped: ${savedPosts.length} posts`);
      } catch (error) {
        results.errors.push(`Posts scraping failed: ${error.message}`);
        console.error(`❌ Posts scraping error for ${username}:`, error.message);
      }
    }
    
    // Step 3: Scrape reels
    if (results.profile) {
      try {
        const reelsData = await instagramService.getReels(username, parseInt(reelsLimit));
        const savedReels = [];
        
        // Process and save reels
        for (const reelData of reelsData) {
          try {
            const existingReel = await Reel.findOne({ reelId: reelData.reelId });
            
            if (existingReel) {
              savedReels.push(existingReel);
              continue;
            }
            
            const reel = new Reel({
              ...reelData,
              influencer: results.profile._id,
              timestamp: reelData.timestamp || new Date(),
              duration: reelData.duration || 15
            });
            
            await reel.save();
            savedReels.push(reel);
          } catch (error) {
            console.error(`❌ Error processing reel ${reelData.reelId}:`, error.message);
          }
        }
        
        results.reels = savedReels;
        console.log(`✅ Reels scraped: ${savedReels.length} reels`);
      } catch (error) {
        results.errors.push(`Reels scraping failed: ${error.message}`);
        console.error(`❌ Reels scraping error for ${username}:`, error.message);
      }
    }


    
    console.log(`✅ Complete scraping finished for: ${username}`);
    
    const summary = {
      profileScraped: !!results.profile,
      postsCount: results.posts.length,
      reelsCount: results.reels.length,
      errorsCount: results.errors.length
    };

    // Always return success with whatever data we could get
    const message = summary.errorsCount > 0 ? 
      'Scraping completed with some issues - Instagram may be blocking access' : 
      'Complete scraping finished successfully';

    if (summary.errorsCount > 0) {
      console.warn(`⚠️ Complete scraping finished with issues for: ${username}`);
    }

    res.json({
      success: true,
      message,
      data: results,
      summary,
      warnings: results.errors.length > 0 ? results.errors : undefined
    });
    
  } catch (error) {
    console.error('❌ Error in complete scraping:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get scraping status
router.get('/status', async (req, res) => {
  try {
    const recentInfluencers = await Influencer.find()
      .sort({ lastScraped: -1 })
      .limit(10)
      .select('username fullName lastScraped followers postsCount');
    
    const stats = await Influencer.aggregate([
      {
        $group: {
          _id: null,
          totalInfluencers: { $sum: 1 },
          totalFollowers: { $sum: '$followers' },
          avgFollowers: { $avg: '$followers' },
          lastUpdate: { $max: '$lastScraped' }
        }
      }
    ]);
    
    const postsCount = await Post.countDocuments();
    const reelsCount = await Reel.countDocuments();
    
    res.json({
      success: true,
      data: {
        stats: stats[0] || {},
        postsCount,
        reelsCount,
        recentInfluencers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;