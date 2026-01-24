import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAuthToken, isAuthed } from "../lib/auth";

function decodeJwtPayload(token) {
  try {
    const [, payloadB64] = token.split(".");
    const json = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export default function ProtectedRoute({ children, requireAdmin = false }) {
  /**
   * Protects a route by requiring a stored JWT token.
   * If requireAdmin=true, we also require is_admin in the JWT payload.
   */
  const loc = useLocation();

  if (!isAuthed()) {
    return <Navigate to="/auth" replace state={{ from: loc.pathname }} />;
  }

  if (requireAdmin) {
    const payload = decodeJwtPayload(getAuthToken());
    if (!payload?.is_admin) return <Navigate to="/app" replace />;
  }

  return children;
}
