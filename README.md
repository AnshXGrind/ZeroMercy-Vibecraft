# 🎪 Infinitus – AI-Powered College Tech Fest Platform

> **A production-ready, full-stack event management platform for large-scale technical festivals, built with modern web technologies and AI-assisted development.**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Vercel-000?style=for-the-badge)](https://zero-mercy-vibecraft.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Stack-React_+_Vite_+_Supabase-38bdf8?style=for-the-badge)](#-tech-stack)
[![AI Assisted](https://img.shields.io/badge/AI-GitHub_Copilot-a855f7?style=for-the-badge)](#-ai-tools-used)

---

## 📌 Problem Statement

**Challenge**: Colleges organizing large-scale technical festivals (1000+ attendees, 20+ events) face significant challenges:

- **No Affordable Solutions**: Existing event platforms charge per-ticket fees or require expensive subscriptions
- **Poor Mobile Experience**: Legacy systems fail to provide the modern, responsive UX that students expect
- **Complex Integration**: Coordinating registration, authentication, and real-time updates requires extensive development time
- **Limited Scalability**: Traditional server setups cannot handle traffic spikes during registration windows
- **Manual Coordination**: Managing events, competitions, workshops, and sponsors requires tedious spreadsheet tracking

**Real-World Context**: SRM University AP's annual tech fest *Infinitus* (Feb 25-28, 2026) needed a unified platform to handle 5000+ expected participants across 20+ events, with zero budget for paid solutions.

---

## 💡 Project Idea

**Infinitus** is a **Techfest-style website** that provides:

1. **Instant Event Discovery** – Students browse events, competitions, and workshops through an immersive 3D card interface
2. **One-Click Registration** – Supabase-powered quick registration with form validation
3. **Secure Authentication** – JWT-based auth with row-level security protecting user data
4. **PWA Capabilities** – Offline access, installable on mobile, push notification ready
5. **Admin Tools** – Real-time analytics, registration management, and event CRUD operations
6. **Zero Cost** – Built entirely on free tiers (Vercel, Supabase) with no vendor lock-in

**Target Users**: College students, event organizers, faculty coordinators, and sponsors.

---

## 🏗️ Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                           USER DEVICES                                  │
│           (Desktop / Mobile / Tablet - PWA Support)                    │
└───────────────────────────────┬────────────────────────────────────────┘
                                │ HTTPS
                                ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      VERCEL EDGE NETWORK                                │
│  ┌─────────────────┐    ┌────────────────────────────────────────┐    │
│  │  STATIC ASSETS  │    │       SERVERLESS FUNCTIONS             │    │
│  │                 │    │                                        │    │
│  │  • 25+ HTML     │    │  /api/create-profile.js → Profile Mgmt │    │
│  │  • CSS Bundles  │    │  /api/registrations.js  → Event Signup │    │
│  │  • JS Bundles   │    │  /api/events.js         → Event Data   │    │
│  │  • Video/Images │    │  /api/health.js         → Health Check │    │
│  │                 │    │                                        │    │
│  │  (Vite Build)   │    │  (Node.js 18 Runtime)                  │    │
│  └─────────────────┘    └───────────────┬────────────────────────┘    │
└────────────────────────────────────────┬┴──────────────────────────────┘
                                         │
                    ┌────────────────────┴────────────────────┐
                    │          SUPABASE BACKEND               │
                    │                                         │
                    │  ┌──────────────┐  ┌────────────────┐  │
                    │  │  PostgreSQL  │  │  Auth (JWT)    │  │
                    │  │  Database    │  │  Service       │  │
                    │  └──────────────┘  └────────────────┘  │
                    │                                         │
                    │  Tables: profiles, events,              │
                    │          quick_registrations            │
                    │                                         │
                    │  Security: Row Level Security (RLS)     │
                    │  Policies: User isolation, Admin access │
                    └─────────────────────────────────────────┘
```

**Data Flow Summary**:
1. User visits site → Vercel serves static HTML/JS/CSS
2. User registers → Form validated → API function called → Supabase inserts record
3. User logs in → Supabase Auth issues JWT → Token stored in localStorage
4. Protected actions → JWT verified → RLS policies enforce authorization

---

## 🧰 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18.2.0 + Vite 5.x | Component-based UI with fast HMR |
| **Styling** | Custom CSS + Orbitron Font | Glassmorphism, 3D effects, responsive |
| **Backend** | Vercel Serverless Functions | API endpoints, no server management |
| **Database** | Supabase (PostgreSQL) | Relational data with real-time subscriptions |
| **Auth** | Supabase Auth (JWT) | Secure, stateless authentication |
| **Deployment** | Vercel | Global CDN, automatic CI/CD |
| **PWA** | Service Worker + Manifest | Offline support, installable |

**Key Dependencies** (from `package.json`):
```json
{
  "@supabase/supabase-js": "^2.93.3",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.30.3",
  "vite": "^5.0.0"
}
```

---

## 🤖 AI Tools Used

### Primary Tool: GitHub Copilot (Claude 3.5 Sonnet → Claude Opus 4.5)

**What AI Assisted With**:
- Boilerplate HTML/CSS generation for 25+ pages
- Supabase RLS policy design and SQL migrations
- Vite multi-page configuration
- Bug diagnosis and performance optimization
- Documentation writing

**What Remained Human-Driven**:
- Product vision and feature prioritization
- UI/UX design decisions (colors, layout, animations)
- Event content and descriptions
- Security review and testing
- Final deployment and verification

**AI Contribution Breakdown** (estimated):

| Area | AI % | Human % |
|------|------|---------|
| Architecture | 20% | 80% |
| Frontend Code | 40% | 60% |
| Backend/API | 50% | 50% |
| Documentation | 70% | 30% |
| Testing | 0% | 100% |
| Design/UX | 10% | 90% |

> See [AI_TOOLS.md](AI_TOOLS.md) for detailed transparency report.

---

## 🎯 Prompt Strategy Summary

Our approach to effective AI collaboration:

### 1. Context-First Prompting
```
❌ Bad:  "Create a registration form"
✅ Good: "Create a registration form for a college tech fest. Use Supabase 
         to store data in 'quick_registrations' table. Validate 11-digit 
         registration numbers. Style with dark theme, cyan/purple gradients."
```

### 2. Constraint-Based Requests
```
"Generate a Vercel serverless function that:
- Uses @supabase/supabase-js v2.93.3
- Validates JWT from Authorization header
- Returns 201 on success, 400/401 on errors
- Includes CORS headers for cross-origin requests"
```

### 3. Iterative Refinement
- Start broad → Get initial code → Request specific modifications → Test → Iterate

### 4. Documentation-Driven Understanding
```
"Explain why Row-Level Security is better than application-level auth 
for this use case. What are the trade-offs?"
```

**Key Insight**: AI is most effective when given specific constraints and context. Generic prompts yield generic code.

---

## 📁 Source Code Structure

```
ZeroMercy-Vibecraft/
│
├── 📄 HTML Pages (25+)
│   ├── video-hero.html        # Homepage with video background
│   ├── event.html             # Events listing (3D cards)
│   ├── competition.html       # Competitions listing
│   ├── workshop.html          # Workshops listing
│   ├── register.html          # User registration form
│   ├── login.html             # Authentication page
│   ├── about.html             # About the fest
│   ├── faq.html               # Frequently asked questions
│   ├── sponsors.html          # Sponsor showcase
│   └── stalls.html            # Exhibition stalls
│
├── 📂 events/                 # Individual event detail pages
│   ├── aloha.html             # Tropical theme event
│   ├── dj-nights.html         # Music event
│   ├── flash-mob.html         # Dance event
│   ├── car-rally.html         # Automotive event
│   ├── game-night.html        # Gaming tournament
│   ├── movie-night.html       # Film screening
│   ├── music-night.html       # Live performances
│   ├── super-car-expo.html    # Car exhibition
│   ├── dj-campfire.html       # Outdoor music
│   └── inauguration-ceremony.html
│
├── 📂 api/                    # Vercel serverless functions
│   ├── create-profile.js      # POST: Create user profile
│   ├── registrations.js       # POST: Event registration
│   ├── events.js              # GET: Fetch events
│   └── health.js              # GET: Health check
│
├── 📂 src/                    # React components
│   ├── main.tsx               # React entry point
│   ├── App.jsx                # Root component
│   ├── components/
│   │   ├── Hero.jsx           # Hero section with CTA
│   │   ├── HeroBackground.jsx # Animated background
│   │   ├── HeroVideo.jsx      # Video player component
│   │   ├── ThreeDEvents.tsx   # 3D card grid + lightbox
│   │   ├── RegistrationModal.tsx # Registration form modal
│   │   ├── VideoBackground.jsx # Video background handler
│   │   └── Balatro.jsx        # Card animation effects
│   ├── contexts/              # React context providers
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   └── pages/                 # React page components
│
├── 📂 backend/                # Backend configuration
│   ├── server.js              # Express server (local dev)
│   ├── routes/
│   │   ├── auth.js            # Auth endpoints
│   │   ├── events.js          # Event CRUD
│   │   └── registrations.js   # Registration handling
│   └── supabase_schema.sql    # Full database schema
│
├── 📂 supabase-migrations/    # Database migrations
│   ├── 00_profiles.sql        # Profiles table
│   └── 01_quick_registrations.sql
│
├── 📂 public/                 # Static assets
│   ├── auth-nav.js            # Auth-aware navigation
│   ├── images/                # Event images, logos
│   └── videos/                # Hero background video
│
├── 📂 scripts/                # Build utilities
│   └── copyDistToRoot.js      # Post-build file copy
│
├── 📄 Configuration Files
│   ├── vite.config.js         # Vite build config (20+ entries)
│   ├── vercel.json            # Vercel deployment config
│   ├── package.json           # Dependencies
│   ├── tsconfig.json          # TypeScript config
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service worker
│
└── 📄 Documentation
    ├── README.md              # This file
    ├── ARCHITECTURE.md        # System architecture
    ├── BUILD.md               # Build instructions
    ├── AI_TOOLS.md            # AI transparency report
    └── HACKATHON_README.md    # Hackathon submission
```

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** v18+ (`node --version`)
- **npm** v9+ (`npm --version`)
- **Git** (`git --version`)
- **Supabase Account** (free at [supabase.com](https://supabase.com))

### Step 1: Clone Repository

```bash
git clone https://github.com/AnshXGrind/ZeroMercy-Vibecraft.git
cd ZeroMercy-Vibecraft
```

### Step 2: Install Dependencies

```bash
npm install
```

Expected: ~250 packages installed in ~30 seconds.

### Step 3: Configure Environment

Create `.env.local` in project root:

```bash
# Supabase (get from Supabase Dashboard → Settings → API)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server-only (KEEP SECRET)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Setup Database

1. Go to Supabase Dashboard → SQL Editor
2. Run migrations from `supabase-migrations/` folder:
   - `00_profiles.sql`
   - `01_quick_registrations.sql`
3. Or run the full schema: `backend/supabase_schema.sql`

### Step 5: Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Step 6: Build for Production

```bash
npm run build
```

Output: `dist/` folder with optimized assets (~2.5s build time).

---

## 🎬 Final Output

### What Users Experience

| Page | Features |
|------|----------|
| **Homepage** | Full-screen video hero, countdown timer, CTA buttons |
| **Events** | 3D card grid, category filtering, lightbox gallery |
| **Competitions** | Image galleries, registration links |
| **Workshops** | Schedule, descriptions, signup forms |
| **Register** | Form validation, Supabase integration |
| **Login** | JWT auth, session persistence |

### Screenshots

```
┌─────────────────────────────────────────────────────────────┐
│  🎥 Video Hero (Homepage)                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                       │   │
│  │           I N F I N I T U S                          │   │
│  │           Feb 25-28, 2026                            │   │
│  │                                                       │   │
│  │     [ EXPLORE EVENTS ]  [ REGISTER NOW ]             │   │
│  │                                                       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Live Demo

🌐 **Production URL**: [https://zero-mercy-vibecraft.vercel.app](https://zero-mercy-vibecraft.vercel.app)

---

## 🔁 Build Reproducibility Instructions

To reproduce an **identical build**:

### 1. Exact Environment
```bash
node --version  # Must be 18.x or 20.x
npm --version   # Must be 9.x or 10.x
```

### 2. Clean Install
```bash
rm -rf node_modules package-lock.json
npm install
```

### 3. Identical Environment Variables
Copy `.env.example` to `.env.local` and fill with your Supabase credentials.

### 4. Build Command
```bash
npm run build
```

### 5. Expected Output
```
vite v5.x.x building for production...
✓ 145 modules transformed.
dist/video-hero.html    XX.XX kB
dist/event.html         XX.XX kB
...
✓ built in 2.3s
```

### 6. Verify Build
```bash
npm run preview
# Open http://localhost:4173
```

### Deterministic Factors
- `package.json` locks major versions
- `vite.config.js` defines all entry points
- `vercel.json` configures deployment
- Database schema in `supabase-migrations/`

---

## ✨ Why This Project Stands Out

1. **Production-Ready**: Not a prototype – deployed and functional at scale
2. **Zero Budget, Full Stack**: Entirely on free tiers (Vercel, Supabase)
3. **Modern Architecture**: Serverless, edge-deployed, PWA-enabled
4. **Transparent AI Usage**: Full disclosure in [AI_TOOLS.md](AI_TOOLS.md)
5. **Comprehensive Documentation**: Architecture diagrams, setup guides, code comments
6. **Real-World Impact**: Built for an actual event with 5000+ expected users
7. **Security First**: RLS policies, JWT auth, input validation
8. **Developer Experience**: Hot reload, TypeScript support, modular components

---

## 👥 Team ZeroMercy

| Member | Role |
|--------|------|
| Saksham Garg | Architecture & Strategy |
| Hardik Chaurasia | Core Development |
| Sujal Kansal | Experience Design |
| Arjun Sharma | Systems Logic |

---

## 📜 License

MIT License – Free for educational and non-commercial use.

See [LICENSE](LICENSE) for full terms.

---

<div align="center">

**Built with 💜 by Team ZeroMercy**

*Infinitus 2026 | SRM University AP | Feb 25-28, 2026*

</div>
