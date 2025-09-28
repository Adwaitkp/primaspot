import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Heart, MessageCircle, Eye, Users, Target, Calendar, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const AnalyticsCharts = ({ analytics, loading = false }) => {
  if (loading) {
    return <AnalyticsChartsLoader />;
  }

  if (!analytics) {
    return (
      <div className="bg-gray-800 rounded-2xl p-8 text-center">
        <TrendingUp size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
        <p className="text-lg text-gray-400">No analytics data available</p>
        <p className="text-sm text-gray-500">Analytics will appear once data is collected.</p>
      </div>
    );
  }

  const { posts, reels, engagementTrends, topPerformingPosts, contentAnalysis } = analytics;

  // Process engagement trends data
  const processedTrends = engagementTrends?.map(trend => ({
    date: trend.date,
    likes: trend.likes,
    comments: trend.comments,
    engagement: trend.likes + trend.comments,
    posts: trend.posts
  })) || [];

  // Process content analysis for pie chart
  const contentData = contentAnalysis?.slice(0, 8).map((item, index) => ({
    name: item._id,
    value: item.count,
    color: `hsl(${index * 45}, 70%, 60%)`
  })) || [];

  // Create performance comparison data
  const performanceData = [
    {
      name: 'Posts',
      avgLikes: posts?.avgLikes || 0,
      avgComments: posts?.avgComments || 0,
      avgEngagement: posts?.avgEngagement || 0,
      total: posts?.totalPosts || 0
    },
    {
      name: 'Reels',
      avgLikes: reels?.avgLikes || 0,
      avgComments: reels?.avgComments || 0,
      avgEngagement: reels?.avgEngagement || 0,
      total: reels?.totalReels || 0
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={<Heart className="text-pink-400" />}
          title="Total Likes"
          value={(posts?.totalLikes || 0) + (reels?.totalLikes || 0)}
          change={12.5}
          color="pink"
        />
        <StatsCard
          icon={<MessageCircle className="text-blue-400" />}
          title="Total Comments"
          value={(posts?.totalComments || 0) + (reels?.totalComments || 0)}
          change={8.3}
          color="blue"
        />
        <StatsCard
          icon={<Eye className="text-green-400" />}
          title="Total Views"
          value={reels?.totalViews || 0}
          change={15.7}
          color="green"
        />
        <StatsCard
          icon={<Target className="text-purple-400" />}
          title="Avg Engagement"
          value={`${((posts?.avgEngagement || 0) + (reels?.avgEngagement || 0)) / 2}%`}
          change={5.2}
          color="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Engagement Trends Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp size={20} />
            Engagement Trends
          </h3>
          
          {processedTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={processedTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF" 
                  fontSize={12}
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <Area
                  type="monotone"
                  dataKey="likes"
                  stackId="1"
                  stroke="#EC4899"
                  fill="#EC4899"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="comments"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                <p>No trend data available</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Posts vs Reels Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Award size={20} />
            Performance Comparison
          </h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Bar dataKey="avgLikes" fill="#EC4899" name="Avg Likes" />
              <Bar dataKey="avgComments" fill="#3B82F6" name="Avg Comments" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Content Analysis Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Users size={20} />
            Content Categories
          </h3>
          
          {contentData.length > 0 ? (
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <ResponsiveContainer width="60%" height={250}>
                <PieChart>
                  <Pie
                    data={contentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {contentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Legend */}
              <div className="flex-1 space-y-2">
                {contentData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-gray-300 text-sm capitalize flex-1">
                      {entry.name}
                    </span>
                    <span className="text-gray-400 text-sm font-semibold">
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Award size={48} className="mx-auto mb-4 opacity-50" />
                <p>No content analysis available</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Top Performing Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Award size={20} />
            Top Performing Posts
          </h3>
          
          {topPerformingPosts && topPerformingPosts.length > 0 ? (
            <div className="space-y-4">
              {topPerformingPosts.slice(0, 5).map((post, index) => (
                <div key={post.postId || `top-post-${index}`} className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-600">
                    <img
                      src={post.imageUrl}
                      alt="Top post"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/48x48?text=?';
                      }}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-400 text-sm">#{index + 1}</span>
                      <span className="text-green-400 text-sm font-semibold">
                        {post.performance?.engagementRate}% ER
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Heart size={12} />
                        {formatNumber(post.likes)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={12} />
                        {formatNumber(post.comments)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Heart size={48} className="mx-auto mb-4 opacity-50" />
                <p>No posts data available</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const StatsCard = ({ icon, title, value, change, color }) => {
  const formatValue = (val) => {
    if (typeof val === 'string') return val;
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1) + 'K';
    return val?.toString() || '0';
  };

  const colorClasses = {
    pink: 'bg-pink-600',
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600'
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gray-800 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`${colorClasses[color]} p-3 rounded-lg`}>
          {icon}
        </div>
        {change && (
          <div className="text-green-400 text-sm flex items-center gap-1">
            <TrendingUp size={14} />
            +{change}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">
        {formatValue(value)}
      </div>
      <div className="text-gray-400 text-sm">{title}</div>
    </motion.div>
  );
};

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num?.toString() || '0';
};

const AnalyticsChartsLoader = () => (
  <div className="space-y-6">
    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-800 rounded-xl p-6 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
            <div className="w-16 h-4 bg-gray-700 rounded"></div>
          </div>
          <div className="w-20 h-8 bg-gray-700 rounded mb-1"></div>
          <div className="w-24 h-4 bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
    
    {/* Charts Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-800 rounded-2xl p-6 animate-pulse">
          <div className="w-48 h-6 bg-gray-700 rounded mb-6"></div>
          <div className="w-full h-[300px] bg-gray-700 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

export default AnalyticsCharts;