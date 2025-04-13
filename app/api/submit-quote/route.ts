import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Store lead in Supabase
    const { error: supabaseError } = await supabase
      .from('leads')
      .insert([
        {
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
          status: 'new'
        }
      ])

    if (supabaseError) throw supabaseError

    // Send to HubSpot via Zapier
    if (process.env.ZAPIER_WEBHOOK_URL) {
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
        console.error('Failed to send to Zapier:', await zapierResponse.text())
      }
    }

    // Send notification email
    if (process.env.RESEND_API_KEY) {
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
        console.error('Failed to send email:', await emailResponse.text())
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Form submission error:', error)
    return NextResponse.json(
      { error: 'Failed to process quote request' },
      { status: 500 }
    )
  }
} 