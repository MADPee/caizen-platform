# CaiZen Documentation

- current/: aktiv dokumentation v2.0
- legacy/: historik (arkiverat, påverkar ej build)
- sessions/: utvecklingssessioner


## 🔁 Rutiner: Dokumentintag & Index

- Importera/klassificera artefakter:
  - Hämta filer till Hämtade filer
  - Kör: `npm run docs:intake` (granskningslista i docs/intake/CLASSIFY_REVIEW.md)
  - För att flytta enligt förslag: `npm run docs:intake:apply`
- Uppdatera index:
  - Kör: `npm run docs:index` och commit
  - CI kontrollerar att docs/INDEX.md är uppdaterad på PR/push

Regler (AI & människor ska följa):
- `docs/current/`: aktiva v2.0-dokument
- `docs/backend/`: strategier, migrations, adapters
- `docs/legacy/`: historik (påverkar inte build/test/lint)
- `docs/intake/`: tillfällig staging (exkluderas från lint/format)
