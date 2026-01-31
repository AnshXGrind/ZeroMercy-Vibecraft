# Vibecraft Event Platform - Setup Guide

## Overview
Full-featured event management platform with user authentication, event registration, and admin controls built with React, Supabase, and Express.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Supabase account
- Vercel account (for frontend deployment)
- Render account (for backend deployment)

## 📋 Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API to get:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Run the database schema:
   - Go to SQL Editor in Supabase dashboard
   - Copy and paste contents of `backend/supabase_schema.sql`
   - Execute the script

### 2. Environment Variables

#### Frontend (.env.local)
```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:3000  # For development
```

#### Backend (backend/.env)
```bash
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=3000
NODE_ENV=development
JWT_SECRET=your-jwt-secret
```

### 3. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 4. Local Development

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run backend:dev
```

Frontend: http://localhost:5173
Backend: http://localhost:3000

## 🗄️ Database Schema

The platform uses 3 main tables:

### profiles
- User information (name, email, phone, college)
- Role management (user/admin)

### events
- Event details (title, description, date, location)
- Category, capacity, registration fee
- Soft delete support

### registrations
- User-event registrations
- Payment status tracking
- Cancellation support

## 🔐 Authentication Flow

1. User registers via `/register` page
2. Supabase Auth creates user account
3. Profile is automatically created in `profiles` table
4. User can sign in via `/login` page
5. JWT token stored in localStorage
6. Protected routes check authentication status

## 📡 API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile

### Events Routes
- `GET /api/events` - List all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)

### Registrations Routes
- `GET /api/registrations` - User's registrations
- `POST /api/registrations` - Register for event
- `PUT /api/registrations/:id/cancel` - Cancel registration
- `PUT /api/registrations/:id/payment` - Update payment status

## 🚢 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (your Render backend URL)
4. Deploy

### Backend (Render)

1. Push code to GitHub
2. Create new Web Service in Render
3. Connect to repository
4. Use these settings:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && node server.js`
5. Add environment variables (see render.yaml)
6. Deploy

## 🎨 Frontend Structure

```
src/
├── lib/
│   └── supabase.js          # Supabase client
├── contexts/
│   └── AuthContext.jsx       # Auth state management
├── hooks/
│   └── useEvents.js          # Event hooks
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Events.jsx
│   └── EventDetails.jsx
└── App.jsx                   # Router configuration
```

## 🔧 Backend Structure

```
backend/
├── server.js                 # Express server
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── events.js            # Event management
│   └── registrations.js     # Registration management
└── supabase_schema.sql      # Database schema
```

## 🔒 Security Features

- Row Level Security (RLS) policies on all tables
- JWT token verification
- Admin role checks for protected operations
- Input validation
- SQL injection prevention
- CORS configuration

## 🎯 Key Features

1. **User Management**
   - Registration with profile creation
   - Login/logout
   - Profile management

2. **Event Management**
   - Browse events by category
   - Search functionality
   - Event details page
   - Registration with capacity checks

3. **Registration System**
   - One-click registration
   - Payment status tracking
   - Cancellation support
   - User dashboard with registrations

4. **Admin Features**
   - Create/update/delete events
   - View all registrations
   - Manage payment status

## 📝 Usage

### Creating Admin User
After registration, update user role in Supabase:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@example.com';
```

### Adding Events
Admins can add events via the API or directly in Supabase:
```sql
INSERT INTO events (title, description, category, event_date, location, max_participants, registration_fee)
VALUES ('Tech Workshop', 'Learn React and Supabase', 'workshop', '2024-02-15 10:00:00', 'Main Hall', 50, 500);
```

## 🐛 Troubleshooting

### Authentication Issues
- Check Supabase credentials in .env files
- Verify JWT_SECRET matches Supabase project
- Clear browser localStorage and try again

### Connection Issues
- Ensure backend is running on port 3000
- Check CORS settings in server.js
- Verify Supabase RLS policies are active

### Build Issues
- Run `npm install` in both root and backend
- Check Node.js version (16+ required)
- Clear node_modules and reinstall

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Router Documentation](https://reactrouter.com)
- [Vite Documentation](https://vitejs.dev)
- [Express.js Documentation](https://expressjs.com)

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase logs
3. Check browser console for errors
4. Verify environment variables are set correctly
