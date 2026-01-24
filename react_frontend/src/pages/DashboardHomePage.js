import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

// PUBLIC_INTERFACE
export default function DashboardHomePage() {
  /** Authenticated dashboard landing within app portal. */
  const trending = useMemo(() => ["torvalds", "gaearon", "sindresorhus", "vercel", "openai"], []);
  const [username, setUsername] = useState("");
  const nav = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const u = username.trim();
    if (!u) return;
    nav(`/app/dashboard/${encodeURIComponent(u)}`);
  };

  const onTrending = (u) => {
    setUsername(u);
    nav(`/app/dashboard/${encodeURIComponent(u)}`);
  };

  return (
    <div className="page" style={{ paddingTop: 22 }}>
      <div className="container">
        <div className="header">
          <div className="brand">
            <span>Dashboard</span>
            <span className="badge">
              <TrendingUp size={14} /> Elite Explorer
            </span>
          </div>
        </div>

        <Card className="glass">
          <CardContent>
            <h1 className="h1">Search a GitHub profile</h1>
            <p className="p" style={{ color: "#94a3b8" }}>
              Cached insights are returned instantly when available (24h TTL).
            </p>

            <form onSubmit={onSubmit} className="glow-search" style={{ marginTop: 18, display: "flex", gap: 12 }}>
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
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </form>

            <div className="pills" aria-label="Trending searches">
              {trending.map((u) => (
                <button key={u} type="button" className="pill pill-visible" onClick={() => onTrending(u)}>
                  {u}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
