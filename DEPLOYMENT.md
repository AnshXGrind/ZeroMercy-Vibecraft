# Infinitus Tech Fest Website

A futuristic, neon-themed tech fest website built with Vite, React, and TypeScript.

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` to view the site locally.

### Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 📦 Deployment to Vercel

### Option 1: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option 2: Deploy via Git Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect the configuration from `vercel.json`
5. Click "Deploy"

### Option 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AnshXGrind/ZeroMercy-Vibecraft)

## 🏗️ Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── main.jsx       # Main entry point
│   └── styles.css     # Global styles
├── public/            # Static assets
├── events/            # Event detail pages
├── *.html             # Static HTML pages
├── vite.config.js     # Vite configuration
├── vercel.json        # Vercel deployment config
└── package.json       # Dependencies
```

## 🎨 Features

- 🎭 Neon-themed cyberpunk design
- 📱 Fully responsive layout
- ⚡ Lightning-fast performance with Vite
- 🎪 Interactive 3D event cards
- 🖼️ Gallery and lightbox views
- 📹 Video background hero section
- 🔄 Progressive Web App (PWA) ready

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: TypeScript / JavaScript
- **Styling**: CSS Variables with CSS-in-JS
- **Deployment**: Vercel

## 📝 Configuration

### Vercel Settings

The `vercel.json` file includes:
- Build command: `npm run build`
- Output directory: `dist`
- URL rewrites for clean URLs
- Cache headers for optimization

### Vite Configuration

The `vite.config.js` includes:
- React plugin with Fast Refresh
- Multi-page build configuration
- Optimized build settings

## 🐛 Troubleshooting

### Build Fails
- Ensure Node.js version is 18 or higher
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

### Deployment Issues
- Check Vercel build logs
- Ensure all environment variables are set (if any)
- Verify `vercel.json` configuration

## 📄 License

This project is private and proprietary.

## 👥 Contributors

- ZeroMercy Team
- AnshXGrind

---

Made with ⚡ by the Infinitus Team
