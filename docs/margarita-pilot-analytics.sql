-- Live pilot analytics schema currently deployed in Supabase project iviwccdyyvjrirgrbgsb.
-- This file documents the reproducible schema; it is not a Supabase CLI migration.

create table if not exists public.pilot_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_name text not null check (char_length(event_name) between 1 and 64),
  dish_id text,
  category_id text,
  session_id text,
  source text not null default 'web' check (char_length(source) <= 32),
  metadata jsonb not null default '{}'::jsonb check (octet_length(metadata::text) <= 4096)
);

alter table public.pilot_events enable row level security;

revoke all on table public.pilot_events from anon, authenticated;
grant insert on table public.pilot_events to anon, authenticated;
grant select, insert, update, delete on table public.pilot_events to service_role;

drop policy if exists "pilot events insert" on public.pilot_events;
create policy "pilot events insert"
on public.pilot_events
for insert
to anon, authenticated
with check (
  event_name in (
    'menu_open',
    'vibe_open',
    'vibe_item_view',
    'dish_open',
    'favorite_add',
    'favorite_remove',
    'category_open',
    'club_open',
    'story_open'
  )
);
