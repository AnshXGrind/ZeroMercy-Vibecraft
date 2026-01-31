Hero background and overlay components

Files added:
- `src/components/HeroBackground.jsx` — Three.js optimized background with particles, layered grids, and mouse parallax.
- `src/components/Hero.jsx` — Hero wrapper that places bold typography and CTA over the animated background.
- `src/components/Hero.module.css` — Minimal, responsive styles tuned for a premium feel.

Integration (Next.js + Tailwind-ready):

1) Install three:

```bash
npm install three
# or
yarn add three
```

2) Client-only import (use dynamic import in Next.js page):

Example: pages/index.jsx

```jsx
import dynamic from 'next/dynamic';
const Hero = dynamic(() => import('../src/components/Hero'), { ssr: false });

export default function Home(){
  return (
    <main>
      <Hero title="TECHFEST • INNOVATE" subtitle="A festival of ideas" cta="Register" />
    </main>
  );
}
```

3) Tailwind: the components use neutral CSS; Tailwind can be layered on top.

Notes:
- This background is tuned for smooth motion and performance. Reduce `particleCount` in `HeroBackground.jsx` if you need to improve mobile performance further.
- Because this uses WebGL, the component is rendered client-side only (disable SSR as shown above).
