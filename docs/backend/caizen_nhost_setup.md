# 🇸🇪 CaiZen - NHOST Integration Guide
*Svenskt, GDPR-vänligt och kraftfullt*

## 🎯 Varför NHOST för CaiZen?

### Fördelar med NHOST:
- ✅ **Svenskt företag** - Bättre för branding och kundförtroende
- ✅ **EU-hosting** - GDPR-compliance från grunden
- ✅ **GraphQL-first** - Modern API-arkitektur
- ✅ **Hasura integration** - Kraftfull databas-access
- ✅ **Bättre auth** - Inbyggt stöd för svenska BankID (framtida)
- ✅ **File storage** - Inbyggt för dokument och bilder
- ✅ **Serverless functions** - För OCR och kryptering

### NHOST vs Supabase för CaiZen:

| Feature | NHOST | Supabase |
|---------|-------|----------|
| Hosting | 🇸🇪 Sverige/EU | 🇺🇸 USA (kan välja EU) |
| API | GraphQL (modern) | REST (enklare) |
| Auth | Hasura + JWT | GoTrue |
| Pricing | Högre start | Lägre start |
| Documentation | Bra | Utmärkt |
| Community | Mindre | Större |
| GDPR Focus | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## 📦 Setup - Steg för steg

### Steg 1: Installera NHOST SDK

```bash
# Ersätt Supabase dependencies i package.json
npm uninstall @supabase/supabase-js

# Installera NHOST
npm install @nhost/react @nhost/nhost-js
npm install -D @graphql-codegen/cli @graphql-codegen/typescript
```

### Steg 2: Uppdatera package.json

**Lägg till dessa scripts:**
```json
{
  "scripts": {
    "codegen": "graphql-codegen --config codegen.yml",
    "nhost:up": "nhost dev",
    "nhost:logs": "nhost logs",
    "db:migrate": "nhost run db migrate apply",
    "db:seed": "nhost run db seed apply"
  }
}
```

### Steg 3: Skapa NHOST projekt

```bash
# Installera NHOST CLI
npm install -g nhost

# Logga in (kräver NHOST-konto)
nhost login

# Skapa nytt projekt
nhost init

# Välj:
# - Project name: caizen-platform
# - Region: eu-central-1 (Frankfurt)
# - Database: PostgreSQL 15
```

### Steg 4: Environment Variables

**Uppdatera .env.example:**
```bash
# NHOST Configuration
VITE_NHOST_SUBDOMAIN=your-subdomain
VITE_NHOST_REGION=eu-central-1

# Alternativt (för self-hosted):
VITE_NHOST_BACKEND_URL=https://your-backend.nhost.run

# Security & Encryption (samma som förut)
VITE_ENCRYPTION_KEY_ID=caizen-2025
ENCRYPTION_MASTER_KEY=your-256-bit-master-key

# External APIs (samma som förut)
VITE_MAPS_API_KEY=your-openstreetmap-key
VITE_VIN_DECODER_API_KEY=your-vin-api-key

# Application
VITE_APP_VERSION=2.0.0
VITE_APP_ENVIRONMENT=development
VITE_APP_TITLE="CaiZen - Säker Fordonsplattform"

# Feature flags
VITE_ENABLE_COMMUNITY=false
VITE_ENABLE_MARKETPLACE=true
VITE_ENABLE_OCR=true
```

## 🔧 Kodintegration

### Skapa NHOST Client

**src/lib/nhost/client.ts:**
```typescript
import { NhostClient } from '@nhost/nhost-js'

const subdomain = import.meta.env.VITE_NHOST_SUBDOMAIN
const region = import.meta.env.VITE_NHOST_REGION

export const nhost = new NhostClient({
  subdomain,
  region,
})

export const { auth, storage, functions, graphql } = nhost

export default nhost
```

### Setup React Provider

**src/main.tsx:**
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { NhostProvider } from '@nhost/react'
import App from './App.tsx'
import './index.css'
import { nhost } from './lib/nhost/client'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NhostProvider nhost={nhost}>
      <App />
    </NhostProvider>
  </React.StrictMode>,
)
```

### Auth Hooks

**src/lib/hooks/useAuth.ts:**
```typescript
import { useAuthenticationStatus, useSignOut, useUserData } from '@nhost/react'
import type { User } from '@/types'

export const useAuth = () => {
  const { isAuthenticated, isLoading } = useAuthenticationStatus()
  const userData = useUserData()
  const { signOut } = useSignOut()

  const user: User | null = userData ? {
    id: userData.id,
    email: userData.email || '',
    name: userData.displayName || '',
    avatar: userData.avatarUrl,
    createdAt: new Date(userData.createdAt),
    lastLoginAt: new Date(),
    isActive: true,
    // Resten av User-typen skulle komma från custom claims
  } as User : null

  return {
    user,
    isAuthenticated,
    isLoading,
    signOut,
  }
}
```

## 🗄️ Database Schema

### PostgreSQL Schema för CaiZen

**nhost/migrations/001_initial_schema.sql:**
```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Krypteringsfunktioner för känslig data
CREATE OR REPLACE FUNCTION encrypt_text(text_to_encrypt TEXT, encryption_key TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(
    encrypt(
      text_to_encrypt::bytea,
      encryption_key::bytea,
      'aes'
    ),
    'base64'
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION decrypt_text(encrypted_text TEXT, encryption_key TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN convert_from(
    decrypt(
      decode(encrypted_text, 'base64'),
      encryption_key::bytea,
      'aes'
    ),
    'UTF8'
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Maskeringsfunktion
CREATE OR REPLACE FUNCTION mask_registration(reg TEXT)
RETURNS TEXT AS $$
BEGIN
  IF LENGTH(reg) <= 3 THEN
    RETURN reg;
  END IF;
  RETURN SUBSTRING(reg FROM 1 FOR 3) || REPEAT('*', LENGTH(reg) - 3);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION mask_vin(vin TEXT)
RETURNS TEXT AS $$
BEGIN
  IF LENGTH(vin) <= 8 THEN
    RETURN vin;
  END IF;
  RETURN SUBSTRING(vin FROM 1 FOR 3) || 
         REPEAT('*', LENGTH(vin) - 7) || 
         SUBSTRING(vin FROM LENGTH(vin) - 3);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Vehicles Table
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Krypterade identifierare (lagras aldrig i klartext)
  registration_encrypted TEXT NOT NULL,
  vin_encrypted TEXT NOT NULL,
  
  -- Maskerade versioner för UI (genereras automatiskt)
  registration_masked TEXT GENERATED ALWAYS AS (mask_registration(registration_encrypted)) STORED,
  vin_masked TEXT GENERATED ALWAYS AS (mask_vin(vin_encrypted)) STORED,
  
  -- Hash för sökning/jämförelse (ingen klartext)
  registration_hash TEXT NOT NULL UNIQUE,
  vin_hash TEXT NOT NULL UNIQUE,
  
  -- Fordonsdata (icke-känslig)
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
  color TEXT NOT NULL,
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid', 'plugin-hybrid', 'ethanol', 'gas')),
  engine_size INTEGER,
  transmission TEXT CHECK (transmission IN ('manual', 'automatic', 'cvt')),
  
  -- Status och verifiering
  verification_level TEXT DEFAULT 'unverified' CHECK (verification_level IN ('unverified', 'basic', 'documented', 'verified', 'certified')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'archived', 'for_sale', 'under_repair')),
  health_score INTEGER DEFAULT 85 CHECK (health_score >= 0 AND health_score <= 100),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_inspection TIMESTAMPTZ,
  next_inspection TIMESTAMPTZ,
  
  -- Indexes för prestanda
  CONSTRAINT valid_inspection_dates CHECK (next_inspection IS NULL OR last_inspection IS NULL OR next_inspection > last_inspection)
);

-- Indexes
CREATE INDEX idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_registration_hash ON vehicles(registration_hash);
CREATE INDEX idx_vehicles_vin_hash ON vehicles(vin_hash);

-- Row Level Security (RLS)
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Användare kan bara se sina egna fordon
CREATE POLICY "Users can view own vehicles"
  ON vehicles FOR SELECT
  USING (auth.uid() = user_id);

-- Användare kan bara skapa sina egna fordon
CREATE POLICY "Users can create own vehicles"
  ON vehicles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Användare kan bara uppdatera sina egna fordon
CREATE POLICY "Users can update own vehicles"
  ON vehicles FOR UPDATE
  USING (auth.uid() = user_id);

-- Användare kan bara radera sina egna fordon
CREATE POLICY "Users can delete own vehicles"
  ON vehicles FOR DELETE
  USING (auth.uid() = user_id);

-- Fuel Entries Table
CREATE TABLE fuel_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  time TIME NOT NULL DEFAULT CURRENT_TIME,
  station TEXT NOT NULL,
  fuel_type TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  price_per_unit DECIMAL(10, 2) NOT NULL CHECK (price_per_unit > 0),
  total_cost DECIMAL(10, 2) NOT NULL CHECK (total_cost > 0),
  odometer_reading INTEGER NOT NULL CHECK (odometer_reading >= 0),
  
  -- Geografisk position (optional, för kartvisning)
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_total_cost CHECK (total_cost = amount * price_per_unit)
);

CREATE INDEX idx_fuel_entries_vehicle_id ON fuel_entries(vehicle_id);
CREATE INDEX idx_fuel_entries_date ON fuel_entries(date DESC);

-- RLS för fuel_entries
ALTER TABLE fuel_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view fuel entries for own vehicles"
  ON fuel_entries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM vehicles 
      WHERE vehicles.id = fuel_entries.vehicle_id 
      AND vehicles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create fuel entries for own vehicles"
  ON fuel_entries FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM vehicles 
      WHERE vehicles.id = fuel_entries.vehicle_id 
      AND vehicles.user_id = auth.uid()
    )
  );

-- Marketplace Listings Table
CREATE TABLE marketplace_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'pending_review', 'sold', 'expired', 'suspended')),
  price DECIMAL(12, 2) NOT NULL CHECK (price > 0),
  currency TEXT DEFAULT 'SEK' CHECK (currency IN ('SEK', 'EUR', 'USD')),
  description TEXT NOT NULL,
  
  -- Geografisk position (avrundad för privacy - max 1km precision)
  location_lat DECIMAL(8, 5) NOT NULL,  -- Reducerad precision
  location_lng DECIMAL(8, 5) NOT NULL,  -- Reducerad precision
  location_description TEXT NOT NULL,  -- "Stockholm län" - aldrig exakt adress
  
  view_count INTEGER DEFAULT 0,
  contact_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  
  CONSTRAINT valid_expiry CHECK (expires_at IS NULL OR expires_at > created_at)
);

CREATE INDEX idx_marketplace_listings_status ON marketplace_listings(status);
CREATE INDEX idx_marketplace_listings_location ON marketplace_listings(location_lat, location_lng);
CREATE INDEX idx_marketplace_listings_price ON marketplace_listings(price);

-- RLS för marketplace
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;

-- Alla kan se aktiva annonser (men inte känslig fordonsdata)
CREATE POLICY "Anyone can view active listings"
  ON marketplace_listings FOR SELECT
  USING (status = 'active');

-- Säljare kan se sina egna annonser
CREATE POLICY "Sellers can view own listings"
  ON marketplace_listings FOR SELECT
  USING (seller_id = auth.uid());

-- Audit Log för GDPR-compliance
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- Trigger för updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketplace_listings_updated_at
  BEFORE UPDATE ON marketplace_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 🔐 GraphQL Queries & Mutations

### Skapa GraphQL operations

**src/lib/graphql/operations.ts:**
```typescript
import { gql } from '@apollo/client'

export const CREATE_VEHICLE = gql`
  mutation CreateVehicle(
    $registration_encrypted: String!
    $vin_encrypted: String!
    $registration_hash: String!
    $vin_hash: String!
    $make: String!
    $model: String!
    $year: Int!
    $color: String!
    $fuel_type: String!
    $transmission: String
  ) {
    insert_vehicles_one(object: {
      registration_encrypted: $registration_encrypted
      vin_encrypted: $vin_encrypted
      registration_hash: $registration_hash
      vin_hash: $vin_hash
      make: $make
      model: $model
      year: $year
      color: $color
      fuel_type: $fuel_type
      transmission: $transmission
    }) {
      id
      registration_masked
      vin_masked
      make
      model
      year
      color
      verification_level
      health_score
      created_at
    }
  }
`

export const GET_USER_VEHICLES = gql`
  query GetUserVehicles {
    vehicles(order_by: { created_at: desc }) {
      id
      registration_masked
      vin_masked
      make
      model
      year
      color
      fuel_type
      transmission
      verification_level
      status
      health_score
      last_inspection
      next_inspection
      created_at
    }
  }
`

export const GET_VEHICLE_DETAILS = gql`
  query GetVehicleDetails($id: uuid!) {
    vehicles_by_pk(id: $id) {
      id
      registration_masked
      vin_masked
      make
      model
      year
      color
      fuel_type
      engine_size
      transmission
      verification_level
      status
      health_score
      last_inspection
      next_inspection
      created_at
      updated_at
      fuel_entries(order_by: { date: desc }, limit: 10) {
        id
        date
        time
        station
        amount
        price_per_unit
        total_cost
        odometer_reading
      }
    }
  }
`

export const CREATE_FUEL_ENTRY = gql`
  mutation CreateFuelEntry(
    $vehicle_id: uuid!
    $date: date!
    $time: time!
    $station: String!
    $fuel_type: String!
    $amount: numeric!
    $price_per_unit: numeric!
    $total_cost: numeric!
    $odometer_reading: Int!
    $location_lat: numeric
    $location_lng: numeric
  ) {
    insert_fuel_entries_one(object: {
      vehicle_id: $vehicle_id
      date: $date
      time: $time
      station: $station
      fuel_type: $fuel_type
      amount: $amount
      price_per_unit: $price_per_unit
      total_cost: $total_cost
      odometer_reading: $odometer_reading
      location_lat: $location_lat
      location_lng: $location_lng
    }) {
      id
      date
      time
      station
      amount
      total_cost
      odometer_reading
    }
  }
`
```

## 🔄 Migration från Supabase

Om du redan har börjat med Supabase:

### API Client Wrapper

**src/lib/api/client.ts:**
```typescript
import { nhost } from '../nhost/client'

// Wrapper som funkar likadant oavsett backend
export const apiClient = {
  async createVehicle(vehicleData: any) {
    const { data, error } = await nhost.graphql.request(CREATE_VEHICLE, {
      ...vehicleData
    })
    
    if (error) throw error
    return data.insert_vehicles_one
  },
  
  async getVehicles() {
    const { data, error } = await nhost.graphql.request(GET_USER_VEHICLES)
    
    if (error) throw error
    return data.vehicles
  },
  
  // Lägg till fler metoder...
}
```

## 📊 Fördelar med NHOST-implementationen

### Säkerhet:
- ✅ **Kryptering på databasnivå** - Känslig data aldrig i klartext
- ✅ **Automatisk maskering** - Generated columns för UI
- ✅ **Hash-baserad sökning** - Inga klartextfrågor
- ✅ **Row Level Security** - Hasura + PostgreSQL RLS
- ✅ **Audit logging** - Full GDPR-compliance

### Performance:
- ✅ **GraphQL subscriptions** - Realtidsuppdateringar
- ✅ **Optimistic updates** - Snabbare UX
- ✅ **Caching** - Apollo Client integration
- ✅ **Batch queries** - Färre nätverksanrop

### Developer Experience:
- ✅ **Type-safe** - GraphQL Code Generator
- ✅ **Modern API** - GraphQL över REST
- ✅ **Better tooling** - Hasura Console
- ✅ **Local development** - `nhost dev`

## 🎯 Nästa Steg

1. **Skapa NHOST-konto** på nhost.io
2. **Kör migrations** med `nhost run db migrate apply`
3. **Testa GraphQL API** i Hasura Console
4. **Uppdatera VehicleRegistration** att använda NHOST
5. **Implementera auth** med `@nhost/react` hooks

Vill du att jag skapar:
- **Uppdaterad VehicleRegistration** som använder NHOST?
- **Auth komponenter** (Login/Register) för NHOST?
- **GraphQL hooks** för alla operationer?

Säg till! 🚀