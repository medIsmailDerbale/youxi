import { showAlert } from "./alert.js";

const resetPassword = async (password, passwordConfirm) => {
  try {
    const token = location.href.split("/")[4];
    let res = await fetch(
      `http://localhost:8000/api/v1/users/resetPassword/${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          passwordConfirm,
        }),
      }
    );
    res = await res.json();
    console.log(await res);
    if ((await res.status) === "success") {
      showAlert("success", "Password reset successfully");
      window.setTimeout(() => {
        location.assign("/login");
      }, 1500);
    } else {
      showAlert("error", "Something went wrong maybe token has expired");
    }
  } catch (err) {
    showAlert("error", err);
  }
};

document.getElementById("submit").addEventListener("click", (e) => {
  e.preventDefault();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  console.log(password, confirmPassword);
  resetPassword(password, confirmPassword);
});
