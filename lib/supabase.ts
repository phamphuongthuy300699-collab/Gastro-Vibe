import { createClient } from '@supabase/supabase-js';

// Safe access to environment variables.
// Use guard check (import.meta.env && ...) to prevent crash if env is undefined.
const supabaseUrl = (import.meta.env && import.meta.env.VITE_SUPABASE_URL) || 'https://iviwccdyyvjrirgrbgsb.supabase.co';
const supabaseAnonKey = (import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || 'sb_publishable_uJ4U78L-R71idAaaqX5rOg_4eSN0zG4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);