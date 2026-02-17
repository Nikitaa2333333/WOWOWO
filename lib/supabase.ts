import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Инициализируем только если есть URL, чтобы не ломать приложение при сборке
export const supabase = supabaseUrl
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
