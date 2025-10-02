# 🌍 EcoAI Pro - Smart Environmental Guardian

A comprehensive AI-powered environmental monitoring and protection platform built with React, Firebase, and cutting-edge AI technologies.

![EcoAI Pro Banner](https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=200&fit=crop)

## 🌟 Features

### 🤖 AI-Powered Analysis
- **Plant Health Analysis**: Upload plant images to get instant AI diagnosis and treatment recommendations
- **Waste Sorting Intelligence**: Identify recyclable, compostable, and general waste items with AI-powered image recognition
- **Smart Recommendations**: Get personalized eco-friendly tips and solutions

### 📊 Environmental Dashboard
- **Real-time Data**: Live weather, air quality, and UV index monitoring
- **Interactive Charts**: Visualize your environmental impact and trends
- **Personal Analytics**: Track your eco-activities and progress over time

### 🗺️ Community Eco-Reporting
- **Interactive Map**: Report environmental issues with precise location mapping
- **Crowdsourced Data**: View and contribute to community environmental monitoring
- **Photo Documentation**: Attach images to reports for better issue visualization

### 🏆 Gamification System
- **Points & Rewards**: Earn eco-points for every action you take
- **Achievement Badges**: Unlock special badges for various milestones
- **Global Leaderboard**: Compete with eco-warriors worldwide
- **Level Progression**: Advance through different eco-guardian levels

### 💬 AI Environmental Assistant
- **24/7 Chatbot**: Get instant answers to your environmental questions
- **Smart Guidance**: Receive personalized sustainability advice
- **Educational Content**: Learn about environmental protection and conservation

### 👤 Personal Profile
- **Activity History**: Track all your analyses, reports, and achievements
- **Progress Visualization**: See your environmental impact through charts and stats
- **Badge Collection**: Showcase your earned environmental achievements

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS + Custom Components
- **Authentication**: Firebase Auth (Email/Google)
- **Database**: Firebase Firestore
- **Maps**: Leaflet.js + React-Leaflet
- **Charts**: Chart.js + React-Chartjs-2
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Deployment**: GitHub Pages

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ecoai-pro.git
cd ecoai-pro
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Google)
3. Create a Firestore database
4. Enable Storage (for image uploads)
5. Copy your Firebase configuration

### 4. Environment Configuration
```bash
cp .env.example .env
```

Edit `.env` with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### 5. Firestore Security Rules
Add these rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read analyses and reports, but only authenticated users can write
    match /analyses/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /ecoReports/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 6. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see your application running!

## 🚀 Deployment to GitHub Pages

### 1. Install GitHub Pages Deploy Package
```bash
npm install --save-dev gh-pages
```

### 2. Update package.json
Add to your `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/ecoai-pro",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### 3. Update Vite Configuration
Update `vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ecoai-pro/',
  build: {
    outDir: 'dist',
  },
})
```

### 4. Deploy
```bash
npm run deploy
```

## 🎮 Demo Credentials

For quick testing, use these demo credentials:
- **Email**: demo@ecoai.pro
- **Password**: demo123

## 📱 Features Overview

### 🏠 Home Page
- Animated hero section with floating eco icons
- Feature highlights and statistics
- Call-to-action for user registration

### 🔐 Authentication
- Email/password registration and login
- Google OAuth integration
- Protected routes for authenticated users

### 📊 Dashboard
- Environmental data widgets (weather, air quality, UV index)
- Personal statistics and progress tracking
- Activity charts and trends
- Recent activity timeline

### 📤 Upload & Analysis
- Dual-mode analysis (Plant Health / Waste Sorting)
- Drag-and-drop image upload
- AI-powered analysis with detailed results
- Personalized recommendations and tips

### 🗺️ Interactive Map
- Leaflet-powered interactive mapping
- Pin dropping for issue reporting
- Category-based filtering
- Photo attachment for reports
- Community-driven environmental monitoring

### 🏆 Leaderboard & Gamification
- Global ranking system
- Multiple ranking categories (points, analyses, reports)
- Achievement badge system
- Progress tracking and level advancement

### 💬 AI Chatbot
- Floating chat interface
- Environmental Q&A assistance
- Quick action buttons
- Contextual responses based on user queries

### 👤 Profile Management
- Personal statistics dashboard
- Achievement showcase
- Activity history and analytics
- Profile customization options

## 🎨 Design System

### Color Palette
- **Primary Green**: `#22c55e` (Eco-500)
- **Secondary Green**: `#10b981` (Emerald-500)
- **Accent Blue**: `#3b82f6` (Blue-500)
- **Success**: `#16a34a` (Green-600)
- **Warning**: `#f59e0b` (Amber-500)
- **Error**: `#ef4444` (Red-500)

### Typography
- **Font Family**: System fonts (Inter, SF Pro, Segoe UI)
- **Headings**: Bold, gradient text effects
- **Body**: Regular weight, high contrast

### Components
- **Cards**: Glassmorphism effect with backdrop blur
- **Buttons**: Gradient backgrounds with hover animations
- **Forms**: Clean inputs with focus states
- **Navigation**: Responsive with mobile hamburger menu

## 🔧 API Integration

### Mock AI Services
The app includes mock AI services that simulate:
- Plant health analysis with confidence scores
- Waste item recognition and sorting recommendations
- Environmental chatbot responses
- Real-time environmental data

### Extensibility
The architecture supports easy integration with real AI services:
- Google Vision API
- OpenAI GPT models
- HuggingFace Transformers
- Weather APIs (OpenWeatherMap, etc.)

## 🧪 Testing

### Demo Data
The application includes comprehensive mock data for:
- User profiles and statistics
- Environmental reports and analyses
- Leaderboard rankings
- Achievement systems
- Chat interactions

### Test Scenarios
1. **User Registration/Login Flow**
2. **Image Upload and Analysis**
3. **Map Interaction and Reporting**
4. **Chatbot Conversations**
5. **Profile Management**
6. **Responsive Design Testing**

## 🤝 Contributing

We welcome contributions to EcoAI Pro! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- **Icons**: [Lucide React](https://lucide.dev)
- **Images**: [Unsplash](https://unsplash.com)
- **Maps**: [OpenStreetMap](https://www.openstreetmap.org)
- **Charts**: [Chart.js](https://www.chartjs.org)
- **Animations**: [Framer Motion](https://www.framer.com/motion)

## 📞 Support

For support and questions:
- 📧 Email: support@ecoai.pro
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/ecoai-pro/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/ecoai-pro/discussions)

## 🚀 Future Enhancements

- [ ] Real AI API integrations
- [ ] Progressive Web App (PWA) features
- [ ] Offline functionality
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Social sharing features
- [ ] Community challenges and events
- [ ] IoT device integration
- [ ] Advanced machine learning models
- [ ] Real-time collaboration features

---

**Built with 💚 for our planet Earth 🌍**

*EcoAI Pro - Empowering everyone to be an environmental guardian through the power of AI and community collaboration.*