import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
const supabaseServiceRoleLoaded = supabaseServiceKey.length > 0

if (!supabaseServiceRoleLoaded) {
  console.warn("Supabase service role key not found in server env; admin Supabase client will be unavailable.")
} else {
  console.log("Supabase admin client initialized for URL:", supabaseUrl)
}

export const supabaseAdmin = supabaseServiceRoleLoaded
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null
