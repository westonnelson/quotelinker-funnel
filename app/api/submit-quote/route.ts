import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const zapierWebhookUrl = process.env.ZAPIER_WEBHOOK_URL
const resendApiKey = process.env.RESEND_API_KEY

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
    
    // Try to query the leads table
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Supabase test error:', error)
      throw error
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection successful',
      data 
    }, { headers: corsHeaders })
  } catch (error) {
    console.error('Test endpoint error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500,
      headers: corsHeaders
    })
  }
}

export async function POST(request: Request) {
  try {
    console.log('Starting submit-quote API route')
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log('Supabase client created')

    const formData = await request.json()
    console.log('Received form data:', formData)

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'age', 'gender', 'healthStatus', 'coverageAmount', 'termLength']
    for (const field of requiredFields) {
      if (!formData[field]) {
        throw new Error(`Missing required field: ${field}`)
      }
    }

    const leadData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      age: parseInt(formData.age, 10),
      gender: formData.gender,
      health_status: formData.healthStatus,
      coverage_amount: parseInt(formData.coverageAmount, 10),
      term_length: parseInt(formData.termLength, 10),
      tobacco_use: formData.tobaccoUse || false,
      occupation: formData.occupation || null,
      annual_income: formData.annualIncome ? parseInt(formData.annualIncome, 10) : null,
      source: 'term_life_quote_form',
      created_at: new Date().toISOString()
    }

    console.log('Mapped lead data:', leadData)

    console.log('Attempting to insert into Supabase...')
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()

    if (error) {
      console.error('Supabase error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }

    console.log('Successfully inserted lead:', data)

    // Send to Zapier if webhook URL is configured
    if (zapierWebhookUrl) {
      try {
        const zapierResponse = await fetch(zapierWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(leadData),
        })
        
        if (!zapierResponse.ok) {
          console.error('Zapier webhook error:', await zapierResponse.text())
        }
      } catch (zapierError) {
        console.error('Failed to send to Zapier:', zapierError)
      }
    }

    // Send notification email if Resend is configured
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey)
        await resend.emails.send({
          from: 'notifications@quotelinker.com',
          to: 'admin@quotelinker.com',
          subject: 'New Term Life Quote Request',
          html: `
            <h2>New Term Life Quote Request</h2>
            <p><strong>Name:</strong> ${leadData.first_name} ${leadData.last_name}</p>
            <p><strong>Email:</strong> ${leadData.email}</p>
            <p><strong>Phone:</strong> ${leadData.phone}</p>
            <p><strong>Age:</strong> ${leadData.age}</p>
            <p><strong>Gender:</strong> ${leadData.gender}</p>
            <p><strong>Health Status:</strong> ${leadData.health_status}</p>
            <p><strong>Coverage Amount:</strong> $${leadData.coverage_amount.toLocaleString()}</p>
            <p><strong>Term Length:</strong> ${leadData.term_length} years</p>
            <p><strong>Tobacco Use:</strong> ${leadData.tobacco_use ? 'Yes' : 'No'}</p>
            <p><strong>Occupation:</strong> ${leadData.occupation || 'Not specified'}</p>
            <p><strong>Annual Income:</strong> ${leadData.annual_income ? `$${leadData.annual_income.toLocaleString()}` : 'Not specified'}</p>
          `
        })
      } catch (emailError) {
        console.error('Failed to send notification email:', emailError)
      }
    }

    return NextResponse.json({ 
      success: true, 
      data 
    }, { 
      headers: corsHeaders
    })
  } catch (error) {
    console.error('API error:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { 
      status: 500,
      headers: corsHeaders
    })
  }
} 