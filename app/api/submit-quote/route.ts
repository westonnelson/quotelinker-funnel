import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// Initialize Supabase client
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

// Add better error handling for email sending
const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'QuoteLinker <quotes@quotelinker.com>',
        to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error('Resend API error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Add better error handling for Zapier webhook
const sendToZapier = async (data: any) => {
  try {
    const res = await fetch(process.env.ZAPIER_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error('Zapier webhook error:', error);
      throw new Error(`Failed to send data to Zapier: ${error.message}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error sending data to Zapier:', error);
    throw error;
  }
};

// Main submission endpoint
export async function POST(request: Request) {
  try {
    console.log('Starting POST request handler');
    console.log('Supabase config:', {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    });

    const body = await request.json();
    console.log('Received request body:', body);

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'age', 'gender', 'healthStatus', 'coverageAmount', 'termLength'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return new Response(JSON.stringify({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Map and clean the data
    const leadData = {
      first_name: body.firstName.trim(),
      last_name: body.lastName.trim(),
      email: body.email.toLowerCase().trim(),
      phone: body.phone.trim(),
      age: Number(body.age),
      gender: body.gender.toLowerCase(),
      health_status: body.healthStatus.toLowerCase(),
      coverage_amount: Number(body.coverageAmount),
      term_length: Number(body.termLength),
      tobacco_use: body.tobaccoUse ? 'yes' : 'no',
      occupation: body.occupation?.trim() || 'Not Provided',
      annual_income: body.annualIncome ? Number(body.annualIncome) : null,
      source: 'term_life_quote_form',
      created_at: new Date().toISOString(),
    };

    console.log('Attempting to insert lead data:', leadData);

    // Insert into Supabase
    const { data, error: insertError } = await supabase
      .from('leads')
      .insert([leadData])
      .select();

    if (insertError) {
      console.error('Error inserting lead:', insertError);
      return new Response(JSON.stringify({
        success: false,
        error: insertError.message,
        details: insertError
      }), {
        status: 500,
        headers: corsHeaders
      });
    }

    console.log('Successfully inserted lead:', data);

    // Send to Zapier if webhook URL is configured
    if (process.env.ZAPIER_WEBHOOK_URL) {
      try {
        await sendToZapier(leadData);
        console.log('Successfully sent data to Zapier');
      } catch (error) {
        console.error('Failed to send data to Zapier:', error);
      }
    }

    // Send notification email if Resend API key is configured
    if (process.env.RESEND_API_KEY) {
      try {
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
            <p><strong>Coverage Amount:</strong> $${leadData.coverage_amount.toLocaleString()}</p>
            <p><strong>Term Length:</strong> ${leadData.term_length} years</p>
            <p><strong>Tobacco Use:</strong> ${leadData.tobacco_use}</p>
            <p><strong>Occupation:</strong> ${leadData.occupation}</p>
            ${leadData.annual_income ? `<p><strong>Annual Income:</strong> $${leadData.annual_income.toLocaleString()}</p>` : ''}
          `
        );
        console.log('Successfully sent notification email');
      } catch (error) {
        console.error('Failed to send notification email:', error);
      }
    }

    // Send confirmation email to the lead
    if (process.env.RESEND_API_KEY) {
      try {
        await sendEmail(
          leadData.email,
          'Your Quote Request Has Been Received',
          `
            <h2>Thank You for Your Quote Request</h2>
            <p>Dear ${leadData.first_name},</p>
            <p>We have received your quote request and will be in touch shortly with personalized options for your life insurance coverage.</p>
            <p>Here's a summary of your request:</p>
            <ul>
              <li>Coverage Amount: $${leadData.coverage_amount.toLocaleString()}</li>
              <li>Term Length: ${leadData.term_length} years</li>
            </ul>
            <p>If you have any questions in the meantime, please don't hesitate to contact us at ${process.env.EMAIL_TO}.</p>
            <p>Best regards,<br>The QuoteLinker Team</p>
          `
        );
        console.log('Successfully sent confirmation email to lead');
      } catch (error) {
        console.error('Failed to send confirmation email to lead:', error);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Quote request submitted successfully',
      data
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Error processing quote request:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error : undefined
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
} 