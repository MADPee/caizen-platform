# Security Checklist (Template)

## Meta
- Feature/Change:
- Owner:
- Date:
- Risk: Low / Medium / High / Critical

## Web Security
- [ ] CSP defined and tested (no external scripts in prod)
- [ ] X-Frame-Options / frame-ancestors deny
- [ ] X-Content-Type-Options nosniff
- [ ] Referrer-Policy strict-origin-when-cross-origin
- [ ] Permissions-Policy minimal

## Auth & Authorization
- [ ] Auth required for protected routes
- [ ] Role/permission checks per resource
- [ ] Session/token expiry & rotation

## Input & Storage
- [ ] Server-side validation mirrors client rules
- [ ] Parameterized queries only
- [ ] File uploads validated (type/size)

## Rate limiting & Bots
- [ ] Rate limiting on public endpoints
- [ ] CAPTCHA on auth-sensitive flows (login/reset/register)

## Logging & Privacy
- [ ] No secrets/PII in logs
- [ ] Centralized logging/alerts configured

## Dependencies & Supply Chain
- [ ] Dependabot enabled
- [ ] Secret scanning (Gitleaks) in CI

## Backups & Recovery (if applicable)
- [ ] Automated backups
- [ ] Periodic restore test

## Testing
- [ ] E2E smoke for auth/critical flows
- [ ] Basic security tests (headers/CSP)

Sign-off:
- Security reviewer:
- Owner:
- Date:
