import React, { useState, useEffect } from 'react';
import { Search, Download, RefreshCw, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileHeader from './components/ProfileHeader';
import PostsGrid from './components/PostsGrid';
import ReelsSection from './components/ReelsSection';
import AnalyticsCharts from './components/AnalyticsCharts';
import ApiService from './services/ApiService';

function App() {
  const [username, setUsername] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentInfluencer, setCurrentInfluencer] = useState(null);
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState({
    profile: false,
    posts: false,
    reels: false,
    analytics: false,
    scraping: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Load influencer data
  const loadInfluencerData = async (username, forceRefresh = false) => {
    if (!username.trim()) return;
    
    setError('');
    setSuccess('');
    
    // Always scrape new data
    setLoading(prev => ({ ...prev, scraping: true }));
    setSuccess('🚀 Connecting to Instagram...');
    
    // Update progress message after 10 seconds
    const progressTimer = setTimeout(() => {
      setSuccess('⏳ Scraping Instagram data - this may take up to 2 minutes...');
    }, 10000);
    
    try {
      const scrapeResponse = await ApiService.scrapeComplete(username, {
        postsLimit: 12,
        reelsLimit: 5,
        analyzeContent: true
      });
      
      clearTimeout(progressTimer);

      if (scrapeResponse.success) {
        
        
        // Backend returns data in results format: { profile, posts, reels, errors }
        const profile = scrapeResponse.data.profile;
        const scrapedPosts = scrapeResponse.data.posts || [];
        const scrapedReels = scrapeResponse.data.reels || [];
        
        
        
        setCurrentInfluencer(profile);
        
        setPosts(scrapedPosts);
        setReels(scrapedReels);
        setAnalytics(null); // Will be calculated in ProfileHeader from posts/reels
        
        setSuccess(`Successfully scraped data for @${username}!`);
      } else {
        throw new Error(scrapeResponse.error || 'Failed to scrape data');
      }

    } catch (err) {
      clearTimeout(progressTimer);
      console.error('Error loading influencer data:', err);
      const errorInfo = ApiService.handleApiError(err);
      
      if (err.code === 'ECONNABORTED') {
        setError('Instagram scraping is taking longer than expected. This may be due to Instagram\'s rate limiting. Please try again in a few minutes.');
      } else {
        setError(errorInfo.message);
      }
    } finally {
      setLoading({
        profile: false,
        posts: false,
        reels: false,
        analytics: false,
        scraping: false
      });
    }
  };

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const cleanUsername = searchQuery.replace('@', '').trim();
    setUsername(cleanUsername);
    await loadInfluencerData(cleanUsername);
  };

  // Handle refresh button
  const handleRefresh = () => {
    if (username) {
      loadInfluencerData(username, true);
    }
  };

  // Clear messages after timeout
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const isLoading = Object.values(loading).some(Boolean);

  

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">PrimaSpot Analytics</h1>
              <p className="text-gray-400">Advanced Instagram influencer analytics platform</p>
            </div>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-3 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Enter username (e.g., @username)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                {loading.scraping ? <Loader className="animate-spin" size={16} /> : <Search size={16} />}
                Search
              </button>
              {username && (
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <RefreshCw className={isLoading ? 'animate-spin' : ''} size={16} />
                  Refresh
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-red-600 text-white p-4 rounded-lg flex items-center gap-3"
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </motion.div>
          )}
          
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-green-600 text-white p-4 rounded-lg flex items-center gap-3"
            >
              <CheckCircle size={20} />
              <span>{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        {currentInfluencer ? (
          <div className="space-y-6">
            {/* Profile Header */}
            <ProfileHeader 
              influencer={currentInfluencer} 
              posts={posts} 
              reels={reels} 
              loading={loading.profile} 
            />
            
            {/* Navigation Tabs */}
            <div className="bg-gray-800 rounded-lg p-1 flex gap-1 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', count: null },
                { id: 'posts', label: 'Posts', count: posts.length },
                { id: 'reels', label: 'Reels', count: reels.length },
                { id: 'analytics', label: 'Analytics', count: null }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-md font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <AnalyticsCharts analytics={analytics} loading={loading.analytics} />
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <PostsGrid posts={posts.slice(0, 6)} loading={loading.posts} />
                    <ReelsSection reels={reels.slice(0, 3)} loading={loading.reels} />
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'posts' && (
                <motion.div
                  key="posts"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <PostsGrid posts={posts} loading={loading.posts} />
                </motion.div>
              )}
              
              {activeTab === 'reels' && (
                <motion.div
                  key="reels"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ReelsSection reels={reels} loading={loading.reels} />
                </motion.div>
              )}
              
              {activeTab === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AnalyticsCharts analytics={analytics} loading={loading.analytics} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* Welcome Screen */
          <div className="text-center py-20">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Search size={48} className="text-white" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">
                  Discover Instagram Insights
                </h2>
                <p className="text-xl text-gray-400 mb-8">
                  Enter an Instagram username to analyze their profile, posts, reels, and engagement metrics with AI-powered insights.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-gray-800 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <Search size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Profile Analysis</h3>
                  <p className="text-gray-400 text-sm">
                    Get comprehensive profile insights including follower count, engagement rates, and audience demographics.
                  </p>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <Download size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Content Analysis</h3>
                  <p className="text-gray-400 text-sm">
                    AI-powered analysis of posts and reels including object detection, mood classification, and quality scoring.
                  </p>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Performance Metrics</h3>
                  <p className="text-gray-400 text-sm">
                    Track engagement trends, top performing content, and detailed analytics with interactive charts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


export default App;
