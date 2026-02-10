
-- 1. Create Profiles Table (Linked to Auth)
-- Эта таблица дублирует пользователей из auth.users, но в схеме public, 
-- чтобы мы могли добавлять туда игровые данные (XP, Level, и т.д.)

create table if not exists public.profiles (
  id uuid not null references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  
  -- Game Data
  total_xp integer default 0,
  level integer default 1,
  balance_gp integer default 0,
  lives_count integer default 3,
  
  -- Preferences (JSONB for flexibility)
  preferences jsonb default '{"spicyTolerance": 1, "isVegan": false, "avoidGluten": false, "avoidLactose": false}'::jsonb,
  
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Enable RLS
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- 3. Auto-create Profile Trigger
-- Эта функция срабатывает автоматически, когда новый юзер регистрируется через Auth (Telegram, Email и т.д.)

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, total_xp, level, balance_gp)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Гость'),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', ''),
    0, -- start xp
    1, -- start level
    500 -- start bonus GP
  );
  return new;
end;
$$;

-- Trigger definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
