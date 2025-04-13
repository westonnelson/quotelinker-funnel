import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL is required')
}

if (!process.env.SUPABASE_SERVICE_KEY) {
  throw new Error('SUPABASE_SERVICE_KEY is required')
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export async function POST(request: Request) {
  try {
    console.log('Starting quote submission process...')
    const data = await request.json()
    
    // Store lead in Supabase
    console.log('Storing lead in Supabase...')
    const { error: supabaseError } = await supabase
      .from('leads')
      .insert([{
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        age: parseInt(data.age),
        gender: data.gender,
        health_status: data.healthStatus,
        coverage_amount: parseInt(data.coverageAmount),
        term_length: parseInt(data.termLength),
        tobacco_use: data.tobaccoUse,
        occupation: data.occupation,
        annual_income: data.annualIncome,
        status: 'new',
        created_at: new Date().toISOString()
      }])

    if (supabaseError) {
      console.error('Supabase error:', supabaseError)
      throw supabaseError
    }
    console.log('Successfully stored lead in Supabase')

    // Send to HubSpot via Zapier
    if (process.env.ZAPIER_WEBHOOK_URL) {
      console.log('Sending data to HubSpot via Zapier...')
      const hubspotData = {
        fields: [
          { name: 'firstname', value: data.firstName },
          { name: 'lastname', value: data.lastName },
          { name: 'email', value: data.email },
          { name: 'phone', value: data.phone },
          { name: 'age', value: data.age },
          { name: 'gender', value: data.gender },
          { name: 'health_status', value: data.healthStatus },
          { name: 'coverage_amount', value: data.coverageAmount },
          { name: 'term_length', value: data.termLength },
          { name: 'tobacco_use', value: data.tobaccoUse },
          { name: 'occupation', value: data.occupation },
          { name: 'annual_income', value: data.annualIncome }
        ],
        context: {
          pageUri: 'https://quotelinker.com/term-life',
          pageName: 'Term Life Insurance Quote'
        }
      }

      const zapierResponse = await fetch(process.env.ZAPIER_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hubspotData)
      })

      if (!zapierResponse.ok) {
        const errorText = await zapierResponse.text()
        console.error('Failed to send to Zapier:', errorText)
      } else {
        console.log('Successfully sent data to HubSpot via Zapier')
      }
    }

    // Send notification email
    if (process.env.RESEND_API_KEY) {
      console.log('Sending notification email...')
      const emailData = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: 'New Quote Request',
        html: `
          <h2>New Quote Request</h2>
          <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone}</p>
          <p><strong>Coverage Amount:</strong> $${parseInt(data.coverageAmount).toLocaleString()}</p>
          <p><strong>Term Length:</strong> ${data.termLength} Years</p>
          <p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>
        `
      }

      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      })

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text()
        console.error('Failed to send email:', errorText)
      } else {
        console.log('Successfully sent notification email')
      }
    }

    console.log('Quote submission process completed successfully')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Form submission error:', error)
    return NextResponse.json(
      { error: 'Failed to process quote request' },
      { status: 500 }
    )
  }
} 