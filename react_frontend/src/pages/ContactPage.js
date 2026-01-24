import React from "react";
import { Card, CardContent } from "../components/ui/card";

// PUBLIC_INTERFACE
export default function ContactPage() {
  /** Static contact page for the public marketing portal. */
  return (
    <div className="page">
      <div className="container">
        <div className="header">
          <div className="brand">
            <span>Contact</span>
            <span className="badge">Support</span>
          </div>
        </div>

        <Card>
          <CardContent>
            <h1 className="h1" style={{ marginBottom: 6 }}>
              Get in touch
            </h1>
            <p className="p">
              For questions about Elite Explorer, reach out to your internal administrator. (This template keeps contact
              simple.)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
