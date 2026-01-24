/**
 * Backend API client.
 *
 * Security note:
 * - The frontend must NEVER call GitHub directly or embed tokens.
 * - All GitHub requests happen on the FastAPI backend, which uses GITHUB_TOKEN from env.
 */

const DEFAULT_BASE_URL = "";

/** @returns {string} API base URL */
function getBaseUrl() {
  // CRA env var convention: REACT_APP_*
  return process.env.REACT_APP_API_BASE_URL || DEFAULT_BASE_URL;
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
export async function getAdminHistory() {
  /** Fetch recent searches for the admin table. */
  const res = await fetch(`${getBaseUrl()}/api/admin/history`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) throw new Error(`Admin history failed (${res.status})`);
  return res.json();
}

// PUBLIC_INTERFACE
export async function getAdminStats() {
  /** Fetch admin stats (rate limit info, aggregates). */
  const res = await fetch(`${getBaseUrl()}/api/admin/stats`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) throw new Error(`Admin stats failed (${res.status})`);
  return res.json();
}
