// Service-role Supabase client — bypasses RLS entirely.
// ONLY import this in server-side code (Server Actions, Route Handlers).
// Never import in client components or expose SUPABASE_SERVICE_ROLE_KEY to the browser.

import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
