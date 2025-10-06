# Projektinstruktioner för CaiZen v3.0
*Version 3.0 - Privacy-First med Fordonscentrerad Arkitektur*  
*Uppdaterad: 2025-09-29*  
*Föregående version: v2.0 (2025-05-30)*

---

## 📋 Dokumentstatus och Versionshistorik

**Version 3.0 Förändringar:**
- Integrerat beslut från Loveable → Cursor utvecklingsprocess
- Lagt till UX-filosofi "Verksamhet utan att synas"
- Uppdaterat marknadsplats som kärnfunktion i MVP
- Community-funktioner med säkerhetsriktlinjer
- Konkreta verktygsrekommendationer (Supabase, tooling)
- Detaljerade datamaskerings- och privacy indicator-krav

---

## 🎯 Kommunikation och Samarbete

### Design-First Approach
- **Diskutera lösningsförslag och design INNAN artefakter skapas**
- Validera arkitektoniska beslut mot Privacy by Design-principer
- Säkerställ att alla features alignar med fordonscentrerad arkitektur
- Bryt ner komplexa implementationer i iterativa faser

### Koncis och Fokuserad Kommunikation
- Prioritera kärnfulla svar framför uttömmande detaljer
- Segmentera komplexa ämnen för att undvika maxlängdsbegränsningar
- Använd konkreta kodexempel istället för teoretiska förklaringar
- Referera till befintlig projektdokumentation vid behov

### Behovsanalys och Validering
- Förstå användarbehov innan teknisk implementation
- Validera mot målgruppernas prioriteringar:
  - **Bilköpare:** Transparent, verifierad historik
  - **Bilsäljare:** Bevis på fordonskvalitet
  - **Privacy-medvetna:** Dataskydd som självklarhet
  - **B2B Partners:** Integrationsmöjligheter

### Iterativ Utveckling
- Arbeta i små cykler med kontinuerlig feedback
- Prioritera MVP-funktioner som skapar omedelbart värde
- Dokumentera beslut och lärdomar löpande
- Använd project knowledge som "source of truth"

---

## 🏗️ Tekniska Principer

### Fordonscentrerad Arkitektur (KÄRNPRINCIP)
- **Fordonet äger sin historia** - ägare är "custodians"
- **VIN som primär identifierare** för all fordonsdata
- **Historik överlever ägarbyten** - permanent datalagring
- **Användare kan raderas** utan att förstöra fordonshistorik

### Privacy by Design (OBLIGATORISK)
- **Separera persondata från fordonsdata** i alla lager (DB, API, UI)
- **Persondata = Krypterat, temporärt, GDPR-raderbart**
- **Fordonsdata = Anonymt, permanent, följer bilen**
- **Ingen persondata får läcka från fordonshistorik**

### GDPR som Konkurrensfördel
- Använd GDPR-compliance som säljargument
- "Omöjligt att läcka persondata" som unik position
- Transparent datahantering som förtroendebonus
- Automatisk compliance, inte efterkonstruktion

### EU-centrerad Infrastruktur
- **Prioritera svenska/europeiska tjänster:**
  - Backend: Supabase (EU-region Frankfurt)
  - Kartor: HERE Maps API (Nederländerna) / OpenStreetMap
  - Betalning: Adyen/Klarna (Nederländerna/Sverige)
  - E-signering: Signicat (Norge)
  - Analytics: Matomo (self-hosted)

- **Budget-alternativ när relevant:**
  - OpenStreetMap för kartfunktionalitet
  - Open Source OCR (Tesseract.js)
  - Firebase/Supabase gratiskontingent för prototyper

### ISO 27001 Kompatibilitet
- Följ riktlinjer för informationssäkerhetshantering
- Implementera audit logging för känslig dataåtkomst
- Regelbundna säkerhetsgranskningar av kod och infrastruktur
- Dokumentera säkerhetsprocesser och incidenthantering

### AI/LLM-tjänster med Dataskyddsfokus
- **OCR och dokumentparsing:** Azure Computer Vision EU (Dublin)
- **Textanalys (anonymiserad):** OpenAI API med EU proxy
- **Prediktiv analys:** Egen ML-modell tränad på anonymiserad data
- **Alltid:** Verifiera GDPR-compliance före integration

---

## 💻 Kodpraxis

### Välstrukturerad och Modulär Kod
- Skriv läsbar TypeScript med strict mode
- Använd explicit return types för alla funktioner
- Flat file structure för enklare navigation
- Separera business logic från UI-komponenter

### Artefaktdisciplin
- Skapa endast artefakter när nödvändigt och diskuterat
- Använd artefakter för:
  - Kod över 20 rader
  - Kompletta funktionella komponenter
  - Återanvändbar dokumentation
- INTE för: Snabba svar, koncept-diskussioner, simple fixes

### Komponentuppdelning
- Dela upp stora kodbaser i hanterliga komponenter
- Max 300 rader per komponent (idealiskt <200)
- Använd kompositionsmönster för återanvändbarhet
- Separera presentational och container components

### Tydlig Dokumentation
- JSDoc för alla publika funktioner och komponenter
- Inline-kommentarer för komplex logik
- README för varje större modul/feature
- Datummärk och versionsmärk dokument

### Säkerhetskonventioner (OBLIGATORISKT)
```typescript
// Alltid maskera känsliga identifierare
const maskedVIN = maskVIN(vehicle.vin); // "WBA***********1234"
const maskedReg = maskRegistration(vehicle.registration); // "ABC***"

// Input validation med Zod
const VehicleSchema = z.object({
  vin: z.string().regex(/^[A-HJ-NPR-Z0-9]{17}$/),
  registration: z.string().max(10)
});

// Kryptering för persondata
const encryptedData = await encrypt(personalData, {
  algorithm: 'AES-256-GCM',
  keyId: 'personal-data-key-v1'
});
```

---

## 🔒 Dataskydd och Säkerhet

### Privacy by Design Implementation
- **Dataminimering:** Samla endast nödvändig data
- **Transparens:** Användaren ser exakt vad som lagras var
- **Dataseparation:** Tydlig gräns mellan person- och fordonsdata
- **Privacy indicators:** Visuella markörer i hela UI

### Dual-Schema Datamodell (OBLIGATORISK)
```sql
-- EVIGHETSFÖRVAR (Fordonsdata - PERMANENT)
vehicle_permanent.vehicles (
  vin_encrypted TEXT PRIMARY KEY,
  vin_masked TEXT,
  make TEXT,
  model TEXT,
  year INTEGER
);

vehicle_permanent.service_events (
  id UUID PRIMARY KEY,
  vin_encrypted TEXT REFERENCES vehicles,
  event_date DATE,
  service_type TEXT,
  -- INGEN persondata här
);

-- KRYPTERAT FÖRVAR (Persondata - GDPR-RADERBART)
personal_encrypted.user_profiles (
  user_id UUID PRIMARY KEY,
  email_encrypted TEXT,
  name_encrypted TEXT,
  created_at TIMESTAMP
);

personal_encrypted.ownership_records (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES user_profiles,
  vin_encrypted TEXT,
  ownership_start DATE,
  ownership_end DATE
);
```

### Kryptering och Åtkomstkontroll
- **AES-256-GCM** för all persondata
- **Separata krypteringsnycklar** per datatyp
- **Row Level Security (RLS)** i Supabase för all data
- **Audit logging** för känslig dataåtkomst
- **Key rotation** varje 90 dagar

### GDPR-kompatibla Integrationer
- Säkerställ att alla API:er och tjänster har DPA (Data Processing Agreement)
- EU/EES-datalagring för personuppgifter
- Transparent dokumentation av datadelning med tredje part
- Användarsamtycke innan dataexport till externa tjänster

### Användarrättigheter (Implementationskrav)
- **Right to access:** En-klicks dataexport (JSON/PDF)
- **Right to be forgotten:** Automatiserad GDPR-radering
- **Right to rectification:** Användaren kan korrigera sin data
- **Right to portability:** Strukturerad dataexport
- **Right to object:** Opt-out från databearbetning

---

## 🎨 Design och Användarupplevelse

### UX-filosofi: "Verksamhet utan att synas"
**Problem att undvika:** "Militärgrad säkerhet" som skrämmer användare  
**Lösning:** Subtil elegans med diskreta säkerhetsindikatorer  
**Resultat:** Professional känsla som bygger förtroende utan att vara påträngande

### Designsystem "SecureFleet Automotive"
```css
:root {
  /* Primära färger */
  --primary-blue: #0066B1;      /* BMW-inspirerad */
  --accent-orange: #FF7700;     /* CTA-knappar */
  --dark-bg: #1a1a1a;           /* Mörkt tema */
  
  /* Privacy indicators */
  --privacy-personal: #ef4444;  /* Persondata (röd) */
  --privacy-vehicle: #22c55e;   /* Fordonsdata (grön) */
  --privacy-mixed: #eab308;     /* Blandat (gul) */
  
  /* UI accents */
  --racing-stripe: linear-gradient(135deg, #0066B1, #FF7700);
}
```

### Privacy Indicators (OBLIGATORISK UI)
```typescript
// Alla komponenter som visar data MÅSTE ha indicators
<PrivacyBadge type="personal" />   // Röd badge
<PrivacyBadge type="vehicle" />    // Grön badge
<PrivacyBadge type="mixed" />      // Gul badge

// Exempel på implementation:
interface DataCardProps {
  data: VehicleData;
  privacyType: 'personal' | 'vehicle' | 'mixed';
}

const DataCard: React.FC<DataCardProps> = ({ data, privacyType }) => {
  return (
    <div className={`data-card privacy-${privacyType}`}>
      <PrivacyIndicator type={privacyType} />
      {/* Innehåll */}
    </div>
  );
};
```

### Datamaskering i UI (OBLIGATORISK)
```typescript
// Utility functions för maskering
const maskVIN = (vin: string): string => {
  if (vin.length !== 17) return vin;
  return `${vin.slice(0, 3)}***********${vin.slice(-4)}`;
};

const maskRegistration = (reg: string): string => {
  if (reg.length < 3) return '***';
  return `${reg.slice(0, 3)}***`;
};

// Använd ALLTID i komponenter:
<VehicleCard 
  vin={maskedVIN}  // ALDRIG klartext
  registration={maskedReg}
/>
```

### Responsiv och Mobile-First
- PWA-funktionalitet för garage-användning
- Offline-kapacitet för dokumentuppladdning
- Touch-optimerad UI för mobil användning
- Dark mode som standard (garage-vänligt)

---

## 🚀 Utvecklingsprocess och Verktyg

### Hybrid Utvecklingsapproach
**Loveable → Cursor Workflow:**
1. **Loveable:** Rapid UI/UX prototyping
   - Skapa komponenter och layouts snabbt
   - Testa design-koncept med användare
   - Generera initial kodbas
   
2. **Export till GitHub:** När UI är stabiliserat
   - Exportera Loveable-projekt
   - Setup Git repository
   - Etablera branching strategy

3. **Cursor:** Avancerad logik och backend
   - Implementera kryptering och säkerhet
   - Bygga API-integrations
   - Performance-optimering
   - Testing och QA

### Git Workflow och Branching
```bash
# Branch naming konventioner:
main              # Produktionskod
develop           # Utvecklingsbranch
privacy/[feature] # Privacy-relaterade features
vehicle/[feature] # Fordonscentrerade features
ocr/[feature]     # Dokumentparsing
gdpr/[feature]    # GDPR compliance
security/[fix]    # Säkerhetsrelaterade fixes

# Commit message format:
[domain] description - impact
# Exempel:
privacy: implement data masking utilities - HIGH
vehicle: add custody transfer logic - MEDIUM
gdpr: fix retention period calculation - CRITICAL
```

### Code Review Checklist
**Säkerhetsgranskning (OBLIGATORISK):**
- [ ] Separeras persondata korrekt från fordonsdata?
- [ ] Används kryptering för all känslig data?
- [ ] Finns privacy indicators i UI?
- [ ] Valideras all user input med Zod?
- [ ] Maskeras VIN/reg.nr i alla UI-komponenter?
- [ ] Loggas åtkomst till känslig data?
- [ ] Följer GDPR-raderingsrutiner rätt schema?

**Teknisk kvalitet:**
- [ ] Följer TypeScript strict mode?
- [ ] Har komponenten tester?
- [ ] Är koden dokumenterad med JSDoc?
- [ ] Följer naming conventions?
- [ ] Är performance acceptabel (<2s response)?

### Testing Strategy
```typescript
// Säkerhetstest (OBLIGATORISK)
describe('Data Masking', () => {
  test('should mask VIN correctly', () => {
    expect(maskVIN('WBA1234567890ABCD')).toBe('WBA***********ABCD');
  });
  
  test('should mask registration', () => {
    expect(maskRegistration('ABC123')).toBe('ABC***');
  });
});

// GDPR compliance test
describe('GDPR Deletion', () => {
  test('should delete personal data but preserve vehicle history', async () => {
    await gdprService.deleteUserData(testUserId);
    
    const personalData = await db.personal.findOne(testUserId);
    const vehicleData = await db.vehicle.findOne(testVIN);
    
    expect(personalData).toBeNull();
    expect(vehicleData).toBeDefined();
  });
});
```

---

## 🎯 Projektspecifika Riktlinjer

### Marknadsplats som Kärnfunktion
- **Inkluderad i MVP** - inte senare tillägg
- Kartbaserad visualisering med färgkodade markörer
- Geografisk säkerhet (max 1km precision)
- Integration av verifierad fordonshistorik i annonser
- Anonymous contact mellan köpare/säljare

### Community-funktioner med Säkerhet
```typescript
// Rate limiting för community
const RATE_LIMITS = {
  posts: { max: 10, window: '1h' },
  comments: { max: 50, window: '1h' },
  reports: { max: 5, window: '1h' }
};

// Auto-censurering av känslig data
const sanitizeContent = (content: string): string => {
  return content
    .replace(/[A-Z]{3}\d{3}/g, '***')      // Reg.nr
    .replace(/W[A-Z0-9]{16}/g, 'VIN***');  // VIN
};

// XSS-skydd
import DOMPurify from 'dompurify';
const safeHTML = DOMPurify.sanitize(userContent);
```

### OCR och Dokumentparsing
- **Tesseract.js** för lokal OCR-bearbetning
- AI-parser för automatisk dataseparation vid uppladdning
- Konfidenspoäng: >80% automatisk godkännande
- Manual review workflow för <80% konfidenspoäng
- Support för PDF, JPG, PNG

### Prominent Tanknings/Laddnings-input
- Frekventa åtgärder placeras överst i dashboard
- GPS-baserad stationsdetektering
- Multi-fordon support med auto-anpassning
- Smart fallbacks för olika användningsscenarier
- Real-time förbrukningsberäkning

---

## 📊 Effektiv Projekthantering

### Smartare Arbetsflöden
- Kontinuerligt effektivisera processer
- Automatisera repetitiva uppgifter där möjligt
- Använd templates för vanliga komponenter
- Etablera CI/CD pipeline early

### Dokumentbaserad Kunskap
- Prioritera strukturerad dokumentation
- Använd project knowledge som "single source of truth"
- Uppdatera dokument löpande vid beslut
- Versionskontroll för kritiska dokument

### Verktygsintegrering
- Enhetliga verktyg genom utvecklingskedjan
- GitHub för versionskontroll
- Supabase för backend och databas
- Vercel/Netlify för hosting och deployment
- Linear/GitHub Projects för projekthantering

### Resursoptimering
- Balansera utvecklingshastighet med kvalitet
- Använd Loveable för snabb prototyping
- Cursor för avancerad implementation
- Prioritera features med högst användarnytta

---

## ⚠️ Kritiska Varningar och Red Flags

### ALDRIG Acceptabelt
- ❌ Persondata i fordonshistorik
- ❌ Klartext lagring av VIN/reg.nr
- ❌ UI utan privacy indicators
- ❌ Dokumentparsing utan dataseparation
- ❌ GDPR-deletion som påverkar fordonshistorik
- ❌ localStorage/sessionStorage för känslig data (ej stöd i Claude.ai artifacts)

### Automatiska Utvecklingsstopp
```typescript
// Dessa patterns STOPPAR all development:
if (personalDataInVehicleHistory) {
  throw new CriticalPrivacyViolation("Personal data in vehicle history");
}

if (!privacyIndicatorsPresent) {
  throw new RequiredPrivacyUI("Missing privacy indicators");
}

if (gdprDeletionAffectsVehicleData) {
  throw new ArchitectureViolation("GDPR deletion must not affect vehicle data");
}
```

---

## 🎯 Framgångskriterier

### Teknisk Excellens
- **99%+ OCR accuracy** för nordiska dokument
- **<2s response times** för alla core operations
- **Zero privacy incidents** över 12 månader
- **100% automated GDPR compliance testing**

### Användaracceptans
- **Network effects threshold:** 10,000 registrerade fordon
- **User trust:** >4.8/5 rating på dataskydd
- **Industry adoption:** >5 verkstadskedjor integrerade
- **Regulatory recognition:** Godkännande från dataskyddsmyndighet

### Affärsmål
- **50,000 fordon** inom år 1
- **"Carfax Killer"** position i Norden år 3
- **International expansion** Norge/Danmark år 3
- **IPO-ready** dataplattform år 5

---

## 📞 Eskalering och Support

### Tekniska Frågor
- **Privacy/GDPR:** Eskalera till Privacy Officer
- **Säkerhet:** Eskalera till Security Lead
- **Arkitektur:** Eskalera till Tech Lead
- **Compliance:** Eskalera till Legal Team

### Utvecklingsresurser
- **Privacy by Design Checklist:** `/docs/privacy-checklist.md`
- **GDPR Test Suite:** `/tests/gdpr-compliance/`
- **Security Testing:** `/tests/security/`
- **Component Library:** `/src/components/privacy/`
- **API Documentation:** `/docs/api/`

---

## 📝 Dokumentunderhåll

### Detta dokument
- **Granskas:** Efter varje major release
- **Uppdateras:** När nya patterns etableras
- **Versioneras:** Semantic versioning (v3.0, v3.1, etc.)
- **Distribueras:** Till alla utvecklare och projektmedlemmar

### Relaterade dokument som bör synkroniseras:
1. **PRD (Product Requirements Document)** - Produktkrav och features
2. **Teknisk Arkitekturdokumentation** - System design och databas
3. **API-dokumentation** - Endpoints och integration
4. **Utvecklingssammanfattningar** - Status och beslut
5. **MyCarsJournal Produktspecifikation** - Original vision alignment

---

*Dessa projektinstruktioner representerar den aktuella standarden för CaiZen v3.0 utveckling. All kod, design och affärslogik MÅSTE följa dessa riktlinjer för att säkerställa projektframgång och användarförtroende.*

---

**Dokumentversion:** 3.0  
**Senast uppdaterad:** 2025-09-29  
**Nästa review:** Efter Community-implementation (Fas 4 completion)  
**Konfidentialitet:** Internt strategiskt dokument  
**Författare:** Produktteam & Utvecklingsteam, CaiZen