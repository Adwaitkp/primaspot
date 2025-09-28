import React from 'react';
import { Play, Heart, MessageCircle, Eye, Share, Clock, Music, Tag, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const ReelsSection = ({ reels, loading = false }) => {
  if (loading) {
    return <ReelsSectionSkeleton />;
  }

  if (!reels || reels.length === 0) {
    return (
      <div className="bg-gray-800 rounded-2xl p-8 text-center">
        <div className="text-gray-400 mb-4">
          <Play size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No reels found</p>
          <p className="text-sm">This influencer hasn't created any reels yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Play size={24} />
          Recent Reels
        </h2>
        <span className="text-gray-400 text-sm">{reels.length} reels</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {reels.filter(reel => reel && (reel.reelId || reel.shortcode)).map((reel, index) => {
          const key = [reel.reelId, reel.shortcode, reel.timestamp && new Date(reel.timestamp).getTime(), index]
            .filter(Boolean)
            .join('_') || `reel-${index}`;
          return <ReelCard key={key} reel={reel} index={index} />;
        })}
      </div>
    </div>
  );
};

const ReelCard = ({ reel, index }) => {
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const truncateText = (text, maxLength = 80) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getVibeColor = (vibe) => {
    const colors = {
      party: 'bg-pink-600',
      travel: 'bg-blue-600',
      luxury: 'bg-yellow-600',
      casual: 'bg-gray-600',
      energetic: 'bg-red-600',
      calm: 'bg-green-600',
      romantic: 'bg-purple-600',
      funny: 'bg-orange-600',
      educational: 'bg-indigo-600',
      inspirational: 'bg-teal-600'
    };
    return colors[vibe] || 'bg-gray-600';
  };

  const getClassificationIcon = (classification) => {
    const icons = {
      dance: '💃',
      tutorial: '📚',
      lifestyle: '🌟',
      comedy: '😂',
      travel: '✈️',
      food: '🍕',
      fashion: '👗',
      fitness: '💪',
      music: '🎵',
      other: '🎬'
    };
    return icons[classification] || '🎬';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-gray-700 rounded-xl overflow-hidden group cursor-pointer relative"
    >
      {/* Reel Thumbnail */}
      <div className="relative aspect-[9/16] overflow-hidden">
        <img
          src={reel.thumbnailUrl || 'https://via.placeholder.com/270x480?text=No+Thumbnail'}
          alt="Reel thumbnail"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/270x480?text=No+Thumbnail';
          }}
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white bg-opacity-90 rounded-full p-3 group-hover:bg-opacity-100 transition-all duration-300"
          >
            <Play size={24} className="text-gray-900 ml-1" fill="currentColor" />
          </motion.div>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <Clock size={12} />
          {formatDuration(reel.duration)}
        </div>

        {/* Vibe Badge */}
        {reel.analysis?.vibe && (
          <div className="absolute top-3 left-3">
            <span className={`${getVibeColor(reel.analysis.vibe)} text-white px-2 py-1 rounded-full text-xs capitalize`}>
              {reel.analysis.vibe}
            </span>
          </div>
        )}

        {/* Classification Badge */}
        {reel.analysis?.classification && (
          <div className="absolute top-3 right-3">
            <span className="bg-gray-900 bg-opacity-70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              {getClassificationIcon(reel.analysis.classification)}
              {reel.analysis.classification}
            </span>
          </div>
        )}

        {/* Stats Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent p-3">
          <div className="space-y-2">
            {/* Engagement Stats */}
            <div className="flex items-center justify-between text-white text-sm">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Eye size={14} />
                  <span>{formatNumber(reel.views)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart size={14} />
                  <span>{formatNumber(reel.likes)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle size={14} />
                  <span>{formatNumber(reel.comments)}</span>
                </div>
              </div>
              {reel.shares > 0 && (
                <div className="flex items-center gap-1">
                  <Share size={14} />
                  <span>{formatNumber(reel.shares)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reel Details */}
      <div className="p-3 space-y-2">
        {/* Caption */}
        {reel.caption && (
          <p className="text-gray-300 text-sm leading-tight">
            {truncateText(reel.caption)}
          </p>
        )}

        {/* Music Info */}
        {reel.music?.title && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Music size={12} />
            <span className="truncate">
              {reel.music.title} {reel.music.artist && `- ${reel.music.artist}`}
            </span>
          </div>
        )}

        {/* Performance Metrics */}
        {reel.performance?.engagementRate && (
          <div className="flex items-center justify-between text-xs">
            <div className="text-green-400">
              ER: {reel.performance.engagementRate}%
            </div>
            {reel.performance.viewsToFollowersRatio && (
              <div className="text-blue-400">
                Reach: {reel.performance.viewsToFollowersRatio}%
              </div>
            )}
          </div>
        )}

        {/* Video Analysis Tags */}
        {reel.analysis?.tags && reel.analysis.tags.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-400">
              <Tag size={10} />
              <span className="text-xs font-semibold">AI Tags</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {reel.analysis.tags.slice(0, 3).map((tagObj, tagIndex) => (
                <span
                  key={tagIndex}
                  className="bg-purple-600 text-white px-1.5 py-0.5 rounded-full text-xs"
                  title={`Confidence: ${Math.round(tagObj.confidence * 100)}% at ${Math.round(tagObj.timestamp)}s`}
                >
                  {tagObj.tag}
                </span>
              ))}
              {reel.analysis.tags.length > 3 && (
                <span className="bg-gray-600 text-white px-1.5 py-0.5 rounded-full text-xs">
                  +{reel.analysis.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Quality Indicators */}
        {reel.analysis?.quality && (
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className="text-center bg-gray-800 rounded px-2 py-1">
              <div className="text-gray-300 font-semibold">{reel.analysis.quality.resolution}</div>
              <div className="text-gray-500">Quality</div>
            </div>
            <div className="text-center bg-gray-800 rounded px-2 py-1">
              <div className="text-gray-300 capitalize font-semibold">{reel.analysis.quality.stability}</div>
              <div className="text-gray-500">Stability</div>
            </div>
          </div>
        )}

        {/* Activities */}
        {reel.analysis?.activities && reel.analysis.activities.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-400">
              <Zap size={10} />
              <span className="text-xs font-semibold">Activities</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {reel.analysis.activities.slice(0, 2).map((activity, actIndex) => (
                <span
                  key={actIndex}
                  className="bg-orange-600 text-white px-1.5 py-0.5 rounded-full text-xs"
                  title={`${activity.activity} (${Math.round(activity.confidence * 100)}% confidence)`}
                >
                  {activity.activity}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Date */}
        <div className="text-gray-500 text-xs">
          {new Date(reel.timestamp).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  );
};

const ReelsSectionSkeleton = () => (
  <div className="bg-gray-800 rounded-2xl p-6">
    <div className="flex items-center justify-between mb-6">
      <div className="h-8 bg-gray-700 rounded w-32 animate-pulse"></div>
      <div className="h-4 bg-gray-700 rounded w-16 animate-pulse"></div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="bg-gray-700 rounded-xl overflow-hidden animate-pulse">
          <div className="aspect-[9/16] bg-gray-600"></div>
          <div className="p-3 space-y-2">
            <div className="h-3 bg-gray-600 rounded w-full"></div>
            <div className="h-3 bg-gray-600 rounded w-2/3"></div>
            <div className="flex gap-1">
              <div className="h-5 bg-gray-600 rounded-full w-12"></div>
              <div className="h-5 bg-gray-600 rounded-full w-12"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ReelsSection;