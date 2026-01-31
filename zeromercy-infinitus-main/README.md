# vibecraft — Hello World (Vercel)

This repo contains a minimal static "Hello, Vercel!" site ready to deploy.

Files:
- [index.html](index.html)
- [styles.css](styles.css)
- [vercel.json](vercel.json)

Quick deploy (pick one):

1) Deploy via Vercel web UI (recommended):
- Push this branch to GitHub (or your Git provider).
- Go to https://vercel.com, import the `AnshXGrind/vibecraft` repository, and follow the prompts.

2) Deploy using Vercel CLI:

```bash
# install (if needed)
npm i -g vercel

# login
vercel login

# from repo root
vercel --prod
```

Notes:
- The `vercel.json` config uses the static builder so `index.html` is served.
- After deploying, your site will be live on a Vercel URL. You can add a custom domain from the Vercel dashboard.
