/**
 * Backend API client.
 *
 * Security note:
 * - The frontend must NEVER call GitHub directly or embed tokens.
 * - All GitHub requests happen on the FastAPI backend, which uses GITHUB_TOKEN from env.
 */

import { getAuthToken } from "./auth";

const DEFAULT_BASE_URL = "";

/**
 * @returns {string} API base URL (no trailing slash). If empty, calls are made relative to current origin.
 */
function getBaseUrl() {
  // CRA env var convention: REACT_APP_*
  //
  // IMPORTANT:
  // The project exposes env vars named REACT_APP_API_BASE and/or REACT_APP_BACKEND_URL.
  // Previously this file looked for REACT_APP_API_BASE_URL, which is not configured.
  //
  // NOTE on "Failed to fetch":
  // - If the URL is unreachable (connection refused/DNS), the browser throws a network TypeError.
  // - If the app is served over https and the API is http, the browser may block it as mixed content.
  const raw =
    process.env.REACT_APP_API_BASE ||
    process.env.REACT_APP_BACKEND_URL ||
    // Backwards compatibility:
    process.env.REACT_APP_API_BASE_URL ||
    DEFAULT_BASE_URL;

  const trimmed = typeof raw === "string" ? raw.trim() : "";

  // Allow empty string for relative calls (works well with CRA dev proxy).
  if (!trimmed) return DEFAULT_BASE_URL;

  // If a host:port is provided without a scheme, assume http:// (common local-dev config).
  const withScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed) ? trimmed : `http://${trimmed}`;

  // Normalize trailing slash so callers can safely append "/api/...".
  const normalized = withScheme.replace(/\/$/, "");

  // Helpful dev-only diagnostics; safe to keep noisy logs out of production.
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[api] baseUrl =", normalized || "(relative)");
    if (normalized.startsWith("http://") && window?.location?.protocol === "https:") {
      // eslint-disable-next-line no-console
      console.warn(
        "[api] Potential mixed-content risk: frontend is https but API base is http. Consider using https or a proxy."
      );
    }
  }

  return normalized;
}

function authHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Wrap fetch to provide better error messages for network failures like "Failed to fetch".
 * @param {string} url
 * @param {RequestInit} options
 */
async function safeFetch(url, options) {
  try {
    return await fetch(url, options);
  } catch (err) {
    // Browser network errors are often a TypeError with message "Failed to fetch".
    const baseHint =
      "Network request failed. Check that the backend is reachable, the URL is correct, and CORS/HTTPS (mixed content) is configured.";
    const detail = err?.message ? ` (${err.message})` : "";
    throw new Error(`${baseHint}\nRequest URL: ${url}${detail}`);
  }
}

// PUBLIC_INTERFACE
export async function searchUser(username) {
  /** Search for a GitHub user via backend (caching is handled server-side). */
  const res = await safeFetch(`${getBaseUrl()}/api/search/${encodeURIComponent(username)}`, {
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
  const res = await safeFetch(`${getBaseUrl()}/api/auth/register`, {
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
  const res = await safeFetch(`${getBaseUrl()}/api/auth/login`, {
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
  const res = await safeFetch(`${getBaseUrl()}/api/admin/history`, {
    method: "GET",
    headers: { Accept: "application/json", ...authHeaders() },
  });

  if (!res.ok) throw new Error(`Admin history failed (${res.status})`);
  return res.json();
}

// PUBLIC_INTERFACE
export async function getAdminStats() {
  /** Fetch admin stats (protected). */
  const res = await safeFetch(`${getBaseUrl()}/api/admin/stats`, {
    method: "GET",
    headers: { Accept: "application/json", ...authHeaders() },
  });

  if (!res.ok) throw new Error(`Admin stats failed (${res.status})`);
  return res.json();
}
