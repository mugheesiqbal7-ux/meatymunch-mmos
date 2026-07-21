-- Zeiterfassung (Stempeluhr): Arbeitszeiten + Pausen. Im SQL-Editor ausführen.
create table if not exists public.time_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  clock_in timestamptz not null default now(),
  clock_out timestamptz,
  created_at timestamptz not null default now()
);
create table if not exists public.break_entries (
  id uuid primary key default gen_random_uuid(),
  time_entry_id uuid not null references public.time_entries(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  break_start timestamptz not null default now(),
  break_end timestamptz
);
alter table public.time_entries enable row level security;
alter table public.break_entries enable row level security;

drop policy if exists te_select on public.time_entries;
create policy te_select on public.time_entries for select
  using ( user_id = auth.uid() or public.current_app_role() in ('sl','mgmt') );
drop policy if exists te_insert on public.time_entries;
create policy te_insert on public.time_entries for insert with check ( user_id = auth.uid() );
drop policy if exists te_update on public.time_entries;
create policy te_update on public.time_entries for update using ( user_id = auth.uid() );

drop policy if exists be_select on public.break_entries;
create policy be_select on public.break_entries for select
  using ( user_id = auth.uid() or public.current_app_role() in ('sl','mgmt') );
drop policy if exists be_insert on public.break_entries;
create policy be_insert on public.break_entries for insert with check ( user_id = auth.uid() );
drop policy if exists be_update on public.break_entries;
create policy be_update on public.break_entries for update using ( user_id = auth.uid() );
