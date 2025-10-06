# Supabase Setup (EU)

## 1) Create project
- Region: EU (e.g., Frankfurt)
- Keep anon/service keys safe

## 2) Apply schema
- Open SQL editor → run `database/migrations/20251006_init_supabase.sql`

## 3) Env vars (frontend)
```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=... (anon key)
```

## 4) Auth & RLS
- RLS is enabled by default on tables; policies restrict by `auth.uid()`
- Sign‑in providers: email/password for dev (add OAuth later)

## 5) Local dev
- Export env and start frontend:
  - `VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... npm run dev`

## 6) Production
- Add env vars in hosting (Vercel/Cloudflare)
- Update CSP `connect-src` to include your Supabase URL
