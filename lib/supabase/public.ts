import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Cookie-free Supabase client for public server components.
// Using this instead of the SSR client avoids calling cookies(),
// which would force the route into dynamic rendering and break ISR.
export function createPublicClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createClient(url, anonKey);
}
