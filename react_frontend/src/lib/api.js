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
 * PUBLIC_INTERFACE
 * @returns {string} API base URL (normalized, no trailing slash).
 *
 * Notes:
 * - Prefer absolute URL via REACT_APP_API_BASE / REACT_APP_API_BASE_URL (production, remote backend).
 * - If unset, defaults to same-origin ("") so calls go to `/api/...` (works with a reverse proxy).
 * - In HTTPS pages, calling an HTTP API is mixed-content and will be blocked; we surface a clear error.
 */
export function getBaseUrl() {
  // CRA env var convention: REACT_APP_*
  // Backwards/forwards compatible:
  // - REACT_APP_API_BASE is the container's configured env var
  // - REACT_APP_API_BASE_URL may exist in older templates
  const raw =
    process.env.REACT_APP_API_BASE ||
    process.env.REACT_APP_API_BASE_URL ||
    DEFAULT_BASE_URL;

  // Same-origin fallback
  if (!raw) return "";

  // Normalize trailing slash to avoid `//api/...`
  const normalized = raw.endsWith("/") ? raw.slice(0, -1) : raw;

  // Guard against mixed-content (https page -> http API).
  // This manifests as "Failed to fetch" in the browser with no useful error body.
  if (typeof window !== "undefined") {
    try {
      const pageIsHttps = window.location?.protocol === "https:";
      const apiProtocol = new URL(normalized).protocol; // throws if not absolute URL
      if (pageIsHttps && apiProtocol === "http:") {
        throw new Error(
          `Mixed content blocked: page is HTTPS but API base is HTTP (${normalized}). ` +
            `Use an HTTPS API URL or same-origin proxy (/api).`
        );
      }
    } catch {
      // If URL() fails (e.g., relative), we treat as same-origin and allow it.
      // Example: normalized === "" or "/api" (not used here but safe).
    }
  }

  return normalized;
}

function authHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Make a JSON request and provide better diagnostics for auth failures.
 * - Distinguishes network/mixed-content/CORS ("Failed to fetch") from HTTP 4xx/5xx.
 * - Returns parsed JSON payload on success.
 *
 * Note: we keep this internal to avoid changing the module's public API.
 */
async function requestJson(url, { method, headers, body, op }) {
  try {
    // Helpful breadcrumb when users report "register is calling login" etc.
    // This logs the exact endpoint.
    // eslint-disable-next-line no-console
    console.debug(`[api] ${op} -> ${method} ${url}`);

    const res = await fetch(url, { method, headers, body });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = payload?.detail || `${op} failed (${res.status})`;
      const err = new Error(message);
      err.status = res.status;
      err.payload = payload;
      err.url = url;
      err.method = method;
      throw err;
    }

    return payload;
  } catch (err) {
    // Browser fetch network errors are commonly:
    // - TypeError: Failed to fetch (CORS, DNS, refused connection, mixed content blocked)
    // Provide a more actionable message while keeping the original error attached.
    const isFetchNetworkError =
      err instanceof TypeError &&
      /failed to fetch/i.test(err.message || "");

    if (isFetchNetworkError) {
      const wrapped = new Error(
        `${op} network error: Failed to fetch. ` +
          `This usually means the backend is unreachable, blocked by CORS, or mixed-content (HTTPS page calling HTTP API). ` +
          `Endpoint: ${method} ${url}`
      );
      wrapped.cause = err;
      wrapped.url = url;
      wrapped.method = method;
      // eslint-disable-next-line no-console
      console.error("[api] network error", { op, method, url, err });
      throw wrapped;
    }

    // eslint-disable-next-line no-console
    console.error("[api] request error", { op, method, url, err });
    throw err;
  }
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

/* PUBLIC_INTERFACE */
export async function register(email, password) {
  /** Register and receive JWT token. */
  const url = `${getBaseUrl()}/api/auth/register`;
  return requestJson(url, {
    op: "Register",
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

/* PUBLIC_INTERFACE */
export async function login(email, password) {
  /** Login and receive JWT token. */
  const url = `${getBaseUrl()}/api/auth/login`;
  return requestJson(url, {
    op: "Login",
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
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
