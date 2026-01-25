import { createClient } from '@supabase/supabase-js';

// Safe access to environment variables to prevent runtime crashes if import.meta.env is undefined
const getEnvVar = (key: string, fallback: string): string => {
  try {
    if (typeof import.meta.env !== 'undefined' && import.meta.env[key]) {
      return import.meta.env[key];
    }
  } catch (e) {
    // Fallback if accessing import.meta throws error
  }
  return fallback;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'https://klbpsnplbufsrmmpincy.supabase.co');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY', 'sb_publishable_-vStPCKhyRycUtdyndUFPA_AvjjlDbE');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);