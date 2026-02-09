
-- SQL SCRIPT: CREATE ADMIN USER (FIXED)
-- Run this in Supabase SQL Editor to fix the "Database error querying schema" / "not-null constraint" error.

-- 1. CLEANUP (Remove existing admin to avoid conflicts)
DELETE FROM auth.identities WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'ad@min.com');
DELETE FROM auth.users WHERE email = 'ad@min.com';

-- 2. CREATE USER & IDENTITY
-- Using DO block to share variables
DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
  new_identity_id uuid := gen_random_uuid();
BEGIN
  -- Insert into auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    'ad@min.com',
    crypt('admin', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"role": "admin"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  -- Insert into auth.identities
  -- FIX: Includes 'provider_id' which is required in newer Supabase versions
  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    new_identity_id,
    new_user_id,
    new_user_id::text, -- provider_id is the user_id for email auth
    format('{"sub": "%s", "email": "ad@min.com"}', new_user_id::text)::jsonb,
    'email',
    now(),
    now(),
    now()
  );
END $$;
