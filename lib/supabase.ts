import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Lead = {
  id?: string
  first_name: string
  last_name: string
  email: string
  phone: string
  age: number
  gender: string
  coverage_amount: number
  term_length: number
  health_status: string
  created_at?: string
}