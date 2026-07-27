import { createClient } from "@supabase/supabase-js";

export function createServiceClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.INGEST_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url.includes("YOUR_PROJECT")) {
    return null;
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
