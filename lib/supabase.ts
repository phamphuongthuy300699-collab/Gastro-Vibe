import { createClient } from '@supabase/supabase-js';

// Access environment variables safely using Vite's standard object
// We use optional chaining (?.) to avoid crashes if import.meta.env is undefined
const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://klbpsnplbufsrmmpincy.supabase.co';
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_-vStPCKhyRycUtdyndUFPA_AvjjlDbE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);