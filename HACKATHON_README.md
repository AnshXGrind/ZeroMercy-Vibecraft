# Infinitus - Vibecraft Event Platform

> Hackathon Submission - ZeroMercy Team

## 🎯 Problem Statement

**Challenge**: Managing large-scale college technical festivals requires complex event registration, user authentication, real-time updates, and seamless coordination across multiple events, competitions, and workshops. Traditional event management systems are either too expensive, too complex, or lack the modern UX expected by today's tech-savvy students.

**Our Solution**: Infinitus is a modern, fast, and scalable event platform built specifically for the Vibecraft technical festival. The platform enables:

- **Instant Event Registration**: Students can quickly browse and register for 20+ events, competitions, and workshops
- **Secure Authentication**: Supabase-powered auth ensures data security and user profile management
- **Real-Time Updates**: Progressive Web App (PWA) capabilities for offline access and push notifications
- **Responsive Design**: Mobile-first UI that works seamlessly across all devices
- **Social Integration**: Integrated social media links and event sharing capabilities
- **Admin Dashboard**: Real-time analytics and registration management for organizers

## 🌟 What Makes This Unique

1. **Performance-First Architecture**: Vite-powered static site generation delivers sub-second page loads
2. **Scalable Backend**: Vercel serverless functions + Supabase handle thousands of concurrent registrations
3. **Modern UX**: 3D card animations, glassmorphism effects, and smooth transitions create an engaging experience
4. **Zero Lock-In**: Open-source stack with no vendor lock-in—can be self-hosted or migrated easily

## 🚀 Live Demo

**Production URL**: [https://zero-mercy-vibecraft.vercel.app](https://zero-mercy-vibecraft.vercel.app)

**Key Pages**:
- Hero/Home: `/video-hero.html`
- Events: `/event.html`
- Competitions: `/competition.html`
- Workshops: `/workshop.html`
- Aloha (Special Event): `/events/aloha.html`
- Registration: `/register.html`
- Login: `/login.html`

## 📋 Features Implemented

### Core Features
- ✅ User authentication (sign up, login, logout)
- ✅ Event browsing and filtering
- ✅ Quick registration system
- ✅ Profile management
- ✅ Admin dashboard (role-based access)
- ✅ Social media integration
- ✅ PWA support (offline-ready)

### Event Types
- 🎪 **Events** (10+): Flash Mob, DJ Nights, Movie Night, Car Rally, Inauguration, etc.
- 🏆 **Competitions** (8+): Murder Mystery, IPL Auction, eSports, Ideathon, Cube Clash, etc.
- 🛠️ **Workshops**: Technical workshops and skill-building sessions
- 🌺 **Special Events**: Aloha (tropical-themed gathering)

### Technical Features
- Server-side rendering with Vite
- Serverless API functions on Vercel
- PostgreSQL database via Supabase
- Row-level security (RLS) policies
- Real-time data sync
- Image optimization and lazy loading
- Video background with fallback support

## 🛠️ Tech Stack

### Frontend
- **Build Tool**: Vite 5.x (fast HMR, optimized builds)
- **Framework**: Vanilla HTML/CSS/JS + React 18 (for interactive components)
- **Styling**: Custom CSS with modern features (backdrop-filter, CSS Grid, Flexbox)
- **Icons**: Custom SVG icons

### Backend
- **Hosting**: Vercel (serverless functions + static hosting)
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Authentication**: Supabase Auth (JWT-based)
- **API**: Serverless functions in `/api/` directory

### DevOps & Tools
- **Version Control**: Git + GitHub
- **CI/CD**: Vercel automatic deployments
- **Package Manager**: npm
- **Environment Management**: `.env.local` for secrets

### Key Dependencies
```json
{
  "@supabase/supabase-js": "^2.93.3",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "vite": "^5.0.0"
}
```

## 📊 Project Statistics

- **Total Pages**: 25+ HTML pages
- **Serverless Functions**: 4 API endpoints
- **Database Tables**: 3 (profiles, quick_registrations, events)
- **Events Listed**: 20+
- **Lines of Code**: ~8,000+ (excluding node_modules)
- **Build Time**: ~2.8 seconds
- **Page Load Time**: < 1 second (first contentful paint)

## 👥 Team: ZeroMercy

- **Saksham Garg** - Architecture & Strategy
- **Hardik Chaurasia** - Core Development
- **Sujal Kansal** - Experience Design
- **Arjun Sharma** - Systems Logic

## 📁 Repository Structure

```
ZeroMercy-Vibecraft/
├── api/                      # Vercel serverless functions
│   ├── create-profile.js     # User profile creation
│   ├── registrations.js      # Event registration handler
│   ├── events.js             # Events API
│   └── health.js             # Health check endpoint
├── events/                   # Individual event pages
│   ├── flash-mob.html
│   ├── dj-nights.html
│   ├── aloha.html
│   └── ...
├── public/                   # Static assets
│   ├── images/               # Event images, logos
│   └── videos/               # Background videos
├── scripts/                  # Client-side JavaScript
│   └── social.js             # Social bar toggle logic
├── src/                      # React components & TypeScript
│   ├── components/
│   │   ├── Hero.jsx
│   │   ├── ThreeDEvents.tsx
│   │   └── ...
│   └── main.tsx
├── supabase-migrations/      # Database schema
│   └── 01_quick_registrations.sql
├── about.html                # About page
├── competition.html          # Competitions listing
├── event.html                # Events listing
├── video-hero.html           # Home page (hero video)
├── register.html             # Registration form
├── login.html                # Login page
├── package.json              # Dependencies
├── vite.config.js            # Vite configuration
├── vercel.json               # Vercel deployment config
└── HACKATHON_README.md       # This file

```

## 🎨 Design Highlights

- **Color Scheme**: Dark theme with cyan (#38bdf8) and purple (#a855f7) accents
- **Typography**: Inter font family with clamp() for responsive sizing
- **Animations**: 3D card tilt effects, smooth transitions, gradient animations
- **Layout**: Mobile-first responsive grid system
- **Accessibility**: ARIA labels, keyboard navigation, semantic HTML

## 🏗️ Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed system architecture and data flow diagrams.

## 📦 Setup & Deployment

See [BUILD.md](BUILD.md) for complete build reproducibility instructions.

## 🤖 AI Tools Used

See [AI_TOOLS.md](AI_TOOLS.md) for details on AI assistance during development.

## 📝 License

This project was built for the Vibecraft hackathon. Code is available for educational purposes.

## 🙏 Acknowledgments

- SRM Institute of Science and Technology
- Vibecraft organizing committee
- Supabase for database infrastructure
- Vercel for hosting platform

---

**Submitted by**: ZeroMercy Team  
**Event**: Infinitus 2026 (Feb 25-28, 2026)  
**Date**: February 2026
