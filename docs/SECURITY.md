# CaiZen - Säkerhetsdokumentation

## 🔒 Säkerhetsöversikt

CaiZen är byggt med "Privacy by Design" och militärgrad säkerhet för känslig fordonsdata.

Se även [säkerhetskrav-checklistan](/docs/security/security_checklist.md) för mätbara kontroller, headers och CSRF/CORS-policy.

## 🛡️ Säkerhetsprinciper

### 1. Automatisk Datamaskering

All känslig data maskeras automatiskt och aldrig exponeras i klartext:

```typescript
// Registreringsnummer
"ABC123" → "ABC***"

// VIN-nummer
"WBA3A5G59DNP26082" → "WBA***********6082"

// Personnummer
"19901201-1234" → "199012**-****"
```

### 2. Krypterad Datalagring

- **AES-256 kryptering** för känslig data
- **Separata krypteringsnycklar** per datatyp
- **Key rotation** för långsiktig säkerhet

### 3. GDPR Compliance

- **Data minimization** - samla endast nödvändig data
- **Explicit consent** för all databehandling
- **Right to be forgotten** - fullständig dataradering
- **Data portability** - enkel export av användardata

### 4. Transport & Kryptering

- **HTTPS** tvingas överallt (HTTP→HTTPS redirect)
- **TLS 1.3** som minimumnivå
- **Kryptering i vila** (databaskryptering) och **diskkryptering**

### 5. Autentisering & Auktorisering

- **Row Level Security (RLS)** aktiverat (multi-tenant som standard)
- **MFA** för admin-konton
- **Session timeout**: max 24 timmar inaktivitet
- **Lösenordspolicy**: min 12 tecken och komplexitet

### 6. API-säkerhet

- Inga hemligheter i kod/repo; använd secrets manager
- Nyckelrotation minst var 90:e dag
- `.env` filer ignoreras i Git
- **Secrets scanning** i CI (t.ex. Gitleaks/TruffleHog)

### 7. Security Headers

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Content-Security-Policy: default-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 8. CSRF & CORS

- **CSRF-tokens** på alla state-ändrande requests
- Restriktiv **CORS** (endast whitelistade domäner)
- Cookies med `SameSite=Strict` eller `Lax`

### 9. Backup & Recovery

- Dagliga automatiska backups; **restore-test** minst var 30:e dag
- Offsite/cross‑region lagring och **point‑in‑time recovery**

### 10. Språk- och kodningspolicy (UTF‑8)

- All kod/konfig/databaser: **UTF‑8/utf8mb4**
- Svenska databaser: **utf8mb4_swedish_ci** kollektion
- API-svar: `Content-Type` med `charset=utf-8`
- HTML: `<meta charset="UTF-8">`
- CI: automatisk UTF‑8‑kontroll
- Testdata ska alltid inkludera **Å, Ä, Ö**

## 🔍 Säkerhetskontroller

### Pre-commit Hooks

Automatiska kontroller förhindrar känslig data i Git:

```bash
# Kontrollerar efter:
- Registreringsnummer (ABC123 format)
- VIN-nummer (17 tecken format)
- Personnummer (YYYYMMDD-XXXX format)
- API-nycklar och secrets
```

### Runtime Validering

```typescript
// Alla inputs valideras enligt säkra patterns
export const isValidSwedishRegistration = (reg: string): boolean => {
  const pattern = /^[A-Z]{3}[0-9A-Z]{3}$/;
  return pattern.test(reg.replace(/\s/g, "").toUpperCase());
};
```

### Audit Logging

All dataåtkomst loggas för säkerhetsanalys:

```typescript
interface AuditLogEntry {
  timestamp: Date;
  action: string;
  dataType: "registration" | "vin" | "personal" | "document";
  userId?: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  details?: Record<string, unknown>;
}
```

## 🚨 Säkerhetsincidenthantering

### Steg 1: Detektering

- **Automatisk monitoring** för onormal dataåtkomst
- **Real-time alerts** för säkerhetsbrott
- **User-reported incidents** via säker kanal

### Steg 2: Containment

- **Omedelbar isolation** av komprometterade system
- **Revoke access tokens** för drabbade användare
- **Säkra logs** och bevismaterial

### Steg 3: Investigation

- **Forensisk analys** av incident
- **Identifiera orsak** och påverkade data
- **Dokumentera timeline** och åtgärder

### Steg 4: Recovery

- **Återställ säkra system**
- **Uppdatera säkerhetskonfiguration**
- **Kommunicera med drabbade användare**

### Steg 5: Lessons Learned

- **Post-incident review**
- **Uppdatera säkerhetspolicies**
- **Förbättra detekteringsförmåga**

## 🔐 Utvecklarsäkerhet

### Säker Kodning

```typescript
// ✅ RÄTT: Använd alltid maskerade värden
const maskedReg = maskRegistrationNumber(registration);
console.log("Vehicle registered:", { registration: maskedReg });

// ❌ FEL: Exponera aldrig klartext
console.log("Vehicle registered:", { registration }); // ALDRIG!
```

### Testdata

```typescript
// ✅ Använd alltid testdata för exempel
const TEST_REGISTRATION = "TEST123";
const TEST_VIN = "WBATEST1234567890";

// ❌ Använd ALDRIG riktiga värden
const REAL_REG = "ABC123"; // FÖRBJUDET!
```

### Code Review Checklist

- [ ] Inga känsliga data i logs
- [ ] All input validerad
- [ ] Datamaskering implementerad
- [ ] Audit logging aktiverat
- [ ] Tests med testdata endast

## 🎯 Penetrationstesting

### Automatiska Säkerhetstester

```bash
# SQL Injection tests
npm run test:security:sql

# XSS protection tests
npm run test:security:xss

# Data leakage tests
npm run test:security:leaks
```

### Manuella Säkerhetstester

- **Input validation** för alla formulär
- **Authentication bypass** försök
- **Authorization escalation** tester
- **Data exfiltration** scenarier

## 📋 Säkerhets-Checklista

### För nya funktioner:

- [ ] Identifiera all känslig data
- [ ] Implementera datamaskering
- [ ] Lägg till audit logging
- [ ] Skapa säkerhetstester
- [ ] Dokumentera säkerhetsrisker
- [ ] Code review för säkerhet

### För deployment:

- [ ] Säkerhetstester passerade
- [ ] Miljövariabler säkra
- [ ] HTTPS konfigurerat
- [ ] Rate limiting aktiverat
- [ ] Monitoring konfigurerat
- [ ] Incident response plan uppdaterad

## 🆘 Rapportera Säkerhetsproblem

### Responsibel Disclosure

1. **Skicka rapport** till säkerhetsteamet
2. **Inkludera detaljer** om sårbarheten
3. **Vänta på bekräftelse** innan offentliggörande
4. **Samarbeta** med fixes och verifiering

### Kontaktinformation

- **Email:** security@caizen.se
- **Krypterad kommunikation:** Använd PGP-nyckel
- **Response tid:** Inom 24 timmar

## 📊 Säkerhetsmetrics

### Key Performance Indicators

- **Mean Time to Detection (MTTD):** < 5 minuter
- **Mean Time to Containment (MTTC):** < 30 minuter
- **False Positive Rate:** < 2%
- **Security Test Coverage:** > 95%

### Månadsrapporter

- Antal säkerhetsincidenter
- Audit log-analys
- Penetrationstestresultat
- Säkerhetsutbildningsresultat

---

**Säkerhet är inte en funktion - det är grunden för hela CaiZen-plattformen.** 🛡️
