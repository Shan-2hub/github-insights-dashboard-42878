import React from "react";
import { Check, Sparkles, Shield, Zap } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

/**
 * Marketing content for the Features / Pricing page.
 * This is intentionally static (SaaS-style) to build trust and professionalism.
 */

// PUBLIC_INTERFACE
export default function FeaturesPage() {
  /** Features/Pricing page (public marketing portal). */
  const featureCards = [
    {
      title: "AI Insights",
      description: "Persona-style summaries, activity signals, and key developer indicators—presented clearly.",
      icon: Sparkles,
    },
    {
      title: "Real-Time Stats",
      description: "Up-to-date charts and activity types rendered in a clean bento-grid dashboard.",
      icon: Zap,
    },
    {
      title: "Smart Caching",
      description: "Backend caching (24h TTL) for fast repeat lookups and reduced external API load.",
      icon: Shield,
    },
  ];

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <div className="brand">
            <span>Features & Pricing</span>
            <span className="badge">SaaS Overview</span>
          </div>
        </header>

        <section style={{ textAlign: "center" }}>
          <h1 className="h1">Everything you need to explore developer personas</h1>
          <p className="p" style={{ color: "#94a3b8", maxWidth: 780, margin: "0 auto" }}>
            Elite Explorer combines secure backend processing with a polished, dark-mode analytics dashboard—built for
            professional developer intelligence.
          </p>
        </section>

        <section style={{ marginTop: 18, display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {featureCards.map((f) => (
            <Card key={f.title} className="hover-scale">
              <CardContent>
                <div className="badge" style={{ width: "fit-content" }}>
                  <f.icon size={14} /> {f.title}
                </div>
                <div style={{ marginTop: 10, fontSize: 18, fontWeight: 800, letterSpacing: -0.2 }}>{f.title}</div>
                <p className="p" style={{ marginTop: 8 }}>
                  {f.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section style={{ marginTop: 16 }}>
          <div className="bento">
            <Card className="hover-scale">
              <CardContent>
                <div className="badge" style={{ width: "fit-content" }}>
                  Free Tier
                </div>
                <h2 style={{ margin: "10px 0 4px", letterSpacing: -0.2 }}>Free</h2>
                <p className="p" style={{ color: "#94a3b8" }}>
                  Perfect for personal exploration and evaluating the platform.
                </p>

                <ul style={{ listStyle: "none", padding: 0, margin: "14px 0 0", display: "grid", gap: 10 }}>
                  {["Profile overview", "Language distribution chart", "Recent activity feed", "Fast cached responses"].map((x) => (
                    <li key={x} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span className="badge" aria-hidden="true">
                        <Check size={14} />
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 650 }}>{x}</span>
                    </li>
                  ))}
                </ul>

                <div style={{ marginTop: 14 }}>
                  <Button asChild href="/auth" variant="primary" className="hover-scale">
                    Get started
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardContent>
                <div className="badge" style={{ width: "fit-content", borderColor: "rgba(245,158,11,0.35)" }}>
                  Pro Tier
                </div>
                <h2 style={{ margin: "10px 0 4px", letterSpacing: -0.2 }}>Pro</h2>
                <p className="p" style={{ color: "#94a3b8" }}>
                  A professional structure for teams—even if pricing is not enabled yet.
                </p>

                <ul style={{ listStyle: "none", padding: 0, margin: "14px 0 0", display: "grid", gap: 10 }}>
                  {[
                    "Saved profiles & watchlists (planned)",
                    "Team dashboards (planned)",
                    "Priority caching & analytics (planned)",
                    "SLA / compliance controls (planned)",
                  ].map((x) => (
                    <li key={x} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span className="badge" aria-hidden="true">
                        <Check size={14} />
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 650 }}>{x}</span>
                    </li>
                  ))}
                </ul>

                <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Button className="hover-scale" onClick={() => window.alert("Pro Tier is not enabled in this template yet.")}>
                    Request access
                  </Button>
                  <Button asChild href="/contact" className="hover-scale">
                    Talk to us
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
