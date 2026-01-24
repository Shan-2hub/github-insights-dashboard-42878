import React from "react";
import { Link, Outlet } from "react-router-dom";
import { LogIn, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { isAuthed } from "../lib/auth";

// PUBLIC_INTERFACE
export default function PublicLayout() {
  /** Public portal layout: fixed navbar + multi-column footer + routed content. */
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header className="navbar" style={{ position: "fixed", left: 0, right: 0 }}>
        <div className="container navbar-inner">
          {/* Left: Logo/brand */}
          <Link to="/" className="brand" style={{ textDecoration: "none" }} aria-label="Elite Explorer home">
            <Sparkles size={18} />
            <span>Elite Explorer</span>
            <span className="badge">Midnight</span>
          </Link>

          {/* Center: Navigation */}
          <nav className="navlinks navlinks-centered" aria-label="Primary navigation">
            <Link className="navlink" to="/">
              Home
            </Link>
            <Link className="navlink" to="/features">
              Features
            </Link>
            <Link className="navlink" to="/about">
              About
            </Link>
            <Link className="navlink" to="/contact">
              Contact
            </Link>
            <Link className="navlink" to="/auth">
              Login
            </Link>
          </nav>

          {/* Right: CTA */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
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
