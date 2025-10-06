# Säkerhetskrav för AI-genererade applikationer

## Dokumentinformation
**Version:** 1.0  
**Senast uppdaterad:** 2025-10-06  
**Syfte:** Säkerställa grundläggande och avancerad säkerhet i AI-utvecklade applikationer

---

## 🔴 Kritiska krav (Implementeras före produktion)

### 1. Transport & Kryptering
- [ ] **HTTPS överallt** - alla endpoints, automatisk HTTP→HTTPS redirect
- [ ] **TLS 1.3** som minimum
- [ ] Använd Let's Encrypt eller motsvarande för certifikat
- [ ] **Kryptering at rest** - aktivera databaskryptering
- [ ] **Disk encryption** på alla servrar/containers

### 2. Autentisering & Auktorisering
- [ ] **Row Level Security (RLS)** aktiverat från dag 1
- [ ] Testa RLS-policys genom att försöka läsa andra användares data
- [ ] Multi-factor authentication (MFA) för admin-konton
- [ ] Session timeout: max 24 timmar inaktivitet
- [ ] Password requirements: min 12 tecken, komplexitet

### 3. API-säkerhet
- [ ] **Aldrig** API-nycklar i kod eller repositories
- [ ] Använd secrets manager (Google Secret Manager, AWS Secrets Manager, Vercel Env)
- [ ] Rotera nycklar var 90:e dag
- [ ] `.env` filer i `.gitignore`
- [ ] Scan repositories för exponerade secrets (Gitleaks, TruffleHog)

### 4. Rate Limiting
```
Standard-gränser:
- API: 100 requests/timme per IP
- Login: 5 försök/15 min per IP
- Registration: 3/timme per IP
- Password reset: 3/timme per email
```
- [ ] Implementera rate limiting på alla publika endpoints
- [ ] Använd Redis eller motsvarande för distributed rate limiting
- [ ] Logga rate limit violations

### 5. Input Validation & Sanitering
- [ ] **Validera på frontend OCH backend** - trust nothing
- [ ] Sanitera ALL användarinput
- [ ] Parametriserade queries (inga string concatenations)
- [ ] File upload validation: typ, storlek, innehåll
- [ ] Blocka null bytes, path traversal (`../`), SQL-tecken i olämpliga fält

### 6. Bot-skydd
- [ ] **CAPTCHA** på: registrering, login, kontaktformulär, password reset
- [ ] Använd invisible mode (hCaptcha, reCAPTCHA v3)
- [ ] Honeypot-fält i formulär

---

## 🟡 Viktiga krav (Implementeras inom 30 dagar efter launch)

### 7. Dependency Management
- [ ] **Dependabot/Renovate** aktiverat
- [ ] Uppdatera dependencies månadsvis minimum
- [ ] Security patches samma dag
- [ ] `npm audit` / `pip-audit` i CI/CD pipeline
- [ ] Blocka deployment vid critical vulnerabilities

### 8. Logging & Monitoring
```
Logga:
✓ Autentiseringsförsök (lyckade + misslyckade)
✓ Auktoriseringsfel
✓ Rate limit violations
✓ Input validation failures
✓ Exceptions och errors
✗ Lösenord, tokens, PII
```
- [ ] Centraliserad logging (Sentry, LogRocket, DataDog)
- [ ] Alerts på kritiska events
- [ ] Log retention: minimum 90 dagar

### 9. Security Headers
```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```
- [ ] Implementera alla security headers
- [ ] Testa med securityheaders.com

### 10. CSRF & CORS
- [ ] **CSRF tokens** på alla state-changing requests
- [ ] Restriktiv CORS-policy (endast whitelistade domains)
- [ ] SameSite cookies (`SameSite=Strict` eller `Lax`)

### 11. Backup & Recovery
- [ ] Automatiska dagliga backups
- [ ] Test restore var 30:e dag
- [ ] Offsite/cross-region backup storage
- [ ] Point-in-time recovery capability

---

## 🟢 Avancerade krav (Enterprise/Scale)

### 12. Infrastructure
- [ ] **PaaS/managed services** över self-hosted där möjligt
- [ ] Principle of least privilege för alla IAM roles
- [ ] **Default deny** för inbound OCH outbound trafik
- [ ] Network segmentation (VPC, subnets)
- [ ] Immutable infrastructure (containers)

### 13. Supply Chain Security
- [ ] **SBOM** (Software Bill of Materials) genereras automatiskt
- [ ] Code signing för releases
- [ ] Dependency vulnerability scanning i CI/CD
- [ ] Private package registry för interna paket
- [ ] Vendor security reviews

### 14. Code Review & Testing
- [ ] **AI code review** (Coderabbit, SonarQube) på alla PRs
- [ ] **Manuell security review** för kritiska features
- [ ] Automated security testing (SAST/DAST)
- [ ] Penetration testing årligen eller efter stora changes
- [ ] Chaos engineering för resilience testing

### 15. Data Privacy (GDPR)
- [ ] **Data minimering** - samla endast nödvändig data
- [ ] Dokumentera dataflöden och lagring
- [ ] Right to deletion implementation
- [ ] Data retention policies
- [ ] Privacy by design i alla features

### 16. Incident Response
```
Incident Response Plan innehåller:
1. Detektering och alerting
2. Eskaleringsprocess
3. Containment procedures
4. Forensics och root cause analysis
5. Recovery procedures
6. Post-mortem och lessons learned
7. Kommunikationsplan (users, press)
```
- [ ] Incident response plan dokumenterad
- [ ] Incident response team definierat
- [ ] Runbooks för vanliga scenarios
- [ ] Årliga tabletop exercises

---

## 🔧 Implementation Guidelines

### För nya projekt
1. **Vecka 1:** Kritiska krav (🔴)
2. **Månad 1:** Viktiga krav (🟡)
3. **År 1:** Avancerade krav (🟢) efter behov

### För befintliga projekt
1. **Security audit** - identifiera gaps mot kritiska krav
2. **Prioritera** baserat på risk (exponering × impact)
3. **Remediate** kritiska sårbarheter inom 7 dagar
4. **Roadmap** för viktiga och avancerade krav

### Teknologival påverkar säkerhet

**Rekommenderat stack för AI-utveckling:**
- **Backend:** TypeScript + Next.js/Remix (typ-säkerhet)
- **Database:** PostgreSQL med Supabase (inbyggd RLS)
- **Hosting:** Vercel/Railway/Render (managed, auto-patching)
- **Auth:** Supabase Auth/Clerk/Auth0 (battle-tested)
- **Secrets:** Vercel Environment Variables/Doppler
- **Monitoring:** Sentry + Axiom/BetterStack

**Undvik om möjligt:**
- Self-hosted VMs (patching burden)
- Custom auth implementations
- Secrets i kod eller Docker images
- Overkill complexity (microservices för MVP)

---

## 📊 Security Metrics

Följ dessa KPIs:
- **Mean Time to Patch (MTTP):** <7 dagar för critical, <30 för high
- **Vulnerability Backlog:** 0 critical, <5 high
- **Failed Login Attempts:** Baseline + alerts på +200% spikes
- **Rate Limit Triggers:** Baseline + alerts på unusual patterns
- **Dependency Age:** <90 dagar för produktionsdependencies
- **Backup Success Rate:** 100%
- **Log Coverage:** 100% av endpoints

---

## 🚨 Red Flags

**Stoppa deployment om:**
- ❌ Exposed API keys i kod
- ❌ No RLS på multi-tenant data
- ❌ Critical CVE i dependencies
- ❌ No rate limiting på public endpoints
- ❌ HTTP endpoints utan redirect
- ❌ SQL injection möjlig
- ❌ Authentication bypass möjlig

---

## 📚 Resurser

### Verktyg (alla open source / free tier)
- **Secrets scanning:** Gitleaks, TruffleHog
- **Dependency scanning:** Dependabot, Snyk
- **SAST:** SonarQube Community, Semgrep
- **Container scanning:** Trivy, Grype
- **SBOM:** Syft, DependencyTrack
- **Monitoring:** Sentry (errors), BetterStack (logs)

### Läsning
- OWASP Top 10
- OWASP ASVS (Application Security Verification Standard)
- NIST Cybersecurity Framework
- CWE Top 25

### Testing
- **Testa själv:** försök läsa andra användares data, SQL injection, XSS
- **Automated:** ZAP, Nuclei templates
- **Professional:** HackerOne, Bugcrowd för bug bounty program

---

## ✅ Compliance Checklist

Vid code review, verifiera:
- [ ] Ingen hardcoded secrets
- [ ] Input valideras på backend
- [ ] Queries är parametriserade
- [ ] Error messages exponerar inte känslig info
- [ ] Logging innehåller inte PII/credentials
- [ ] Rate limiting finns på endpoint
- [ ] Authorization checks före data access
- [ ] HTTPS används för all kommunikation

---

**Kom ihåg:** Säkerhet är inte en one-time task, det är en kontinuerlig process. AI gör dig snabb, men säkerhet gör dig hållbar.

**Next step:** Kopiera denna checklist till ditt projekt och börja bocka av! 🎯