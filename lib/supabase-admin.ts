import { createClient } from "@supabase/supabase-js";

// Solo lato server: la service role key non deve mai arrivare al browser.
export function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
