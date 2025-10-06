# SEO checklist (pre‑prod → go‑live)

Pre‑prod (default):
- Meta robots: `noindex, nofollow` in `index.html`
- `public/robots.txt`: `Disallow: /`
- `vercel.json`: `X-Robots-Tag: noindex, nofollow`

Go‑live (enable indexing):
- Remove meta robots or set `index, follow`
- Change `public/robots.txt` to allow (`User-agent: *\nAllow: /`)
- Remove `X-Robots-Tag` or set `index, follow` in `vercel.json`
- Add canonical URL, social tags, sitemap

Notes:
- Allow a few days for indexing efter DNS‑switch.
- Be noga med CSP när externa analysverktyg läggs till (uppdatera `connect-src`).
