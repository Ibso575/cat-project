import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const createEmptyQuery = () => ({
	select: async () => ({ data: [], error: null }),
	insert: async () => ({ data: null, error: null }),
	update: async () => ({ data: null, error: null }),
	upsert: async () => ({ data: null, error: null }),
	delete: async () => ({ data: null, error: null }),
	single: async () => ({ data: null, error: null }),
})

const createFallbackClient = () => ({
	from: () => createEmptyQuery(),
})

const hasSupabaseConfig = Boolean(supabaseUrl && supabaseKey)

if (!hasSupabaseConfig) {
	console.warn('Supabase env topilmadi: VITE_SUPABASE_URL va VITE_SUPABASE_ANON_KEY ni .env ga qo\'ying')
}

export const supabase = hasSupabaseConfig
	? createClient(supabaseUrl, supabaseKey)
	: createFallbackClient()