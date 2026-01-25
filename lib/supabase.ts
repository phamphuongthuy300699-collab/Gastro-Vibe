import { createClient } from '@supabase/supabase-js';

// We prioritize environment variables, but fall back to the provided credentials.
// This allows the app to connect to your specific Supabase instance immediately.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://klbpsnplbufsrmmpincy.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_-vStPCKhyRycUtdyndUFPA_AvjjlDbE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
