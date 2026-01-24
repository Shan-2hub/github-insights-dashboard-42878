/**
 * Minimal JWT auth utilities for Elite Explorer.
 *
 * Storage:
 * - Stores bearer token in localStorage (simple template approach).
 * - In production, consider httpOnly cookies + CSRF protection.
 */

const TOKEN_KEY = "elite_explorer_token";

// PUBLIC_INTERFACE
export function getAuthToken() {
  /** Get JWT bearer token from storage (or null). */
  return localStorage.getItem(TOKEN_KEY);
}

// PUBLIC_INTERFACE
export function setAuthToken(token) {
  /** Persist JWT bearer token. */
  localStorage.setItem(TOKEN_KEY, token);
}

// PUBLIC_INTERFACE
export function clearAuthToken() {
  /** Clear JWT bearer token. */
  localStorage.removeItem(TOKEN_KEY);
}

// PUBLIC_INTERFACE
export function isAuthed() {
  /** Returns true if a token exists. */
  return Boolean(getAuthToken());
}
