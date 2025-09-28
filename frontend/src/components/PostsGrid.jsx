import React from 'react';
import { Heart, MessageCircle, Eye, Calendar, Tag, Palette, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const PostsGrid = ({ posts, loading = false }) => {
  if (loading) {
    return <PostsGridSkeleton />;
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="bg-gray-800 rounded-2xl p-8 text-center">
        <div className="text-gray-400 mb-4">
          <Heart size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No posts found</p>
          <p className="text-sm">This influencer hasn't posted any content yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Recent Posts</h2>
        <span className="text-gray-400 text-sm">{posts.length} posts</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.filter(post => post && (post.postId || post.shortcode)).map((post, index) => {
          const key = [post.postId, post.shortcode, post.timestamp && new Date(post.timestamp).getTime(), index]
            .filter(Boolean)
            .join('_') || `post-${index}`;
          return <PostCard key={key} post={post} index={index} />;
        })}
      </div>
    </div>
  );
};

const PostCard = ({ post, index }) => {
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const getVibeColor = (vibe) => {
    const colors = {
      luxury: 'bg-yellow-600',
      aesthetic: 'bg-purple-600',
      casual: 'bg-blue-600',
      energetic: 'bg-red-600',
      minimalist: 'bg-gray-600',
      vintage: 'bg-orange-600',
      professional: 'bg-indigo-600',
      fun: 'bg-pink-600'
    };
    return colors[vibe] || 'bg-gray-600';
  };

  const getQualityColor = (score) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    if (score >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-gray-700 rounded-xl overflow-hidden group cursor-pointer"
    >
      {/* Post Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={post.imageUrl || 'https://via.placeholder.com/400x400?text=No+Image'}
          alt="Post content"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
          }}
        />
        
        {/* Overlay with stats */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-2">
                <Heart size={20} />
                <span className="text-lg font-semibold">{formatNumber(post.likes)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle size={20} />
                <span className="text-lg font-semibold">{formatNumber(post.comments)}</span>
              </div>
              {post.views > 0 && (
                <div className="flex items-center gap-2">
                  <Eye size={20} />
                  <span className="text-lg font-semibold">{formatNumber(post.views)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Post Type Badge */}
        <div className="absolute top-3 right-3">
          {post.type === 'carousel' && (
            <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
              📸 Carousel
            </span>
          )}
          {post.type === 'video' && (
            <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs">
              🎥 Video
            </span>
          )}
        </div>

        {/* Vibe Badge */}
        {post.analysis?.vibe && (
          <div className="absolute top-3 left-3">
            <span className={`${getVibeColor(post.analysis.vibe)} text-white px-2 py-1 rounded-full text-xs capitalize`}>
              {post.analysis.vibe}
            </span>
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="p-4 space-y-3">
        {/* Caption */}
        {post.caption && (
          <p className="text-gray-300 text-sm leading-relaxed">
            {truncateText(post.caption)}
          </p>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-pink-400">
              <Heart size={16} />
              <span>{formatNumber(post.likes)}</span>
            </div>
            <div className="flex items-center gap-1 text-blue-400">
              <MessageCircle size={16} />
              <span>{formatNumber(post.comments)}</span>
            </div>
            {post.performance?.engagementRate && (
              <div className="text-green-400">
                {post.performance.engagementRate}% ER
              </div>
            )}
          </div>
          <div className="text-gray-500 flex items-center gap-1">
            <Calendar size={14} />
            <span>{new Date(post.timestamp).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Image Analysis Tags */}
        {post.analysis?.tags && post.analysis.tags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
              <Tag size={14} />
              <span className="text-xs font-semibold">AI Tags</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {post.analysis.tags.slice(0, 4).map((tagObj, tagIndex) => (
                <span
                  key={tagIndex}
                  className="bg-indigo-600 text-white px-2 py-1 rounded-full text-xs"
                  title={`Confidence: ${Math.round(tagObj.confidence * 100)}%`}
                >
                  {tagObj.tag}
                </span>
              ))}
              {post.analysis.tags.length > 4 && (
                <span className="bg-gray-600 text-white px-2 py-1 rounded-full text-xs">
                  +{post.analysis.tags.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Quality Indicators */}
        {post.analysis?.quality && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
              <Sparkles size={14} />
              <span className="text-xs font-semibold">Quality Analysis</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className={`font-semibold ${getQualityColor(post.analysis.quality.visualAppeal)}`}>
                  {post.analysis.quality.visualAppeal}/10
                </div>
                <div className="text-gray-500">Visual</div>
              </div>
              <div className="text-center">
                <div className="text-gray-300 capitalize font-semibold">
                  {post.analysis.quality.lighting}
                </div>
                <div className="text-gray-500">Lighting</div>
              </div>
              <div className="text-center">
                <div className="text-gray-300 capitalize font-semibold">
                  {post.analysis.quality.composition}
                </div>
                <div className="text-gray-500">Composition</div>
              </div>
            </div>
          </div>
        )}

        {/* Dominant Colors */}
        {post.analysis?.colors && post.analysis.colors.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
              <Palette size={14} />
              <span className="text-xs font-semibold">Dominant Colors</span>
            </div>
            <div className="flex gap-1">
              {post.analysis.colors.slice(0, 5).map((colorObj, colorIndex) => (
                <div
                  key={colorIndex}
                  className="w-6 h-6 rounded-full border-2 border-gray-600"
                  style={{ backgroundColor: colorObj.color }}
                  title={`${colorObj.color}: ${colorObj.percentage}%`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const PostsGridSkeleton = () => (
  <div className="bg-gray-800 rounded-2xl p-6">
    <div className="flex items-center justify-between mb-6">
      <div className="h-8 bg-gray-700 rounded w-32 animate-pulse"></div>
      <div className="h-4 bg-gray-700 rounded w-16 animate-pulse"></div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-gray-700 rounded-xl overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-600"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-600 rounded w-full"></div>
            <div className="h-4 bg-gray-600 rounded w-2/3"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-600 rounded-full w-16"></div>
              <div className="h-6 bg-gray-600 rounded-full w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default PostsGrid;