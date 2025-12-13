// login.js
window.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("login-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = document.getElementById("status");
      status.textContent = "";

      const payload = {
        national_id: document.getElementById("national_id").value,
        password: document.getElementById("password").value,
      };

      try {
        const res = await apiRequest("/auth/login-credentials", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        console.log("[login] received tempToken:", res.tempToken);

        // This is what face-verification.js will read
        sessionStorage.setItem("tempToken", res.tempToken);

        window.location.href = "/face-verification.html";
      } catch (err) {
        status.textContent = err.message;
      }
    });
});
