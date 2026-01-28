import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client singleton.
 *
 * Uses CRA env var convention:
 * - REACT_APP_SUPABASE_URL
 * - REACT_APP_SUPABASE_ANON_KEY
 *
 * Do NOT hardcode secrets here.
 */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

function assertSupabaseConfigured() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase is not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your environment."
    );
  }
}

let _client = null;

// PUBLIC_INTERFACE
export function getSupabaseClient() {
  /** Returns a lazily-created Supabase client singleton. */
  if (_client) return _client;
  assertSupabaseConfigured();
  _client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // We handle session state changes in the app via listeners.
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
  return _client;
}

// PUBLIC_INTERFACE
export async function signInWithOAuthProvider(provider) {
  /**
   * Starts OAuth sign-in with the given provider.
   * @param {"google"|"github"} provider OAuth provider name for Supabase.
   */
  const supabase = getSupabaseClient();

  const baseUrl =
    process.env.REACT_APP_FRONTEND_URL ||
    (typeof window !== "undefined" ? window.location.origin : undefined);

  // IMPORTANT: This must be allowlisted in Supabase Auth settings (Additional Redirect URLs).
  // Using a dedicated callback path avoids subtle mismatches and makes debugging easier.
  const redirectTo = baseUrl ? `${baseUrl.replace(/\/$/, "")}/auth/callback` : undefined;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      // Supabase will redirect back to this URL with a session in the hash/query.
      redirectTo,
    },
  });

  if (error) throw error;
  return data;
}

// PUBLIC_INTERFACE
export async function getSupabaseSession() {
  /** Returns the current Supabase session (or null). */
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data?.session ?? null;
}

// PUBLIC_INTERFACE
export function onSupabaseAuthStateChange(callback) {
  /**
   * Subscribe to Supabase auth state changes.
   * @param {(event: string, session: any) => void} callback
   * @returns {() => void} unsubscribe function
   */
  const supabase = getSupabaseClient();
  const { data } = supabase.auth.onAuthStateChange((event, session) => callback(event, session));
  return () => data?.subscription?.unsubscribe?.();
}
