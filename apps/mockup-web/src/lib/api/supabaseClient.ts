import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = (() => {
  if (!url || !anon) {
    console.warn('Supabase env not set (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)');
  }
  return createClient(url || '', anon || '');
})();
