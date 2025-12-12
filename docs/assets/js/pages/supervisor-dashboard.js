// src/js/pages/admin-dashboard.js
import { requireRole, getCurrentUser, logout } from "../api/auth.js";

requireRole("supervisor"); // redirect to login if not admin

const user = getCurrentUser();
document.querySelector(
  "#welcome"
).textContent = `مرحبًا يا ${user.username} (مشرف)`;

document.querySelector("#logoutBtn").addEventListener("click", () => {
  logout();
  window.location.href = "/login.html";
});
