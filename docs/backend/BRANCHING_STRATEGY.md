# Git Branching Strategy for NHOST Migration

Mål: Möjliggöra parallell utveckling (Supabase i produktion) och Nhost-migrering utan risk.

## Brancher

- `main`: Production
- `develop`: Aktiv utveckling för Supabase (MVP/feature-fix)
- `feature/nhost-adapter`: Nhost-adapter + relaterat arbete
- `feat/*`, `fix/*`, `docs/*`: vanliga feature/fix branches

## Flöde

1. Supabase-förändringar → `feature/*` → PR till `develop` → release till `main`
2. Nhost-migrering → `feature/nhost-adapter` (långlivad) → PR till `develop` när kontrakttester är gröna
3. När Nhost är redo: `release/nhost-cutover` → PR till `main`

## CI

- Matrix-jobb: `provider=[supabase, nhost]`
- Kör: type-check, unit/contract tests, lint
- Blockera merge om någon provider failar

## Miljöer

- Staging (Supabase): `develop` → `VITE_BACKEND_PROVIDER=supabase`
- Staging (Nhost skugg): PR från `feature/nhost-adapter` → `VITE_BACKEND_PROVIDER=nhost`

## Regler

- Ingen direkt UI-kod får prata med provider-SDK → endast via `BackendClient`
- Migrations-skript versioneras under `database/migrations/`
- Dokument uppdateras i varje PR (CHANGELOG, HANDOVER)
