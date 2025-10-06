# MyCarsJournal / CaiZen Produktspecifikation v3.0
*Från Dokumentation till Fordonshistorik-Revolution*

**Version:** 3.0 | **Datum:** 2025-09-29 | **Status:** Aktiv utveckling

---

## 📋 Vision Evolution

### Original Vision (v1.0 - April 2025)
**MyCarsJournal:** Digital dokumentation av fordonsunderhåll
- Fokus: Personal fordonsloggbok
- Target: Bilentusiaster och noggranna ägare
- Core feature: Dokumentuppladdning och spårning

### Revolutionerad Vision (v3.0 - September 2025)
**CaiZen:** Fordonscentrerad historikplattform med Privacy by Design
- Fokus: Bilens permanenta minnesbok + verifierad marknadsplats
- Target: Alla bilägare, köpare och säljare + B2B partners
- Core feature: **Fordonets historia följer bilen för alltid**

---

## 🎯 Kärnkoncept

### 1. Fordonscentrerad Arkitektur
**"Bilen äger sin historia, du är bara vårdnadshavare"**

- **Historik överlever ägarbyten** - följer VIN, inte ägaren
- **Persondata separerad från fordonsdata** - GDPR-säkert by design
- **Evighetsförvar** - teknisk data raderas aldrig
- **Smart dataseparation** - AI separerar automatiskt vid upload

### 2. Privacy by Design
**"Omöjligt att läcka persondata från fordonshistoriken"**

- Dual-schema databas (permanent/encrypted)
- Automatisk datamaskering i UI
- GDPR-radering påverkar aldrig fordonsdata
- Privacy indicators överallt

### 3. Marknadsplats Integration
**"Transparent försäljning med verifierad historik"**

- Kartbaserad visualisering
- Färgkodade markörer (grön = komplett historik)
- Anonymiserad säljarkontakt
- Geografisk säkerhet (max 1km precision)

### 4. Community Layer
**"Social validation och expert-kunskap"**

- Fordonsmodell-baserade grupper
- Expert-rekommendationer
- Säker content moderation
- Integration med marknadsplats

---

## 🎨 UX-filosofi: "Verksamhet utan att synas"

### Problem som undviks
❌ "Militärgrad säkerhet" som skrämmer  
❌ Påträngande säkerhetsvarningar  
❌ Komplex UI som kräver teknisk kunskap

### Lösning
✅ Subtil elegans med diskreta indicators  
✅ Säkerhet som känns naturlig  
✅ Professional känsla som bygger förtroende  
✅ Användaren märker säkerheten genom frånvaro av problem

---

## 🚀 Funktioner - MVP Scope

### Phase 1: Foundation (Vecka 1-4)
- ✅ **Loveable UI/UX prototyping**
  - Designsystem "SecureFleet Automotive"
  - Core komponenter (Dashboard, Vehicle Card)
  - Privacy indicators (röd/grön/gul badges)
  
- ✅ **Cursor Backend setup**
  - Supabase EU-region (Frankfurt)
  - Dual-schema implementation
  - Authentication flow

### Phase 2: Document Processing (Vecka 5-8)
- 📋 **OCR Pipeline**
  - Tesseract.js integration
  - Document type detection
  - Confidence scoring (>80% auto-approve)
  
- 📋 **Data Separation AI**
  - Automatisk person/fordons-dataseparation
  - Krypteringsservice
  - Maskerings-utilities

### Phase 3: Core Features (Vecka 9-11)
- 📋 **Vehicle Management**
  - Multi-vehicle support
  - VIN-baserad identifiering
  - Ownership tracking
  
- 📋 **Service & Fuel Tracking**
  - Prominent tanknings-input (överst i dashboard)
  - GPS-baserad stationsdetektering
  - Automatic mileage tracking
  
- 📋 **Analytics Dashboard**
  - Dual-view interface (personal/vehicle)
  - Cost analysis och trends
  - Predictive maintenance

### Phase 4: Marketplace & Community (Vecka 12-14)
- 📋 **Kartbaserad Marknadsplats**
  - HERE Maps / OpenStreetMap integration
  - Färgkodade markörer
  - Anonymiserad kontakt
  
- 📋 **Community Foundation**
  - Fordonsmodell-grupper
  - Basic posting/commenting
  - Auto-censurering av känslig data
  - Rate limiting

---

## 🎯 Målgrupper

### Primär: Bilköpare
**Behov:** Transparent historik före köp, verifierad data, jämförelser

### Sekundär: Bilsäljare  
**Behov:** Bevisa kvalitet, högre pris, snabb försäljning

### Tertiär: Privacy-medvetna
**Behov:** Dataskydd, kontroll över information, GDPR-tools

### B2B: Verkstäder & Partners
**Behov:** Differentiera genom kvalitet, enkel integration, marknadsföring

---

## 💰 Affärsmodell

### Freemium Tiers

**Free:**
- 1 fordon
- 5 dokument/månad OCR
- Marknadsplats (köpare)
- Community read-only

**Premium (€9.99/mån):**
- Obegränsade fordon
- Obegränsad OCR
- Marknadsplats (köpare + säljare)
- Full community access
- Advanced analytics

**Professional (€19.99/mån):**
- Allt i Premium
- API access
- Bulk processing
- White-label möjligheter
- Priority support

### Revenue Streams
- Subscriptions: €9.99-19.99/mån
- Marketplace fees: 3% på försäljningar
- Premium listings: €29/mån
- Verification services: €49/fordon
- Data monetization: €150K+/år (anonymiserad)

---

## 📊 Success Metrics

### Year 1 Targets
- 50,000 användare
- 75,000 verifierade fordon
- €500K ARR
- 10 B2B partners
- "GDPR Gold Standard" erkännande

### KPIs
- OCR accuracy: >80%
- Response time: <2s
- Conversion free→premium: 8%
- Monthly churn: <5%
- Zero privacy incidents

---

## 🛠️ Tech Stack

**Frontend:** React 18 + TypeScript + TailwindCSS  
**Backend:** Supabase (PostgreSQL + Auth)  
**OCR:** Tesseract.js + Azure Computer Vision  
**Maps:** HERE Maps / OpenStreetMap  
**Payments:** Adyen / Klarna  
**Hosting:** Vercel / Netlify  
**CI/CD:** GitHub Actions

---

## 🗺️ Roadmap

### Q4 2025: MVP Launch
- Core features live
- 1,000 beta users
- 10,000 fordon threshold

### Q1 2026: Growth
- Native mobile apps
- OBD-II integration
- AI recommendations

### Q2-Q3 2026: Scale
- International expansion (Norge/Danmark)
- Enterprise tier
- 100K+ fordon

### Q4 2026+: Market Leadership
- "Carfax Killer" position
- Industry standard
- IPO preparation

---

## ⚠️ Kritiska Skillnader från Original Vision

### Från MyCarsJournal → CaiZen

| Aspect | MyCarsJournal (v1.0) | CaiZen (v3.0) |
|--------|---------------------|---------------|
| **Dataägande** | Användaren äger | Fordonet äger |
| **Fokus** | Dokumentation | Historik + Marknadsplats |
| **Privacy** | Standard GDPR | Privacy by Design |
| **Målgrupp** | Entusiaster | Alla bilägare + B2B |
| **USP** | Digital servicebok | Omöjligt att läcka persondata |
| **Marknadsplats** | Senare feature | Core MVP feature |
| **Community** | Nice-to-have | Engagement driver |

---

## 🎉 Konkurrensfördel

### Unika Positioner
1. **"Omöjligt att läcka persondata"** - Teknisk moat
2. **"Bilens permanenta minnesbok"** - Överlever ägarbyten
3. **"Kartbaserad verifierad marknadsplats"** - Geografi + historik + community
4. **"Privacy så bra att den är osynlig"** - UX-filosofi

### Defensiva Moats
- Patent på dataseparation-arkitektur
- Network effects (värde ökar exponentiellt)
- Community lock-in
- First-mover advantage i privacy-first space

---

**Original vision bibehållen, men dramatiskt utökad med fordonscentrerad arkitektur, privacy leadership och marknadsplatsintegration.**

---

*Detta dokument alignar original MyCarsJournal-vision med nuvarande CaiZen-strategi och implementation.*

**Version:** 3.0  
**Senast uppdaterad:** 2025-09-29  
**Relaterade dokument:** 
- Projektinstruktioner v3.0
- PRD v3.0
- Teknisk Arkitektur v3.0