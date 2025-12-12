// src/js/pages/supervisor-dashboard.js
import { getCurrentUser, requireRole } from "../api/auth.js";
import { supervisors } from "../db/supervisors.js";

// Enforce role
requireRole("supervisor");

// Get logged-in user
const user = getCurrentUser();
if (!user) {
  // safety; requireRole should already redirect
  window.location.href = "login.html";
}

// Find the supervisor domain record
const supervisor = supervisors.find((s) => s.id === user.personId);
if (!supervisor) {
  console.warn("No supervisor record found for user", user);
}

// Fill the DOM
const block = document.querySelector("[data-profile-block]");
if (!block || !supervisor) {
  // nothing to render
} else {
  const avatarEl = block.querySelector("[data-profile-avatar]");
  const nameEl = block.querySelector("[data-profile-name]");
  const tagsEl = block.querySelector("[data-profile-tags]");

  if (avatarEl) {
    avatarEl.src = supervisor.avatarUrl;
    avatarEl.alt = supervisor.name;
  }

  if (nameEl) {
    nameEl.textContent = supervisor.name;
  }

  if (tagsEl) {
    const tags = [supervisor.title, supervisor.department].filter(Boolean);

    // Clear existing tags
    tagsEl.innerHTML = "";

    tags.forEach((tagText) => {
      const span = document.createElement("span");
      span.className = "tag__container tag__container-primary"; // adapt to your CSS
      span.textContent = tagText;
      tagsEl.appendChild(span);
    });
  }
}
