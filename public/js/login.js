/* eslint-disable */
import { showAlert } from "./alert.js";

const login = async (email, password) => {
  try {
    const res = await fetch("http://localhost:8000/api/v1/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    if ((await res.status) === 200) {
      showAlert("success", "logged in successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    } else {
      showAlert("error", "Incorrect Email or Password");
    }
  } catch (err) {
    showAlert("error", err);
  }
};

document.getElementById("submitBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  login(email, password);
});
