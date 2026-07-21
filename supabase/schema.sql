-- MeatyMunch MMOS — Datenbank-Schema + Sicherheitsregeln (Row Level Security)
-- Im Supabase SQL-Editor einfügen und "Run" klicken. Idempotent (mehrfach ausführbar).

-- ============================================================
-- Rollen-Enum + Profil-Tabelle
-- ============================================================
do $$ begin
  create type app_role as enum ('ma', 'sl', 'mgmt');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     text unique not null,
  display_name text not null default '',
  role         app_role not null default 'ma',
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

-- Rolle des aktuell eingeloggten Nutzers ermitteln (SECURITY DEFINER umgeht RLS -> keine Rekursion)
create or replace function public.current_app_role()
returns app_role
language sql stable security definer set search_path = public
as $$ select role from public.profiles where id = auth.uid() $$;

-- Beim Anlegen eines auth-Users automatisch eine Profilzeile erzeugen
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', ''),
    coalesce((new.raw_user_meta_data->>'role')::app_role, 'ma')
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Fortschritts- & Betriebstabellen
-- ============================================================
create table if not exists public.checklist_checks (
  user_id    uuid not null references auth.users(id) on delete cascade,
  check_key  text not null,               -- z. B. 'oeffnen:a' oder 'rez_classic_3'
  checked_at timestamptz not null default now(),
  primary key (user_id, check_key)
);

create table if not exists public.module_progress (
  user_id   uuid not null references auth.users(id) on delete cascade,
  module_id text not null,                -- z. B. 'm1'
  done_at   timestamptz not null default now(),
  primary key (user_id, module_id)
);

create table if not exists public.temp_logs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  station    text not null,
  value      numeric not null,
  ok         boolean not null,
  created_at timestamptz not null default now()
);

create table if not exists public.reports (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  text       text not null,
  severity   text not null default 'neu',
  created_at timestamptz not null default now()
);

create table if not exists public.sick_notes (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  from_date  date not null,
  to_date    date,
  reason     text,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  item_name  text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- RLS aktivieren
-- ============================================================
alter table public.profiles         enable row level security;
alter table public.checklist_checks enable row level security;
alter table public.module_progress  enable row level security;
alter table public.temp_logs        enable row level security;
alter table public.reports          enable row level security;
alter table public.sick_notes       enable row level security;
alter table public.orders           enable row level security;

-- ---------- profiles ----------
-- Lesen: eigenes Profil, oder sl/mgmt sehen alle
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select
  using ( id = auth.uid() or public.current_app_role() in ('sl','mgmt') );
-- Schreiben passiert ausschließlich über den Trigger bzw. die Edge Function (service_role, umgeht RLS).

-- ---------- Helper-Makro-Ersatz: pro Tabelle dieselben drei Muster ----------
-- checklist_checks
drop policy if exists cc_select on public.checklist_checks;
create policy cc_select on public.checklist_checks for select
  using ( user_id = auth.uid() or public.current_app_role() in ('sl','mgmt') );
drop policy if exists cc_insert on public.checklist_checks;
create policy cc_insert on public.checklist_checks for insert
  with check ( user_id = auth.uid() );
drop policy if exists cc_delete on public.checklist_checks;
create policy cc_delete on public.checklist_checks for delete
  using ( user_id = auth.uid() );

-- module_progress
drop policy if exists mp_select on public.module_progress;
create policy mp_select on public.module_progress for select
  using ( user_id = auth.uid() or public.current_app_role() in ('sl','mgmt') );
drop policy if exists mp_insert on public.module_progress;
create policy mp_insert on public.module_progress for insert
  with check ( user_id = auth.uid() );
drop policy if exists mp_delete on public.module_progress;
create policy mp_delete on public.module_progress for delete
  using ( user_id = auth.uid() );

-- temp_logs
drop policy if exists tl_select on public.temp_logs;
create policy tl_select on public.temp_logs for select
  using ( user_id = auth.uid() or public.current_app_role() in ('sl','mgmt') );
drop policy if exists tl_insert on public.temp_logs;
create policy tl_insert on public.temp_logs for insert
  with check ( user_id = auth.uid() );

-- reports
drop policy if exists rp_select on public.reports;
create policy rp_select on public.reports for select
  using ( user_id = auth.uid() or public.current_app_role() in ('sl','mgmt') );
drop policy if exists rp_insert on public.reports;
create policy rp_insert on public.reports for insert
  with check ( user_id = auth.uid() );

-- sick_notes
drop policy if exists sn_select on public.sick_notes;
create policy sn_select on public.sick_notes for select
  using ( user_id = auth.uid() or public.current_app_role() in ('sl','mgmt') );
drop policy if exists sn_insert on public.sick_notes;
create policy sn_insert on public.sick_notes for insert
  with check ( user_id = auth.uid() );

-- orders
drop policy if exists or_select on public.orders;
create policy or_select on public.orders for select
  using ( user_id = auth.uid() or public.current_app_role() in ('sl','mgmt') );
drop policy if exists or_insert on public.orders;
create policy or_insert on public.orders for insert
  with check ( user_id = auth.uid() );
