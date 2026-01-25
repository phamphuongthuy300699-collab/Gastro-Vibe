
-- 1. Reset Policies again to be clean
drop policy if exists "Admin All Restaurants" on restaurants;
drop policy if exists "Admin All Categories" on categories;
drop policy if exists "Admin All Dishes" on dishes;
drop policy if exists "Admin All Groups" on modifier_groups;
drop policy if exists "Admin All Modifiers" on modifiers;
drop policy if exists "Admin All Links" on dish_modifier_groups;
drop policy if exists "Admin All Orders" on order_items;

-- 2. Define the Admin Check Logic
-- We check if the user's JWT metadata contains "role": "admin"

-- Restaurants
create policy "RBAC Admin Restaurants" on restaurants for all to authenticated 
using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Categories
create policy "RBAC Admin Categories" on categories for all to authenticated 
using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Dishes
create policy "RBAC Admin Dishes" on dishes for all to authenticated 
using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Modifiers
create policy "RBAC Admin Groups" on modifier_groups for all to authenticated 
using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

create policy "RBAC Admin Modifiers" on modifiers for all to authenticated 
using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

create policy "RBAC Admin Links" on dish_modifier_groups for all to authenticated 
using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Orders (Admins can delete/edit any order, Users can only create)
create policy "RBAC Admin Orders" on order_items for all to authenticated 
using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');
