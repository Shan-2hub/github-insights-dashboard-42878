import React from "react";
import { Navigate, useParams } from "react-router-dom";

// PUBLIC_INTERFACE
export default function DashboardRedirectPage() {
  /** Redirect /dashboard/:username to /app/dashboard/:username */
  const { username } = useParams();
  return <Navigate to={`/app/dashboard/${encodeURIComponent(username || "")}`} replace />;
}
