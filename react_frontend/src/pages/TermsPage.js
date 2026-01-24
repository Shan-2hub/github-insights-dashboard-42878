import React from "react";
import { Card, CardContent } from "../components/ui/card";

// PUBLIC_INTERFACE
export default function TermsPage() {
  /** Terms of Service page (public marketing portal). */
  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <div className="brand">
            <span>Terms of Service</span>
            <span className="badge">Legal</span>
          </div>
        </header>

        <Card>
          <CardContent>
            <h1 className="h1" style={{ marginBottom: 8 }}>
              Terms of Service
            </h1>
            <p className="p" style={{ color: "#94a3b8" }}>
              This template includes a lightweight ToS placeholder for a SaaS-like presentation. Replace with formal
              terms before production use.
            </p>

            <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
              <section>
                <div className="badge" style={{ width: "fit-content" }}>
                  Acceptable Use
                </div>
                <p className="p" style={{ marginTop: 8 }}>
                  Do not attempt to misuse the service, scrape beyond intended usage, or violate GitHub’s terms and API
                  policies.
                </p>
              </section>

              <section>
                <div className="badge" style={{ width: "fit-content" }}>
                  No Warranty
                </div>
                <p className="p" style={{ marginTop: 8 }}>
                  The service is provided “as is.” Analytics are best-effort and may be incomplete depending on public
                  data availability.
                </p>
              </section>

              <section>
                <div className="badge" style={{ width: "fit-content" }}>
                  Limitation of Liability
                </div>
                <p className="p" style={{ marginTop: 8 }}>
                  To the maximum extent permitted by law, Elite Explorer is not liable for indirect damages arising from
                  use of the service.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
