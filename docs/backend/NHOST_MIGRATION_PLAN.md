# NHOST Migration Plan (Supabase → Nhost)

Datum: 2025-09-29
Ägare: Platform/Architecture
Status: Planerad (ej startad)
Tidsfönster: 4–8 veckor (efter MVP)

## Mål

- Bibehålla funktionalitet och säkerhetsgarantier vid byte av backend
- Minimera produktionsrisk med stegvis, mätbar migrering
- Möjliggöra snabb rollback

## Omfattning

- Auth, DB (CRUD), Storage, Realtime/Subscriptions, Functions
- Paritet med befintliga features (vehicles, fuel entries, marketplace)

## Förutsättningar

- MVP i produktion på Supabase
- CI/CD på plats
- Backend-adapter-interface etablerat (BackendClient)

## Milstolpar

1. Förberedelser (1–2 veckor)

- [ ] Skapa Nhost-projekt (EU-region) och DPA
- [ ] Upprätta GraphQL/Hasura konsol
- [ ] Importera schema (Postgres-compat) och seeds
- [ ] Sätta upp Auth (email/password, magic link)
- [ ] Storage buckets och policies
- [ ] Sentry + loggning

2. Adapter & Paritet (1–2 veckor)

- [ ] Implementera `NhostBackendClient`
- [ ] GraphQL Codegen + typer
- [ ] CRUD-paritet: vehicles, fuel_entries, marketplace
- [ ] Storage: upload/download/signedUrl/list
- [ ] Subscriptions (Hasura)
- [ ] Functions (serverless/Actions)

3. Kontrakttester & CI (1 vecka)

- [ ] Kontrakttest mot `BackendClient` körs mot Supabase och Nhost (matrix)
- [ ] Regressions-mätare (tider/felkoder)
- [ ] Säkerhetstester (RLS/claims-paritet)

4. Data Migrering (1–2 veckor)

- [ ] Export från Supabase (CSV/SQL)
- [ ] Transform (kompatibla kolumner, enum-paritet)
- [ ] Import till Nhost
- [ ] Verifiera checksums/antal rader

5. Skuggdrift & Cutover (1 vecka)

- [ ] Feature flagg `VITE_BACKEND_PROVIDER=nhost` på staging
- [ ] Skuggdrift: skriv till båda, läs från Supabase
- [ ] Monitorera differenser
- [ ] Cutover: läs/skriv Nhost
- [ ] Retention plan för Supabase

## Risker & Mitigering

- Skillnader i Auth-claims (Hasura vs GoTrue) → Claim-mappning i adapter + tester
- GraphQL överfetch/underfetch → Codegen + fragment
- Kostnader/kvoter → budgetvakt + larm
- Realtime semantics → event-kontrakt och replay-tests

## Branch-strategi

- Skapa `feature/nhost-adapter` för implementation
- `develop` fortsätter på Supabase
- Merge via PR med kontrakttester gröna för båda providers

## Miljövariabler

- VITE_BACKEND_PROVIDER=supabase|nhost
- NHOST_SUBDOMAIN, NHOST_REGION, NHOST_GRAPHQL_URL, NHOST_AUTH_URL
- SUPABASE_URL, SUPABASE_ANON_KEY (legacy under migration)

## Checklista DoD

- [ ] Alla kontrakttester gröna i CI matrix
- [ ] Prestanda inom ±20% mot Supabase
- [ ] Säkerhetspolicys verifierade (RLS/permissions)
- [ ] Rollback-plan dokumenterad och testad
