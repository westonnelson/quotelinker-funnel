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
    const formData = await request.json()
    console.log('Received form data:', formData)

    // Map form data to Supabase schema
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
      tobacco_use: formData.tobaccoUse,
      occupation: formData.occupation,
      annual_income: formData.annualIncome ? parseInt(formData.annualIncome, 10) : null,
      created_at: new Date().toISOString(),
      source: 'term_life_quote_form'
    }

    console.log('Mapped lead data:', leadData)

    // Insert into Supabase
    const { data: supabaseData, error: supabaseError } = await supabase
      .from('leads')
      .insert([leadData])
      .select()

    if (supabaseError) {
      console.error('Supabase error:', {
        error: supabaseError,
        message: supabaseError.message,
        details: supabaseError.details,
        hint: supabaseError.hint,
        code: supabaseError.code
      })
      throw new Error(`Failed to save lead data: ${supabaseError.message}`)
    }

    console.log('Successfully saved to Supabase:', supabaseData)

    // Send to HubSpot via Zapier if configured
    if (zapierWebhookUrl) {
      try {
        const zapierResponse = await fetch(zapierWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            source: 'term_life_quote_form',
            timestamp: new Date().toISOString()
          })
        })
        
        if (!zapierResponse.ok) {
          const errorText = await zapierResponse.text()
          console.error('Zapier webhook error:', {
            status: zapierResponse.status,
            statusText: zapierResponse.statusText,
            error: errorText
          })
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
            <p>Name: ${formData.firstName} ${formData.lastName}</p>
            <p>Email: ${formData.email}</p>
            <p>Phone: ${formData.phone}</p>
            <p>Age: ${formData.age}</p>
            <p>Gender: ${formData.gender}</p>
            <p>Health Status: ${formData.healthStatus}</p>
            <p>Coverage Amount: $${formData.coverageAmount}</p>
            <p>Term Length: ${formData.termLength} years</p>
            <p>Source: Term Life Quote Form</p>
            <p>Timestamp: ${new Date().toISOString()}</p>
          `
        })
        console.log('Successfully sent notification email:', emailResult)
      } catch (emailError) {
        console.error('Email notification error:', {
          error: emailError,
          message: emailError instanceof Error ? emailError.message : String(emailError)
        })
        // Don't throw here, continue with response
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Quote request submitted successfully',
      data: supabaseData
    })

  } catch (error) {
    console.error('API route error:', {
      error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
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