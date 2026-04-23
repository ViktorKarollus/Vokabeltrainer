document.addEventListener("DOMContentLoaded", () => {
const API_BASE_URL = window.location.origin;
 const registerForm = document.getElementById("register-form"); //Register-Formular
 if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
const username = document.getElementById("username").value;
const password = document.getElementById("password").value;
const response = await fetch(`${API_BASE_URL}/api/users`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password }),
  credentials: "include" //Include cookies for authentication
});
if (response.ok) {
  window.location.href = `${API_BASE_URL}/dashboard`;//redirect to dashboard after successful registration
} else {
  alert("Registration failed");
  }
 });
}
const backToLoginButton = document.getElementById("back-to-login");//Button in Register.html to go back to Login.html
if (backToLoginButton) {
  backToLoginButton.addEventListener("click", () => {
    window.location.href = `${API_BASE_URL}/index`;
  });
}
});
