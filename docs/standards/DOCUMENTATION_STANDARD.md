---
title: "Dokumentationsstandard (ISO-inriktad)"
status: approved
author: Platform Team
version: 1.0.0
last_updated: 2025-10-06
---

# 📚 Dokumentationsstandard (ISO-inriktad)

Syfte: Säkerställa en enhetlig och ISO-inspirerad struktur (9001/27001) för alla dokument.

## Obligatoriska sektioner
1. Dokumentinformation (Titel, Version, Ägare, Datum, Status)
2. Syfte och Omfattning
3. Definitioner och Referenser
4. Roller och Ansvar
5. Policy/Standard/Process (huvudinnehåll)
6. Kontroller/Checklista (mätbara krav)
7. Underhåll och Ändringshantering
8. Revisionhistorik

## Metadata-format (front matter)
```yaml
---
title: "<Titel>"
status: draft | approved
author: <namn>
version: 1.0.0
last_updated: YYYY-MM-DD
---
```

## Filnamn och plats
- Aktiva dokument: `docs/<område>/<ämne>.md`
- Standarder/policys: `docs/standards/`
- Daterade/versionsstämplade dokument: `docs/legacy/<YYYY>/<MM>-<slug>/*.md`

## Kvalitetskrav
- UTF-8 (utf8mb4). Svenska tecken Å, Ä, Ö i exempel/testdata.
- Markdown-regler: MD022, MD032, MD031, MD040.
- Konsekventa semicolons i JavaScript och 2 spaces indentering.
- Använd template literals för strängar.

## Länkning
- Lägg till dokument i `docs/INDEX.md` via `npm run docs:index`.
- Tvärlänka relaterade dokument (ex. `docs/SECURITY.md`, `docs/security/security_checklist.md`).

## Granska
- Minst en peer review innan status "approved".
- Säkerhetsrelaterade dokument ska även granskas av säkerhetsansvarig.
