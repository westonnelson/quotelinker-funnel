-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    health_status TEXT NOT NULL,
    coverage_amount INTEGER NOT NULL,
    term_length INTEGER NOT NULL,
    tobacco_use TEXT NOT NULL,
    occupation TEXT,
    annual_income INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    source TEXT DEFAULT 'term_life_quote_form'::text NOT NULL
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads (email);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable insert access for all users" ON public.leads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON public.leads
    FOR SELECT USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT ALL ON public.leads TO authenticated;
GRANT INSERT ON public.leads TO anon;

-- Add table comments
COMMENT ON TABLE public.leads IS 'Stores lead information from quote requests';
COMMENT ON COLUMN public.leads.id IS 'Unique identifier for the lead';
COMMENT ON COLUMN public.leads.first_name IS 'Lead''s first name';
COMMENT ON COLUMN public.leads.last_name IS 'Lead''s last name';
COMMENT ON COLUMN public.leads.email IS 'Lead''s email address';
COMMENT ON COLUMN public.leads.phone IS 'Lead''s phone number';
COMMENT ON COLUMN public.leads.age IS 'Lead''s age';
COMMENT ON COLUMN public.leads.gender IS 'Lead''s gender';
COMMENT ON COLUMN public.leads.health_status IS 'Lead''s self-reported health status';
COMMENT ON COLUMN public.leads.coverage_amount IS 'Requested coverage amount in USD';
COMMENT ON COLUMN public.leads.term_length IS 'Requested term length in years';
COMMENT ON COLUMN public.leads.tobacco_use IS 'Lead''s tobacco use status';
COMMENT ON COLUMN public.leads.occupation IS 'Lead''s occupation (optional)';
COMMENT ON COLUMN public.leads.annual_income IS 'Lead''s annual income in USD (optional)';
COMMENT ON COLUMN public.leads.created_at IS 'Timestamp when the lead was created';
COMMENT ON COLUMN public.leads.source IS 'Source of the lead'; 