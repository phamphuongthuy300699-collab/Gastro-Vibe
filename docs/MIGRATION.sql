
-- 1. Create Modifier Groups Table
-- Stores "types" of modifiers (e.g., "Milk Options", "Steak Doneness")
create table if not exists modifier_groups (
  id uuid default gen_random_uuid() primary key,
  restaurant_id uuid references restaurants(id) on delete cascade not null,
  name text not null,
  min_selection integer default 0, -- 0 = optional, 1 = required
  max_selection integer default 1, -- 1 = radio button, >1 = checkboxes
  required boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Modifiers Table
-- Stores actual items (e.g., "Almond Milk", "Rare", "Extra Cheese")
create table if not exists modifiers (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references modifier_groups(id) on delete cascade not null,
  name text not null,
  price numeric default 0,
  is_available boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Link Table (Dish <-> Modifier Group)
-- Connects a dish to a group of modifiers (e.g., "Latte" uses "Milk Options")
create table if not exists dish_modifier_groups (
  dish_id uuid references dishes(id) on delete cascade not null,
  modifier_group_id uuid references modifier_groups(id) on delete cascade not null,
  sort_order integer default 0,
  primary key (dish_id, modifier_group_id)
);

-- 4. Enable RLS (Optional for now, but good practice)
alter table modifier_groups enable row level security;
alter table modifiers enable row level security;
alter table dish_modifier_groups enable row level security;

-- Allow public read access (for guest app)
create policy "Public read groups" on modifier_groups for select using (true);
create policy "Public read modifiers" on modifiers for select using (true);
create policy "Public read links" on dish_modifier_groups for select using (true);

-- Allow full access for anon/service role (for admin panel usage in this demo)
-- In production, strict policies apply to authenticated admins only.
create policy "Admin all groups" on modifier_groups using (true) with check (true);
create policy "Admin all modifiers" on modifiers using (true) with check (true);
create policy "Admin all links" on dish_modifier_groups using (true) with check (true);
