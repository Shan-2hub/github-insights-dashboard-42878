import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Code2, Flame, GitFork, Search, Sparkles, Star, TrendingUp, Users } from "lucide-react";
import { isAuthed } from "../lib/auth";
import { Card, CardContent } from "../components/ui/card";

function formatCompactInt(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "—";
  return new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(num);
}

function slugify(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function useTypewriter(phrases, { typeMs = 38, deleteMs = 22, holdMs = 1100 } = {}) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[idx % phrases.length] ?? "";
    const doneTyping = !deleting && text === current;
    const doneDeleting = deleting && text === "";

    const t = window.setTimeout(() => {
      if (doneTyping) {
        setDeleting(true);
        return;
      }

      if (doneDeleting) {
        setDeleting(false);
        setIdx((i) => (i + 1) % phrases.length);
        return;
      }

      if (deleting) setText((x) => x.slice(0, Math.max(0, x.length - 1)));
      else setText(current.slice(0, text.length + 1));
    }, doneTyping ? holdMs : deleting ? deleteMs : typeMs);

    return () => window.clearTimeout(t);
  }, [deleting, holdMs, idx, phrases, text, typeMs, deleteMs]);

  return text;
}

// PUBLIC_INTERFACE
export default function HomePage() {
  /** Public landing page with dynamic hero, quick-hint search, and professional homepage sections. */
  const nav = useNavigate();
  const inputRef = useRef(null);

  const heroPhrases = useMemo(
    () => ["Discover top-tier developers...", "Analyze repository metrics...", "Explore the latest tech stacks..."],
    []
  );
  const typed = useTypewriter(heroPhrases);

  const quickHints = useMemo(() => ["React", "AI", "Web3", "TypeScript", "Python"], []);
  const trendingUsers = useMemo(() => ["torvalds", "gaearon", "sindresorhus", "vercel", "openai"], []);

  const [username, setUsername] = useState("");

  // Social proof (kept from previous version, still used in hero strip).
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

  const onHint = (tag) => {
    // Hints are treated as a “topic” fill, but search still expects a username.
    // This is intentional: it nudges users to try real usernames while keeping SaaS polish.
    setUsername(tag);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  const onTrending = (u) => {
    setUsername(u);
    if (isAuthed()) nav(`/app/dashboard/${encodeURIComponent(u)}`);
    else nav("/auth");
  };

  const topTech = useMemo(
    () => [
      { name: "JavaScript", icon: Code2, detail: "Most active on the web", badge: "Trending" },
      { name: "Python", icon: Sparkles, detail: "AI + data workflows", badge: "Popular" },
      { name: "TypeScript", icon: Code2, detail: "Typed frontend stacks", badge: "Growing" },
      { name: "Go", icon: Flame, detail: "High-performance services", badge: "Rising" },
      { name: "Rust", icon: Flame, detail: "Systems + safety", badge: "Hot" },
      { name: "Java", icon: Code2, detail: "Enterprise scale", badge: "Stable" },
    ],
    []
  );

  const featuredRepos = useMemo(
    () => [
      {
        name: "vercel/next.js",
        description: "The React Framework for the Web.",
        language: "TypeScript",
        stars: 125000,
        forks: 27000,
      },
      {
        name: "facebook/react",
        description: "The library for web and native user interfaces.",
        language: "JavaScript",
        stars: 230000,
        forks: 47000,
      },
      {
        name: "openai/openai-python",
        description: "The official Python library for the OpenAI API.",
        language: "Python",
        stars: 24000,
        forks: 3200,
      },
      {
        name: "tailwindlabs/tailwindcss",
        description: "A utility-first CSS framework for rapid UI development.",
        language: "CSS",
        stars: 82000,
        forks: 4100,
      },
    ],
    []
  );

  return (
    <div className="page" style={{ paddingTop: 28 }}>
      <div className="container">
        {/* HERO */}
        <section
          className="card glass"
          style={{
            position: "relative",
            overflow: "hidden",
          }}
          aria-label="Hero section"
        >
          {/* subtle background accent */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(1200px 600px at 20% 10%, rgba(30,58,138,0.22), transparent 60%), radial-gradient(1000px 520px at 80% 0%, rgba(245,158,11,0.14), transparent 55%)",
              pointerEvents: "none",
            }}
          />

          <div className="card-inner" style={{ position: "relative" }}>
            <div style={{ maxWidth: 920, margin: "0 auto", textAlign: "center" }}>
              <div className="badge" style={{ width: "fit-content", margin: "0 auto" }}>
                <TrendingUp size={14} /> Developer Analytics Platform
              </div>

              <h1 className="h1" style={{ marginTop: 14, marginBottom: 10 }}>
                Explore the World&apos;s Code in Real-Time
              </h1>

              <div
                className="p"
                style={{
                  color: "#94a3b8",
                  fontSize: 16,
                  maxWidth: 760,
                  margin: "0 auto",
                }}
              >
                <span style={{ color: "rgba(255,255,255,0.92)", fontWeight: 700 }}>{typed}</span>
                <span aria-hidden="true" style={{ color: "rgba(245,158,11,0.8)", marginLeft: 2 }}>
                  ▍
                </span>
              </div>

              <p className="p" style={{ color: "#94a3b8", maxWidth: 820, margin: "12px auto 0" }}>
                The ultimate dashboard for navigating GitHub’s vast ecosystem with advanced analytics and insights.
              </p>

              {/* Search */}
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
                    ref={inputRef}
                    className="input"
                    style={{ paddingLeft: 42 }}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Search GitHub username (e.g., torvalds)"
                    aria-label="Search GitHub username"
                    autoComplete="off"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary hover-scale"
                  aria-label={isAuthed() ? "Explore profile" : "Login to explore"}
                >
                  {isAuthed() ? "Explore" : "Login to Explore"}
                </button>
              </form>

              {/* Quick hints */}
              <div style={{ marginTop: 14 }} aria-label="Quick hints">
                <div className="p" style={{ color: "#94a3b8", marginBottom: 8 }}>
                  Quick hints:
                </div>
                <div className="pills" style={{ justifyContent: "center" }}>
                  {quickHints.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className="pill pill-visible hover-scale"
                      onClick={() => onHint(t)}
                      aria-label={`Quick hint ${t}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Social proof */}
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

              {/* Trending usernames */}
              <div className="pills" aria-label="Trending searches" style={{ justifyContent: "center" }}>
                {trendingUsers.map((u) => (
                  <button
                    key={u}
                    type="button"
                    className="pill pill-visible hover-scale"
                    onClick={() => onTrending(u)}
                    aria-label={`Trending username ${u}`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* LIVE STATS STRIP */}
        <section style={{ marginTop: 16 }} aria-label="Live statistics">
          <div
            className="card"
            style={{
              background:
                "linear-gradient(90deg, rgba(30,58,138,0.28), rgba(245,158,11,0.12))",
            }}
          >
            <div
              className="card-inner"
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                alignItems: "center",
              }}
            >
              <StatPill icon={Users} label="Developers" value="100M+" sub="Global GitHub ecosystem" />
              <StatPill icon={Star} label="Repositories" value="400M+" sub="Public + private at scale" />
              <StatPill icon={TrendingUp} label="Signals" value="Live" sub="Trends, stars, and forks" />
              <StatPill icon={Sparkles} label="Insights" value="AI-ready" sub="Persona-style summaries" />
            </div>
          </div>
        </section>

        {/* TOP TECHNOLOGIES */}
        <section style={{ marginTop: 18 }} aria-label="Top technologies">
          <div style={{ textAlign: "left", marginBottom: 10 }}>
            <h2 style={{ margin: 0, letterSpacing: -0.2 }}>Top Technologies</h2>
            <p className="p" style={{ marginTop: 6, color: "#94a3b8" }}>
              A snapshot of languages and stacks shaping GitHub today.
            </p>
          </div>

          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {topTech.map((t) => (
              <Card key={t.name} className="hover-scale">
                <CardContent>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div className="badge">
                      <t.icon size={14} /> {t.name}
                    </div>
                    <span className="badge" style={{ borderColor: "rgba(245,158,11,0.35)" }}>
                      {t.badge}
                    </span>
                  </div>
                  <p className="p" style={{ marginTop: 10, color: "#94a3b8" }}>
                    {t.detail}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FEATURED REPOSITORIES */}
        <section style={{ marginTop: 18 }} aria-label="Featured repositories">
          <div style={{ textAlign: "left", marginBottom: 10 }}>
            <h2 style={{ margin: 0, letterSpacing: -0.2 }}>Featured Repositories</h2>
            <p className="p" style={{ marginTop: 6, color: "#94a3b8" }}>
              A curated set of trending projects (sample data for now, designed for micro-interactions).
            </p>
          </div>

          <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
            {featuredRepos.map((r) => (
              <a
                key={r.name}
                href={`https://github.com/${r.name}`}
                target="_blank"
                rel="noreferrer"
                className="hover-scale"
                style={{ textDecoration: "none" }}
                aria-label={`Open repository ${r.name} on GitHub`}
              >
                <Card className="hover-scale" style={{ height: "100%" }}>
                  <CardContent>
                    <div style={{ fontSize: 16, fontWeight: 850, letterSpacing: -0.2 }}>{r.name}</div>
                    <p className="p" style={{ marginTop: 8, color: "#94a3b8" }}>
                      {r.description}
                    </p>

                    <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                      <span className="badge">
                        <Code2 size={14} /> {r.language}
                      </span>
                      <span className="badge">
                        <Star size={14} /> {formatCompactInt(r.stars)}
                      </span>
                      <span className="badge">
                        <GitFork size={14} /> {formatCompactInt(r.forks)}
                      </span>
                    </div>

                    <div className="p" style={{ marginTop: 12, color: "#94a3b8" }}>
                      Click to view →
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatPill({ icon: Icon, label, value, sub }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        className="badge"
        style={{
          borderColor: "rgba(255,255,255,0.14)",
          background: "rgba(2,6,23,0.25)",
        }}
      >
        <Icon size={14} /> {label}
      </div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 850, letterSpacing: -0.2 }}>{value}</div>
        <div className="p" style={{ color: "#94a3b8", marginTop: 2 }}>
          {sub}
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
