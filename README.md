# PrimaSpot - Instagram Influencer Analytics Platform

A comprehensive full-stack application for analyzing Instagram influencers using the `instagram-web-api`, with an interactive analytics dashboard.

## 🚀 Features

### Backend Features
- **Instagram API Integration**: Uses the `instagram-web-api` library for data access.
- **Comprehensive API**: REST endpoints for all data access and analytics.
- **Database**: MongoDB with optimized schemas for influencers, posts, and reels.
- **Performance**: Rate limiting, compression, and security middleware.

### Frontend Features
- **Modern React**: Functional components with hooks and state management.
- **Interactive Dashboard**: Profile overview, analytics, posts grid, and reels section.
- **Advanced Charts**: Engagement trends and performance comparisons.
- **Responsive Design**: Mobile-first design with Tailwind CSS.
- **Real-time Updates**: Live data fetching and smooth animations.
- **Search & Discovery**: Influencer search with comprehensive filtering.

### Analytics & Insights
- **Engagement Metrics**: Likes, comments, views, and engagement rates.
- **Performance Trends**: Time-based analytics and growth tracking.
- **Top Performing Content**: Identify best-performing posts and reels.

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **instagram-web-api** for Instagram data scraping

### Frontend
- **React 19** with modern hooks and functional components
- **Tailwind CSS** for responsive styling
- **Recharts** for data visualization and analytics
- **Framer Motion** for smooth animations and transitions
- **Lucide React** for consistent iconography
- **Axios** for API communication

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- An Instagram account
- Git

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env file with your Instagram credentials
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🔧 Configuration

### Environment Variables (`backend/.env`)
Add your Instagram account credentials to the `backend/.env` file.

```bash
# Database
MONGO_URI=mongodb://localhost:27017/primaspot

# Server
PORT=3001
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:5173

# Instagram Credentials
INSTAGRAM_USERNAME=your_instagram_username
INSTAGRAM_PASSWORD=your_instagram_password
```

## 🚀 Usage

### Starting the Application
1. **Start MongoDB** (if using local instance)
2. **Start Backend**: `cd backend && npm run dev`
3. **Start Frontend**: `cd frontend && npm run dev`
4. **Access Application**: Open `http://localhost:5173`

### Basic Workflow
1. **Search Influencer**: Enter Instagram username in search bar
2. **View Profile**: Comprehensive profile overview with stats
3. **Analyze Content**: AI-powered analysis of posts and reels
4. **Track Performance**: Interactive charts and engagement metrics
5. **Export Data**: Download analytics reports (future feature)

## 📊 API Endpoints

### Influencer Endpoints
- `GET /api/influencers` - List all influencers
- `GET /api/influencers/:username` - Get specific influencer
- `GET /api/influencers/:username/posts` - Get influencer posts
- `GET /api/influencers/:username/reels` - Get influencer reels
- `GET /api/influencers/:username/analytics` - Get analytics data

### Scraping Endpoints
- `POST /api/scraping/profile/:username` - Scrape profile data
- `POST /api/scraping/posts/:username` - Scrape posts with analysis
- `POST /api/scraping/reels/:username` - Scrape reels with analysis
- `POST /api/scraping/complete/:username` - Complete scraping pipeline

## 🔍 Data Analysis Features

### Image Analysis
- **Object Detection**: Identify objects, people, and scenes
- **Color Analysis**: Dominant colors and palette extraction
- **Quality Assessment**: Lighting, composition, and visual appeal scores
- **Tag Generation**: AI-generated descriptive tags
- **Vibe Classification**: Mood and ambience detection

### Video Analysis
- **Activity Recognition**: Detect actions and movements
- **Scene Classification**: Identify video content categories
- **Quality Metrics**: Resolution, stability, and audio quality
- **Temporal Analysis**: Time-based object and activity tracking

### Performance Metrics
- **Engagement Rate**: Likes and comments relative to followers
- **Growth Tracking**: Follower and engagement trends
- **Content Performance**: Top-performing posts identification
- **Comparative Analysis**: Posts vs reels performance

## 🔒 Security & Compliance

### Data Privacy
- No personal data storage beyond public Instagram information
- Configurable data retention policies
- GDPR-compliant data handling

### Scraping Ethics
- Respects Instagram's robots.txt and terms of service
- Implements rate limiting to avoid overloading servers
- Uses public data only, no private account access

### Security Features
- Request rate limiting
- Input validation and sanitization
- CORS configuration
- Error handling and logging

## 🚧 Future Enhancements

### Advanced Features
- **Real-time Monitoring**: Live engagement tracking
- **Competitor Analysis**: Multi-influencer comparisons
- **Predictive Analytics**: Engagement prediction models
- **Export Functionality**: PDF/Excel report generation
- **Collaboration Tools**: Team sharing and commenting

### Technical Improvements
- **Caching Layer**: Redis for improved performance
- **Queue System**: Background job processing
- **Microservices**: Scalable architecture migration
- **GraphQL API**: Alternative to REST endpoints

## 📈 Performance Optimization

### Backend Optimization
- Database indexing for fast queries
- Image processing optimization
- Connection pooling and caching
- Background job processing

### Frontend Optimization
- Component lazy loading
- Image optimization and caching
- Bundle size optimization
- Progressive loading states

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This tool is for educational and research purposes. Users are responsible for complying with Instagram's Terms of Service and applicable laws. The developers are not responsible for any misuse of this software.

## 📞 Support

For support, email support@primaspot.com or open an issue on GitHub.

---

**PrimaSpot Analytics** - Empowering data-driven influencer marketing decisions.