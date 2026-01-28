import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Store singleton client
let client: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client for development without Supabase
    // This allows the app to run without Supabase configured
    if (!client) {
      client = {
        auth: {
          getSession: async () => ({ data: { session: null }, error: null }),
          getUser: async () => ({ data: { user: null }, error: null }),
          signInWithPassword: async () => ({
            data: { user: null, session: null },
            error: { message: "Supabase not configured", status: 500 },
          }),
          signUp: async () => ({
            data: { user: null, session: null },
            error: { message: "Supabase not configured", status: 500 },
          }),
          signOut: async () => ({ error: null }),
          onAuthStateChange: () => ({
            data: { subscription: { unsubscribe: () => {} } },
          }),
        },
      } as unknown as SupabaseClient;
    }
    return client;
  }

  if (!client) {
    client = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}
