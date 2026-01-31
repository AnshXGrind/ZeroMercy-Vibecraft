# System Architecture - Infinitus Platform

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER DEVICES                             │
│  (Desktop, Mobile, Tablet - Progressive Web App Support)        │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                     VERCEL EDGE NETWORK                          │
│  • Global CDN                                                    │
│  • Static Asset Caching                                          │
│  • Automatic HTTPS/SSL                                           │
└────────────────────┬────────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌────────────────────┐  ┌────────────────────────────────┐
│  STATIC PAGES      │  │  SERVERLESS FUNCTIONS          │
│                    │  │                                │
│  • HTML Files      │  │  /api/create-profile.js        │
│  • CSS Bundles     │  │  /api/registrations.js         │
│  • JS Bundles      │  │  /api/events.js                │
│  • Images/Videos   │  │  /api/health.js                │
│                    │  │                                │
│  (Vite Build)      │  │  (Node.js Runtime)             │
└────────────────────┘  └───────────┬────────────────────┘
         │                          │
         │                          │ Supabase Client SDK
         │                          ▼
         │              ┌──────────────────────────────┐
         │              │   SUPABASE BACKEND           │
         │              │                              │
         └──────────────►  • PostgreSQL Database       │
                        │  • Authentication (JWT)      │
                        │  • Row Level Security (RLS)  │
                        │  • Real-Time Subscriptions   │
                        │  • Storage (future)          │
                        └──────────────────────────────┘
```

## 📊 Data Flow

### 1. User Registration Flow
```
User fills form (register.html)
    │
    ▼
JavaScript validates input
    │
    ▼
Supabase Auth creates user
    │
    ▼
Serverless function creates profile (/api/create-profile.js)
    │
    ▼
Database stores user in 'profiles' table
    │
    ▼
User redirected to dashboard
```

### 2. Event Registration Flow
```
User browses events (event.html)
    │
    ▼
User clicks "Register Now"
    │
    ▼
JavaScript sends request to /api/registrations.js
    │
    ▼
Function validates auth token
    │
    ▼
Database inserts into 'quick_registrations' table
    │
    ▼
Confirmation displayed to user
```

### 3. Authentication Flow
```
User submits login (login.html)
    │
    ▼
Supabase Auth validates credentials
    │
    ▼
JWT token stored in localStorage
    │
    ▼
auth-nav.js injects user menu
    │
    ▼
Protected pages check token
```

## 🗄️ Database Schema

### Table: `profiles`
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text NOT NULL,
  email text UNIQUE,
  phone text,
  college text,
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);
```

**Indexes**:
- Primary key on `id`
- Unique constraint on `email`

**RLS Policies**:
- Users can read their own profile
- Users can update their own profile
- Admins can read all profiles

### Table: `quick_registrations`
```sql
CREATE TABLE quick_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  registration_number text NOT NULL,
  event_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

**Indexes**:
- `idx_quick_registrations_email` on `email`
- `idx_quick_registrations_reg_number` on `registration_number`
- `idx_quick_registrations_event` on `event_name`
- `idx_quick_registrations_created_at` on `created_at DESC`

**RLS Policies**:
- Public can insert (for registration)
- Users can view their own registrations
- Admins can view and manage all

## 🔧 Component Architecture

### Frontend Components

```
Page Layer (HTML)
    ├── video-hero.html       (Landing page with video background)
    ├── event.html            (Events listing with 3D cards)
    ├── competition.html      (Competitions with image gallery)
    ├── workshop.html         (Workshops listing)
    ├── register.html         (User registration form)
    ├── login.html            (Login form)
    └── events/               (Individual event pages)
        ├── aloha.html
        ├── flash-mob.html
        └── ...

Shared Scripts Layer
    ├── auth-nav.js           (Navigation + auth state management)
    ├── social.js             (Social media bar toggle)
    └── src/static-registration.ts (Registration logic)

React Components (for advanced interactions)
    ├── Hero.jsx              (Hero section with animations)
    ├── ThreeDEvents.tsx      (3D card grid)
    └── Balatro.jsx           (Card animations)
```

### API Layer

```
/api/
├── create-profile.js
│   ├── Method: POST
│   ├── Auth: Service Role Key
│   ├── Purpose: Create user profile after signup
│   └── Returns: Profile object
│
├── registrations.js
│   ├── Method: POST
│   ├── Auth: User JWT
│   ├── Purpose: Register user for event
│   └── Returns: Registration confirmation
│
├── events.js
│   ├── Method: GET
│   ├── Auth: Optional
│   ├── Purpose: Fetch events list
│   └── Returns: Events array
│
└── health.js
    ├── Method: GET
    ├── Auth: None
    ├── Purpose: Health check
    └── Returns: Server status
```

## 🔐 Security Architecture

### Authentication
- **Provider**: Supabase Auth
- **Method**: Email/Password with JWT tokens
- **Token Storage**: localStorage (client-side)
- **Token Expiry**: Configurable (default: 1 hour)

### Authorization
- **Row-Level Security (RLS)**: Enabled on all tables
- **Role-Based Access Control (RBAC)**: `user` vs `admin` roles
- **API Protection**: JWT verification on protected endpoints

### Environment Variables (Required)
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Security Notes**:
- Anon key is safe for client-side (RLS enforced)
- Service role key bypasses RLS (server-only)
- All keys stored in Vercel environment variables

## 🚀 Build & Deployment Pipeline

```
Developer pushes to GitHub
    │
    ▼
GitHub triggers Vercel webhook
    │
    ▼
Vercel clones repository
    │
    ▼
Install dependencies (npm install)
    │
    ▼
Build static site (npm run build)
    │   └─ Vite processes HTML/JS/CSS
    │   └─ Injects environment variables
    │   └─ Outputs to /dist/ directory
    │
    ▼
Deploy to Vercel Edge Network
    │   └─ Static files cached on CDN
    │   └─ Serverless functions deployed
    │
    ▼
Production URL live
```

**Build Configuration** (`vite.config.js`):
- Multi-page app (MPA) with explicit HTML entry points
- Environment variable injection into HTML
- Asset optimization and minification
- Source maps for debugging

**Deployment Configuration** (`vercel.json`):
- Clean URLs (no `.html` extension)
- Cache headers for assets (1 year) and pages (on-demand)
- URL rewrites (`/` → `/video-hero.html`)
- CORS headers for API endpoints

## 📈 Scalability Considerations

### Current Capacity
- **Static Pages**: Unlimited (CDN-cached)
- **Database**: Supabase free tier (~500MB, 50,000 rows)
- **Serverless Functions**: 100GB-hours/month (Vercel free tier)
- **Bandwidth**: 100GB/month (Vercel free tier)

### Scaling Strategy
1. **Horizontal Scaling**: Vercel automatically scales serverless functions
2. **Database Scaling**: Upgrade Supabase plan for more connections/storage
3. **Caching**: Static pages cached at edge, minimal database hits
4. **CDN**: Global distribution via Vercel Edge Network

### Performance Optimizations
- ✅ Static site generation (no SSR overhead)
- ✅ Image lazy loading
- ✅ CSS/JS minification and bundling
- ✅ Asset compression (gzip/brotli)
- ✅ Database indexes on frequently queried columns
- ✅ Connection pooling (Supabase built-in)

## 🔄 Data Synchronization

### Real-Time Features (Potential)
- Supabase supports real-time subscriptions via WebSockets
- Current implementation uses REST API for simplicity
- Future: Live event updates, registration counters

### State Management
- Client-side state in localStorage (auth tokens, user preferences)
- No global state management library (vanilla JS for simplicity)
- React components use local state only

## 🛡️ Error Handling & Monitoring

### Client-Side
- Try-catch blocks around API calls
- User-friendly error messages
- Fallback UI for failed loads

### Server-Side
- Supabase logs errors automatically
- Vercel provides function logs and analytics
- Custom error responses with status codes

### Monitoring
- Vercel Analytics (page views, performance)
- Supabase Dashboard (database metrics)
- Browser DevTools for client-side debugging

---

**Architecture Version**: 1.0  
**Last Updated**: February 2026  
**Team**: ZeroMercy
