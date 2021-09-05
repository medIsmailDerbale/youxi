import { showAlert } from "./alert.js";

const sendTokenToEmail = async (email) => {
  try {
    const res = await fetch(`/api/v1/users/forgotPassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });
    if ((await res.status) === 200) {
      showAlert("success", "Email sent");
    } else {
      showAlert("error", "Something went wrong");
    }
  } catch (err) {
    showAlert("error", err);
  }
};

document.getElementById("submitBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  sendTokenToEmail(email);
});
