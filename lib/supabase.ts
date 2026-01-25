import { createClient } from '@supabase/supabase-js';

// Access environment variables safely using Vite's standard object
// We cast import.meta to any to avoid TypeScript errors if vite/client types are missing
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://klbpsnplbufsrmmpincy.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_-vStPCKhyRycUtdyndUFPA_AvjjlDbE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);