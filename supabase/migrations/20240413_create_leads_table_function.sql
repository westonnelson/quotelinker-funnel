-- Create a function to create the leads table if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_leads_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the table exists
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'leads') THEN
    -- Create the leads table
    CREATE TABLE public.leads (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
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
      occupation TEXT NOT NULL,
      annual_income INTEGER,
      source TEXT NOT NULL
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS leads_email_idx ON public.leads (email);
    CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at DESC);

    -- Enable RLS
    ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

    -- Create policies
    CREATE POLICY "Enable insert for all users" ON public.leads
      FOR INSERT
      TO public
      WITH CHECK (true);

    CREATE POLICY "Enable select for authenticated users only" ON public.leads
      FOR SELECT
      TO authenticated
      USING (true);

    -- Grant permissions
    GRANT INSERT ON public.leads TO anon;
    GRANT INSERT, SELECT ON public.leads TO authenticated;

    -- Add comments
    COMMENT ON TABLE public.leads IS 'Table storing lead information from quote requests';
    COMMENT ON COLUMN public.leads.id IS 'Unique identifier for each lead';
    COMMENT ON COLUMN public.leads.created_at IS 'Timestamp when the lead was created';
    COMMENT ON COLUMN public.leads.first_name IS 'First name of the lead';
    COMMENT ON COLUMN public.leads.last_name IS 'Last name of the lead';
    COMMENT ON COLUMN public.leads.email IS 'Email address of the lead';
    COMMENT ON COLUMN public.leads.phone IS 'Phone number of the lead';
    COMMENT ON COLUMN public.leads.age IS 'Age of the lead';
    COMMENT ON COLUMN public.leads.gender IS 'Gender of the lead';
    COMMENT ON COLUMN public.leads.health_status IS 'Health status of the lead';
    COMMENT ON COLUMN public.leads.coverage_amount IS 'Requested coverage amount in dollars';
    COMMENT ON COLUMN public.leads.term_length IS 'Requested term length in years';
    COMMENT ON COLUMN public.leads.tobacco_use IS 'Whether the lead uses tobacco products';
    COMMENT ON COLUMN public.leads.occupation IS 'Occupation of the lead';
    COMMENT ON COLUMN public.leads.annual_income IS 'Annual income of the lead (optional)';
    COMMENT ON COLUMN public.leads.source IS 'Source of the lead (e.g., term_life_quote_form)';
  END IF;
END;
$$; 