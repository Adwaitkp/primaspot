import React from 'react';
import { Users, Eye, Heart, MessageCircle, TrendingUp, Award, Globe, Calendar, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileHeader = ({ influencer, posts = [], reels = [], loading = false }) => {
  if (loading) {
    return <ProfileHeaderSkeleton />;
  }

  if (!influencer) {
    return null;
  }

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toString() || '0';
  };

  // Calculate analytics from posts and reels
  const allContent = [...posts, ...reels];
  const totalLikes = allContent.reduce((sum, item) => sum + (item.likes || 0), 0);
  const totalComments = allContent.reduce((sum, item) => sum + (item.comments || 0), 0);
  const averageLikes = allContent.length > 0 ? Math.round(totalLikes / allContent.length) : 0;
  const averageComments = allContent.length > 0 ? Math.round(totalComments / allContent.length) : 0;
  const engagementRate = influencer.followers > 0 && allContent.length > 0 ? 
    ((totalLikes + totalComments) / (allContent.length * influencer.followers) * 100).toFixed(2) : 0;

  const getEngagementColor = (rate) => {
    if (rate >= 3) return 'text-green-400';
    if (rate >= 1.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-2xl p-6 mb-6"
    >
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
        {/* Profile Picture */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative"
        >
          <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl overflow-hidden bg-gray-700">
            <img
              src={influencer.profilePicUrl || 'https://via.placeholder.com/160x160?text=No+Image'}
              alt={`${influencer.fullName} profile`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/160x160?text=No+Image';
              }}
            />
          </div>
          {influencer.isVerified && (
            <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
              <CheckCircle size={20} className="text-white" />
            </div>
          )}
        </motion.div>

        {/* Profile Info */}
        <div className="flex-1 text-center lg:text-left">
          <div className="mb-4">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              {influencer.fullName}
            </h1>
            <p className="text-xl text-gray-400 mb-2">
              @{influencer.username}
            </p>
            
            {influencer.category && (
              <span className="inline-flex items-center gap-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                <Award size={16} />
                {influencer.category.charAt(0).toUpperCase() + influencer.category.slice(1)}
              </span>
            )}
          </div>

          {influencer.biography && (
            <p className="text-gray-300 mb-4 max-w-2xl">
              {influencer.biography}
            </p>
          )}

          {influencer.website && (
            <a
              href={influencer.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-4"
            >
              <Globe size={16} />
              {influencer.website.replace(/^https?:\/\//, '')}
            </a>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Users size={20} />}
              label="Followers"
              value={formatNumber(influencer.followers)}
              color="text-blue-400"
            />
            <StatCard
              icon={<Eye size={20} />}
              label="Following"
              value={formatNumber(influencer.following)}
              color="text-green-400"
            />
            <StatCard
              icon={<Heart size={20} />}
              label="Posts"
              value={formatNumber(influencer.postsCount)}
              color="text-red-400"
            />
            <StatCard
              icon={<TrendingUp size={20} />}
              label="Engagement"
              value={`${engagementRate}%`}
              color={getEngagementColor(engagementRate)}
            />
          </div>

          {/* Analytics Preview */}
          {allContent.length > 0 && (
            <div className="mt-6 p-4 bg-gray-700 rounded-xl">
              <h3 className="text-lg font-semibold text-white mb-3">Quick Analytics</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-400">
                    {formatNumber(averageLikes)}
                  </div>
                  <div className="text-gray-400">Avg Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {formatNumber(averageComments)}
                  </div>
                  <div className="text-gray-400">Avg Comments</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {new Date(influencer.analytics.lastUpdated || influencer.lastScraped).toLocaleDateString()}
                  </div>
                  <div className="text-gray-400">Last Updated</div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy and Verification Status */}
          <div className="flex flex-wrap gap-2 mt-4">
            {influencer.isPrivate && (
              <span className="flex items-center gap-1 bg-orange-600 text-white px-3 py-1 rounded-full text-xs">
                <Calendar size={14} />
                Private Account
              </span>
            )}
            {influencer.isVerified && (
              <span className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
                <CheckCircle size={14} />
                Verified
              </span>
            )}
            <span className="flex items-center gap-1 bg-gray-600 text-white px-3 py-1 rounded-full text-xs">
              <Calendar size={14} />
              Scraped {new Date(influencer.lastScraped).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-gray-700 rounded-xl p-4 text-center"
  >
    <div className={`${color} mb-2 flex justify-center`}>
      {icon}
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-xs text-gray-400 uppercase tracking-wide">{label}</div>
  </motion.div>
);

const ProfileHeaderSkeleton = () => (
  <div className="bg-gray-800 rounded-2xl p-6 mb-6 animate-pulse">
    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
      {/* Profile Picture Skeleton */}
      <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl bg-gray-700"></div>
      
      {/* Profile Info Skeleton */}
      <div className="flex-1">
        <div className="h-8 bg-gray-700 rounded w-64 mb-2"></div>
        <div className="h-6 bg-gray-700 rounded w-32 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-96 mb-4"></div>
        
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-700 rounded-xl p-4">
              <div className="h-5 bg-gray-600 rounded mb-2"></div>
              <div className="h-8 bg-gray-600 rounded mb-1"></div>
              <div className="h-3 bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ProfileHeader;