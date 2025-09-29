# 🚀 CaiZen - Komplett Installationsguide

_Från 0 till körande projekt på 10 minuter_

## 📦 Vad du behöver göra

### Steg 1: Ersätt package.json (1 minut)

Du har redan ett Vite-projekt igång. Nu ersätter vi bara package.json:

```bash
# Du är redan i caizen-platform mappen
# Stäng dev-servern om den körs (Ctrl+C)

# Backup av nuvarande package.json (valfritt)
cp package.json package.json.backup

# Öppna projektet i Cursor
cursor .
```

**I Cursor:**

1. Öppna `package.json`
2. Ta bort ALLT innehåll
3. Kopiera HELA innehållet från artefakt "CaiZen - Komplett package.json"
4. Klistra in i din `package.json`
5. Spara filen

### Steg 2: Kör setup-scriptet (3 minuter)

```bash
# Skapa scripts-mapp
mkdir -p scripts

# Kopiera setup-scriptet (gör detta i Cursor)
# Skapa filen: scripts/setup.sh
# Kopiera innehållet från artefakt "CaiZen - Automatisk Setup Script"
# Spara

# Gör scriptet körbart
chmod +x scripts/setup.sh

# Kör setup
npm run setup
```

**Vad händer:**

- ✅ Alla mappar skapas automatiskt
- ✅ Dependencies installeras
- ✅ Konfigurationsfiler skapas
- ✅ TailwindCSS konfigureras
- ✅ Git hooks för säkerhet sätts upp
- ✅ Dokumentation genereras

### Steg 3: Kopiera kärnfiler från artefakterna (5 minuter)

Nu ska du kopiera de 3 viktigaste filerna från Claude-artefakterna:

#### A. Security & Data Masking

```bash
# Skapa filen
touch src/lib/security/dataMasking.ts
```

**I Cursor:**

- Öppna `src/lib/security/dataMasking.ts`
- Kopiera HELA innehållet från artefakt "CaiZen - Security & Data Masking Utils"
- Klistra in och spara

#### B. TypeScript Types

```bash
# Skapa filen
touch src/types/index.ts
```

**I Cursor:**

- Öppna `src/types/index.ts`
- Kopiera HELA innehållet från artefakt "CaiZen - TypeScript Type Definitions"
- Klistra in och spara

#### C. Vehicle Registration Component

```bash
# Skapa filen
touch src/components/vehicle/VehicleRegistration.tsx
```

**I Cursor:**

- Öppna `src/components/vehicle/VehicleRegistration.tsx`
- Kopiera HELA innehållet från artefakt "CaiZen - Säker Fordonsregistrering Komponent"
- Klistra in och spara

### Steg 4: Uppdatera App.tsx (1 minut)

Ersätt innehållet i `src/App.tsx`:

```typescript
import { useState } from 'react'
import VehicleRegistration from './components/vehicle/VehicleRegistration'
import { Vehicle, CreateType } from './types'
import { Car } from 'lucide-react'

function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])

  const handleVehicleCreated = async (vehicleData: CreateType<Vehicle>) => {
    console.log('Nytt fordon registrerat:', vehicleData)

    // I produktionen skulle detta skickas till Supabase
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setVehicles(prev => [...prev, newVehicle])
    alert('Fordon registrerat! Se konsolen för detaljer.')
  }

  const handleValidationError = (error: string) => {
    alert(error)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-10 shadow-md">
        <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-red-600"></div>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
              <Car size={18} />
            </div>
            <h1 className="text-xl font-semibold">
              <span className="text-blue-500">Cai</span>
              <span className="text-orange-500">Zen</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Välkommen till CaiZen</h2>
            <p className="text-gray-400">
              Säker fordonshantering med privacy-first design
            </p>
          </div>

          <VehicleRegistration
            onVehicleCreated={handleVehicleCreated}
            onValidationError={handleValidationError}
          />

          {/* Registrerade fordon */}
          {vehicles.length > 0 && (
            <div className="mt-8 card">
              <h3 className="text-xl font-semibold mb-4">Registrerade fordon</h3>
              <div className="space-y-4">
                {vehicles.map(vehicle => (
                  <div key={vehicle.id} className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {vehicle.make} {vehicle.model} ({vehicle.year})
                        </p>
                        <p className="text-sm text-gray-400">
                          Reg: {vehicle.registration.masked} | VIN: {vehicle.vin.masked}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs px-2 py-1 bg-green-900 text-green-300 rounded">
                          {vehicle.verificationLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>CaiZen Platform v2.0 - Säker fordonshantering</p>
        </div>
      </footer>
    </div>
  )
}

export default App
```

### Steg 5: Starta projektet! (30 sekunder)

```bash
# Installera alla nya dependencies
npm install

# Starta development server
npm run dev
```

Öppna http://localhost:5173 i din webbläsare!

## ✅ Vad du nu har

### Funktionalitet:

- ✅ Komplett fordonsregistrering med säkerhet
- ✅ Realtidsvalidering av reg.nr och VIN
- ✅ Automatisk datamaskering
- ✅ Privacy-by-design arkitektur
- ✅ TypeScript-typning överallt
- ✅ TailwindCSS styling

### Projektstruktur:

```
caizen-platform/
├── src/
│   ├── components/
│   │   └── vehicle/
│   │       └── VehicleRegistration.tsx ✅
│   ├── lib/
│   │   └── security/
│   │       └── dataMasking.ts ✅
│   ├── types/
│   │   └── index.ts ✅
│   └── App.tsx ✅
├── docs/ ✅
├── scripts/ ✅
└── package.json ✅
```

## 🎯 Nästa steg för utveckling

### I Cursor Composer, be om:

**1. Skapa fler komponenter:**

```
"Skapa en FuelEntry-komponent baserat på mönstret från VehicleRegistration.
Den ska hantera tankningar med samma säkerhetsnivå."
```

**2. Lägg till routing:**

```
"Setup React Router med dessa routes:
- / (Dashboard)
- /vehicles (Fordonsöversikt)
- /marketplace (Marknadsplats)
Använd samma designsystem som VehicleRegistration."
```

**3. Integrera Supabase:**

```
"Skapa en Supabase client i src/lib/api/supabase.ts
Använd environment variables från .env.example"
```

## 🔒 Säkerhetstips

**Test att säkerheten fungerar:**

1. Registrera ett testfordon med reg.nr "ABC123"
2. Se att det visas som "ABC\*\*\*" i UI
3. Öppna konsolen - inget klartext reg.nr ska synas
4. Försök commita kod med riktigt reg.nr - Git hook ska stoppa dig

## 🆘 Troubleshooting

### "Module not found" fel?

```bash
npm install
```

### TypeScript-fel?

```bash
npm run type-check
```

### TailwindCSS fungerar inte?

```bash
# Kontrollera att tailwind.config.js finns
ls tailwind.config.js

# Om den saknas, kör setup igen
npm run setup

# Eller skapa manuellt (se setup-scriptet för innehåll)
```

### Git hooks varnar felaktigt?

```bash
# Om du använder testdata och får falskt alarm
# Temporärt disable hooks:
git commit --no-verify -m "your message"

# Men kontrollera alltid att ingen riktig känslig data finns!
```

### Port 5173 redan används?

```bash
# Använd annan port
npm run dev -- --port 3000
```

## 📊 Verifiering - Checklista

Innan du går vidare, kontrollera att allt fungerar:

**Filstruktur:**

- [ ] `src/lib/security/dataMasking.ts` finns och innehåller säkerhetsfunktioner
- [ ] `src/types/index.ts` finns och innehåller alla TypeScript-definitioner
- [ ] `src/components/vehicle/VehicleRegistration.tsx` finns
- [ ] `tailwind.config.js` finns med CaiZen färger
- [ ] `.env.example` finns
- [ ] `docs/` mapp skapad med dokumentation

**Funktionalitet:**

- [ ] `npm run dev` startar utan fel
- [ ] Webbläsaren visar CaiZen-headern med blå/orange logo
- [ ] Fordonsregistreringsformuläret visas
- [ ] Kan skriva reg.nr och se det maskeras automatiskt
- [ ] Kan skriva VIN och se det maskeras automatiskt
- [ ] Validering fungerar (felmeddelanden visas vid ogiltiga värden)
- [ ] Kan registrera ett testfordon
- [ ] Fordonet visas i listan med maskerade värden

**Development tools:**

- [ ] `npm run lint` fungerar
- [ ] `npm run type-check` fungerar utan fel
- [ ] Hot reload fungerar (ändringar syns direkt)

## 🚀 Production Deployment (Framtida steg)

När du är redo att deploya:

### Setup Supabase

```bash
# 1. Skapa projekt på supabase.com
# 2. Kopiera .env.example till .env
cp .env.example .env

# 3. Fyll i dina Supabase credentials i .env
# 4. Kör migrations (när du har dem)
```

### Deploy till Vercel

```bash
# Installera Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

## 💡 Pro Tips

### Cursor Composer Best Practices

**För att få bäst hjälp från Cursor:**

1. **Referera till befintlig kod:**

   ```
   "Skapa en MarketplaceCard-komponent som följer samma mönster
   som VehicleRegistration.tsx"
   ```

2. **Specificera säkerhetskrav:**

   ```
   "Lägg till en ny komponent för servicehistorik.
   Använd samma datamaskering som i dataMasking.ts"
   ```

3. **Be om förklaringar:**
   ```
   "Förklara hur maskRegistrationNumber fungerar i dataMasking.ts
   och ge exempel på användning"
   ```

### Utvecklingsflöde

**Rekommenderad ordning:**

1. ✅ **Grundstruktur** (du är här!)
2. **Routing & Navigation** - Lägg till React Router
3. **Supabase Integration** - Anslut till databas
4. **Auth System** - Användarregistrering och login
5. **Fuel Management** - Tankningsloggning
6. **Marketplace** - Kartbaserad marknadsplats
7. **Community** - Forum och grupper
8. **OCR Integration** - Dokumentskanning
9. **PWA Features** - Offline-funktionalitet
10. **Production Deploy** - Live lansering

### Kodkvalitet

**Innan varje commit:**

```bash
# Kör alla kvalitetskontroller
npm run lint
npm run type-check
npm run test

# Eller kombinerat:
npm run lint && npm run type-check && npm run test
```

## 📚 Läs mer

- **Projektdokumentation:** `/docs/README.md`
- **Arkitektur:** `/docs/ARCHITECTURE.md`
- **Artefakter från Claude:** De 5 ursprungliga artefakterna
- **Supabase Docs:** https://supabase.com/docs
- **TailwindCSS:** https://tailwindcss.com/docs

## 🎉 Grattis!

Du har nu en fullt fungerande CaiZen-plattform med:

- ✅ Modern React + TypeScript setup
- ✅ Säkerhetsinfrastruktur från dag 1
- ✅ Privacy-by-design arkitektur
- ✅ Production-ready kod
- ✅ Skalbar projektstruktur

**Nästa steg:** Öppna Cursor och börja utveckla!

```bash
# Öppna i Cursor
cursor .

# Happy coding! 🚗✨
```

---

## 🆘 Behöver du mer hjälp?

Om något inte fungerar:

1. **Kontrollera att alla filer är på plats** (använd checklistan ovan)
2. **Kör `npm install` igen** för att säkerställa alla dependencies
3. **Starta om Cursor** och dev-servern
4. **Kolla terminalen** för felmeddelanden
5. **Be Cursor om hjälp** med det specifika felet

**Vanliga kommandon för felsökning:**

```bash
# Rensa cache och installera om
rm -rf node_modules package-lock.json
npm install

# Kontrollera TypeScript
npm run type-check

# Kontrollera kodkvalitet
npm run lint

# Se vilka scripts som finns
npm run
```

**Lycka till med CaiZen-utvecklingen!** 🎯
