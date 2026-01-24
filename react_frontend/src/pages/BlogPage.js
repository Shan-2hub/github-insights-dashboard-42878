import React, { useMemo } from "react";
import { Card, CardContent } from "../components/ui/card";

// PUBLIC_INTERFACE
export default function BlogPage() {
  /** Blog/Updates page (public marketing portal). */
  const posts = useMemo(
    () => [
      {
        title: "Welcome to Elite Explorer",
        date: "2026-01-01",
        excerpt: "A fast, secure, dark-mode developer analytics dashboard with backend caching.",
      },
      {
        title: "Bento dashboards & activity signals",
        date: "2026-01-10",
        excerpt: "We’ve improved the dashboard layout and refined the activity timeline rendering.",
      },
      {
        title: "SaaS polish: Pricing, Legal, and Help pages",
        date: "2026-01-24",
        excerpt: "New marketing pages and interaction polish to improve trust and professionalism.",
      },
    ],
    []
  );

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <div className="brand">
            <span>Blog & Updates</span>
            <span className="badge">News</span>
          </div>
        </header>

        <Card className="glass">
          <CardContent>
            <h1 className="h1" style={{ marginBottom: 8, textAlign: "center" }}>
              Updates
            </h1>
            <p className="p" style={{ color: "#94a3b8", textAlign: "center" }}>
              Product notes, new features, and insights.
            </p>

            <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
              {posts.map((p) => (
                <Card key={p.title} className="hover-scale">
                  <CardContent>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                      <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.2 }}>{p.title}</div>
                      <div className="badge" aria-label={`Post date ${p.date}`}>
                        {p.date}
                      </div>
                    </div>
                    <p className="p" style={{ marginTop: 8 }}>
                      {p.excerpt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
