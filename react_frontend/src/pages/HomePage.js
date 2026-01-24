import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { isAuthed } from "../lib/auth";

// PUBLIC_INTERFACE
export default function HomePage() {
  /** Public landing page with centered hero + CTA search + dynamic trust counter. */
  const trending = useMemo(() => ["torvalds", "gaearon", "sindresorhus", "vercel", "openai"], []);
  const [username, setUsername] = useState("");
  const nav = useNavigate();

  // Spec: after 5 seconds, transition counter from "Trusted by 0 developers" to "Trusted by 10,000+ developers".
  const [trustedCount, setTrustedCount] = useState(0);
  useEffect(() => {
    const t = window.setTimeout(() => setTrustedCount(10000), 5000);
    return () => window.clearTimeout(t);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const u = username.trim();
    if (!u) return;

    if (isAuthed()) nav(`/app/dashboard/${encodeURIComponent(u)}`);
    else nav("/auth");
  };

  const onTrending = (u) => {
    setUsername(u);
    if (isAuthed()) nav(`/app/dashboard/${encodeURIComponent(u)}`);
    else nav("/auth");
  };

  return (
    <div className="page">
      <div className="container">
        <div className="card glass">
          <div className="card-inner" style={{ textAlign: "center" }}>
            <h1 className="h1" style={{ marginBottom: 10 }}>
              Explore Your Developer Persona
            </h1>
            <p className="p" style={{ color: "#94a3b8", maxWidth: 860, margin: "0 auto" }}>
              Search any GitHub username to see profile insights, language distribution, and recent activity—served with
              smart caching.
            </p>

            <form
              onSubmit={onSubmit}
              className="glow-search"
              style={{
                marginTop: 18,
                display: "flex",
                gap: 12,
                alignItems: "center",
                width: "min(860px, 100%)",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              aria-label="Search form"
            >
              <div style={{ flex: 1, position: "relative" }}>
                <Search
                  size={18}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "rgba(255,255,255,0.55)",
                  }}
                  aria-hidden="true"
                />
                <input
                  className="input"
                  style={{ paddingLeft: 42 }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Search GitHub username (e.g., torvalds)"
                  aria-label="Search GitHub username"
                />
              </div>
              <button type="submit" className="btn btn-primary hover-scale" aria-label={isAuthed() ? "Explore profile" : "Login to explore"}>
                {isAuthed() ? "Explore" : "Login to Explore"}
              </button>
            </form>

            <div
              className="p"
              style={{
                marginTop: 12,
                color: "#94a3b8",
                transition: "opacity 400ms ease, transform 400ms ease",
                transform: trustedCount ? "translateY(0)" : "translateY(2px)",
              }}
              aria-live="polite"
            >
              Trusted by {trustedCount ? "10,000+ developers" : "0 developers"}
            </div>

            <div className="pills" aria-label="Trending searches" style={{ justifyContent: "center" }}>
              {trending.map((u) => (
                <button key={u} type="button" className="pill pill-visible hover-scale" onClick={() => onTrending(u)} aria-label={`Trending username ${u}`}>
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ isNotFound, message }) {
  return (
    <div className="card">
      <div className="card-inner">
        <div className="badge" style={{ borderColor: isNotFound ? "rgba(220,38,38,0.45)" : "var(--border)" }}>
          {isNotFound ? "404" : "Error"}
        </div>
        <h2 style={{ margin: "10px 0 6px" }}>{isNotFound ? "User not found" : "Request failed"}</h2>
        <p className="p">{message}</p>
      </div>
    </div>
  );
}
