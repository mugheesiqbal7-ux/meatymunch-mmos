-- Lieferanten-Sortiment & Preise. Editierbar, aber nur durch Management (Inhaber).
-- Im Supabase SQL-Editor ausführen. Seed läuft nur, wenn die Tabelle leer ist.

create table if not exists public.supplier_products (
  id          uuid primary key default gen_random_uuid(),
  supplier    text not null,            -- 'aldi' | 'winters' | 'cc' | 'km'
  art_no      text,                     -- Artikelnummer (für den Bestell-Anruf)
  name        text not null,
  price_cents integer not null default 0,
  sort        integer not null default 0,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users(id)
);

alter table public.supplier_products enable row level security;

-- Lesen: alle eingeloggten Nutzer
drop policy if exists sp_select on public.supplier_products;
create policy sp_select on public.supplier_products for select
  using ( auth.uid() is not null );

-- Ändern/Anlegen/Löschen: nur Management
drop policy if exists sp_write on public.supplier_products;
create policy sp_write on public.supplier_products for all
  using ( public.current_app_role() = 'mgmt' )
  with check ( public.current_app_role() = 'mgmt' );

-- ---------- Seed (nur wenn Tabelle leer) ----------
insert into public.supplier_products (supplier, art_no, name, price_cents, sort)
select v.supplier, v.art_no, v.name, v.price_cents, v.sort
from (values
  -- C&C
  ('cc','485403','GEFLÜGELBRATWURST 5X100 G',870,1),
  ('cc','241343','CN BURGER BUN MIT SESAM 80 G',27,2),
  ('cc','603597','CN SALATMAYONNAISE 50 % 10 KG',2099,3),
  ('cc','268668','SALOMON CHILI-CHEESEBURGER-SAUCE 2L',1099,4),
  ('cc','363081','HEINZ BARBECUE-SAUCE 2,15 L',950,5),
  ('cc','299036','COOK BRAND CHILISAUCE SÜß HUHN 650ML',300,6),
  ('cc','789887','HEIDRICH FRITÜSEN-ÖL EW 10 L',1450,7),
  ('cc','623679','SALOMON PRIME MOZZARELLA-STICKS 1 KG',970,8),
  ('cc','443778','AVIKO SPICY JACKET WEDGES GEWÜRZT 2,5 KG',430,9),
  ('cc','294425','AVIKO ONION RINGS 16G 1KG',350,10),
  ('cc','291846','Frühlingsrollen',359,11),
  ('cc','290326','Jalapeños',450,12),
  ('cc','255948','HERMSEN MENUBOX DOPPELBURGER WS',1099,13),
  ('cc','4032048001905','HERMSEN SCHALE OVAL 10,5X17,5',799,14),
  ('cc','4019336116766','HERMSEN PAPPSCHALEN 13X18X3',1199,15),
  ('cc','10595','HERMSEN HOLZ POMMES GABELN',399,16),
  ('cc','818534','PAPSTAR BECHER',149,17),
  ('cc','818569','PAPSTAR DECKEL DRESSINGBECHER',99,18),
  ('cc','4002911115152','PAPSTAR HAMBURGERTÜTE MIT DRUCK',2200,19),
  ('cc','9002590250026','NATURALLY FINGER BAMBUS-SPIESSE',469,20),
  ('cc','885670','SALOMON BRIOCHE BURGER BUN',40,21),
  ('cc','374512','CN PFLANZENFETT UNGEHÄRTET BLOCK 10 KG',2100,22),
  ('cc','FR 1417','RED BULL WHITE EDITION KOKOS',110,23),
  -- Winters
  ('winters','1002','Pommes',1749,1),
  ('winters','2055','Rindwurst',2494,2),
  ('winters','3209','Hamburger Sesam Brot Winter',829,3),
  ('winters','1301','Ketchup',2190,4),
  ('winters','1490','Knoblauch Soße',900,5),
  ('winters','3775','Servietten',938,6),
  ('winters','0715/0716','Fuzetea',1069,7),
  ('winters','0740','Coca Cola',1454,8),
  -- ALDI (Einkaufsliste, ohne Artikelnummer)
  ('aldi',null,'Weizenbrötchen',19,1),
  ('aldi',null,'Schmelzscheiben',189,2),
  ('aldi',null,'Eisbergsalat',111,3),
  ('aldi',null,'Gurkentopf',159,4),
  ('aldi',null,'Passierte Tomaten (500g)',65,5)
) as v(supplier, art_no, name, price_cents, sort)
where not exists (select 1 from public.supplier_products);
