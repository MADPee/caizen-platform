# 📁 Security Docs

Denna katalog samlar praktiska säkerhetsartefakter som används i utveckling och drift.

## Struktur
- `security_checklist.md`: Huvudchecklista (ISO-inriktad) för säkerhetskrav
- `SECURITY_CHECKLIST_TEMPLATE.md`: Mall för säkerhetsgranskning vid features/releases (valfri)

## Användning
1. Använd `security_checklist.md` som referens vid design/PR/release.
2. Vid specifika features kan mallen kopieras till `YYYY-MM-DD_feature-security-checklist.md`.
3. Länka dokument i PR-beskrivningen och uppdatera `CHANGELOG.md`.

## Principer
- Allt material ska vara UTF-8 (utf8mb4). 
- Testdata måste innehålla Å, Ä, Ö.
- Följ `docs/SECURITY.md` och OWASP Top 10.
 - Följ ISO-inriktad mall i `docs/standards/DOCUMENTATION_STANDARD.md` (se nedan).

## Standarder
- Dokumentationsstandard (ISO-inriktad): `../standards/DOCUMENTATION_STANDARD.md`
- Arkiveringspolicy (daterade dokument): `../standards/ARCHIVING_POLICY.md`


