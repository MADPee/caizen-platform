# Lovable Mode (Environment Toggle)

This document explains the environment-based toggle to safely use Lovable while keeping production security intact.

## Usage

- Local dev with strict CSP (default):
  - `npm run dev` or `npm run build`
- Lovable/editor mode (relaxed CSP + overlay script):
  - `npm run dev:lovable` or `npm run build:lovable`

The toggle is controlled via `VITE_LOVABLE=1` and a Vite HTML transform that injects relaxed CSP and the Lovable overlay script only when enabled.

## Security notes

- Do not use Lovable mode for production deployments.
- Do not load production secrets in Lovable mode.
- Production hosting should enforce strict headers (HSTS, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Permissions-Policy, strict CSP without external scripts).

# Lovable Mode (Development-Only)

This document explains security considerations when editing/prompting the project inside Lovable, and how our "Lovable mode" works.

## What is Lovable mode?

Lovable mode is a development-only branch/config that relaxes browser security controls so Lovable's in-editor overlay and preview can run:

- Re-enables Lovable overlay script: `https://cdn.gpteng.co/gptengineer.js`
- Allows embedding by Lovable: `frame-ancestors https://lovable.dev`
- Keeps other protections intact (no objects, limited connect-src, etc.)

Never use Lovable mode for production deployments.

## Risks and mitigations

- External script execution: Allowing `cdn.gpteng.co` expands the trust boundary. Mitigation: Use only on dev/staging, and only with non-sensitive data.
- Embedding/clickjacking surface: Allowing `frame-ancestors https://lovable.dev` turns off strict DENY. Mitigation: Only in Lovable mode; enforce DENY in main branch/prod.
- Data egress/telemetry: Relaxed `connect-src` can enable more outbound connections. Mitigation: No PII/production secrets in dev; use separate environment keys.

## Operational guidance

- Branch: `lovable-mode` carries the relaxed CSP and overlay script.
- Main branch: strict CSP (`script-src 'self'`, `frame-ancestors 'none'`) with no overlay script.
- Secrets: Do not load production secrets in Lovable; use `.env` dev keys only.
- Reviews: Treat Lovable mode as an exception profile; do not merge into production.

## Header/Hosting alignment (production)

In production, also enforce server headers:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

Content-Security-Policy in production should avoid external scripts, and ideally remove `'unsafe-inline'` when inline styles are refactored out.


