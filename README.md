# 🌍 EcoQuest - FIPTCUP 2026

**Interactive Ecosystem Education Platform for Indonesia**

Transform environmental awareness into action through gamified missions, interactive experiences, and community competition. EcoQuest educates users about Indonesia's biodiversity, climate challenges, and sustainable practices through immersive gameplay across all 34 provinces.

> **Designed for**: Environmental educators, students, and eco-conscious citizens  
> **Language**: Indonesian (Bahasa Indonesia)  
> **Platform**: Web-based, responsive design  
> **Competition**: FIPTCUP 2026

---

## ✨ Features Overview

### 🎮 Core Gamification System

- **Experience Points (XP)**: Earn XP by completing missions and challenges
- **Strategic Badges**: Unlock 10+ collectible badges across environmental categories
- **Level Progression**: Advance through levels to unlock new content
- **Provincial Missions**: 34 Indonesian provinces with unique ecosystems and challenges
- **Leaderboard System**: Compete with other players globally
- **Achievement Tracking**: Monitor environmental impact and personal growth

### 📍 Interactive Map & Geography

- **GeoJSON-based Map**: Explore Indonesia's provinces with interactive visualization
- **Province Details**: Each province includes:
  - Unique ecosystem information
  - Threat level assessments
  - Endemic species profiles
  - Location-specific fun facts
  - Province-specific missions
- **Leaflet Integration**: Smooth, responsive mapping experience
- **Regional Organization**: North Sumatra, East Java, Sulawesi, and more

### 🎯 Mission Types (5 Categories)

1. **🌡️ Carbon Calculator** (Easy - 100 XP)
   - Calculate daily carbon footprint
   - Discover reduction strategies
   - Badge: "Carbon Conscious"
   - Real data: Average Indonesian produces 2.3 tons CO2/year

2. **♻️ Waste Sorting** (Easy - 120 XP)
   - Interactive drag-drop waste classification
   - Learn organic, inorganic, and hazardous waste separation
   - Badge: "Waste Warrior"
   - Context: Indonesia generates 67.8 million tons of waste annually

3. **🦏 Species Quiz** (Medium - 150 XP)
   - Test knowledge of Indonesian endangered species
   - Learn about mega-biodiversity
   - Badge: "Species Guardian"
   - Focus: Sumatran tigers, orangutans, rhinoceros, and more

4. **🌊 Mangrove Simulator** (Hard - 200 XP)
   - Virtual ecosystem restoration simulation
   - Understand mangrove ecosystem dynamics
   - Badge: "Mangrove Hero"
   - Real impact: Mangroves protect coastlines

5. **💧 Water Conservation** (Medium - 150 XP)
   - Water management and sustainability challenges
   - Interactive learning experience
   - Badge: "Water Guardian"

### 👤 User System

- **Authentication**: Secure login/registration system
- **Profiles**: Track XP, level, badges, and achievements
- **Individual Progress**: Monitor mission completion per province
- **Impact Dashboard**: Visualize environmental contributions
- **Profile Customization**: Update personal information and preferences

### 🎨 User Interface Highlights

- **Design System**: Custom UI components (EcoButton, EcoCard, EcoBadge)
- **3D Visualizations**:
  - EcoGlobe: Interactive 3D Earth representation
  - Trophy Scene: Celebratory 3D visuals for achievements
- **Smooth Animations**: Framer Motion transitions and effects
- **Progress Indicators**: Visual XP bars, celebration overlays
- **Responsive Design**: Works on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: [React](https://react.dev) 19.2.3 with Next.js 16.1.6
- **Build System**: Next.js with Turbopack (default in v16)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com) + [DaisyUI](https://daisyui.com) components
- **Animations**: [Framer Motion](https://www.framer.com/motion/) 12.34.3
- **State Management**: [Zustand](https://zustand.dev) 5.0.11
- **3D Graphics**: [Three.js](https://threejs.org) 0.183.0
- **Visualization**: [Recharts](https://recharts.org) 3.7.0

### Backend & Data

- **Database**: PostgreSQL (via Prisma)
- **ORM**: [Prisma](https://www.prisma.io) 7.4.1
- **AI Integration**: [@google/generative-ai](https://ai.google.dev) 0.24.1
- **Geospatial**: [Leaflet](https://leafletjs.com) 1.9.4 + [React-Leaflet](https://react-leaflet.js.org) 5.0.0
- **Data Format**: GeoJSON for province mapping

### Development Tools

- **Code Quality**: ESLint 9 with Next.js config
- **CSS Processing**: PostCSS 4
- **Compiler**: Babel React Compiler for optimization

---

## 📁 Project Structure

```
ecoquest-fiptcup2026/
├── app/                           # Next.js app directory
│   ├── auth/                      # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/                 # User dashboard
│   ├── leaderboard/               # Leaderboard view
│   ├── map/                       # Interactive map page
│   ├── mission/[provinceId]/[missionId]/  # Mission pages
│   ├── profile/                   # User profile
│   ├── province/[provinceId]/     # Province details
│   ├── layout.js                  # Root layout
│   ├── page.js                    # Landing page
│   └── globals.css                # Global styles
│
├── components/                    # Reusable React components
│   ├── 3d/                        # Three.js 3D components
│   │   ├── EcoGlobe.jsx           # Interactive Earth
│   │   └── TrophyScene.jsx        # Achievement visualization
│   ├── design-system/             # Custom UI library
│   │   ├── EcoButton.jsx
│   │   ├── EcoCard.jsx
│   │   └── EcoBadge.jsx
│   ├── landing/                   # Landing page sections
│   │   ├── HeroSection.jsx
│   │   ├── FeaturesSection.jsx
│   │   ├── MissionShowcase.jsx
│   │   ├── HowItWorksSection.jsx
│   │   ├── StatsSection.jsx
│   │   └── illustrations/         # SVG & image components
│   ├── layout/                    # Layout components
│   │   ├── Navbar.jsx
│   │   ├── BottomNav.jsx
│   │   └── PageWrapper.jsx
│   ├── map/                       # Map components
│   │   ├── InteractiveMap.jsx
│   │   ├── MapLegend.jsx
│   │   └── ProvinceTooltip.jsx
│   ├── mission/missions/          # Mission game components
│   │   ├── CarbonCalculator.jsx
│   │   ├── WasteSorting.jsx
│   │   ├── SpeciesQuiz.jsx
│   │   ├── MangroveSimulator.jsx
│   │   └── WaterConservation.jsx
│   └── ui/                        # UI utilities
│       ├── ProgressRing.jsx
│       ├── LevelBadge.jsx
│       ├── ShareCard.jsx
│       └── CelebrationOverlay.jsx
│
├── data/                          # Static data & content
│   ├── missions.js                # 5 mission definitions
│   ├── provinces.js               # 34 Indonesian provinces
│   ├── badges.js                  # Achievement definitions
│   ├── ecosystems.js              # Ecosystem data
│   └── landing.js                 # Landing page content
│
├── hooks/                         # Custom React hooks
│   └── useCountUp.js              # Number animation hook
│
├── store/                         # Zustand state management
│   ├── useUserStore.js            # User state (XP, level, badges)
│   └── useMapStore.js             # Map interaction state
│
├── services/                      # External service integrations
│   └── ai.js                      # Google Generative AI service
│
├── utils/                         # Utility functions
│   ├── achievements.js            # Achievement logic
│   ├── calculations.js            # Game math calculations
│   ├── constants.js               # App constants
│   ├── formatters.js              # Data formatting utilities
│   └── motion-variants.js         # Framer Motion presets
│
├── prisma/
│   └── schema.prisma              # Database schema (PostgreSQL)
│
├── public/
│   └── data/
│       └── indonesia.geojson      # Indonesian provinces GeoJSON
│
├── next.config.mjs                # Next.js configuration
├── tailwind.config.js             # Tailwind CSS config
├── postcss.config.mjs             # PostCSS config
├── eslint.config.mjs              # ESLint config
├── package.json                   # Dependencies & scripts
└── README.md                      # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** or **yarn** or **pnpm** (v8+)
- **PostgreSQL**: Database server running
- **Git**: For version control

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ecoquest-fiptcup2026.git
cd ecoquest-fiptcup2026

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ecoquest"

# Google Generative AI
NEXT_PUBLIC_GOOGLE_API_KEY="your-api-key-here"
```

### Database Setup

```bash
# Initialize Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Open Prisma Studio (optional - visual database explorer)
npx prisma studio
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

The application will be available at `http://localhost:3000` (default Next.js port).

### Build and Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 🎯 Key Pages & Routes

| Route                               | Purpose                                |
| ----------------------------------- | -------------------------------------- |
| `/`                                 | Landing page with features overview    |
| `/auth/login`                       | User login page                        |
| `/auth/register`                    | User registration page                 |
| `/dashboard`                        | User dashboard with stats and overview |
| `/map`                              | Interactive Indonesia province map     |
| `/mission/[provinceId]/[missionId]` | Individual mission gameplay            |
| `/province/[provinceId]`            | Detailed province information          |
| `/profile`                          | User profile and achievement showcase  |
| `/leaderboard`                      | Community rankings and competition     |

---

## 🎮 How the Game Works

### For New Players

1. **Register** at `/auth/register` to create account
2. **Explore** the interactive map at `/map` to discover provinces
3. **Select** a province to view available missions
4. **Complete** missions to earn XP, badges, and unlock achievements
5. **Track** progress in dashboard and profile

### Progression System

- **XP Earning**: Complete missions to earn experience points
  - Easy missions: 100 XP
  - Medium missions: 150 XP
  - Hard missions: 200 XP
- **Leveling Up**: Accumulate XP to advance levels
- **Badges**: Unlock collectible achievement badges
- **Leaderboard**: Compete with other players

### Environmental Learning

Each mission teaches real environmental concepts:

- 🌡️ **Carbon footprint** reduction strategies
- ♻️ **Waste management** best practices
- 🦏 **Biodiversity** and endangered species
- 🌊 **Mangrove ecosystems** and restoration
- 💧 **Water conservation** techniques

---

## 🗂️ Data Models

### Province Model

```javascript
{
  id: string,
  name: string,
  coordinates: [number, number],
  region: string,
  ecosystems: string[],
  threatLevel: "low" | "medium" | "high",
  description: string,
  funFact: string,
  species: string[],
  missions: string[], // Mission IDs
  illustration: string,
  color: string
}
```

### Mission Model

```javascript
{
  id: string,
  title: string,
  subtitle: string,
  description: string,
  type: string,
  difficulty: "easy" | "medium" | "hard",
  xpReward: number,
  timeEstimate: string,
  badgeReward: string,
  category: string,
  component: string,
  icon: string,
  color: string
}
```

### Badge Model

```javascript
{
  id: string,
  name: string,
  description: string,
  icon: string,
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary",
  category: string
}
```

---

## 📚 Learning Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **React Documentation**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Prisma ORM**: https://www.prisma.io
- **Three.js**: https://threejs.org
- **Leaflet Maps**: https://leafletjs.com

---

## 🚀 Performance Optimizations

- **React Compiler**: Babel plugin for automatic optimization
- **Turbopack**: Next.js 16 default bundler for 5x faster builds
- **Image Optimization**: Automatic image serving and optimization
- **DNS Prefetching**: Enhanced DNS resolution performance
- **State Management**: Zustand for minimal bundle size
- **Code Splitting**: Automatic route-based code splitting with Next.js

---

## 🔐 Security Features

- **Authentication**: Secure login/register system
- **Environment Variables**: Sensitive configuration in `.env.local`
- **Input Validation**: Data validation through Prisma and React
- **CORS Protection**: Configured through Next.js headers

---

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
# Verify DATABASE_URL in .env.local
# Reset database (development only):
npx prisma migrate reset
```

### Port Already in Use

```bash
# Run on different port
npm run dev -- -p 3001
```

### Build Errors

```bash
# Clear build cache
rm -rf .next
npm run build
```

---

## 📊 Current Features Status

| Feature           | Status              |
| ----------------- | ------------------- |
| Landing Page      | ✅ Complete         |
| Authentication    | ✅ Setup Ready      |
| Interactive Map   | ✅ Component Ready  |
| 5 Mission Types   | ✅ Framework Ready  |
| XP System         | ✅ Framework Ready  |
| Badge System      | ✅ Framework Ready  |
| Dashboard         | ✅ Component Ready  |
| Profile Page      | ✅ Component Ready  |
| Leaderboard       | ✅ Component Ready  |
| 3D Visualizations | ✅ Components Ready |
| Database (Prisma) | ⏳ Schema to Define |

---

## 🎓 Project Insights

### Target Audience

- Students learning about Indonesian ecosystems
- Environmental educators and educators
- Eco-conscious citizens aged 13+
- Indonesian biodiversity enthusiasts

### Educational Framework

- **Gamification**: Makes learning fun and engaging
- **Real Data**: Uses actual environmental statistics from Indonesia
- **Interactivity**: Hands-on learning through simulations
- **Community**: Social competition via leaderboards
- **Impact**: Visualize personal environmental contributions

### Indonesian Context

- Focuses on **Indonesia's 34 provinces**
- Features **Indonesian endangered species**
- Covers **unique Indonesian ecosystems**:
  - Rainforests (Sumatra, Kalimantan)
  - Mangrove forest (Coastal regions)
  - Coral ecosystems (Eastern Indonesia)
  - Mountains/Highlands (Java, Sulawesi)

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a Pull Request

### Code Standards

- Follow ESLint configuration
- Use React best practices
- Component naming: PascalCase
- File naming: camelCase (except components)
- Maintain Tailwind CSS consistency

---

## 📄 License

This project is part of FIPTCUP 2026 competition.

---

## 👥 Team

**EcoQuest Development Team** - FIPTCUP 2026

### Key Contributors

- Full-stack developers
- UI/UX designers
- Environmental educators
- Data specialists

---

## 📞 Support & Contact

- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Join community discussions
- **Email**: [contact email for project]
- **Website**: [competition website]

---

## 🌱 Environmental Mission

> "EcoQuest transforms environmental education into an engaging, gamified experience that inspires Indonesian youth to become conservation leaders. Through interactive missions, beautiful visualizations, and community competition, we make learning about nature as exciting as playing a game."

### Real Impact Statistics

- Indonesia produces **67.8 million tons** of waste annually
- Average Indonesian emits **2.3 tons CO2** per year
- Indonesia is a **mega-biodiversity country** with 17% of global species
- **Mangroves** cover only 3% of Earth but support 25% of marine life

---

## 🚀 Future Roadmap

- [ ] Offline mode support
- [ ] Multiplayer missions
- [ ] Advanced analytics dashboard
- [ ] Mobile app version
- [ ] Integration with environmental NGOs
- [ ] Carbon offset marketplace
- [ ] Virtual field trips
- [ ] AI-powered personalized learning paths

---

**Made with 💚 for environmental conservation and Indonesian youth empowerment**

_FIPTCUP 2026 - Building the future of environmental education_
