// src/js/main.js

console.log("JS is loaded from /assets/js/main.js");

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("test-button");
  const out = document.getElementById("output");

  if (btn && out) {
    btn.addEventListener("click", () => {
      out.textContent = "Button click handler is working.";
    });
  }
});
