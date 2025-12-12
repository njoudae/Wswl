import { findUserByCredentials } from "../db/usersDB.js";

const ACTIVE_USER_KEY = "activeUser";

// Perform login using the in-memory users "database".
export function login(idNumber, password) {
  const user = findUserByCredentials(idNumber, password);

  if (!user) {
    return { ok: false, error: "INVALID_CREDENTIALS" };
  }

  // Persist only non-sensitive fields; never store raw password in a real app.
  const { password: _, ...safeUser } = user;
  localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(safeUser));

  return { ok: true, user: safeUser };
}

// Remove the active user from storage.
export function logout() {
  localStorage.removeItem(ACTIVE_USER_KEY);
}

// Get the currently logged-in user or null.
export function getCurrentUser() {
  const raw = localStorage.getItem(ACTIVE_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    // Corrupted storage; clear it.
    localStorage.removeItem(ACTIVE_USER_KEY);
    return null;
  }
}

// Utility: is there any logged-in user?
export function isAuthenticated() {
  return !!getCurrentUser();
}

// Utility: does current user have one of the required roles?
export function hasRole(...roles) {
  const user = getCurrentUser();
  if (!user) return false;
  return roles.includes(user.role);
}

// Enforce that a user is logged in. If not, redirect to login.
export function requireAuth({ redirectTo = "/login.html" } = {}) {
  if (!isAuthenticated()) {
    window.location.href = redirectTo;
  }
}

// Enforce a particular role (or roles). Redirect if not matched.
export function requireRole(allowedRoles, { redirectTo = "/login.html" } = {}) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  if (!hasRole(...roles)) {
    window.location.href = redirectTo;
  }
}

// After successful login, route user to the correct dashboard based on role.
export function redirectByRole(user) {
  const u = user || getCurrentUser();
  if (!u) {
    window.location.href = "/login.html";
    return;
  }

  switch (u.role) {
    // case "admin":
    //   window.location.href = "/admin-dashboard.html";
    //   break;
    case "driver":
      window.location.href = "/users/driver-dashboard.html";
      break;
    case "supervisor":
      window.location.href = "/users/supervisor-dashboard.html";
      break;
    case "passenger":
      window.location.href = "/users/passenger-dashboard.html";
      break;
    default:
      // Fallback if role is unknown.
      window.location.href = "/login.html";
  }
}
