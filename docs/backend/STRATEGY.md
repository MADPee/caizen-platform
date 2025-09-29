# CaiZen - Backend Strategy & Migration Plan

_Provider-agnostic architecture för Supabase ↔ Nhost_

## 🎯 Strategi Overview

### Design Principles

1. **Provider-agnostic core** - Business logic oberoende av backend
2. **Adapter pattern** - Clean interface för backend-operationer
3. **Type-safe** - Full TypeScript-säkerhet oavsett provider
4. **Feature parity** - Samma funktionalitet i båda providers
5. **Zero-downtime migration** - Gradvis övergång möjlig

### Architecture Layers

```
┌─────────────────────────────────────┐
│   React Components & UI             │
├─────────────────────────────────────┤
│   Business Logic (Hooks & Services) │
├─────────────────────────────────────┤
│   BackendClient Interface (abstraction) │
├─────────────────┬───────────────────┤
│ SupabaseBackend │  NhostBackend     │
│    Adapter      │     Adapter       │
├─────────────────┴───────────────────┤
│   Supabase SDK  │   Nhost SDK       │
└─────────────────┴───────────────────┘
```

## 📋 Migration Checklist

### Phase 1: Preparation (Week 1)

- [x] Define `BackendClient` interface
- [x] Create adapter stubs
- [x] Setup environment variables for both providers
- [x] Document provider differences
- [ ] Create migration test suite
- [ ] Setup CI matrix for both providers

### Phase 2: Supabase Implementation (Week 2-3)

- [ ] Implement `SupabaseBackendClient`
- [ ] Auth flow (signup, login, logout)
- [ ] CRUD operations (vehicles, fuel entries)
- [ ] Storage operations (documents, images)
- [ ] Realtime subscriptions
- [ ] Full test coverage

### Phase 3: Nhost Implementation (Week 4-5)

- [ ] Implement `NhostBackendClient`
- [ ] GraphQL operations & codegen
- [ ] Auth flow with Hasura claims
- [ ] CRUD via GraphQL
- [ ] Storage operations
- [ ] Subscriptions
- [ ] Parity tests with Supabase

### Phase 4: Production Migration (Week 6+)

- [ ] Data export from Supabase
- [ ] Schema migration to Nhost
- [ ] User migration
- [ ] Parallel run (shadow traffic)
- [ ] Cutover
- [ ] Decommission Supabase

## 🔧 Implementation Details

### 1. Backend Adapter Layer

**Interface location:** `src/lib/backend/interface.ts`

Key operations:

- **Auth**: signup, login, logout, getSession, refreshToken
- **Database**: query, insert, update, delete, subscribe
- **Storage**: upload, download, delete, getPublicUrl
- **Realtime**: subscribe, unsubscribe
- **Functions**: invoke (serverless functions)

### 2. Auth Claims & RLS Parity

#### Supabase (GoTrue + RLS)

```sql
-- RLS Policy
CREATE POLICY "Users own vehicles"
ON vehicles FOR ALL
USING (auth.uid() = user_id);

-- JWT Claim
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "authenticated"
}
```

#### Nhost (Hasura + JWT)

```sql
-- Permission Rule (Hasura Console)
{
  "user_id": {
    "_eq": "X-Hasura-User-Id"
  }
}

-- JWT Claim
{
  "sub": "user-uuid",
  "https://hasura.io/jwt/claims": {
    "x-hasura-user-id": "user-uuid",
    "x-hasura-default-role": "user",
    "x-hasura-allowed-roles": ["user"]
  }
}
```

**Solution:** `currentUserIdProvider()` abstracts claim access.

### 3. Storage Abstraktion

Both providers use similar bucket-based storage:

- Supabase: `supabase.storage.from('bucket')`
- Nhost: `nhost.storage`

Common interface:

```typescript
interface StorageClient {
  upload(path: string, file: File): Promise<{ url: string }>;
  download(path: string): Promise<Blob>;
  getPublicUrl(path: string): string;
  delete(path: string): Promise<void>;
}
```

### 4. API Protocol Mapping

#### Supabase → REST/PostgREST

```typescript
// Query
const { data, error } = await supabase
  .from("vehicles")
  .select("*")
  .eq("user_id", userId);

// Type generation
import { Database } from "./database.types";
type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];
```

#### Nhost → GraphQL/Hasura

```typescript
// Query
const { data, error } = await nhost.graphql.request(GET_VEHICLES, { userId });

// Type generation via codegen.yml
import { GetVehiclesQuery } from "./generated/graphql";
```

**Solution:** DTOs in `src/types/` + conversion in adapters.

### 5. Realtime/Events

#### Supabase Realtime

```typescript
const subscription = supabase
  .channel("vehicles")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "vehicles" },
    (payload) => handleChange(payload),
  )
  .subscribe();
```

#### Hasura Subscriptions

```typescript
const subscription = nhost.graphql
  .request(SUBSCRIBE_VEHICLES, { userId })
  .subscribe({
    next: (data) => handleChange(data),
  });
```

**Solution:** Unified `EventClient` interface.

### 6. SQL Portability

**Do:**

- ✅ Standard PostgreSQL functions
- ✅ ANSI SQL syntax
- ✅ Neutral column names (`user_id`, not `auth.uid()`)
- ✅ Triggers for timestamps

**Don't:**

- ❌ Supabase-specific functions (`auth.uid()` in SQL)
- ❌ Hasura-specific syntax in migrations
- ❌ Provider-specific extensions (unless wrapped)

**Migration pattern:**

```sql
-- migrations/001_vehicles.sql (works in both)
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  -- standard columns
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Separate RLS for each provider
-- supabase/policies.sql
CREATE POLICY ...

-- nhost/permissions.json (Hasura metadata)
{...}
```

## 🔐 GDPR & Svenska Krav

### Collation & Encoding

```sql
-- Ensure Swedish sorting
CREATE DATABASE caizen_db
  ENCODING 'UTF8'
  LC_COLLATE 'sv_SE.UTF-8'
  LC_CTYPE 'sv_SE.UTF-8'
  TEMPLATE template0;

-- Test sorting with Å/Ä/Ö
SELECT * FROM users ORDER BY name COLLATE "sv_SE";
```

### Data Processing Agreements

**Required for both providers:**

- ✅ DPA signed (EU GDPR Article 28)
- ✅ Server location: EU region
- ✅ Sub-processors documented
- ✅ Audit rights established
- ✅ Data retention policies aligned

**Verification:**

```bash
# Supabase
Region: eu-central-1 (Frankfurt)
DPA: Available at supabase.com/dpa

# Nhost
Region: eu-central-1 (Frankfurt)
DPA: Available at nhost.io/legal/dpa
```

### Audit Logging

```typescript
// Unified audit logger (works with both)
interface AuditEvent {
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  provider: "supabase" | "nhost";
  metadata?: any;
}

// Retention: 7 years (Swedish law)
```

## 🧪 Testing Strategy

### Contract Tests

```typescript
// tests/backend/contract.test.ts
import { describe, it, expect } from "vitest";

describe("BackendClient Contract", () => {
  const providers = [new SupabaseBackendClient(), new NhostBackendClient()];

  providers.forEach((provider) => {
    describe(`Provider: ${provider.name}`, () => {
      it("should authenticate user", async () => {
        const result = await provider.auth.signUp({
          email: "test@example.com",
          password: "Test123!!",
        });
        expect(result.user).toBeDefined();
        expect(result.user?.email).toBe("test@example.com");
      });

      it("should handle Swedish characters", async () => {
        const vehicle = await provider.vehicles.create({
          make: "Volvo",
          model: "V70 Årsmodell",
          color: "Röd",
        });
        expect(vehicle.model).toBe("V70 Årsmodell");
      });
    });
  });
});
```

### E2E Tests with Feature Flags

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: "supabase",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:5173",
      },
      env: {
        VITE_BACKEND_PROVIDER: "supabase",
      },
    },
    {
      name: "nhost",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:5173",
      },
      env: {
        VITE_BACKEND_PROVIDER: "nhost",
      },
    },
  ],
});
```

## 📊 Cost & Scaling Comparison

### Pricing Model (approximate, SEK/month)

| Feature        | Supabase         | Nhost  | Notes                   |
| -------------- | ---------------- | ------ | ----------------------- |
| **Free Tier**  |                  |        |                         |
| Database       | 500MB            | 1GB    | Nhost more generous     |
| Auth Users     | Unlimited        | 10,000 | Supabase better for MVP |
| Storage        | 1GB              | 1GB    | Same                    |
| Edge Functions | 500k invocations | 100k   | Supabase better         |
| **Pro Tier**   | $25              | ~€25   | Similar pricing         |
| Database       | 8GB              | 8GB    | Same                    |
| Bandwidth      | 50GB             | 50GB   | Same                    |
| Support        | Email            | Email  | Same                    |
| **Enterprise** | Custom           | Custom | Contact sales           |

### Scaling Considerations

**Database:**

- Both: PostgreSQL, vertical scaling
- Read replicas: Both support (enterprise)
- Connection pooling: Built-in

**Caching:**

- Supabase: Implement with Vercel Edge
- Nhost: Hasura response caching
- Recommendation: Redis layer for both

**CDN/Edge:**

- Supabase: Global edge network
- Nhost: CloudFlare integration
- Both: < 100ms latency in EU

## 🚀 CI/CD Matrix

### GitHub Actions

```yaml
# .github/workflows/test-matrix.yml
name: Multi-Provider Tests

on: [push, pull_request]

jobs:
  test:
    strategy:
      matrix:
        provider: [supabase, nhost]
        node-version: [18, 20]

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Run tests
        env:
          VITE_BACKEND_PROVIDER: ${{ matrix.provider }}
        run: npm test

      - name: E2E tests
        env:
          VITE_BACKEND_PROVIDER: ${{ matrix.provider }}
        run: npm run test:e2e
```

## 🔄 Migration Process

### Data Export (Supabase)

```bash
# Export schema
pg_dump -h db.xxx.supabase.co \
  -U postgres \
  -d postgres \
  --schema-only \
  > schema.sql

# Export data
pg_dump -h db.xxx.supabase.co \
  -U postgres \
  -d postgres \
  --data-only \
  --exclude-table auth.users \
  > data.sql
```

### Data Import (Nhost)

```bash
# Apply schema
nhost run db migrate apply

# Import data (with transformations)
psql $NHOST_DB_URL < transformed_data.sql

# Verify row counts
nhost run db query "SELECT COUNT(*) FROM vehicles"
```

### User Migration

```typescript
// scripts/migrate-users.ts
import { supabase } from "./old-backend";
import { nhost } from "./new-backend";

async function migrateUsers() {
  const { data: users } = await supabase.auth.admin.listUsers();

  for (const user of users) {
    // Create user in Nhost
    await nhost.auth.signUp({
      email: user.email,
      password: generateTempPassword(), // Trigger reset
      options: {
        data: user.user_metadata,
      },
    });

    // Send password reset
    await nhost.auth.resetPassword({ email: user.email });
  }
}
```

## 📝 Environment Variables

### `.env.supabase`

```bash
VITE_BACKEND_PROVIDER=supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### `.env.nhost`

```bash
VITE_BACKEND_PROVIDER=nhost
VITE_NHOST_SUBDOMAIN=xxx
VITE_NHOST_REGION=eu-central-1
# OR
VITE_NHOST_BACKEND_URL=https://xxx.nhost.run
```

### Dynamic Loading (Treeshaking)

```typescript
// src/lib/backend/index.ts
export async function getBackendClient() {
  const provider = import.meta.env.VITE_BACKEND_PROVIDER;

  if (provider === "nhost") {
    const { NhostBackendClient } = await import("./nhost-adapter");
    return new NhostBackendClient();
  } else {
    const { SupabaseBackendClient } = await import("./supabase-adapter");
    return new SupabaseBackendClient();
  }
}
```

## 🎯 Recommended Timeline

### MVP Phase (Supabase - 4 weeks)

- Week 1: Backend adapter + Supabase implementation
- Week 2: Auth, CRUD, Storage
- Week 3: UI components + integration
- Week 4: Testing + soft launch

### Validation Phase (2-4 months)

- Gather user feedback
- Validate product-market fit
- Build user base
- Monitor costs

### Migration Phase (Nhost - 6 weeks)

- Week 1-2: Nhost adapter implementation
- Week 3: Parity testing
- Week 4: Data migration scripts
- Week 5: Parallel run
- Week 6: Cutover + monitoring

## ✅ Success Criteria

**Parity Requirements:**

- [ ] All features work identically in both providers
- [ ] < 5% performance difference
- [ ] Same data integrity guarantees
- [ ] Identical user experience
- [ ] Full test coverage (>80%)

**Migration Requirements:**

- [ ] Zero data loss
- [ ] < 1 hour downtime
- [ ] All users migrated
- [ ] Audit trail complete
- [ ] Rollback plan tested

## 📚 Next Steps

1. **Create adapter stubs** (see next artefact)
2. **Setup CI matrix**
3. **Implement Supabase adapter** (MVP)
4. **Build core features**
5. **Validate with users**
6. **Plan Nhost migration**

---

_This document is a living strategy. Update as requirements evolve._
