import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getSupabaseSession } from "../lib/supabaseClient";

/**
 * Supabase OAuth callback landing page.
 *
 * Supabase will redirect the browser back to this path with auth data in the URL.
 * With `detectSessionInUrl: true` (configured in supabaseClient), the Supabase JS client
 * parses the URL and establishes a session.
 */

// PUBLIC_INTERFACE
export default function AuthCallbackPage() {
  /** Finalizes Supabase OAuth by ensuring session is established, then redirects into the app. */
  const nav = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function finalize() {
      try {
        const session = await getSupabaseSession();
        if (!cancelled && session) {
          nav("/app", { replace: true });
          return;
        }

        // If the session didn't materialize, provide a helpful message.
        // This can happen if redirect URLs are misconfigured in Supabase or the provider denied access.
        if (!cancelled) {
          setError(
            "OAuth sign-in did not complete. Please verify Supabase Auth redirect URLs include this page (/auth/callback) and try again."
          );
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || "OAuth callback failed.");
        }
      }
    }

    finalize();
    return () => {
      cancelled = true;
    };
  }, [nav]);

  return (
    <div className="page">
      <div className="container" style={{ display: "grid", placeItems: "center" }}>
        <div style={{ width: "min(720px, 100%)" }}>
          <div className="card glass">
            <div className="card-inner">
              <div className="badge">Completing sign-in…</div>
              <div className="p" style={{ marginTop: 10, color: "#94a3b8" }}>
                Please wait while we finish authenticating.
              </div>

              {error ? (
                <div className="card" style={{ marginTop: 14, borderColor: "rgba(220,38,38,0.35)" }}>
                  <div className="card-inner">
                    <div className="badge" style={{ borderColor: "rgba(220,38,38,0.35)" }}>
                      OAuth Error
                    </div>
                    <div style={{ marginTop: 8, color: "rgba(255,255,255,0.9)" }}>{error}</div>
                    <div className="p" style={{ marginTop: 10, color: "#94a3b8" }}>
                      You can go back to <a href="/auth">Sign in</a>.
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="p" style={{ marginTop: 12, color: "#94a3b8" }}>
            If this page hangs, your Supabase redirect URL allowlist likely needs updating.
          </div>
        </div>
      </div>
    </div>
  );
}
