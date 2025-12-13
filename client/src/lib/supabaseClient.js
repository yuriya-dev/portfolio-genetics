import { createClient } from '@supabase/supabase-js'

// Pastikan Anda sudah mengisi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)