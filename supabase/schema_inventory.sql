-- Inventur-Artikel (Bestand + MIN/MAX). Editierbar durch Management.
create table if not exists public.inventory_items (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  min_qty     numeric not null default 0,
  max_qty     numeric not null default 0,
  current_qty numeric not null default 0,
  sort        integer not null default 0,
  updated_at  timestamptz not null default now()
);
alter table public.inventory_items enable row level security;

drop policy if exists inv_select on public.inventory_items;
create policy inv_select on public.inventory_items for select using ( auth.uid() is not null );
drop policy if exists inv_write on public.inventory_items;
create policy inv_write on public.inventory_items for all
  using ( public.current_app_role() = 'mgmt' ) with check ( public.current_app_role() = 'mgmt' );

insert into public.inventory_items (name, min_qty, max_qty, current_qty, sort)
select v.name, v.min_qty, v.max_qty, v.current_qty, v.sort from (values
  ('Buns (80 g)',120,400,90,1),
  ('Smash Patties (110 g)',150,500,420,2),
  ('Cheddar Käse',80,250,70,3),
  ('Gurken (Eimer)',4,12,5,4),
  ('Tomaten (kg)',6,20,15,5),
  ('Eisbergsalat (Kopf)',8,25,8,6),
  ('Currysoße (L)',5,18,12,7),
  ('Pommes TK (kg)',20,60,18,8)
) as v(name, min_qty, max_qty, current_qty, sort)
where not exists (select 1 from public.inventory_items);
