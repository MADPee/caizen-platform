# CaiZen - Komplett GitHub Projektstruktur

_Datum: 2025-09-28_
_Version: 2.0_

## 📁 Recommended Repository Structure

```
caizen-platform/
├── README.md
├── LICENSE
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
│
├── docs/                              # 📚 Dokumentation
│   ├── README.md
│   ├── ARCHITECTURE.md
│   ├── SECURITY.md
│   ├── API.md
│   ├── DEPLOYMENT.md
│   ├── specifications/
│   │   ├── product-requirements-v2.md
│   │   ├── privacy-first-components.md
│   │   ├── utvecklingssession-beslut.md
│   │   └── komponent-dokumentation.md
│   └── design/
│       ├── design-system.md
│       ├── user-flows.md
│       └── wireframes/
│
├── src/                               # 💻 Källkod
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   │
│   ├── components/                    # 🧩 React komponenter
│   │   ├── common/                    # Återanvändbara komponenter
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── PrivacyBadge.tsx
│   │   │
│   │   ├── vehicle/                   # Fordonshantering
│   │   │   ├── VehicleRegistration.tsx
│   │   │   ├── VehicleCard.tsx
│   │   │   ├── VehicleDetails.tsx
│   │   │   └── VehicleVerification.tsx
│   │   │
│   │   ├── fuel/                      # Bränsle & tankningar
│   │   │   ├── FuelManagementDashboard.tsx
│   │   │   ├── FuelEntry.tsx
│   │   │   ├── FuelAnalysisReport.tsx
│   │   │   └── FuelStatistics.tsx
│   │   │
│   │   ├── trips/                     # Reseanalys
│   │   │   ├── TripAnalysisDashboard.tsx
│   │   │   ├── TripCard.tsx
│   │   │   ├── TripDetails.tsx
│   │   │   └── TripStatistics.tsx
│   │   │
│   │   ├── marketplace/               # Marknadsplats
│   │   │   ├── MarketplaceMap.tsx
│   │   │   ├── VehicleListing.tsx
│   │   │   ├── SearchFilters.tsx
│   │   │   ├── VehicleMarker.tsx
│   │   │   └── MarketplaceCard.tsx
│   │   │
│   │   ├── community/                 # Community (framtida)
│   │   │   ├── VehicleGroups.tsx
│   │   │   ├── CommunityPost.tsx
│   │   │   ├── MarketplaceDiscussion.tsx
│   │   │   └── ExpertRecommendations.tsx
│   │   │
│   │   ├── privacy/                   # Privacy & säkerhet
│   │   │   ├── SmartDocumentParser.tsx
│   │   │   ├── PrivacyControlPanel.tsx
│   │   │   ├── ConsentManagement.tsx
│   │   │   ├── DataMaskingDemo.tsx
│   │   │   └── GDPRTools.tsx
│   │   │
│   │   └── ocr/                       # OCR & dokumenthantering
│   │       ├── SmartOCRParser.tsx
│   │       ├── DocumentUpload.tsx
│   │       ├── DocumentClassifier.tsx
│   │       └── DataExtractor.tsx
│   │
│   ├── lib/                          # 🔧 Utilities & helpers
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   ├── security/
│   │   │   ├── dataMasking.ts
│   │   │   ├── encryption.ts
│   │   │   └── validation.ts
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── vehicles.ts
│   │   │   ├── marketplace.ts
│   │   │   └── ocr.ts
│   │   └── hooks/
│   │       ├── useVehicles.ts
│   │       ├── usePrivacy.ts
│   │       └── useOCR.ts
│   │
│   ├── types/                        # 📝 TypeScript definitioner
│   │   ├── index.ts
│   │   ├── vehicle.ts
│   │   ├── fuel.ts
│   │   ├── marketplace.ts
│   │   ├── privacy.ts
│   │   └── ocr.ts
│   │
│   ├── styles/                       # 🎨 CSS & styling
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── themes/
│   │       ├── automotive.css
│   │       └── variables.css
│   │
│   └── assets/                       # 🖼️ Statiska filer
│       ├── images/
│       ├── icons/
│       └── logos/
│
├── tests/                            # 🧪 Tester
│   ├── components/
│   ├── utils/
│   ├── security/
│   └── e2e/
│
├── scripts/                          # 🛠️ Build & deploy scripts
│   ├── build.sh
│   ├── deploy.sh
│   └── db-migrate.sh
│
├── database/                         # 💾 Databasschema
│   ├── schema.sql
│   ├── migrations/
│   └── seeds/
│
└── deployment/                       # 🚀 Deployment konfiguration
    ├── docker/
    │   ├── Dockerfile
    │   └── docker-compose.yml
    ├── supabase/
    │   ├── config.toml
    │   └── functions/
    └── github-actions/
        └── ci-cd.yml
```

## 🔑 Viktiga filer att skapa

### 1. Root README.md

```markdown
# CaiZen - Säker Fordonsplattform

En omfattande fordonshanteringsplattform som kombinerar personlig fordonshistorik,
säker marknadsplats och community-funktioner med militärgrads datasäkerhet.

## 🚗 Funktioner

- **Säker fordonshantering** med maskering av känsliga identifierare
- **Kartbaserad marknadsplats** med geografisk sökning
- **Smart OCR** för automatisk dokumenthantering
- **GDPR-kompatibel** från grunden
- **Privacy by design** arkitektur

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, TailwindCSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Maps:** OpenStreetMap/Leaflet
- **OCR:** Tesseract.js
- **Deploy:** Vercel/Netlify

## 🚀 Snabbstart

\`\`\`bash
git clone https://github.com/[username]/caizen-platform
cd caizen-platform
npm install
npm run dev
\`\`\`

## 📚 Dokumentation

Se `/docs` för komplett dokumentation och specifikationer.
```

### 2. package.json

```json
{
  "name": "caizen-platform",
  "version": "2.0.0",
  "description": "Säker fordonsplattform med privacy-first design",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:e2e": "playwright test",
    "lint": "eslint . --ext ts,tsx",
    "format": "prettier --write ."
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.38.0",
    "lucide-react": "^0.263.1",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "tesseract.js": "^4.1.1",
    "recharts": "^2.8.0",
    "framer-motion": "^10.16.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/node": "^20.5.0",
    "@types/leaflet": "^1.9.0",
    "typescript": "^5.0.2",
    "vite": "^4.4.0",
    "tailwindcss": "^3.3.0",
    "eslint": "^8.45.0",
    "prettier": "^3.0.0",
    "vitest": "^0.34.0",
    "@playwright/test": "^1.37.0"
  }
}
```

### 3. Security & Privacy konfiguration

#### .env.example

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Encryption
VITE_ENCRYPTION_KEY_ID=your_key_id
ENCRYPTION_MASTER_KEY=your_master_key

# External APIs
VITE_MAPS_API_KEY=your_maps_api_key
VITE_VIN_DECODER_API_KEY=your_vin_api_key

# Development
NODE_ENV=development
VITE_APP_VERSION=2.0.0
```

### 4. TypeScript konfiguration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 🔒 Säkerhetsrekommendationer

### Git hooks (pre-commit)

```bash
#!/bin/sh
# Förhindra commit av känslig data
if git diff --cached --name-only | xargs grep -l "ABC[0-9]"; then
  echo "❌ Registreringsnummer upptäckt i commit!"
  exit 1
fi

if git diff --cached --name-only | xargs grep -l "W[A-Z0-9]{16}"; then
  echo "❌ VIN-nummer upptäckt i commit!"
  exit 1
fi
```

### .gitignore additions

```gitignore
# Känslig data
*.env.local
*.env.production
/test-data/real-documents/
/uploads/
/temp/

# OCR cache
/ocr-cache/
/document-cache/

# Logs med potentiell känslig data
*.log
logs/
npm-debug.log*
```

## 📋 Nästa steg för implementation

1. **Skapa repository:** `git init` och push till GitHub
2. **Konfigurera Supabase:** Database schema och RLS policies
3. **Implementera säkerhetslager:** Datamaskering och kryptering
4. **Setup CI/CD:** GitHub Actions för automated testing
5. **Deploy staging:** Testmiljö för utveckling

## 🎯 Prioriterad ordning för kodfiler

1. **Säkerhetsinfrastruktur först** (`/src/lib/security/`)
2. **Grundläggande komponenter** (`/src/components/common/`)
3. **Fordonshantering** (`/src/components/vehicle/`)
4. **Marknadsplats** (`/src/components/marketplace/`)
5. **Community funktioner** (`/src/components/community/`)

Denna struktur följer best practices för moderna React-applikationer och säkerställer skalbarhet och underhållbarhet för CaiZen-plattformen.
