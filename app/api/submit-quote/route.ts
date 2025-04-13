/* eslint-disable no-console */
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

interface LeadData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  insurance_type: string;
  coverage_amount: string;
  term_length: string;
  tobacco_use: string;
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
        age: '',
        gender: leadData.gender,
        healthStatus: '',
        coverageAmount: leadData.coverage_amount,
        termLength: leadData.term_length,
        tobaccoUse: leadData.tobacco_use,
        occupation: 'Not Provided',
        annualIncome: '',
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
    const submissionData = body
    
    // Prepare lead data matching the exact table structure
    const data: LeadData = {
      first_name: submissionData.firstName || '',
      last_name: submissionData.lastName || '',
      email: submissionData.email || '',
      phone: submissionData.phone || '',
      date_of_birth: submissionData.dateOfBirth || '',
      gender: submissionData.gender || '',
      insurance_type: submissionData.insuranceType || '',
      coverage_amount: submissionData.coverageAmount || '',
      term_length: submissionData.termLength || '',
      tobacco_use: submissionData.tobaccoUse || '',
      source: submissionData.source || ''
    }

    // Insert into Supabase
    const { data: insertData, error: insertError } = await supabase
      .from('leads')
      .insert([data])
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
        <p><strong>Name:</strong> ${data.first_name} ${data.last_name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Date of Birth:</strong> ${data.date_of_birth}</p>
        <p><strong>Gender:</strong> ${data.gender}</p>
        <p><strong>Insurance Type:</strong> ${data.insurance_type}</p>
        <p><strong>Coverage Amount:</strong> $${data.coverage_amount}</p>
        <p><strong>Term Length:</strong> ${data.term_length} years</p>
        <p><strong>Tobacco Use:</strong> ${data.tobacco_use}</p>
        <p><strong>Source:</strong> ${data.source}</p>
      `
    )

    // Send confirmation email to lead
    if (data.email) {
      await sendEmail(
        data.email,
        'Your Quote Request Has Been Received',
        `
          <h2>Thank You for Your Quote Request</h2>
          <p>Dear ${data.first_name},</p>
          <p>We have received your quote request and will be in touch shortly with personalized options for your life insurance coverage.</p>
          <p>Here's a summary of your request:</p>
          <ul>
            <li>Insurance Type: ${data.insurance_type}</li>
            <li>Coverage Amount: $${data.coverage_amount}</li>
            <li>Term Length: ${data.term_length} years</li>
          </ul>
          <p>If you have any questions, please contact us at ${process.env.EMAIL_FROM}.</p>
          <p>Best regards,<br>The QuoteLinker Team</p>
        `
      )
    }

    // Send to Zapier for HubSpot integration
    await sendToZapier(data)

    // Track submission in GA4
    await trackEvent('quote_submitted', {
      source: data.source,
      insurance_type: data.insurance_type,
      coverage_amount: data.coverage_amount,
      term_length: data.term_length
    })

    return NextResponse.json({
      success: true,
      message: 'Quote request submitted successfully',
      data: insertData
    }, { headers: corsHeaders })

  } catch (error) {
    console.error('Error processing quote request:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500, headers: corsHeaders })
  }
} 