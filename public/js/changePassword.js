import { showAlert } from "./alert.js";

const changePassword = async (passwordCurrent, password, passwordConfirm) => {
  try {
    let res = await fetch(`/api/v1/users/updateMyPassword`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        passwordCurrent,
        password,
        passwordConfirm,
      }),
    });

    if ((await res).status === 200) {
      showAlert("success", "Password updated successfully");
      document.getElementById("confirmPassword").value = "";
      document.getElementById("password").value = "";
      document.getElementById("newPassword").value = "";
      window.setTimeout(() => {
        location.assign("/me");
      }, 2000);
    } else if ((await res).status === 401) {
      showAlert("error", "Wrong password try again.");
    } else {
      showAlert("error", "Something went wrong");
    }
  } catch (err) {
    showAlert("error", err);
  }
};

document.getElementById("confirmButton").addEventListener("click", (e) => {
  e.preventDefault();
  const passwordCurrent = document.getElementById("password").value;
  if (passwordCurrent.length < 8) {
    showAlert("error", "Current password should be at least 8 characters");
    return;
  }

  const password = document.getElementById("newPassword").value;
  if (password.length < 8) {
    showAlert("error", "New password should be at least 8 characters");
    return;
  }

  const passwordConfirm = document.getElementById("confirmPassword").value;
  if (passwordConfirm.length < 8) {
    showAlert("error", "Password Confirm should be at least 8 characters");
    return;
  }

  if (password === passwordConfirm) {
    changePassword(passwordCurrent, password, passwordConfirm);
  } else {
    showAlert("error", "Your confirm password doesn't match the new password");
  }
});
