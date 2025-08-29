import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/config/supabase";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabaseSingleton: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseSingleton) {
    supabaseSingleton = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    });
  }
  return supabaseSingleton;
}

export default getSupabaseClient();
