import { signUp, login, logout, checkUserRole } from "../firebase/auth.js";

window.handleSignup = () => {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  signUp(email, password);
};

window.handleLogin = () => {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  login(email, password);
};

window.handleLogout = () => {
  logout();
};

window.onload = () => {
    checkUserRole();
};
