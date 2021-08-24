import { showAlert } from "./alert.js";

const checkout = async (address) => {
  try {
    const res = await fetch("http://localhost:8000/api/v1/order/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
      }),
    });
    console.log(await res.json());
    if (res.status === 201 || res.status === 200) {
      showAlert("success", "Order added successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 1000);
    } else {
      showAlert("error", "Something went Wrong");
    }
  } catch (err) {
    showAlert("error", err);
  }
};

document.getElementById("confirmCheckout").addEventListener("click", (e) => {
  e.preventDefault();
  const address = document.getElementById("address").value;
  console.log(address);
  checkout(address);
});
