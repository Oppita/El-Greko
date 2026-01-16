import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isValidUrl = (url: string) => {
    try {
        return url.startsWith('http');
    } catch {
        return false;
    }
};

if (!isValidUrl(supabaseUrl) || !supabaseAnonKey || supabaseUrl.includes('YOUR_SUPABASE_URL')) {
    console.warn('Supabase URL or Anon Key is missing or invalid. Database features will be disabled.');
}

export const supabase = (isValidUrl(supabaseUrl) && supabaseAnonKey && !supabaseUrl.includes('YOUR_SUPABASE_URL'))
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null as any;
