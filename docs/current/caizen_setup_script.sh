#!/bin/bash
# CaiZen Platform - Automatisk Setup Script
# Version: 2.0
# Datum: 2025-09-28

set -e  # Avsluta vid fel

echo "🚗 CaiZen Platform - Automatisk Setup"
echo "======================================"
echo ""

# Färgkoder för output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funktion för att printa med färg
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# Kontrollera att vi är i rätt mapp
if [ ! -f "package.json" ]; then
    print_error "package.json hittades inte. Kör detta script från projektets root-mapp."
    exit 1
fi

print_status "Startar CaiZen setup..."
echo ""

# Steg 1: Skapa mappstruktur
print_status "Skapar projektstruktur..."

mkdir -p docs/{specifications,design}
mkdir -p src/components/{common,vehicle,fuel,trips,marketplace,community,privacy,ocr}
mkdir -p src/lib/{security,api,hooks}
mkdir -p src/types
mkdir -p src/styles/{themes}
mkdir -p src/assets/{images,icons,logos}
mkdir -p tests/{components,utils,security,e2e}
mkdir -p scripts
mkdir -p database/{migrations,seeds}
mkdir -p deployment/{docker,supabase,github-actions}
mkdir -p .husky

print_success "Mappstruktur skapad"

# Steg 2: Installera dependencies
print_status "Installerar npm-paket (detta kan ta ett par minuter)..."

npm install --silent || {
    print_error "npm install misslyckades"
    exit 1
}

print_success "Dependencies installerade"

# Steg 3: Skapa konfigurationsfiler
print_status "Skapar konfigurationsfiler..."

# TailwindCSS config
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'caizen': {
          'blue': '#0066B1',
          'orange': '#FF7700', 
          'purple': '#6F2B90',
          'red': '#FF0000',
          'dark': '#222222',
          'card': '#1E1E1E'
        }
      },
      fontFamily: {
        'automotive': ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}
EOF

# PostCSS config
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# .env.example
cat > .env.example << 'EOF'
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

# Application
VITE_APP_VERSION=2.0.0
VITE_APP_ENVIRONMENT=development
VITE_APP_TITLE="CaiZen - Säker Fordonsplattform"

# Feature flags
VITE_ENABLE_COMMUNITY=false
VITE_ENABLE_MARKETPLACE=true
VITE_ENABLE_OCR=true
VITE_ENABLE_ANALYTICS=false
EOF

# .gitignore med säkerhetsfokus
cat > .gitignore << 'EOF'
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

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

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
EOF

print_success "Konfigurationsfiler skapade"

# Steg 4: Uppdatera src/index.css med TailwindCSS
print_status "Konfigurerar TailwindCSS..."

cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-900 text-white font-automotive;
  }
}

@layer components {
  .btn-primary {
    @apply px-6 py-2 bg-caizen-blue rounded-md hover:bg-blue-700 transition-colors;
  }
  
  .btn-secondary {
    @apply px-6 py-2 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors;
  }
  
  .card {
    @apply bg-gray-800 rounded-lg p-6 border border-gray-700;
  }
  
  .input {
    @apply w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md 
           focus:outline-none focus:border-caizen-blue transition-colors;
  }
}
EOF

print_success "TailwindCSS konfigurerad"

# Steg 5: Skapa dokumentation
print_status "Skapar grundläggande dokumentation..."

cat > docs/README.md << 'EOF'
# CaiZen Platform - Dokumentation

## Översikt
CaiZen är en säker fordonshanteringsplattform med privacy-first design.

## Dokumentationsstruktur
- `/specifications` - Produktspecifikationer och arkitektur
- `/design` - Designsystem och UI/UX-dokumentation

## Snabbstart
Se projektets root README.md för installationsinstruktioner.
EOF

cat > docs/ARCHITECTURE.md << 'EOF'
# CaiZen - Teknisk Arkitektur

## Säkerhetsarkitektur
- Tvådelad databas (encrypted/masked)
- Row Level Security med Supabase
- Automatisk datamaskering
- GDPR-kompatibel från grunden

## Tech Stack
- **Frontend**: React 18 + TypeScript + TailwindCSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Maps**: Leaflet/OpenStreetMap
- **OCR**: Tesseract.js
- **Deploy**: Vercel

## Komponentsystem
Modular design med separation of concerns:
- `/components/common` - Återanvändbara komponenter
- `/components/vehicle` - Fordonsspecifika komponenter
- `/components/marketplace` - Marknadsplatsfunktioner
- `/lib/security` - Säkerhetsinfrastruktur
EOF

print_success "Dokumentation skapad"

# Steg 6: Skapa README.md
print_status "Uppdaterar README.md..."

cat > README.md << 'EOF'
# 🚗 CaiZen - Säker Fordonsplattform

En omfattande fordonshanteringsplattform som kombinerar personlig fordonshistorik, 
säker marknadsplats och community-funktioner med militärgrads datasäkerhet.

## ✨ Funktioner

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

```bash
# Installera dependencies
npm install

# Starta development server
npm run dev

# Bygg för production
npm run build
```

## 📁 Projektstruktur

```
src/
├── components/     # React komponenter
│   ├── common/    # Återanvändbara komponenter
│   ├── vehicle/   # Fordonshantering
│   ├── fuel/      # Bränsle & tankningar
│   └── ...
├── lib/           # Utilities & helpers
│   ├── security/  # Säkerhetsinfrastruktur
│   └── api/       # API clients
└── types/         # TypeScript definitioner
```

## 🔒 Säkerhet

All fordonsdata krypteras och känsliga identifierare maskeras automatiskt:
- Registreringsnummer: `ABC123` → `ABC***`
- VIN: `WBA3A5G59DNP26082` → `WBA***********6082`

## 📚 Dokumentation

Se `/docs` för komplett dokumentation och specifikationer.

## 🤝 Bidra

Detta är ett privat projekt under utveckling.

## 📄 Licens

Copyright © 2025 CaiZen. All rights reserved.
EOF

print_success "README.md uppdaterad"

# Steg 7: Setup Git hooks
print_status "Konfigurerar Git hooks för säkerhet..."

if command -v git &> /dev/null; then
    if [ -d .git ]; then
        # Skapa pre-commit hook
        cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

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
  exit 1
fi

echo "✅ Säkerhetskontroll godkänd"
EOF
        chmod +x .husky/pre-commit
        print_success "Git hooks konfigurerade"
    else
        print_warning "Git repository inte initierat, skippar hooks"
    fi
else
    print_warning "Git inte installerat, skippar hooks"
fi

# Steg 8: Skapa exempel API client
print_status "Skapar exempel API-struktur..."

cat > src/lib/api/client.ts << 'EOF'
/**
 * CaiZen API Client
 * Centraliserad API-hantering
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

class APIClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options;

    let url = `${this.baseURL}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new APIClient(API_BASE_URL);
export default apiClient;
EOF

print_success "API client skapad"

# Sammanfattning
echo ""
echo "======================================"
print_success "CaiZen setup komplett!"
echo "======================================"
echo ""
echo "📋 Nästa steg:"
echo ""
echo "1. Kopiera säkerhetsfiler från Claude artefakterna:"
echo "   - src/lib/security/dataMasking.ts"
echo "   - src/types/index.ts"
echo "   - src/components/vehicle/VehicleRegistration.tsx"
echo ""
echo "2. Konfigurera miljövariabler:"
echo "   cp .env.example .env"
echo "   # Redigera .env med dina API-nycklar"
echo ""
echo "3. Starta development server:"
echo "   npm run dev"
echo ""
echo "4. Öppna projektet i Cursor för vidare utveckling"
echo ""
print_status "Lycka till med CaiZen! 🚗✨"