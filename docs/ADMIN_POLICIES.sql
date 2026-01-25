
-- 1. Enable RLS on all tables (Safety first)
alter table restaurants enable row level security;
alter table categories enable row level security;
alter table dishes enable row level security;
alter table modifier_groups enable row level security;
alter table modifiers enable row level security;
alter table dish_modifier_groups enable row level security;
alter table order_items enable row level security;

-- 2. Clean up old policies to avoid conflicts
drop policy if exists "Public Access Restaurants" on restaurants;
drop policy if exists "Public Access Categories" on categories;
drop policy if exists "Public Access Dishes" on dishes;
drop policy if exists "Public Access Groups" on modifier_groups;
drop policy if exists "Public Access Modifiers" on modifiers;
drop policy if exists "Public Access DishModifiers" on dish_modifier_groups;
drop policy if exists "Public Access Orders" on order_items;

-- 3. CREATE READ POLICIES (Allow everyone/guests to SEE the menu)
create policy "Public Read Restaurants" on restaurants for select using (true);
create policy "Public Read Categories" on categories for select using (true);
create policy "Public Read Dishes" on dishes for select using (true);
create policy "Public Read Groups" on modifier_groups for select using (true);
create policy "Public Read Modifiers" on modifiers for select using (true);
create policy "Public Read DishModifiers" on dish_modifier_groups for select using (true);
-- Orders usually need to be read by the creator, but for this demo we allow public read/create
create policy "Public Read Orders" on order_items for select using (true);
create policy "Public Create Orders" on order_items for insert with check (true);

-- 4. CREATE ADMIN WRITE POLICIES (Allow ONLY authenticated users to Edit/Delete)
-- The "to authenticated" clause ensures only logged-in users can execute these.

-- Restaurants
create policy "Admin All Restaurants" on restaurants for all to authenticated using (true) with check (true);

-- Categories
create policy "Admin All Categories" on categories for all to authenticated using (true) with check (true);

-- Dishes
create policy "Admin All Dishes" on dishes for all to authenticated using (true) with check (true);

-- Modifiers
create policy "Admin All Groups" on modifier_groups for all to authenticated using (true) with check (true);
create policy "Admin All Modifiers" on modifiers for all to authenticated using (true) with check (true);
create policy "Admin All Links" on dish_modifier_groups for all to authenticated using (true) with check (true);

-- Orders cleanup
create policy "Admin All Orders" on order_items for all to authenticated using (true) with check (true);
