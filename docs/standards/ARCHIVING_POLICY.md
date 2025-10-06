---
title: "Arkiveringspolicy (Legacy)"
status: approved
author: Platform Team
version: 1.0.0
last_updated: 2025-10-06
---

# 🗄️ Arkiveringspolicy (Legacy)

Syfte: Säkerställa spårbarhet och ordning genom att flytta daterade dokument till `docs/legacy/`.

## När arkivera
- Dokument med datum i titel/metadata (t.ex. rapporter, beslut, checklistor per release).
- Ersatta versioner när status ändras till "approved" för en nyare version.
- Sessions/loggar äldre än 90 dagar om de inte är aktiva.

## Plats & Namngivning
- Mapp: `docs/legacy/<YYYY>/<MM>-<slug>/`
- Filnamn: `YYYY-MM-DD_<slug>.md`
- Lägg `README.md` i varje legacy-mapp med kort sammanfattning och referenser.

## Process (icke-destruktiv)
1. Skapa backup (git commit/branch) och kör alltid "dry-run" innan flytt.
2. Flytta filer till korrekt legacy-sökväg.
3. Uppdatera länkar i `docs/INDEX.md` och andra dokument.
4. Lägg till post i CHANGELOG med 📦 Arkiverat.

## Retention
- Behåll alla säkerhets-/compliance-relaterade dokument i minst 3 år.
- Övriga dokument: minst 12 månader.

## Ansvar
- Dokumentägare initierar arkivering.
- Plattformsteamet granskar och godkänner vid behov.

## Referenser
- `docs/README.md`
- `docs/standards/DOCUMENTATION_STANDARD.md`
