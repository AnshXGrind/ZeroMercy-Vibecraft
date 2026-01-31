This project contains a small Vite + React app used to render 3D-style event cards.

Quick commands:

Install:
```
npm install
```

Dev server (Vite):
```
npm run dev
```

Build and copy output to project root (so the existing python static server can serve built files):
```
npm run build
```

Notes:
- The `build` script runs `vite build` then `scripts/copyDistToRoot.js` to copy `dist/*` into the repository root so `python -m http.server` can serve the built site.
- During development, open Vite's dev server (it serves ES modules). For serving the built files with python, run the build command first.
