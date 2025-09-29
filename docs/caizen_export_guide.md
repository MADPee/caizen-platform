# CaiZen - Komplett Exportguide

_Steg-för-steg guide för att exportera och organisera ditt projekt_

## 🚀 Snabbstart (15 minuter)

### Steg 1: Skapa GitHub Repository

```bash
# Skapa lokal mapp
mkdir caizen-platform
cd caizen-platform

# Initiera Git
git init
git branch -M main

# Skapa GitHub repo (via web interface eller CLI)
gh repo create caizen-platform --public --description "Säker fordonsplattform med privacy-first design"
```

### Steg 2: Setup Project Structure

```bash
# Skapa grundläggande struktur
mkdir -p {docs,src/{components/{common,vehicle,fuel,trips,marketplace,community,privacy,ocr},lib/{security,api,hooks},types,styles,assets},tests,scripts,database,deployment}

# Skapa viktiga filer
touch README.md .gitignore .env.example package.json tsconfig.json tailwind.config.js
```

### Steg 3: Kopiera Core Files

1. **Kopiera projektstruktur** från första artefakten till README.md
2. **Kopiera säkerhetsutils** från andra artefakten till `src/lib/security/dataMasking.ts`
3. **Kopiera typedefinitioner** från tredje artefakten till `src/types/index.ts`
4. **Kopiera komponent** från fjärde artefakten till `src/components/vehicle/VehicleRegistration.tsx`

## 📋 Detaljerad Exportprocess

### Fas 1: Dokumentation (30 minuter)

#### Kopiera från projektkunskapen:

```bash
# docs/specifications/
product-requirements-v2.md          # Från "Uppdaterad MyCarsJournal Produktspecifikation"
privacy-first-components.md         # Från "CaiZen Komponentdokumentation v2.0"
utvecklingssession-beslut.md        # Från "CaiZen Utvecklingssession - Beslut"
komponent-dokumentation.md          # Från "Caizen Komponentdokumentation"

# docs/
utvecklingssammanfattning.md        # Från "CaiZen Utvecklingssammanfattning"
vehicle-access-control.md           # Från "CaiZen Smart Vehicle Access Control"
```

#### Skapa nya dokumentationsfiler:

```markdown
# docs/ARCHITECTURE.md

# CaiZen - Teknisk Arkitektur

## Säkerhetsarkitektur

- Tvådelad databas (encrypted/masked)
- Row Level Security med Supabase
- Automatisk datamaskering
- GDPR-kompatibel från grunden

## Komponentsystem

- React 18 + TypeScript
- TailwindCSS för styling
- Lucide React för ikoner
- Modular design med separation of concerns

## Privacy by Design

- Aldrig känslig data i frontend
- Automatisk OCR-censurering
- Audit logging för all dataåtkomst
- User consent management
```

### Fas 2: Befintliga Komponenter (45 minuter)

#### Identifiera befintliga komponenter från projektkunskapen:

**Från "Caizen - Reseanalys Dashboard.tsx":**

```bash
# Kopiera till: src/components/trips/TripAnalysisDashboard.tsx
# Innehåller: Komplett reseanalys med privacy-funktioner
```

**Från "Caizen Smart OCR Parser.tsx":**

```bash
# Kopiera till: src/components/ocr/SmartOCRParser.tsx
# Innehåller: OCR-funktionalitet med dokumentklassificering
```

**Andra komponenter att extrahera:**

- FuelManagementDashboard.tsx (från komponentdokumentation)
- MarketplaceMap.tsx (behöver skapas baserat på specifikationer)
- VehicleCard.tsx (grundkomponent)

### Fas 3: Setup Development Environment (30 minuter)

#### package.json

```json
{
  "name": "caizen-platform",
  "version": "2.0.0",
  "description": "Säker fordonsplattform med privacy-first design",
  "main": "src/main.tsx",
  "scripts": {
    "dev": "vite --host",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "security:audit": "npm audit && npm audit signatures",
    "db:migrate": "supabase db push",
    "db:reset": "supabase db reset",
    "deploy:staging": "npm run build && vercel --prod",
    "prepare": "husky install"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.15.0",
    "@supabase/supabase-js": "^2.38.0",
    "lucide-react": "^0.263.1",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "tesseract.js": "^5.0.0",
    "recharts": "^2.8.0",
    "framer-motion": "^10.16.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^1.14.0",
    "@hookform/resolvers": "^3.3.0",
    "react-hook-form": "^7.45.0",
    "zod": "^3.22.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@types/node": "^20.5.0",
    "@types/leaflet": "^1.9.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.3",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "prettier": "^3.0.0",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.0.2",
    "vite": "^4.4.5",
    "vitest": "^0.34.0",
    "@vitest/ui": "^0.34.0",
    "@playwright/test": "^1.37.0",
    "husky": "^8.0.3",
    "lint-staged": "^14.0.0"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{md,json}": ["prettier --write"]
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

#### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        caizen: {
          blue: "#0066B1",
          orange: "#FF7700",
          purple: "#6F2B90",
          red: "#FF0000",
          dark: "#222222",
          card: "#1E1E1E",
        },
      },
      fontFamily: {
        automotive: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
```

#### .env.example

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Security & Encryption
VITE_ENCRYPTION_KEY_ID=caizen-2025
ENCRYPTION_MASTER_KEY=your-256-bit-master-key

# External APIs
VITE_MAPS_API_KEY=your-openstreetmap-key
VITE_VIN_DECODER_API_KEY=your-vin-api-key
VITE_FUEL_PRICE_API_KEY=your-fuel-price-api

# Application
VITE_APP_VERSION=2.0.0
VITE_APP_ENVIRONMENT=development
VITE_APP_TITLE="CaiZen - Säker Fordonsplattform"

# Features flags
VITE_ENABLE_COMMUNITY=false
VITE_ENABLE_MARKETPLACE=true
VITE_ENABLE_OCR=true
VITE_ENABLE_ANALYTICS=false

# Rate Limiting
VITE_API_RATE_LIMIT=100
VITE_UPLOAD_MAX_SIZE=10485760

# Geographic defaults (Sweden)
VITE_DEFAULT_COUNTRY=SE
VITE_DEFAULT_CURRENCY=SEK
VITE_DEFAULT_LANGUAGE=sv
```

### Fas 4: Säkerhetssetup (45 minuter)

#### Git hooks för säkerhet

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Förhindra commit av känslig data
echo "🔍 Säkerhetskontroll..."

# Kontrollera efter registreringsnummer
if git diff --cached --name-only | xargs grep -l "\b[A-Z]{3}[0-9]{3}\b" 2>/dev/null; then
  echo "❌ VARNING: Registreringsnummer upptäckt i commit!"
  echo "   Använd testdata eller maskerade värden istället."
  exit 1
fi

# Kontrollera efter VIN
if git diff --cached --name-only | xargs grep -l "\b[A-HJ-NPR-Z0-9]{17}\b" 2>/dev/null; then
  echo "❌ VARNING: VIN-nummer upptäckt i commit!"
  echo "   Använd testdata eller maskerade värden istället."
  exit 1
fi

# Kontrollera efter personnummer
if git diff --cached --name-only | xargs grep -l "\b[0-9]{6}-[0-9]{4}\b" 2>/dev/null; then
  echo "❌ VARNING: Personnummer upptäckt i commit!"
  exit 1
fi

# Kör linting
npm run lint-staged

echo "✅ Säkerhetskontroll godkänd"
```

#### .gitignore med säkerhetsfokus

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Production
/dist
/build

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# SÄKERHETSKRITISKT: Blockera känslig data
/test-data/real-documents/
/uploads/
/temp/
*.backup
*.dump
/keys/
/secrets/

# OCR och Document processing
/ocr-cache/
/document-cache/
/processed-documents/

# Logs som kan innehålla känslig data
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Testing
/coverage
/.nyc_output

# Misc
.eslintcache
*.tsbuildinfo
```

## 🔄 Continuous Integration Setup

### GitHub Actions (.github/workflows/ci.yml)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Security Audit
        run: |
          # Scan for sensitive patterns
          if grep -r "\b[A-Z]{3}[0-9]{3}\b" src/; then
            echo "❌ Registration numbers found in code"
            exit 1
          fi

          if grep -r "\b[A-HJ-NPR-Z0-9]{17}\b" src/; then
            echo "❌ VIN numbers found in code"  
            exit 1
          fi

  test:
    runs-on: ubuntu-latest
    needs: security-scan
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📊 Progress Tracking

### Checklista för komplett export:

**📚 Dokumentation**

- [ ] README.md med projektöversikt
- [ ] ARCHITECTURE.md med teknisk design
- [ ] SECURITY.md med säkerhetsprinciper
- [ ] API.md med endpoint-dokumentation
- [ ] Alla specifikationer från projektkunskap

**💻 Kod**

- [ ] TypeScript types (`src/types/`)
- [ ] Säkerhetsutils (`src/lib/security/`)
- [ ] React komponenter (`src/components/`)
- [ ] API clients (`src/lib/api/`)
- [ ] Custom hooks (`src/lib/hooks/`)

**🔧 Konfiguration**

- [ ] package.json med alla dependencies
- [ ] tsconfig.json för TypeScript
- [ ] tailwind.config.js för styling
- [ ] vite.config.ts för build
- [ ] .env.example för miljövariabler

**🔒 Säkerhet**

- [ ] Git hooks för sensitive data
- [ ] .gitignore med säkerhetsfokus
- [ ] ESLint rules för security
- [ ] Pre-commit validering

**🚀 DevOps**

- [ ] GitHub Actions CI/CD
- [ ] Deployment konfiguration
- [ ] Database migrations
- [ ] Monitoring setup

## 🎯 Nästa Steg Efter Export

1. **Setup Supabase:**

   ```sql
   -- Database schema för vehicles
   CREATE TABLE vehicles (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id),
     registration_encrypted TEXT NOT NULL,
     registration_masked TEXT NOT NULL,
     vin_encrypted TEXT NOT NULL,
     vin_masked TEXT NOT NULL,
     make TEXT NOT NULL,
     model TEXT NOT NULL,
     year INTEGER NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

2. **Deploy till Staging:**

   ```bash
   npm run build
   vercel --prod
   ```

3. **Aktivera Community Features:**

   ```bash
   # När redo för community
   export VITE_ENABLE_COMMUNITY=true
   ```

4. **Setup Monitoring:**
   ```bash
   # LogRocket, Sentry, eller liknande
   npm install @sentry/react
   ```

## 💡 Tips för Framgångsrik Export

### Prioritera i denna ordning:

1. **Säkerhet först** - All kryptering och maskering
2. **Core funktioner** - Fordonsregistrering och grunddata
3. **UI komponenter** - Dashboard och navigation
4. **Advanced features** - Marknadsplats och community
5. **Integrations** - Externa API:er och tjänster

### Viktiga principer:

- **Aldrig riktiga känsliga data** i testfiler
- **Automatiserad säkerhetstesting** från dag 1
- **GDPR-compliance** inbyggt från början
- **Mobile-first design** för garage-användning
- **Progressive enhancement** för offline-funktionalitet

---

_Denna guide säkerställer att din CaiZen-plattform exporteras på ett säkert, strukturerat och skalbart sätt. Följ stegen i ordning för bästa resultat._
