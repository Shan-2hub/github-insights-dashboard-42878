import React from "react";
import { Card, CardContent } from "../components/ui/card";

// PUBLIC_INTERFACE
export default function SavedProfilesPage() {
  /** Saved profiles placeholder page for app portal. */
  return (
    <div className="page" style={{ paddingTop: 22 }}>
      <div className="container">
        <Card>
          <CardContent>
            <h1 className="h1" style={{ marginBottom: 6 }}>
              Saved Profiles
            </h1>
            <p className="p" style={{ color: "#94a3b8" }}>
              Save favorite developers here (not implemented in this template).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
