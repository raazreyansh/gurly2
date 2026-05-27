import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import * as path from "path"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl!, supabaseServiceKey!, {
  auth: { persistSession: false },
  realtime: {
    transport: {
      new: () => {}
    } as any
  }
})

async function run() {
  console.log("Checking tables...")
  const tables = ["products", "categories", "profiles", "orders", "wishlist"]
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select("*").limit(1)
    if (error) {
      console.log(`Table '${t}' error:`, error.message)
    } else {
      console.log(`Table '${t}' exists! Data:`, data)
    }
  }
}

run()
