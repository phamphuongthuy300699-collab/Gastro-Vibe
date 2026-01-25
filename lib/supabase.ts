import { createClient } from '@supabase/supabase-js';

// Safe access to environment variables.
// Use guard check (import.meta.env && ...) to prevent crash if env is undefined.
const supabaseUrl = (import.meta.env && import.meta.env.VITE_SUPABASE_URL) || 'https://klbpsnplbufsrmmpincy.supabase.co';
const supabaseAnonKey = (import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || 'sb_publishable_-vStPCKhyRycUtdyndUFPA_AvjjlDbE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);