
-- 1. Disable RLS temporarily to clean up policies (clean slate)
alter table restaurants disable row level security;
alter table categories disable row level security;
alter table dishes disable row level security;
alter table modifier_groups disable row level security;
alter table modifiers disable row level security;
alter table dish_modifier_groups disable row level security;
alter table order_items disable row level security;

-- 2. Drop existing policies to avoid conflicts
drop policy if exists "Enable read access for all users" on restaurants;
drop policy if exists "Enable read access for all users" on categories;
drop policy if exists "Enable read access for all users" on dishes;
drop policy if exists "Public read groups" on modifier_groups;
drop policy if exists "Public read modifiers" on modifiers;
drop policy if exists "Public read links" on dish_modifier_groups;
-- Drop any admin policies you might have created
drop policy if exists "Admin all groups" on modifier_groups;
drop policy if exists "Admin all modifiers" on modifiers;
drop policy if exists "Admin all links" on dish_modifier_groups;

-- 3. Re-enable RLS
alter table restaurants enable row level security;
alter table categories enable row level security;
alter table dishes enable row level security;
alter table modifier_groups enable row level security;
alter table modifiers enable row level security;
alter table dish_modifier_groups enable row level security;
alter table order_items enable row level security;

-- 4. Create "Permissive" Policies for Anon/Public (For Development Mode)
-- CAUTION: This allows anyone with your anon key to Insert/Update/Delete. 
-- In production, you would wrap this in `to authenticated` or check a specific role.

create policy "Public Access Restaurants" on restaurants for all using (true) with check (true);
create policy "Public Access Categories" on categories for all using (true) with check (true);
create policy "Public Access Dishes" on dishes for all using (true) with check (true);
create policy "Public Access Groups" on modifier_groups for all using (true) with check (true);
create policy "Public Access Modifiers" on modifiers for all using (true) with check (true);
create policy "Public Access DishModifiers" on dish_modifier_groups for all using (true) with check (true);
create policy "Public Access Orders" on order_items for all using (true) with check (true);

-- 5. Ensure Foreign Keys have CASCADE DELETE
-- This ensures that deleting a category deletes its dishes, etc.
-- Note: You might need to drop constraint first if it exists without cascade, 
-- but normally pure deletions are handled by the app logic in order. 
-- The app logic deletes children first, so strict FK is fine, provided permissions allow it.
