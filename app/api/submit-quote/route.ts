import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// Test endpoint
export async function GET() {
  try {
    console.log('Testing Supabase connection');
    console.log('Supabase config:', {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    });
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('_prisma_migrations')
      .select('*')
      .limit(1);

    if (testError) {
      console.error('Basic connection test error:', testError);
      throw testError;
    }

    console.log('Basic connection successful');

    // List all tables in the public schema
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
      throw tablesError;
    }

    console.log('Available tables:', tables);

    // Test leads table if it exists
    const { data: leadsCount, error: leadsError } = await supabase
      .from('leads')
      .select('count')
      .limit(1);

    if (leadsError) {
      console.error('Error testing leads table:', leadsError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'API is working',
      supabase: 'connected',
      tables,
      leadsCount,
      config: {
        hasResendKey: !!process.env.RESEND_API_KEY,
        hasZapierWebhook: !!process.env.ZAPIER_WEBHOOK_URL,
        hasSupportEmail: !!process.env.SUPPORT_EMAIL,
      }
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('API test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error : undefined,
      config: {
        hasResendKey: !!process.env.RESEND_API_KEY,
        hasZapierWebhook: !!process.env.ZAPIER_WEBHOOK_URL,
        hasSupportEmail: !!process.env.SUPPORT_EMAIL,
      }
    }, { headers: corsHeaders });
  }
}

// Send email using Resend
const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject,
      html,
    })
    return result
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

// Send data to Zapier webhook
const sendToZapier = async (data: any) => {
  try {
    const res = await fetch(process.env.ZAPIER_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    
    if (!res.ok) {
      throw new Error(`Zapier webhook failed: ${res.statusText}`)
    }
    
    return await res.json()
  } catch (error) {
    console.error('Error sending to Zapier:', error)
    throw error
  }
}

// Track event in GA4
const trackEvent = async (eventName: string, eventData: any) => {
  try {
    await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.NEXT_PUBLIC_GA4_ID}&api_secret=${process.env.GA4_API_SECRET}`, {
      method: 'POST',
      body: JSON.stringify({
        client_id: 'server_api',
        events: [{
          name: eventName,
          params: eventData
        }]
      })
    })
  } catch (error) {
    console.error('Error tracking GA4 event:', error)
  }
}

// Main submission endpoint
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Prepare lead data with dynamic fields
    const leadData = {
      funnel_type: body.funnelType || 'term_life',
      submission_data: body.submissionData || body, // Store all form fields in JSONB
      submitted_at: new Date().toISOString(),
      utm_data: body.utmData || null,
      status: 'new',
      notes: null
    }

    // Insert into Supabase
    const { data, error: insertError } = await supabase
      .from('leads')
      .insert([leadData])
      .select()

    if (insertError) {
      console.error('Error inserting lead:', insertError)
      return NextResponse.json({ 
        success: false, 
        error: insertError.message 
      }, { status: 500, headers: corsHeaders })
    }

    // Send notification email to admin
    await sendEmail(
      process.env.EMAIL_TO!,
      'New Quote Request',
      `
        <h2>New Quote Request Received</h2>
        <p><strong>Funnel Type:</strong> ${leadData.funnel_type}</p>
        <pre>${JSON.stringify(leadData.submission_data, null, 2)}</pre>
        ${leadData.utm_data ? `<p><strong>UTM Data:</strong> ${JSON.stringify(leadData.utm_data, null, 2)}</p>` : ''}
      `
    )

    // Send confirmation email to lead
    if (leadData.submission_data.email) {
      await sendEmail(
        leadData.submission_data.email,
        'Your Quote Request Has Been Received',
        `
          <h2>Thank You for Your Quote Request</h2>
          <p>Dear ${leadData.submission_data.firstName},</p>
          <p>We have received your quote request and will be in touch shortly with personalized options for your life insurance coverage.</p>
          <p>If you have any questions, please contact us at ${process.env.EMAIL_TO}.</p>
          <p>Best regards,<br>The QuoteLinker Team</p>
        `
      )
    }

    // Send to Zapier for HubSpot integration
    await sendToZapier(leadData)

    // Track submission in GA4
    await trackEvent('quote_submitted', {
      funnel_type: leadData.funnel_type,
      ...leadData.utm_data
    })

    return NextResponse.json({
      success: true,
      message: 'Quote request submitted successfully',
      data
    }, { headers: corsHeaders })

  } catch (error) {
    console.error('Error processing quote request:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500, headers: corsHeaders })
  }
} 