import React from "react";
import { Card, CardContent } from "../components/ui/card";

// PUBLIC_INTERFACE
export default function AboutPage() {
  /** Static about page for the public marketing portal. */
  return (
    <div className="page">
      <div className="container">
        <div className="header">
          <div className="brand">
            <span>About Elite Explorer</span>
            <span className="badge">Developer Analytics</span>
          </div>
        </div>

        <Card>
          <CardContent>
            <h1 className="h1" style={{ marginBottom: 6 }}>
              Built for modern developer intelligence
            </h1>
            <p className="p">
              Elite Explorer is a high-performance GitHub insights experience. We combine fast backend caching with a
              modern “Midnight” UI to help teams understand developer profiles at a glance.
            </p>

            <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
              <div className="badge">Backend-only GitHub token usage</div>
              <div className="badge">24h smart caching</div>
              <div className="badge">Bento dashboard with charts + activity</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
