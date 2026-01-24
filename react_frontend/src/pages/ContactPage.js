import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

// PUBLIC_INTERFACE
export default function ContactPage() {
  /** Contact page with centered single-column form per spec. */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setStatus("Thanks! This template does not send messages yet.");
  };

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <div className="brand">
            <span>Contact</span>
            <span className="badge">Support</span>
          </div>
        </header>

        <div style={{ display: "grid", placeItems: "center" }}>
          <Card className="glass" style={{ width: "min(640px, 100%)" }}>
            <CardContent>
              <h1 className="h1" style={{ marginBottom: 8, textAlign: "center" }}>
                Get in touch
              </h1>
              <p className="p" style={{ color: "#94a3b8", textAlign: "center" }}>
                Send us a message and we’ll route it to the right place.
              </p>

              <form onSubmit={onSubmit} style={{ marginTop: 16, display: "grid", gap: 12 }}>
                <label style={{ display: "grid", gap: 6, textAlign: "left" }}>
                  <span className="badge" style={{ width: "fit-content" }}>
                    Name
                  </span>
                  <input
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </label>

                <label style={{ display: "grid", gap: 6, textAlign: "left" }}>
                  <span className="badge" style={{ width: "fit-content" }}>
                    Email
                  </span>
                  <input
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </label>

                <label style={{ display: "grid", gap: 6, textAlign: "left" }}>
                  <span className="badge" style={{ width: "fit-content" }}>
                    Message
                  </span>
                  <textarea
                    className="input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    placeholder="How can we help?"
                    style={{ resize: "vertical" }}
                  />
                </label>

                <div style={{ display: "grid", gap: 10, justifyItems: "start" }}>
                  <Button type="submit" variant="primary" className="hover-scale">
                    Send Message
                  </Button>
                  {status ? (
                    <div className="p" style={{ color: "#94a3b8" }} aria-live="polite">
                      {status}
                    </div>
                  ) : null}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
