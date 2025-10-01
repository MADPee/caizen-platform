# CaiZen Teknisk Arkitekturdokumentation v3.0
*Privacy-First Fordonscentrerad Arkitektur*

**Version:** 3.0 | **Datum:** 2025-09-29 | **Status:** Godkänd

---

## 🏗️ System Overview

### High-Level Architecture
```
Client (PWA) → API Gateway → Business Logic → Dual-Schema DB
                ↓                    ↓
         Privacy Service      External APIs
```

---

## 🗄️ Dual-Schema Database

### vehicle_permanent (PERMANENT - Fordonsdata)
```sql
CREATE SCHEMA vehicle_permanent;

-- Kärnfordonstabell
CREATE TABLE vehicle_permanent.vehicles (
  id UUID PRIMARY KEY,
  vin_encrypted TEXT UNIQUE,
  vin_hash TEXT UNIQUE,
  vin_masked TEXT, -- "WBA***********1234"
  registration_masked TEXT, -- "ABC***"
  make TEXT, model TEXT, year INTEGER,
  verification_level TEXT
);

-- Service, inspections, fuel events med samma mönster
```

### personal_encrypted (GDPR-RADERBART - Persondata)
```sql
CREATE SCHEMA personal_encrypted;

CREATE TABLE personal_encrypted.user_profiles (
  user_id UUID PRIMARY KEY,
  email_encrypted TEXT,
  email_hash TEXT,
  email_masked TEXT,
  gdpr_consent_date TIMESTAMP
);

CREATE TABLE personal_encrypted.ownership_records (
  user_id UUID REFERENCES user_profiles ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicle_permanent.vehicles,
  ownership_start DATE,
  deleted_user BOOLEAN DEFAULT FALSE
);
```

---

## 🔐 Kryptering

### Implementation
```typescript
class EncryptionService {
  algorithm = 'aes-256-gcm';
  
  async encrypt(data: string, keyId: string): Promise<EncryptedData> {
    const key = await this.getKey(keyId);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, key, iv);
    // ... standard AES-256-GCM
  }
  
  maskVIN(vin: string): string {
    return `${vin.slice(0,3)}***********${vin.slice(-4)}`;
  }
  
  maskRegistration(reg: string): string {
    return `${reg.slice(0,3)}***`;
  }
}
```

---

## 🔒 GDPR Implementation

### Right to be Forgotten
```typescript
async deleteUserData(userId: string) {
  // 1. Anonymisera ownership records
  await db.update('ownership_records')
    .set({ deleted_user: true })
    .where({ user_id: userId });
  
  // 2. Anonymisera community posts
  await db.update('community_posts')
    .set({ author_display_name: 'Deleted User' });
  
  // 3. Radera user profile (CASCADE)
  await db.delete('user_profiles').where({ user_id: userId });
  
  // 4. KRITISKT: Verifiera fordonsdata intakt
  const vehiclesIntact = await this.verifyVehicleDataIntegrity();
  if (!vehiclesIntact) throw new Error('Vehicle data affected!');
}
```

---

## 🔌 API Endpoints

### Core Routes
```typescript
// Vehicles
GET    /api/vehicles           // Hämta användarens fordon (masked)
POST   /api/vehicles           // Registrera nytt fordon
GET    /api/vehicles/:id       // Hämta fordonsdetaljer
PUT    /api/vehicles/:id       // Uppdatera fordonsinfo

// Documents
POST   /api/documents/upload   // Upload + OCR parsing
GET    /api/documents          // Hämta användarens dokument
DELETE /api/documents/:id      // Radera dokument

// Marketplace
GET    /api/marketplace        // Sök fordon (kartbaserat)
POST   /api/marketplace        // Skapa annons
GET    /api/marketplace/:id    // Annonsdetaljer

// Community
GET    /api/community/posts    // Hämta posts för fordonsmodell
POST   /api/community/posts    // Skapa ny post
POST   /api/community/comments // Kommentera

// GDPR
POST   /api/gdpr/delete        // Radera användardata
GET    /api/gdpr/export        // Exportera användardata
```

### Security Middleware
```typescript
// Rate limiting
app.use('/api', rateLimit({ max: 100, window: '15min' }));

// Input validation (Zod)
const createVehicleSchema = z.object({
  vin: z.string().regex(/^[A-HJ-NPR-Z0-9]{17}$/),
  registration: z.string().max(10),
  make: z.string(),
  model: z.string(),
  year: z.number().int().min(1900)
});

// Authentication
app.use(authenticate); // JWT validation
```

---

## 🚀 Tech Stack

**Frontend:**
- React 18 + TypeScript
- TailwindCSS + Shadcn/ui
- React Query för data fetching
- Zustand för state

**Backend:**
- Supabase (PostgreSQL + Auth + Storage)
- Edge Functions för performance
- Node.js för custom logic

**Infrastructure:**
- Vercel/Netlify hosting
- Cloudflare CDN
- GitHub CI/CD

**External Services:**
- HERE Maps / OpenStreetMap
- Tesseract.js (OCR)
- Azure Computer Vision (advanced OCR)
- Postmark (email)
- Adyen/Klarna (payments)

---

## 📊 Performance Targets

- Response time: <2s för alla operations
- OCR accuracy: >80% för auto-approve
- Database queries: <100ms (indexed)
- API rate limits: 100 req/15min per user
- Uptime: 99.9% SLA

---

## 🔍 Monitoring & Logging

```typescript
// Audit logging för kritiska events
audit.log('sensitive_data_accessed', {
  userId,
  resource: 'vehicle_vin',
  action: 'decrypt'
});

// Performance monitoring
metrics.track('api_response_time', duration, {
  endpoint: '/api/vehicles',
  status: 200
});

// Error tracking
logger.error('Encryption failed', {
  keyId,
  error: error.message
});
```

---

**För fullständiga implementation-detaljer, se separata dokument:**
- Database Schema Documentation
- API Reference Guide  
- Security Implementation Guide
- Deployment & DevOps Guide