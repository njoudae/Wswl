// src/js/pages/login.js
import { login, redirectByRole, getCurrentUser } from "../api/auth.js";

const form = document.querySelector("#loginForm");
const idNumberInput = document.querySelector("#idNumber");
const passwordInput = document.querySelector("#password");
const errorBox = document.querySelector("#loginError");

// If user is already logged in, optionally redirect immediately:
// const existingUser = getCurrentUser();
// if (existingUser) {
//   redirectByRole(existingUser);
// }

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const idNumber = idNumberInput.value;
  const password = passwordInput.value;

  const result = login(idNumber, password);

  if (!result.ok) {
    if (errorBox) {
      errorBox.textContent = "اسم المستخدم أو كلمة المرور غير صحيحة.";
      errorBox.style.display = "block";
    } else {
      alert("اسم المستخدم أو كلمة المرور غير صحيحة.");
    }
    return;
  }

  redirectByRole(result.user);
});
