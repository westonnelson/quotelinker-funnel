import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

interface LeadData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  health_status: string;
  coverage_amount: string;
  term_length: string;
  tobacco_use: string;
  occupation: string;
  annual_income: string;
  source: string;
}

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
    
    // List all tables in the public schema
    const { data: tables, error: tablesError } = await supabase
      .from('leads')
      .select('count')
      .limit(1);

    if (tablesError) {
      console.error('Error testing connection:', tablesError);
      throw tablesError;
    }

    return NextResponse.json({ 
      success: true, 
      message: 'API is working',
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
const sendToZapier = async (leadData: LeadData) => {
  try {
    // Format data specifically for HubSpot integration via Zapier
    const zapierData = {
      leads: {
        firstName: leadData.first_name,
        lastName: leadData.last_name,
        email: leadData.email,
        phone: leadData.phone,
        age: leadData.age,
        gender: leadData.gender,
        healthStatus: leadData.health_status,
        coverageAmount: leadData.coverage_amount,
        termLength: leadData.term_length,
        tobaccoUse: leadData.tobacco_use,
        occupation: leadData.occupation,
        annualIncome: leadData.annual_income,
        source: leadData.source
      }
    }

    const res = await fetch(process.env.ZAPIER_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(zapierData),
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
const trackEvent = async (eventName: string, eventData: Record<string, unknown>) => {
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
    const submissionData = body.submissionData || body
    
    // Prepare lead data matching the exact table structure
    const leadData: LeadData = {
      first_name: submissionData.firstName || '',
      last_name: submissionData.lastName || '',
      email: submissionData.email || '',
      phone: submissionData.phone || '',
      age: submissionData.age || '',
      gender: submissionData.gender || '',
      health_status: submissionData.healthStatus || '',
      coverage_amount: submissionData.coverage || '',
      term_length: submissionData.termLength || '',
      tobacco_use: submissionData.tobaccoUse || 'no',
      occupation: submissionData.occupation || 'Not Provided',
      annual_income: submissionData.annualIncome || '',
      source: body.funnelType || 'term_life_quote_form'
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
        <p><strong>Name:</strong> ${leadData.first_name} ${leadData.last_name}</p>
        <p><strong>Email:</strong> ${leadData.email}</p>
        <p><strong>Phone:</strong> ${leadData.phone}</p>
        <p><strong>Age:</strong> ${leadData.age}</p>
        <p><strong>Gender:</strong> ${leadData.gender}</p>
        <p><strong>Health Status:</strong> ${leadData.health_status}</p>
        <p><strong>Coverage Amount:</strong> ${leadData.coverage_amount}</p>
        <p><strong>Term Length:</strong> ${leadData.term_length}</p>
        <p><strong>Tobacco Use:</strong> ${leadData.tobacco_use}</p>
        <p><strong>Occupation:</strong> ${leadData.occupation}</p>
        <p><strong>Annual Income:</strong> ${leadData.annual_income}</p>
        <p><strong>Source:</strong> ${leadData.source}</p>
      `
    )

    // Send confirmation email to lead
    if (leadData.email) {
      await sendEmail(
        leadData.email,
        'Your Quote Request Has Been Received',
        `
          <h2>Thank You for Your Quote Request</h2>
          <p>Dear ${leadData.first_name},</p>
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
      source: leadData.source,
      coverage_amount: leadData.coverage_amount,
      term_length: leadData.term_length
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