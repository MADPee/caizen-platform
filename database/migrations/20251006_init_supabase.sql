-- CaiZen initial Supabase schema with RLS
-- Note: Run in a Supabase Postgres project. auth schema is managed by Supabase.

create extension if not exists pgcrypto;

-- Profiles (maps to auth.users)
create table if not exists public.profiles (
	id uuid primary key references auth.users(id) on delete cascade,
	email text,
	created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "profiles_owner_select"
	on public.profiles for select
	using (id = auth.uid());
create policy "profiles_owner_upsert"
	on public.profiles for insert with check (id = auth.uid());
create policy "profiles_owner_update"
	on public.profiles for update using (id = auth.uid());

-- Vehicles owned by a user
create table if not exists public.vehicles (
	id uuid primary key default gen_random_uuid(),
	owner_id uuid not null references auth.users(id) on delete cascade,
	vin text,
	registration text,
	make text,
	model text,
	year int,
	created_at timestamptz not null default now()
);
create index if not exists vehicles_owner_idx on public.vehicles(owner_id);
create index if not exists vehicles_vin_idx on public.vehicles(vin);

alter table public.vehicles enable row level security;
create policy "vehicles_owner_all"
	on public.vehicles for all
	using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Service events per vehicle
create table if not exists public.service_events (
	id uuid primary key default gen_random_uuid(),
	owner_id uuid not null references auth.users(id) on delete cascade,
	vehicle_id uuid not null references public.vehicles(id) on delete cascade,
	event_date date not null,
	odo_km int,
	summary text,
	created_at timestamptz not null default now()
);
create index if not exists service_events_vehicle_idx on public.service_events(vehicle_id);
create index if not exists service_events_owner_idx on public.service_events(owner_id);

alter table public.service_events enable row level security;
create policy "events_owner_all"
	on public.service_events for all
	using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Inspection results (1:1 with service_event when type is inspection)
create table if not exists public.inspection_results (
	event_id uuid primary key references public.service_events(id) on delete cascade,
	co_idle numeric,
	co_2500 numeric,
	hc_idle int,
	lambda numeric,
	o2 numeric,
	co2 numeric,
	nox int,
	opacity numeric,
	brake_fl int,
	brake_fr int,
	brake_rl int,
	brake_rr int,
	brake_parking int,
	brake_fl_kn numeric,
	brake_fr_kn numeric,
	brake_rl_kn numeric,
	brake_rr_kn numeric,
	brake_parking_kn numeric,
	weight_kg int,
	result text,
	notes text
);

alter table public.inspection_results enable row level security;
create policy "inspection_owner_all"
	on public.inspection_results for all
	using (exists (
		select 1 from public.service_events e
		where e.id = inspection_results.event_id and e.owner_id = auth.uid()
	)) with check (exists (
		select 1 from public.service_events e
		where e.id = inspection_results.event_id and e.owner_id = auth.uid()
	));

-- OCR tasks tracking (optional)
create table if not exists public.ocr_tasks (
	id uuid primary key default gen_random_uuid(),
	owner_id uuid not null references auth.users(id) on delete cascade,
	file_name text,
	status text not null default 'pending',
	document_type text,
	confidence numeric,
	extracted_data jsonb,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);
create index if not exists ocr_tasks_owner_idx on public.ocr_tasks(owner_id);

alter table public.ocr_tasks enable row level security;
create policy "ocr_tasks_owner_all"
	on public.ocr_tasks for all
	using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Helpful view combining event + inspection results
create view if not exists public.v_inspections as
select e.id as event_id,
       e.vehicle_id,
       e.event_date,
       e.odo_km,
       r.*
from public.service_events e
left join public.inspection_results r on r.event_id = e.id;

comment on view public.v_inspections is 'Join of service_events and inspection_results';

-- Default grants (postgrest relies on anon/auth roles); RLS governs access
grant usage on schema public to anon, authenticated;
grant select on public.v_inspections to anon, authenticated;
