import React, { useEffect, useMemo, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { ExternalLink, Github, Moon, Sparkles, Sun } from "lucide-react";
import { Button } from "../components/ui/button";
import { isAuthed } from "../lib/auth";

function getInitialTheme() {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia?.("(prefers-color-scheme: light)")?.matches ? "light" : "dark";
}

function applyTheme(theme) {
  // Minimal theme toggle:
  // - Dark uses existing tokenized styling.
  // - Light flips to a readable neutral background while keeping brand accents.
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem("theme", theme);
}

function formatCompactInt(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "—";
  return new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 }).format(num);
}

// PUBLIC_INTERFACE
export default function PublicLayout() {
  /** Public portal layout: fixed utility header + footer + routed content. */
  const [theme, setTheme] = useState(getInitialTheme);
  const [starCount, setStarCount] = useState(null);

  // Replace with your real GitHub repo, if different.
  const repo = useMemo(() => ({ owner: "kavia-ai", name: "github-insights-dashboard" }), []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    let cancelled = false;

    async function loadStars() {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.name}`, {
          headers: { Accept: "application/vnd.github+json" },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setStarCount(data?.stargazers_count ?? null);
      } catch {
        // Social proof is optional; fail silently.
      }
    }

    loadStars();
    return () => {
      cancelled = true;
    };
  }, [repo.name, repo.owner]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header className="navbar" style={{ position: "fixed", left: 0, right: 0 }}>
        <div className="container navbar-inner">
          {/* Left: Brand */}
          <Link to="/" className="brand" style={{ textDecoration: "none" }} aria-label="Elite Explorer home">
            <Sparkles size={18} />
            <span>Elite Explorer</span>
            <span className="badge">Explorer</span>
          </Link>

          {/* Center: Navigation (spec) */}
          <nav className="navlinks navlinks-centered" aria-label="Primary navigation">
            <Link className="navlink" to="/features">
              Trending Repos
            </Link>
            <Link className="navlink" to="/about">
              Top Users
            </Link>
            <Link className="navlink" to="/help">
              Documentation
            </Link>
          </nav>

          {/* Right: utilities */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              type="button"
              className="btn"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <a
              className="btn"
              href={`https://github.com/${repo.owner}/${repo.name}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Star this project on GitHub"
              title="Star on GitHub"
            >
              <Github size={16} />
              Star
              <span className="badge" style={{ marginLeft: 2 }}>
                {starCount == null ? "—" : formatCompactInt(starCount)}
              </span>
              <ExternalLink size={14} aria-hidden="true" />
            </a>

            {isAuthed() ? (
              <Button asChild href="/app" className="hover-scale">
                Go to App
              </Button>
            ) : (
              <Button asChild href="/auth" variant="primary" className="hover-scale" aria-label="Sign up for Elite Explorer">
                Sign Up
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Spacer for fixed navbar */}
      <div aria-hidden="true" style={{ height: 64 }} />

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container" style={{ padding: "22px 0" }}>
          <div className="footer-columns">
            <div>
              <div className="brand" style={{ marginBottom: 10 }}>
                <Sparkles size={18} />
                <span>Elite Explorer</span>
              </div>
              <p className="p" style={{ color: "#94a3b8", maxWidth: 360 }}>
                A professional developer analytics experience powered by secure backend caching.
              </p>
            </div>

            <div>
              <div className="footer-col-title">Product</div>
              <div className="footer-links-col">
                <Link className="footer-link" to="/features">
                  Features & Pricing
                </Link>
                <Link className="footer-link" to="/help">
                  Help / FAQ
                </Link>
              </div>
            </div>

            <div>
              <div className="footer-col-title">Company</div>
              <div className="footer-links-col">
                <Link className="footer-link" to="/about">
                  About
                </Link>
                <Link className="footer-link" to="/contact">
                  Contact
                </Link>
              </div>
            </div>

            <div>
              <div className="footer-col-title">Resources</div>
              <div className="footer-links-col">
                <Link className="footer-link" to="/blog">
                  Blog / Updates
                </Link>
              </div>
            </div>

            <div>
              <div className="footer-col-title">Legal</div>
              <div className="footer-links-col">
                <Link className="footer-link" to="/privacy">
                  Privacy
                </Link>
                <Link className="footer-link" to="/terms">
                  Terms
                </Link>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
            <div className="p" style={{ color: "#94a3b8" }}>
              © {new Date().getFullYear()} Elite Explorer. All rights reserved.
            </div>
            <div className="p" style={{ color: "#94a3b8" }}>
              Built with React, FastAPI, PostgreSQL.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
