import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Github, Lock, UserPlus, Eye, EyeOff } from "lucide-react";

import { login, register } from "../lib/api";
import { setAuthToken } from "../lib/auth";
import { getSupabaseSession, onSupabaseAuthStateChange, signInWithOAuthProvider } from "../lib/supabaseClient";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

function OAuthButton({ provider, onClick, disabled }) {
  const isGoogle = provider === "google";
  const label = isGoogle ? "Continue with Google" : "Continue with GitHub";

  return (
    <button
      type="button"
      className="btn"
      disabled={disabled}
      onClick={onClick}
      style={{
        width: "100%",
        justifyContent: "center",
        borderColor: "rgba(30,58,138,0.45)",
        background: "rgba(255,255,255,0.03)",
      }}
      aria-label={label}
    >
      {isGoogle ? (
        <span
          aria-hidden="true"
          style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            display: "inline-grid",
            placeItems: "center",
            border: "1px solid rgba(245,158,11,0.35)",
            color: "rgba(245,158,11,0.9)",
            fontWeight: 900,
            fontSize: 12,
          }}
        >
          G
        </span>
      ) : (
        <Github size={16} />
      )}
      <span>{label}</span>
    </button>
  );
}

// PUBLIC_INTERFACE
export default function AuthPage() {
  /** Login and registration page for JWT auth (+ Supabase OAuth buttons). */
  const nav = useNavigate();
  const loc = useLocation();

  const redirectTo = useMemo(() => loc.state?.from || "/app", [loc.state]);

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [oauthBusy, setOauthBusy] = useState(false);
  const [error, setError] = useState("");
  const [oauthError, setOauthError] = useState("");

  // Handle Supabase redirects / session detection and move user into the app portal.
  // Note: This template's app portal expects a JWT from the backend; in many Supabase-first apps
  // you would protect routes using Supabase session instead. Here, we keep the existing behavior
  // and simply route authenticated OAuth users into the app shell.
  useEffect(() => {
    let unsub = null;

    async function bootstrap() {
      try {
        const session = await getSupabaseSession();
        if (session) {
          nav(redirectTo, { replace: true });
          return;
        }
      } catch {
        // If Supabase env vars aren't configured, we silently ignore and keep JWT auth working.
      }

      try {
        unsub = onSupabaseAuthStateChange((_event, session) => {
          if (session) nav(redirectTo, { replace: true });
        });
      } catch {
        // ignore (missing env vars)
      }
    }

    bootstrap();
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [nav, redirectTo]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const fn = mode === "register" ? register : login;
      const res = await fn(email, password);
      if (res?.access_token) {
        setAuthToken(res.access_token);
        nav(redirectTo, { replace: true });
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      setError(err?.message || "Auth failed.");
    } finally {
      setBusy(false);
    }
  };

  const onOAuth = async (provider) => {
    setOauthError("");
    setOauthBusy(true);

    try {
      await signInWithOAuthProvider(provider);
      // Supabase will redirect away; if it doesn't (popup/blocked), the session listener above will handle it.
    } catch (err) {
      const msg = err?.message || "OAuth sign-in failed.";
      setOauthError(msg);
      setOauthBusy(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ display: "grid", placeItems: "center" }}>
        <div style={{ width: "min(520px, 100%)" }}>
          <Card className="glass">
            <CardContent>
              <h1 className="h1" style={{ marginBottom: 6 }}>
                Welcome back
              </h1>
              <p className="p" style={{ color: "#94a3b8" }}>
                Sign in to access the Elite Explorer dashboard.
              </p>

              {/* OAuth */}
              <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
                <OAuthButton provider="google" disabled={busy || oauthBusy} onClick={() => onOAuth("google")} />
                <OAuthButton provider="github" disabled={busy || oauthBusy} onClick={() => onOAuth("github")} />

                {oauthError ? (
                  <div className="card" style={{ borderColor: "rgba(220,38,38,0.35)" }}>
                    <div className="card-inner">
                      <div className="badge" style={{ borderColor: "rgba(220,38,38,0.35)" }}>
                        OAuth Error
                      </div>
                      <div style={{ marginTop: 8, color: "rgba(255,255,255,0.9)" }}>{oauthError}</div>
                    </div>
                  </div>
                ) : null}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginTop: 2,
                    marginBottom: 2,
                    opacity: 0.9,
                  }}
                  aria-hidden="true"
                >
                  <div style={{ height: 1, flex: 1, background: "rgba(30,41,59,0.9)" }} />
                  <div className="badge">or</div>
                  <div style={{ height: 1, flex: 1, background: "rgba(30,41,59,0.9)" }} />
                </div>
              </div>

              {/* Existing JWT email/password auth */}
              <Tabs value={mode} onValueChange={setMode} className="mt-4" defaultValue="login">
                <TabsList>
                  <TabsTrigger value="login">
                    <Lock size={14} /> Login
                  </TabsTrigger>
                  <TabsTrigger value="register">
                    <UserPlus size={14} /> Register
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <AuthForm
                    mode="login"
                    email={email}
                    password={password}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    onSubmit={onSubmit}
                    busy={busy || oauthBusy}
                    error={error}
                  />
                </TabsContent>

                <TabsContent value="register">
                  <AuthForm
                    mode="register"
                    email={email}
                    password={password}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    onSubmit={onSubmit}
                    busy={busy || oauthBusy}
                    error={error}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="p" style={{ marginTop: 12, color: "#94a3b8" }}>
            Admin access: set <code>ADMIN_EMAIL</code> on the backend to grant admin privileges.
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthForm({ mode, email, password, setEmail, setPassword, onSubmit, busy, error }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} style={{ marginTop: 14, display: "grid", gap: 12 }}>
      <label style={{ display: "grid", gap: 6 }}>
        <span className="badge">Email</span>
        <input
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          type="email"
          autoComplete="email"
          required
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span className="badge">Password</span>
        <div style={{ position: "relative" }}>
          <input
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            minLength={8}
            autoComplete={mode === "register" ? "new-password" : "current-password"}
            required
            style={{ paddingRight: 44 }}
          />
          <button
            type="button"
            className="btn"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              padding: "8px 10px",
              borderRadius: 12,
              borderColor: "rgba(30,41,59,0.9)",
              background: "rgba(2,6,23,0.25)",
            }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </label>

      {error ? (
        <div className="card" style={{ borderColor: "rgba(220,38,38,0.35)" }}>
          <div className="card-inner">
            <div className="badge" style={{ borderColor: "rgba(220,38,38,0.35)" }}>
              Error
            </div>
            <div style={{ marginTop: 8, color: "rgba(255,255,255,0.9)" }}>{error}</div>
          </div>
        </div>
      ) : null}

      <Button variant="primary" disabled={busy} type="submit">
        {busy ? "Working..." : mode === "register" ? "Create account" : "Sign in"}
      </Button>
    </form>
  );
}
