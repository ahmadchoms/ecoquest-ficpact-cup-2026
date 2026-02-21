# FIPTCUP 2026 - Interactive Ecosystem Education Platform

An interactive web-based platform designed to educate and engage users about environmental conservation and ecosystem management through gamified missions and interactive experiences.

## 🌍 Features

### Core Features

- **Interactive Map**: Explore Indonesia's provinces with detailed geospatial data
- **Gamified Missions**: Complete eco-friendly challenges to earn XP and badges
- **3D Visualizations**: Experience immersive 3D components (EcoGlobe, Trophy scenes)
- **User Profiles**: Track progress, achievements, and environmental impact
- **Leaderboard**: Compete with other users on environmental initiatives
- **Authentication**: Secure login and registration system

### Mission Types

- 🌱 **Carbon Calculator**: Calculate and reduce your carbon footprint
- 🥭 **Mangrove Simulator**: Simulate mangrove ecosystem management
- 📚 **Species Quiz**: Learn about Indonesian biodiversity
- ♻️ **Waste Sorting**: Practice proper waste classification
- 💧 **Water Conservation**: Understand water management challenges

### Gamification Elements

- Experience Points (XP) system
- Collectible badges and achievements
- Level progression
- Provincial mission tracking
- Environmental impact metrics

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **3D Graphics**: Three.js (implied from 3D components)
- **Geospatial**: GeoJSON data format
- **Backend**: AI service integration

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm, yarn, or pnpm package manager

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:5173` (default Vite port).

### Build

```bash
# Build for production
npm run build
# or
yarn build
# or
pnpm build
```

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
# or
yarn preview
# or
pnpm preview
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── 3d/             # 3D visualizations
│   ├── layout/         # Layout components (Navbar, BottomNav, etc.)
│   ├── map/            # Map-related components
│   ├── mission/        # Mission components
│   ├── ui/             # Reusable UI components
│   └── visuals/        # Visual components
├── pages/              # Page components
│   ├── DashboardPage
│   ├── LandingPage
│   ├── LeaderboardPage
│   ├── MapPage
│   ├── MissionPage
│   ├── ProfilePage
│   ├── ProvincePage
│   └── auth/           # Authentication pages
├── data/               # Static data (badges, missions, provinces, ecosystems)
├── services/           # API services (AI integration)
├── store/              # Zustand state stores
├── utils/              # Utility functions (calculations, formatters, etc.)
├── hooks/              # Custom React hooks
├── App.jsx             # Main App component
└── main.jsx            # Application entry point
```

## 🌐 Key Pages

- **Landing Page** (`/`): Introduction and entry point
- **Dashboard** (`/dashboard`): User overview and statistics
- **Map** (`/map`): Interactive Indonesia province map
- **Missions** (`/mission`): Available challenges and tasks
- **Profile** (`/profile`): User profile and achievements
- **Leaderboard** (`/leaderboard`): Rankings and competition
- **Province** (`/province/:id`): Detailed province information
- **Auth**: Login and registration pages

## 🎮 Gamification System

- **XP System**: Earn experience points by completing missions
- **Badges**: Unlock badges for specific achievements
- **Levels**: Progress through levels as you earn XP
- **Impact Tracking**: Monitor your environmental impact

## 📊 Data Sources

- **GeoJSON Data**: Indonesia province boundaries and data (`public/data/indonesia.geojson`)
- **Mission Data**: Predefined missions and challenges (`src/data/missions.js`)
- **Badge Data**: Achievement badges and criteria (`src/data/badges.js`)
- **Ecosystem Data**: Information about Indonesian ecosystems (`src/data/ecosystems.js`)
- **Province Data**: Province-specific information (`src/data/provinces.js`)

## 🔧 Configuration Files

- `vite.config.js`: Vite configuration
- `tailwind.config.js`: Tailwind CSS customization
- `postcss.config.js`: PostCSS configuration
- `package.json`: Project dependencies and scripts

## 📝 Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build

## 🤝 Contributing

To contribute to this project:

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

[Add your license information here]

## 👥 Team

FIPTCUP 2026 Development Team

## 📧 Contact

[Add contact information here]

## 🌱 Environmental Impact

This platform aims to foster environmental awareness and encourage sustainable practices among users through interactive and engaging experiences.

---

**Made with 💚 for environmental conservation**
