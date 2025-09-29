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

- **Frontend:** React 19, TypeScript, TailwindCSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Maps:** OpenStreetMap/Leaflet
- **OCR:** Tesseract.js
- **Deploy:** Vercel/Netlify

## 🚀 Snabbstart

```bash
# Klona projektet
git clone https://github.com/[username]/caizen-platform
cd caizen-platform

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
│   ├── trips/     # Reseanalys
│   ├── marketplace/ # Marknadsplats
│   ├── community/ # Community funktioner
│   ├── privacy/   # Privacy & säkerhet
│   └── ocr/       # OCR & dokumenthantering
├── lib/           # Utilities & helpers
│   ├── security/  # Säkerhetsinfrastruktur
│   ├── api/       # API clients
│   └── hooks/     # Custom React hooks
├── types/         # TypeScript definitioner
├── styles/        # CSS & styling
└── assets/        # Statiska filer
```

## 🔒 Säkerhet

All fordonsdata krypteras och känsliga identifierare maskeras automatiskt:

- Registreringsnummer: `ABC123` → `ABC***`
- VIN: `WBA3A5G59DNP26082` → `WBA***********6082`

### Säkerhetsprinciper:

- **Privacy by Design** - Känslig data exponeras aldrig
- **Automatisk datamaskering** - Alla identifierare censureras
- **GDPR-kompatibel** - Användarna äger sin data
- **Audit logging** - All dataåtkomst loggas säkert

## 📚 Dokumentation

Se `/docs` för komplett dokumentation och specifikationer:

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Teknisk arkitektur
- **[SECURITY.md](docs/SECURITY.md)** - Säkerhetsprinciper
- **[API.md](docs/API.md)** - API dokumentation
- **[Specifications](docs/specifications/)** - Produktspecifikationer

## 🧪 Testing

```bash
# Kör unit tests
npm run test

# Kör tests med UI
npm run test:ui

# Kör end-to-end tests
npm run test:e2e

# Kodkvalitet
npm run lint
npm run type-check
```

## 🚀 Deployment

```bash
# Bygg för production
npm run build

# Preview build
npm run preview

# Deploy till Vercel
vercel --prod
```

## 🔧 Development

```bash
# Starta med hot reload
npm run dev

# Linting och formattering
npm run lint:fix
npm run format

# Säkerhetsaudit
npm run security:audit
```

## 🌍 Miljövariabler

Kopiera `.env.example` till `.env` och fyll i dina API-nycklar:

```bash
cp .env.example .env
```

### Nödvändiga variabler:

- `VITE_SUPABASE_URL` - Din Supabase URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonym nyckel
- `VITE_MAPS_API_KEY` - OpenStreetMap API-nyckel

## 🤝 Bidra

Detta är ett privat projekt under utveckling. Säkerhetsprinciper:

1. **Aldrig riktiga känsliga data** i commits
2. **Kör säkerhetskontroller** före varje commit
3. **Följ GDPR-principerna** i all kod
4. **Testa automatisk datamaskering** för nya funktioner

### Git Hooks

Automatiska säkerhetskontroller körs före commits:

- Letar efter registreringsnummer (ABC123 format)
- Letar efter VIN-nummer (17 tecken)
- Letar efter personnummer
- Kör linting och formattering

## 🏆 Status

- ✅ Grundläggande fordonsregistrering
- ✅ Säkerhetssystem och datamaskering
- ✅ TypeScript typning
- ✅ TailwindCSS styling
- 🔄 React Router navigation (pågående)
- 🔄 Supabase integration (pågående)
- 📋 Kartbaserad marknadsplats (planerad)
- 📋 Community funktioner (planerad)

## 📄 Licens

Copyright © 2025 CaiZen Team. All rights reserved.

## 🆘 Support

För frågor eller support, se dokumentationen i `/docs` eller kontakta utvecklingsteamet.

---

**CaiZen Platform v2.0** - Säker fordonshantering med privacy-first design 🚗✨
