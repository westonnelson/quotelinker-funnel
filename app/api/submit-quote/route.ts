import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const zapierWebhookUrl = process.env.ZAPIER_WEBHOOK_URL
const resendApiKey = process.env.RESEND_API_KEY

export async function POST(request: Request) {
  try {
    // Validate environment variables
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase configuration:', { supabaseUrl, supabaseAnonKey })
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const data = await request.json()
    console.log('Received form data:', data)

    // Insert into Supabase
    const { data: supabaseData, error: supabaseError } = await supabase
      .from('leads')
      .insert([{
        ...data,
        created_at: new Date().toISOString(),
        source: 'term_life_quote_form'
      }])
      .select()

    if (supabaseError) {
      console.error('Supabase error:', supabaseError)
      throw new Error('Failed to save lead data')
    }

    console.log('Successfully saved to Supabase:', supabaseData)

    // Send to HubSpot via Zapier if configured
    if (zapierWebhookUrl) {
      try {
        const zapierResponse = await fetch(zapierWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            source: 'term_life_quote_form',
            timestamp: new Date().toISOString()
          })
        })
        
        if (!zapierResponse.ok) {
          console.error('Zapier webhook error:', await zapierResponse.text())
        } else {
          console.log('Successfully sent to Zapier webhook')
        }
      } catch (zapierError) {
        console.error('Zapier webhook error:', zapierError)
        // Don't throw here, continue with other operations
      }
    }

    // Send notification email if Resend is configured
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey)
        const emailResult = await resend.emails.send({
          from: process.env.EMAIL_FROM || 'notifications@quotelinker.com',
          to: process.env.EMAIL_TO || 'admin@quotelinker.com',
          subject: 'New Quote Request',
          html: `
            <h1>New Quote Request</h1>
            <p>Name: ${data.firstName} ${data.lastName}</p>
            <p>Email: ${data.email}</p>
            <p>Phone: ${data.phone}</p>
            <p>Age: ${data.age}</p>
            <p>Gender: ${data.gender}</p>
            <p>Health Status: ${data.healthStatus}</p>
            <p>Coverage Amount: $${data.coverageAmount}</p>
            <p>Term Length: ${data.termLength} years</p>
            <p>Source: Term Life Quote Form</p>
            <p>Timestamp: ${new Date().toISOString()}</p>
          `
        })
        console.log('Successfully sent notification email:', emailResult)
      } catch (emailError) {
        console.error('Email notification error:', emailError)
        // Don't throw here, continue with response
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Quote request submitted successfully',
      data: supabaseData
    })

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 