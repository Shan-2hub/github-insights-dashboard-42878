/**
 * Backend API client.
 *
 * Security note:
 * - The frontend must NEVER call GitHub directly or embed tokens.
 * - All GitHub requests happen on the FastAPI backend, which uses GITHUB_TOKEN from env.
 */

import { getAuthToken } from "./auth";

const DEFAULT_BASE_URL = "";

/** @returns {string} API base URL */
function getBaseUrl() {
  // CRA env var convention: REACT_APP_*
  // Backwards/forwards compatible:
  // - REACT_APP_API_BASE is the container's configured env var
  // - REACT_APP_API_BASE_URL may exist in older templates
  return process.env.REACT_APP_API_BASE || process.env.REACT_APP_API_BASE_URL || DEFAULT_BASE_URL;
}

function authHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// PUBLIC_INTERFACE
export async function searchUser(username) {
  /** Search for a GitHub user via backend (caching is handled server-side). */
  const res = await fetch(`${getBaseUrl()}/api/search/${encodeURIComponent(username)}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    let payload = null;
    try {
      payload = await res.json();
    } catch {
      // ignore
    }
    const message = payload?.detail || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return res.json();
}

// PUBLIC_INTERFACE
export async function register(email, password) {
  /** Register and receive JWT token. */
  const res = await fetch(`${getBaseUrl()}/api/auth/register`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(payload?.detail || `Register failed (${res.status})`);
  return payload;
}

// PUBLIC_INTERFACE
export async function login(email, password) {
  /** Login and receive JWT token. */
  const res = await fetch(`${getBaseUrl()}/api/auth/login`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(payload?.detail || `Login failed (${res.status})`);
  return payload;
}

// PUBLIC_INTERFACE
export async function getAdminHistory() {
  /** Fetch recent searches for the admin table (protected). */
  const res = await fetch(`${getBaseUrl()}/api/admin/history`, {
    method: "GET",
    headers: { Accept: "application/json", ...authHeaders() },
  });

  if (!res.ok) throw new Error(`Admin history failed (${res.status})`);
  return res.json();
}

// PUBLIC_INTERFACE
export async function getAdminStats() {
  /** Fetch admin stats (protected). */
  const res = await fetch(`${getBaseUrl()}/api/admin/stats`, {
    method: "GET",
    headers: { Accept: "application/json", ...authHeaders() },
  });

  if (!res.ok) throw new Error(`Admin stats failed (${res.status})`);
  return res.json();
}
