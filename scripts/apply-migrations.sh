#!/bin/bash

# Load environment variables
source .env.local

# Check if required variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
  echo "Error: Missing required environment variables"
  exit 1
fi

# Apply the migration
curl -X POST "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/apply_migration" \
  -H "apikey: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d @supabase/migrations/20240224_create_leads_table.sql

echo "Migration applied successfully" 