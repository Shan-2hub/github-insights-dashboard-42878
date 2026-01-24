import React from "react";
import { Card, CardContent } from "../components/ui/card";

// PUBLIC_INTERFACE
export default function SettingsPage() {
  /** Settings placeholder page for app portal. */
  return (
    <div className="page" style={{ paddingTop: 22 }}>
      <div className="container">
        <Card>
          <CardContent>
            <h1 className="h1" style={{ marginBottom: 6 }}>
              Settings
            </h1>
            <p className="p" style={{ color: "#94a3b8" }}>
              Settings management can be added here (profile, preferences, etc.).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
