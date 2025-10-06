# Mockup Web (Lovable) – Run Guide

Location: `apps/mockup-web`

## Install
```bash
cd apps/mockup-web
npm ci
```

## Dev
```bash
npm run dev           # strict CSP
npm run dev:lovable   # Lovable overlay (env-based)
```

## Build
```bash
npm run build
```

Notes:
- Port set in `vite.config.ts` (7777).
- Security headers for deploy via `vercel.json`.
