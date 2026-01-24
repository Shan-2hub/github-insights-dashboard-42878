import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Lock, UserPlus } from "lucide-react";

import { login, register } from "../lib/api";
import { setAuthToken } from "../lib/auth";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

// PUBLIC_INTERFACE
export default function AuthPage() {
  /** Login and registration page for JWT auth. */
  const nav = useNavigate();
  const loc = useLocation();

  const redirectTo = useMemo(() => loc.state?.from || "/app", [loc.state]);

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

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
                    busy={busy}
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
                    busy={busy}
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
          required
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span className="badge">Password</span>
        <input
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          type="password"
          minLength={8}
          required
        />
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
