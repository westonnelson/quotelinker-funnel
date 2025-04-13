/* eslint-disable no-console */
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    console.log('Testing Supabase connection');
    console.log('Supabase config:', {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    });

    // Try to query the leads table directly
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .limit(1);

    if (leadsError) {
      console.error('Error querying leads table:', leadsError);
      return NextResponse.json({ 
        success: false, 
        error: leadsError.message,
        phase: 'query_leads',
        details: leadsError
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection working',
      leads
    });

  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error : undefined
    });
  }
} 