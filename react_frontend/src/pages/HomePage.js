import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, TrendingUp } from "lucide-react";

import { searchUser } from "../lib/api";
import UserInsightsView from "../components/UserInsightsView";
import { Button } from "../components/ui/button";

// PUBLIC_INTERFACE
export default function HomePage() {
  /** Public landing + search view. Renders skeletons while fetching insights. */
  const trending = useMemo(() => ["torvalds", "gaearon", "sindresorhus", "vercel", "openai"], []);

  const [username, setUsername] = useState("");
  const [submitted, setSubmitted] = useState("");

  const query = useQuery({
    queryKey: ["search", submitted],
    queryFn: () => searchUser(submitted),
    enabled: Boolean(submitted),
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const u = username.trim();
    if (u) setSubmitted(u);
  };

  const onTrending = (u) => {
    setUsername(u);
    setSubmitted(u);
  };

  const isNotFound = query.error?.status === 404;

  return (
    <div className="page">
      <div className="container">
        <div className="header">
          <div className="brand">
            <span style={{ width: 10, height: 10, borderRadius: 99, background: "var(--accent)" }} />
            <span>GitHub Insights</span>
            <span className="badge">
              <TrendingUp size={14} /> Midnight Analytics
            </span>
          </div>
          <Button asChild href="/admin">
            Admin
          </Button>
        </div>

        <div className="card glass">
          <div className="card-inner">
            <h1 className="h1">Explore a developer persona</h1>
            <p className="p">
              Search any GitHub username to see profile insights, language distribution, and recent activity—served with
              smart caching.
            </p>

            <form onSubmit={onSubmit} style={{ marginTop: 18, display: "flex", gap: 12, alignItems: "center" }}>
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
                <button key={u} type="button" className="pill" onClick={() => onTrending(u)}>
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          {query.isError ? (
            <ErrorState isNotFound={isNotFound} message={query.error?.message || "Something went wrong."} />
          ) : submitted ? (
            <UserInsightsView payload={query.data} isFetching={query.isFetching} />
          ) : (
            <div style={{ marginTop: 18, color: "var(--muted)" }}>Tip: Start with a trending search to see the dashboard.</div>
          )}
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
