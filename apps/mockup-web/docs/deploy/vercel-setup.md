# Deploy to Vercel (+ Loopia DNS)

## 1) Förbered repo

- Build: `npm run build` → output i `dist/`
- `vercel.json` innehåller SPA-routing och säkerhetsheaders

## 2) Skapa Vercel-projekt

1. vercel.com → New Project → Importera GitHub
2. Framework: Vite
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Env vars vid behov (`VITE_*`)

## 3) Koppla caizen.se i Vercel och Loopia

1. Vercel: Settings → Domains → Add → `caizen.se`
2. Loopia DNS:
   - Apex `caizen.se`: A → 76.76.21.21
   - `www.caizen.se`: CNAME → `cname.vercel-dns.com.`
3. Vänta på DNS-propagation (5–60 min)

## 4) Testa och säkerhet

- Förhandsdeploys på PR/commit, prod på `main`
- Headers: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP
- Uppdatera CSP `connect-src` när Supabase/Sentry kopplas

## 5) Felsökning

- SPA 404 → kontrollera `routes` i `vercel.json`
- Blockerade skript → kontrollera CSP i `vercel.json`
- DNS → verifiera i Vercel Domain status + Loopia
