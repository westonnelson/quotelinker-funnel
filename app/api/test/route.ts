import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function GET(request: Request) {
  try {
    console.log('Testing Supabase connection')
    console.log('Config:', { 
      hasUrl: !!supabaseUrl, 
      hasKey: !!supabaseAnonKey,
      url: supabaseUrl
    })

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // List all tables in the public schema
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')

    if (tablesError) {
      console.error('Error fetching tables:', tablesError)
      throw tablesError
    }

    // Try to query the leads table
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .limit(1)

    return NextResponse.json({ 
      success: true, 
      tables,
      hasLeadsTable: !leadsError,
      leadsError: leadsError ? {
        message: leadsError.message,
        details: leadsError.details,
        hint: leadsError.hint,
        code: leadsError.code
      } : null
    })
  } catch (error) {
    console.error('Test endpoint error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 