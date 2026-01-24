import React from "react";
import { Database, Server, Code2 } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

// PUBLIC_INTERFACE
export default function AboutPage() {
  /** About page with two-column layout per spec. */
  const stack = [
    { name: "React", icon: Code2, detail: "Modern, component-based UI with Tailwind utilities." },
    { name: "FastAPI", icon: Server, detail: "Secure backend API with caching and analytics processing." },
    { name: "PostgreSQL", icon: Database, detail: "Persistent cache and search logs for speed and admin stats." },
  ];

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <div className="brand">
            <span>About</span>
            <span className="badge">Our Mission</span>
          </div>
        </header>

        <div className="about-grid">
          {/* Left column: text (left-aligned within container) */}
          <Card className="hover-scale">
            <CardContent>
              <h1 className="h1" style={{ marginBottom: 8 }}>
                Our Mission
              </h1>
              <p className="p" style={{ color: "#94a3b8" }}>
                Elite Explorer helps teams and individuals understand developer personas quickly and professionally.
                Searches are processed server-side, cached for speed, and presented through a clean dark-mode dashboard.
              </p>

              <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
                <div className="badge">Backend-only GitHub token usage</div>
                <div className="badge">24h smart caching</div>
                <div className="badge">Bento dashboard with charts + activity</div>
              </div>
            </CardContent>
          </Card>

          {/* Right column: cards centered within column */}
          <div style={{ display: "grid", gap: 12, alignContent: "start", justifyItems: "center" }}>
            {stack.map((s) => (
              <Card key={s.name} className="hover-scale" style={{ width: "min(420px, 100%)" }}>
                <CardContent style={{ textAlign: "center" }}>
                  <div className="badge" style={{ width: "fit-content", margin: "0 auto" }}>
                    <s.icon size={14} /> {s.name}
                  </div>
                  <p className="p" style={{ marginTop: 10 }}>
                    {s.detail}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
