---
title: "Security Checklist Template"
status: draft
version: 1.0.0
last_updated: 2025-10-06
---

# 🔐 Security Checklist (Template)

> Använd denna mall för nya features, releaser och systemförändringar. All text och filer ska vara UTF-8 (utf8mb4). Inkludera alltid testdata med Å, Ä, Ö.

## Meta
- **Feature/Ändring:**
- **Ägare:**
- **Datum:**
- **Risknivå:** Låg / Medel / Hög / Kritisk

## Inputvalidering
- [ ] Server-side validering för alla endpoints
- [ ] Klientvalidering speglar serverregler (inte ersätter)
- [ ] Regex/policy för svenska format (regnr, personnummer, VIN)

## Autentisering & Auktorisering
- [ ] Skyddade endpoints kräver auth-token
- [ ] Roll/behörighetskontroller per resurs
- [ ] Session/Token-expiration och rotation testad

## Sekretess & Datamaskering
- [ ] Maskera registreringsnummer, VIN, personnummer i UI/loggar
- [ ] Kryptering i vila (AES-256) och under transport (TLS1.2+)
- [ ] Separata nycklar per datatyp och key-rotation plan

## Läckageskydd & Loggning
- [ ] Audit-logg av åtkomst till känslig data
- [ ] Rate limiting och bot-skydd
- [ ] Inga hemligheter i repo, env vars dokumenterade

## Webbsäkerhet
- [ ] XSS-skydd (output-escaping, CSP, React sanitization)
- [ ] CSRF-skydd (tokens/dubbla submit-cookies) vid state-ändringar
- [ ] Clickjacking-skydd (X-Frame-Options/SameSite)

## Beroenden & Bygg
- [ ] `npm audit` och sårbarheter åtgärdade
- [ ] Linting/Prettier/Typecheck OK
- [ ] CI säkerhetssteg körs (inkl. UTF-8-check)

## Deployment & Infrastruktur
- [ ] HTTPS tvingat, HSTS
- [ ] Secrets i hemlig manager (inte i .env i prod)
- [ ] Backups + återläsningstest

## Testning
- [ ] Automatiska säkerhetstester finns och passerar
- [ ] Manuell kontroll enligt denna lista signerad
- [ ] Testdata innehåller Å, Ä, Ö

## Godkännande
- **Reviewer (Security):**
- **Reviewer (Owner):**
- **Datum:**

---
Notera: Följ OWASP Top 10. Rapportera avvikelser i `docs/SECURITY.md` samt i CHANGELOG. 🛡️


