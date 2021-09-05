import { showAlert } from "./alert.js";

let checkbox = document.getElementsByClassName("toggleUser");

const sendActivateUser = async (id) => {
  try {
    let res = await fetch(
      `http://localhost:8000/api/v1/users/activateUser/${id}`,
      {
        method: "PATCH",
      }
    );
    res = await res.json();
    //console.log(res);
    if ((await res.status) === "success") {
      const { data } = res;
      const { user } = data;
      showAlert("success", `${user.FirstName}'s account has been activated`);
    } else {
      showAlert("error", "something went wrong");
    }
  } catch (err) {
    showAlert("error", err);
  }
};

const sendBlockUser = async (id) => {
  try {
    let res = await fetch(
      `http://localhost:8000/api/v1/users/blockUser/${id}`,
      {
        method: "PATCH",
      }
    );
    res = await res.json();
    //console.log(res);
    if ((await res.status) === "success") {
      const { data } = res;
      const { user } = data;
      showAlert("warning", `${user.FirstName}'s account has been blocked`);
    } else {
      showAlert("error", "something went wrong");
    }
  } catch (err) {
    showAlert("error", err);
  }
};

for (let i = 0; i < checkbox.length; i++) {
  checkbox[i].addEventListener("change", function () {
    if (this.checked) {
      // when we check the toggle checkbox
      sendActivateUser(this.attributes._id.value);
    } else {
      // when we uncheck the toggle checkboxd
      sendBlockUser(this.attributes._id.value);
    }
  });
}
