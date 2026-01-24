import React from "react";
import { Card, CardContent } from "../components/ui/card";

// PUBLIC_INTERFACE
export default function HelpPage() {
  /** Help/FAQ page (public marketing portal). */
  const faqs = [
    {
      q: "Why is the data fast sometimes?",
      a: "If a username has been searched recently, results may be returned from the backend cache (24h TTL).",
    },
    {
      q: "Do you store GitHub tokens in the browser?",
      a: "No. GitHub API requests and tokens are backend-only. The frontend never embeds GitHub credentials.",
    },
    {
      q: "Why are some stats missing?",
      a: "Some fields depend on public GitHub data availability and backend processing. Not all users expose the same data.",
    },
    {
      q: "How do I access the dashboard?",
      a: "Create an account or log in, then search a username. You can also paste a username directly in the app search.",
    },
  ];

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <div className="brand">
            <span>Help & FAQ</span>
            <span className="badge">Support</span>
          </div>
        </header>

        <Card>
          <CardContent>
            <h1 className="h1" style={{ marginBottom: 8 }}>
              Help Center
            </h1>
            <p className="p" style={{ color: "#94a3b8" }}>
              Common questions about Elite Explorer.
            </p>

            <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
              {faqs.map((f) => (
                <Card key={f.q} className="hover-scale">
                  <CardContent>
                    <div className="badge" style={{ width: "fit-content" }}>
                      Question
                    </div>
                    <div style={{ marginTop: 10, fontSize: 16, fontWeight: 800 }}>{f.q}</div>
                    <p className="p" style={{ marginTop: 8 }}>
                      {f.a}
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
