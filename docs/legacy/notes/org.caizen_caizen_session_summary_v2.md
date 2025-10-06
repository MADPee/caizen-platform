# CaiZen Utvecklingssession - Komplett Dokumentation
**Datum:** 2025-05-30  
**Version:** 2.0  
**Session-typ:** Strategisk planering och teknisk design  
**Status:** Migration från Loveable till Cursor planerad

---

## 📋 Executive Summary

Denna session fokuserade på att förfina CaiZen MVP från en grundläggande fordonsplattform till en komplett ekosystem med säker datahantering, kartbaserad marknadsplats och frekvent använd tanknings/laddningsfunktion. Viktiga beslut inkluderar övergång från "skrikig" säkerhetskommunikation till elegant subtilitet och planerad backend-migration från Supabase till NHOST.

**Nyckelbeslut:**
- ✅ Tanknings/laddningsfunktion som primär användarinteraktion
- ✅ Multi-fordon support med dynamisk formulärhantering
- ✅ Supabase för MVP, parallell migration till NHOST planerad
- ✅ "Verksamhet utan att synas" som UX-filosofi

---

## 🎯 Session-agenda och Genomförda Aktiviteter

### 1. Initial Kontext och Projektöversikt
**Syfte:** Etablera projektvision och MVP-omfattning  
**Resultat:**
- Definierade CaiZen som säker fordonsplattform + marknadsplats + community
- Prioriterade datasäkerhet för reg.nr/VIN som kärnkrav
- Identifierade kartbaserad marknadsplats som primär USP

### 2. MVP-funktioner och Prioritering
**Diskussion:** Vilka funktioner ska ingå i första versionen?  
**Beslut:**
```
Priority 1: Fordonshantering (bränsle, service, dokument)
Priority 2: Kartbaserad marknadsplats med geografisk sökning
Priority 3: Community-funktioner (fordonsgrupper)
Priority 4: Tanknings/laddningsfunktion (frekvent använd)
```

**Motivering:** Marknadsplats och community är USP:ar som differentierar CaiZen från konkurrenter.

### 3. Säkerhetsarkitektur för Känslig Fordonsdata
**Problem:** Reg.nr och VIN kan missbrukas för bedrägerier  
**Lösning:**
```typescript
// Kryptering på databasnivå
vehicles (
  registration_encrypted TEXT,  // AES-256 krypterat
  vin_encrypted TEXT,
  registration_masked TEXT,     // "ABC***" för UI
  vin_masked TEXT               // "WBA***********1234" för UI
)

// Maskeringsfunktioner
const maskRegistration = (reg: string) => 
  reg.substring(0, 3) + '*'.repeat(reg.length - 3);

const maskVIN = (vin: string) => 
  vin.substring(0, 3) + '*'.repeat(vin.length - 7) + vin.substring(vin.length - 4);
```

**Säkerhetsprinciper:**
- Aldrig klartext i frontend
- Backend-only dekryptering för verifiering
- Audit logging för all åtkomst till känslig data
- GDPR-compliant "right to be forgotten"

### 4. Marknadsplats-implementation
**Vision:** Kartbaserad fordonshandel med verifierad historik  
**Teknisk Design:**

**Geografisk säkerhet:**
- Endast stad/region visas (ej exakt adress)
- Ungefärliga koordinater med 1km precision
- Radiusbaserad sökning

**Fordonsmarkörer:**
- 🟢 Grön: Fullständigt verifierad + komplett historik
- 🟡 Gul: Delvis verifierad + viss historik
- 🔴 Röd: Overifierad eller bristfällig historik

**Datamodell:**
```typescript
interface MarketplaceListing {
  id: string;
  title: string;
  price: number;
  location: string;              // "Stockholm" (ej exakt)
  registrationMasked: string;    // "ABC***"
  vinMasked: string;             // "WBA***********1234"
  verificationStatus: 'verified' | 'partial' | 'unverified';
  documentationScore: number;    // 0-100%
}
```

### 5. UX-Evolution: "Verksamhet utan att synas"
**Problem:** Initial design var för "skrikig" om säkerhet  
**Före:**
```
"MILITÄRGRAD SÄKERHET" överallt
"KRYPTERAD DATA" i varje hörn
Påträngande säkerhetsvarningar
```

**Efter:**
```
Header: "Din kompletta fordonsplattform"
Diskreta ikoner: 🔒 för säker data
Säkerhetsinformation i "Om CaiZen" istället
Subtil elegans som bygger förtroende
```

**Motivering:** Professionella användare förväntar sig säkerhet - det behöver inte skrikas om. Elegant implementation signalerar kompetens bättre än "militärgrad"-marknadsföring.

### 6. Design Language: "SecureFleet Automotive"
**Etablerat designsystem:**

**Färgpalett:**
```css
Primär:     #0066B1  /* BMW-blå för navigation, primära knappar */
Accent:     #FF7700  /* Orange för CTA, varningar */
Bakgrund:   #222222  /* Mörk huvudbakgrund */
Kort:       #1E1E1E  /* Kort och paneler */
Success:    #22c55e  /* Grön för verifiering */
Warning:    #eab308  /* Gul för pending */
Error:      #ef4444  /* Röd för problem */
```

**Visual Elements:**
- Racing stripe: `linear-gradient(90deg, #0066B1 0%, #6F2B90 50%, #FF0000 100%)`
- Helvetica Neue som primär typsnitt
- Mätare-inspirerade gauges för förbrukning
- Subtle shadows och 8px rounded corners

### 7. Tanknings/Laddningsfunktion (Frekvent Använd)
**Användarscenario:** Användare tankar/laddar och vill snabbt logga  
**Design-beslut:** Prominent placering överst i dashboard

**Implementation:**
```tsx
<div className="bg-gray-800 rounded-lg p-4 mb-6 border-l-4 border-orange-500">
  <button className="w-full bg-orange-500 hover:bg-orange-600">
    + Lägg till Tankning/Laddning
  </button>
  
  <div className="grid grid-cols-2 gap-4 mt-4">
    <div>
      <span className="text-gray-400">Senaste förbrukning:</span>
      <p className="font-mono text-lg">7.2 l/100km</p>
    </div>
    <div>
      <span className="text-gray-400">Medianförbrukning:</span>
      <p className="font-mono text-lg">7.8 l/100km</p>
    </div>
  </div>
</div>
```

**Smart GPS-hantering:**
```typescript
// Tre input-lägen baserat på kontext:
1. GPS-aktiv nära station → Auto-förslag: "Circle K Stenungsund"
2. GPS otillgänglig → Dropdown med senaste 10 stationer
3. Backup → Manuell fritext för stationsnamn
```

**Platslogik:**
- Spara GPS-koordinater endast med användarens consent
- Anonymisera stations-GPS (endast stationsnamn + ungefärlig plats)
- Återanvänd tidigare stationer för snabbare input

### 8. Multi-Fordon Support
**Problem:** Användare med flera bilar behöver växla mellan olika bränsletyper  
**Lösning:**

**Fordonsval först:**
```tsx
<select className="w-full p-3 bg-gray-700 rounded mb-4">
  <option value="">Välj fordon...</option>
  {userVehicles.map(vehicle => (
    <option key={vehicle.id}>
      {vehicle.name} - {vehicle.fuelType}
    </option>
  ))}
</select>
```

**Dynamiskt formulär:**
```typescript
if (selectedVehicle.fuelType === 'electric') {
  // Visa: kWh, laddstation, laddningstid, batterinivå
  fields = ['amount_kwh', 'charging_station', 'charging_time'];
} else if (selectedVehicle.fuelType === 'gasoline' || 'diesel') {
  // Visa: liter, bensinstation, pris/liter, oktantal
  fields = ['amount_liters', 'fuel_station', 'price_per_liter'];
}
```

**Auto-population från fordonsprofil:**
- Bränsletyp (95/98/diesel/E85/el)
- Senaste mätarställning + estimerat körsträcka
- Förväntad tankstorlek för validering

**Fallback-hantering:**
- "Lägg till fordon först" om inga bilar registrerade
- Manuell input om fordonsprofil saknar bränsletyp
- Smart defaults baserat på historik

**Benefit:** Snabbare input + Färre fel + Bättre UX

---

## 🏗️ Teknisk Arkitektur och Beslut

### Backend-val: Supabase → NHOST Migration
**Beslutsprocess:**

**Initial fråga:** Supabase (enkel integration) vs NHOST (svenskt, mindre känt)?

**Analys:**
```
Supabase-fördelar:
✅ EU hosting (Frankfurt) - GDPR-compliant
✅ Mogen plattform - färre buggar
✅ Row Level Security - perfekt för säkerhetsmodell
✅ Real-time subscriptions - community/marknadsplats
✅ En-klicks export från Loveable
✅ Stor community och omfattande docs

NHOST-fördelar:
✅ Svenskt företag - PR/branding-värde
✅ EU-fokus och dataskyddsprofil
⚠️ Mindre community - långsammare problemlösning
⚠️ Yngre plattform - potentiella bugs
```

**BESLUT:**
1. **MVP på Supabase** - snabbare time-to-market
2. **Parallell NHOST-migration** - planera arkitektur för portabilitet
3. **Switch när resurs finns** - efter MVP-lansering

**Motivering:** Time-to-market viktigare än "svenskt företag" för MVP. NHOST-branding kan användas senare som differentierare.

### Migrations-strategi
**Teknisk approach:**
```typescript
// Abstrahera databas-layer från start
interface DatabaseAdapter {
  createVehicle(data: VehicleData): Promise<Vehicle>;
  getFuelLogs(vehicleId: string): Promise<FuelLog[]>;
  // ...
}

// Supabase-implementation
class SupabaseAdapter implements DatabaseAdapter { ... }

// NHOST-implementation (parallell utveckling)
class NHOSTAdapter implements DatabaseAdapter { ... }

// Switch genom config
const db = process.env.DB_PROVIDER === 'nhost' 
  ? new NHOSTAdapter() 
  : new SupabaseAdapter();
```

**Migration-milstolpar:**
- [ ] Abstrahera databas-layer
- [ ] Testa NHOST i dev-miljö
- [ ] Dual-write period (Supabase + NHOST)
- [ ] Verifiera data-integritet
- [ ] Switch DNS och traffic
- [ ] Deprecate Supabase

### Övergång Loveable → Cursor
**Timing:** Nu (efter MVP-grund färdig i Loveable)

**Loveable gav oss:**
✅ Snabb UI-prototyping
✅ Grundläggande CRUD-operationer
✅ Responsiv design och komponenter
✅ Supabase-integration out-of-the-box

**Cursor behövs för:**
🔧 Komplex API-logik (kryptering, maskning)
🔧 Tredjepartsintegrationer (Transportstyrelsen, HERE Maps)
🔧 Avancerad säkerhet (audit logging, rate limiting)
🔧 Performance-optimering (caching, lazy loading)
🔧 Backend-funktioner (OCR, AI-analys)

**Export-process:**
1. Exportera kod från Loveable till GitHub
2. Klona repo lokalt och öppna i Cursor
3. Installera dependencies och verifiera build
4. Fortsätt utveckling med full IDE-kontroll

---

## 📊 Datamodell och Schema

### Kärnschema (Supabase/PostgreSQL)
```sql
-- Användarprofiler med GDPR-fält
profiles (
  id UUID PRIMARY KEY,
  email TEXT ENCRYPTED,
  display_name TEXT,
  created_at TIMESTAMPTZ,
  consent_marketing BOOLEAN,
  consent_analytics BOOLEAN,
  consent_community BOOLEAN,
  data_retention_until DATE
);

-- Fordon med krypterade identifierare
vehicles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  make TEXT, model TEXT, year INTEGER,
  fuel_type TEXT, -- 'gasoline', 'diesel', 'electric', 'hybrid'
  
  -- KRYPTERADE (backend only)
  registration_encrypted TEXT,
  vin_encrypted TEXT,
  
  -- MASKERADE (för UI)
  registration_masked TEXT,
  vin_masked TEXT,
  
  -- Verifiering
  is_verified BOOLEAN DEFAULT false,
  verification_source TEXT,
  last_verified_at TIMESTAMPTZ
);

-- Energilogg (bränsle + el)
energy_logs (
  id UUID PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles(id),
  date TIMESTAMPTZ,
  fuel_type TEXT, -- 'gasoline', 'diesel', 'electric'
  amount NUMERIC, -- Liter eller kWh
  cost NUMERIC,
  price_per_unit NUMERIC,
  odometer_reading INTEGER,
  station_name TEXT,
  gps_location GEOGRAPHY(POINT),
  calculated_consumption NUMERIC,
  created_at TIMESTAMPTZ
);

-- Servicehistorik
service_records (
  id UUID PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles(id),
  date TIMESTAMPTZ,
  odometer_reading INTEGER,
  service_type TEXT,
  cost NUMERIC,
  workshop_name TEXT,
  description TEXT,
  parts_used JSONB,
  next_service_km INTEGER,
  created_at TIMESTAMPTZ
);

-- Marknadsplatsannonser
marketplace_listings (
  id UUID PRIMARY KEY,
  vehicle_id UUID REFERENCES vehicles(id),
  seller_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  price INTEGER,
  
  -- Geografisk data (ALDRIG exakt adress)
  city TEXT,
  region TEXT,
  approximate_lat NUMERIC(8,6),
  approximate_lng NUMERIC(9,6),
  
  -- Verifiering
  verification_status TEXT,
  documentation_score INTEGER,
  has_service_history BOOLEAN,
  
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ,
  sold_at TIMESTAMPTZ
);

-- Community-grupper
vehicle_groups (
  id UUID PRIMARY KEY,
  name TEXT UNIQUE, -- "BMW E46 M3", "Volvo V70"
  description TEXT,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ
);

-- Community-posts
community_posts (
  id UUID PRIMARY KEY,
  group_id UUID REFERENCES vehicle_groups(id),
  author_id UUID REFERENCES profiles(id),
  title TEXT,
  content TEXT, -- DOMPurify sanitized
  image_urls TEXT[],
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ
);

-- Audit log för säkerhetsåtgärder
audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  action_type TEXT, -- 'view_vin', 'delete_vehicle', 'verify_document'
  resource_type TEXT,
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ
);
```

### Row Level Security (RLS) Policies
```sql
-- Användare ser endast sina egna fordon
CREATE POLICY "Users view own vehicles" ON vehicles
  FOR SELECT USING (user_id = auth.uid());

-- Användare kan inte se andras krypterade fält
CREATE POLICY "No access to encrypted fields" ON vehicles
  FOR SELECT USING (
    auth.role() = 'service_role' OR 
    (user_id = auth.uid() AND current_setting('request.jwt.claim.role') != 'anon')
  );

-- Community-content synligt för alla, bara författare kan redigera
CREATE POLICY "Public read community" ON community_posts
  FOR SELECT USING (true);

CREATE POLICY "Author edit own posts" ON community_posts
  FOR UPDATE USING (author_id = auth.uid());
```

---

## 🎨 Komponentarkitektur

### Filstruktur (Flat Structure för Loveable-kompatibilitet)
```
/components
  // Fordon
  - VehicleCard.tsx              // Fordonskort med maskerade data
  - VehicleForm.tsx              // Registrera/redigera fordon
  - VehicleSelector.tsx          // Multi-fordon dropdown
  
  // Energi/tankning
  - FuelLogButton.tsx            // Prominent "Lägg till"-knapp
  - FuelLogForm.tsx              // Modal för datainmatning
  - FuelStats.tsx                // Förbrukningsstatistik
  - StationSelector.tsx          // GPS + tidigare stationer
  
  // Marknadsplats
  - MarketplaceMap.tsx           // Kartvy med markörer
  - VehicleMarker.tsx            // Färgkodade pins
  - ListingCard.tsx              // Annons-kort
  - ListingDetails.tsx           // Detaljvy
  - SearchFilters.tsx            // Radius, pris, verifiering
  
  // Community
  - VehicleGroups.tsx            // Fordonsgrupper
  - CommunityPost.tsx            // Inlägg med sanitering
  - PostComments.tsx             // Kommentarer
  
  // Säkerhet & Utilities
  - SecurityStatus.tsx           // Diskret säkerhetsindikator
  - AuditLogger.tsx              // Logging-component
  - PrivacySettings.tsx          // GDPR-kontroller

/pages
  - Dashboard.tsx                // Huvudöversikt
  - Vehicles.tsx                 // Fordonshantering
  - EnergyManagement.tsx         // Bränsle/el-historik
  - Marketplace.tsx              // Marknadsplats-hub
  - Community.tsx                // Community-hub
  - Security.tsx                 // Säkerhetsinställningar

/utils
  - dataEncryption.ts            // Kryptering/maskning
  - securityValidation.ts        // Input validation
  - auditLogger.ts               // Audit trail
  - gpsUtils.ts                  // GPS-hantering
```

### Komponentkonventioner
```typescript
// Standard säkerhetscheck i komponenter
interface SecureComponentProps {
  vehicleId?: string;
  isEncrypted?: boolean;
  requiresAuth?: boolean;
}

const SecureComponent: React.FC<SecureComponentProps> = ({
  vehicleId,
  isEncrypted = true,
  requiresAuth = true
}) => {
  // 1. Auth check
  if (requiresAuth && !user) {
    return <AuthRequired />;
  }
  
  // 2. Security validation
  if (!isEncrypted || !vehicleId) {
    return <SecurityError />;
  }
  
  // 3. Component logic
  return <div>...</div>;
};
```

---

## 📝 Loveable-prompt för Tanknings/Laddningsfunktion

### Komplett implementation-prompt
```markdown
Implementera prominent tanknings/laddningsfunktion för CaiZen med multi-fordon support och smart platshantering:

**Huvudfunktionalitet:**
- PROMINENT knapp "Lägg till Tankning/Laddning" överst i dashboard
- Quick-stats under knappen: senaste och medianförbrukning
- Multi-fordon selector som första steg
- Dynamiskt formulär baserat på vald bils bränsletyp
- Smart GPS-baserad stationsdetektering när möjligt

**1. Dashboard-komponent (överst):**
[Kod från tidigare avsnitt...]

**2. Fordonsval (första steg i modal):**
<select className="w-full p-3 bg-gray-700 rounded mb-4">
  <option value="">Välj fordon...</option>
  {userVehicles.map(vehicle => (
    <option key={vehicle.id} value={vehicle.id}>
      {vehicle.name} - {vehicle.make} {vehicle.model} ({vehicle.fuelType})
    </option>
  ))}
</select>

**3. Dynamiskt formulär baserat på bränsletyp:**
```tsx
{selectedVehicle.fuelType === 'electric' ? (
  <>
    <label>Laddad energi (kWh)</label>
    <input type="number" step="0.1" />
    
    <label>Laddningstid (minuter)</label>
    <input type="number" />
    
    <label>Laddningsstation</label>
    <StationSelector type="charging" />
  </>
) : (
  <>
    <label>Mängd (liter)</label>
    <input type="number" step="0.01" />
    
    <label>Pris per liter (kr)</label>
    <input type="number" step="0.01" />
    
    <label>Bensinstation</label>
    <StationSelector type="fuel" />
  </>
)}

<label>Mätarställning (km)</label>
<input 
  type="number" 
  defaultValue={selectedVehicle.currentOdometer + 50}
  min={selectedVehicle.currentOdometer}
/>
```

**4. Smart GPS-platshantering:**
[Kod från tidigare avsnitt...]

**5. Auto-beräkning och validering:**
```tsx
// Beräkna förbrukning automatiskt
const calculateConsumption = (
  amount: number,
  odometerReading: number,
  previousOdometer: number,
  fuelType: string
) => {
  const distance = odometerReading - previousOdometer;
  
  if (fuelType === 'electric') {
    return (amount / distance * 100).toFixed(1); // kWh/100km
  } else {
    return (amount / distance * 100).toFixed(1); // l/100km
  }
};

// Validering av rimliga värden
const validateInput = (fuelType: string, amount: number) => {
  if (fuelType === 'electric') {
    return amount >= 5 && amount <= 100; // kWh
  } else {
    return amount >= 5 && amount <= 150; // liter
  }
};
```

**6. Datamodell:**
```typescript
interface EnergyLog {
  vehicleId: string;
  date: Date;
  fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  amount: number;
  cost: number;
  pricePerUnit: number;
  odometerReading: number;
  stationName?: string;
  gpsLocation?: { lat: number; lng: number };
  calculatedConsumption?: number;
  chargingTime?: number; // För el
}
```

**7. Integration och UX:**
- Data sparas till "energy_logs" tabell
- Uppdatera dashboard-statistik direkt efter inmatning
- Toast-meddelande med beräknad förbrukning
- Auto-fokus på första input-fält
- Loading states under GPS-detektering
- Swipe-to-dismiss modal på mobil
```

---

## 🚀 Nästa Steg och Prioriteringar

### Omedelbara åtgärder (Vecka 1-2)
1. **Export från Loveable till GitHub**
   - Klona repository
   - Verifiera build i Cursor
   - Sätt upp development environment

2. **Implementera tanknings/laddningsfunktion**
   - Använd Loveable-prompt ovan
   - Testa multi-fordon support
   - Verifiera GPS-funktionalitet

3. **Databas-abstraktion för NHOST-migration**
   - Skapa DatabaseAdapter interface
   - Implementera Supabase-adapter
   - Dokumentera API-kontakt

### Kort sikt (Månad 1)
4. **Community-funktioner**
   - Fordonsgrupper implementation
   - Content moderation system
   - Integration med marknadsplats

5. **Avancerad säkerhet i Cursor**
   - Server-side kryptering/dekryptering
   - Audit logging system
   - Rate limiting för API:er

6. **Tredjepartsintegrationer**
   - Transportstyrelsen API för verifiering
   - HERE Maps API för marknadsplats
   - OCR för kvitton (Google Vision API)

### Medellång sikt (Månad 2-3)
7. **NHOST-migration (parallell utveckling)**
   - Sätt upp NHOST dev-miljö
   - Implementera NHOST-adapter
   - Dual-write testing

8. **Performance-optimering**
   - Lazy loading för bilder
   - Virtual scrolling i community
   - Service worker för offline

9. **Beta-lansering**
   - Closed beta med 50-100 användare
   - Feedback-loop och iteration
   - Säkerhetsaudit

### Långsiktig roadmap (Månad 4+)
10. **AI-funktioner**
    - Prediktiv underhåll
    - Smart prisrekommendationer
    - Anomali-detektion i förbrukning

11. **Mobile app**
    - React Native implementation
    - Offline-first arkitektur
    - Push notifications

12. **Internationell expansion**
    - Norge/Danmark först
    - Lokalisering (i18n)
    - Regionala fordonsregister

---

## 💡 Viktiga Insikter och Lärdomar

### UX-filosofi
**"Verksamhet utan att synas"** - Säkerhet ska kännas, inte skrikas om

**Före vs Efter:**
| Aspekt | Före | Efter |
|--------|------|-------|
| Header | "MILITÄRGRAD SÄKERHET" | "Din kompletta fordonsplattform" |
| Indikatorer | Stora varningsrutor | Diskreta ikoner |
| Kommunikation | Teknisk jargong | Användarvänligt språk |
| Förtroende | Påträngande | Elegant subtilitet |

### Tekniska prioriteringar
1. **Time-to-market > Perfect stack** - Supabase för MVP, migrera senare
2. **Säkerhet från start** - Kryptering och maskning inte efterkonstruktion
3. **User frequency** - Tankningsfunktion prominent för daglig användning
4. **Skalbarhet** - Abstrahera tidigt för enklare migration

### Affärsinsikter
- **Kartbaserad marknadsplats** är unik differentierare
- **Community-integration** skapar nätverkseffekter
- **Verifierad fordonshistorik** bygger förtroende
- **Svenskt företag (NHOST)** kan vara PR-värde senare

---

## 📚 Referenser och Resurser

### Teknisk dokumentation
- **Supabase Docs:** https://supabase.com/docs
- **NHOST Docs:** https://docs.nhost.io
- **Loveable Export Guide:** https://docs.lovable.dev/export
- **Cursor AI Documentation:** https://cursor.sh/docs

### Säkerhetsresurser
- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **GDPR Compliance:** https://gdpr.eu
- **ISO 27001:** https://www.iso.org/isoiec-27001-information-security.html

### API-integrationer (planerade)
- **Transportstyrelsen API:** För fordonsverifiering
- **HERE Maps API:** För kartfunktionalitet
- **Google Vision API:** För OCR av kvitton

---

## 🔍 Appendix: Designreferenser

### UI-komponenter (implementerade i Loveable)
1. **Dashboard med säkerhetsstatus och fordonsöversikt**
2. **Fordonskort med maskerade identifierare**
3. **Prominent tanknings/laddningsknapp**
4. **Marknadsplats med kartvy**

### Färgkoder och Typografi
```css
/* Primära färger */
--color-primary: #0066B1;
--color-accent: #FF7700;
--color-background: #222222;
--color-card: #1E1E1E;

/* Status-färger */
--color-success: #22c55e;
--color-warning: #eab308;
--color-error: #ef4444;

/* Typografi */
--font-primary: 'Helvetica Neue', sans-serif;
--font-mono: 'Courier New', monospace;
```

---

**Dokumentslut**

*Detta dokument representerar en komplett sammanfattning av utvecklingssessionen för CaiZen per 2025-05-30. All information är avsedd för internt bruk och framtida referens i produktutvecklingen.*

**Version History:**
- v1.0 (2025-05-30): Initial sammanställning
- v2.0 (2025-05-30): Uppdaterad med tankningsfunktion och backend-beslut