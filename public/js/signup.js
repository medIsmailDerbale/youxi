/* eslint-disable */
import { showAlert } from "./alert.js";

const singupUser = async (
  FirstName,
  LastName,
  email,
  password,
  passwordConfirm
) => {
  try {
    let res = fetch(`http://localhost:8000/api/v1/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        FirstName,
        LastName,
        email,
        password,
        passwordConfirm,
      }),
    });
    if ((await res).ok) {
      showAlert("success", "Account successfully created");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    } else {
      res = await (await res).json();
      const { message } = res;
      showAlert("error", message);
    }
  } catch (err) {
    showAlert("error", err);
  }
};

document.getElementById("submitBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const FirstName = document.getElementById("firstName").value;
  const LastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  singupUser(FirstName, LastName, email, password, confirmPassword);
});
