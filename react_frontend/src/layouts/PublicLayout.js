import React from "react";
import { Link, Outlet } from "react-router-dom";
import { LogIn, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { isAuthed } from "../lib/auth";

// PUBLIC_INTERFACE
export default function PublicLayout() {
  /** Public portal layout: persistent navbar + footer + routed content. */
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header className="navbar">
        <div className="container navbar-inner">
          <div className="brand">
            <Sparkles size={18} />
            <span>Elite Explorer</span>
            <span className="badge">Midnight</span>
          </div>

          <nav className="navlinks" aria-label="Primary navigation">
            <Link className="navlink" to="/">
              Home
            </Link>
            <Link className="navlink" to="/about">
              About Us
            </Link>
            <Link className="navlink" to="/contact">
              Contact
            </Link>
          </nav>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {isAuthed() ? (
              <Button asChild href="/app">
                Go to App
              </Button>
            ) : (
              <Button asChild href="/auth" variant="primary">
                <LogIn size={16} /> Login / Register
              </Button>
            )}
          </div>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="p" style={{ color: "#94a3b8" }}>
            © {new Date().getFullYear()} Elite Explorer. All rights reserved.
          </div>
          <div className="footer-links">
            <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>
              Privacy
            </a>
            <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>
              Terms
            </a>
            <a className="footer-link" href="#" onClick={(e) => e.preventDefault()}>
              Sitemap
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
