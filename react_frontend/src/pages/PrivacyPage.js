import React from "react";
import { Card, CardContent } from "../components/ui/card";

// PUBLIC_INTERFACE
export default function PrivacyPage() {
  /** Privacy Policy page (public marketing portal). */
  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <div className="brand">
            <span>Privacy Policy</span>
            <span className="badge">Legal</span>
          </div>
        </header>

        <Card>
          <CardContent>
            <h1 className="h1" style={{ marginBottom: 8 }}>
              Privacy Policy
            </h1>
            <p className="p" style={{ color: "#94a3b8" }}>
              This template provides a professional placeholder privacy policy page. Replace with counsel-reviewed content
              before production use.
            </p>

            <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
              <section>
                <div className="badge" style={{ width: "fit-content" }}>
                  Overview
                </div>
                <p className="p" style={{ marginTop: 8 }}>
                  Elite Explorer processes GitHub usernames that users search for. Analytics are generated server-side and
                  may be cached to improve performance.
                </p>
              </section>

              <section>
                <div className="badge" style={{ width: "fit-content" }}>
                  Data We Process
                </div>
                <p className="p" style={{ marginTop: 8 }}>
                  The application may process: searched usernames, timestamps, derived analytics (e.g., language stats),
                  and operational logs needed for security and reliability.
                </p>
              </section>

              <section>
                <div className="badge" style={{ width: "fit-content" }}>
                  Security
                </div>
                <p className="p" style={{ marginTop: 8 }}>
                  GitHub API access is performed on the backend only. The frontend never embeds GitHub tokens. Caching is
                  used to reduce repeated external requests.
                </p>
              </section>

              <section>
                <div className="badge" style={{ width: "fit-content" }}>
                  Contact
                </div>
                <p className="p" style={{ marginTop: 8 }}>
                  For privacy questions, use the contact page and reach your administrator or support contact.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
