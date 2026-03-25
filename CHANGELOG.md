# 📋 CaiZen Platform - Changelog

Alla ändringar i projektet dokumenteras här.

Format baserat på [Keep a Changelog](https://keepachangelog.com/sv/1.1.0/).

---

## [Unreleased]

### ✨ Tillagt

- **Smart inköpslista** — Komplett inköpslista-feature med:
  - `ShoppingListView` — Smart vy med butikgruppering, artikelnummer,
    kvantitetshantering, progress-bar och status (att köpa/köpt)
  - `ShoppingListService` — CRUD-service med localStorage-persistens
  - `useShoppingList` — React hook med notifikationer och state management
  - Typer: `ShoppingList`, `ShoppingListItem`, `ShoppingListItemStatus`
  - "Lägg till i inköpslista"-knapp direkt i prisjämförelse-resultaten
  - Badge-räknare i navigationen visar antal artiklar att köpa
  - Toast-notifikationer vid tillägg/borttagning
- **Prisjämförelse-feature** — Komplett prisinformations-modul med sökning,
  indexering och jämförelse av fordonsdelar från svenska butiker
  - `PriceDashboard` — Huvudvy med statistik och sökresultat
  - `PriceSearch` — Avancerat sökformulär med filter (kategori, märke,
    viskositet, max pris, i lager, rea) och snabbsök
  - `PriceResults` — Detaljerade produktkort med prislistor per butik,
    rea-markering, pristrend och direktlänkar
  - `PriceService` — Indexeringsmotor med mock-data från 7 svenska butiker
    (Biltema, Mekonomen, Skruvat, AK24, Weboil, AutoExperten, Motonet)
  - `usePriceSearch` — React hook med state management, sortering och
    prishistorik
- **Biltema-artikelnummer** — Verifierade med Biltema-appen:
  - 10L: **Art. 34-880** — 649 kr (64:90 kr/L)
  - 4L: **Art. 34-879** — ~319 kr
  - 1L: **Art. 34-878** — ~99 kr
  - OEM: MB 229.3/229.5, BMW LL-01, VW 502/505, Renault RN 0700/0710
- **Pristyper** — TypeScript-typer för prisindexering: `Product`,
  `PriceEntry`, `Retailer`, `PriceSearchQuery`, `PriceSearchResult`,
  `PriceHistory`, `PriceAlert` m.fl.
- **Navigation** — App-navigation Fordon / Prisjämförelse / Inköpslista
- **UC001: Motorolja för Volvo XC90 2.5T** — Komplett use case med forskningsanalys
  för optimalt oljeval vid 350 000 km (docs/use-cases/)
- **UC001: Inköpsguide Sverige** — Prisjämförelse med fysiska butiker, onlinebutiker,
  totalkostnad per oljebyte och köpstrategi (uppdatering mars 2026)
- **MaintenanceRecommendation types** — TypeScript-typer för underhållsrekommendationer,
  oljespecifikationer och servicescheman (src/types/index.ts)
- **Use cases-katalog** — Ny dokumentationssektion för verkliga fordons-use-cases
  (docs/use-cases/)
- **CHANGELOG.md** — Changelog-fil för spårning av projektändringar

### 🔧 Ändrat

- **App.tsx** — Navigation med 3 flikar (Fordon / Prisjämförelse / Inköpslista), v2.2
- **docs/README.md** — Uppdaterad med use case-sektion och länk till UC001

---

## [2.0.0] - 2025-09-29

### ✨ Tillagt

- Initial release med säkerhetsinfrastruktur
- Fordonsregistrering (VehicleRegistration.tsx)
- Automatisk datamaskering
- GDPR-kompatibel arkitektur
- TypeScript typdefinitioner
- TailwindCSS styling

---

_📅 Senast uppdaterad: 2026-03-21_
