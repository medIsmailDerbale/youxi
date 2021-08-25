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

const addOne = async (productId) => {
  try {
    const res = await fetch("http://localhost:8000/api/v1/cart/add-quantity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
      }),
    });
    console.log(await res.json());
    if (res.status === 201 || res.status === 200) {
      showAlert("success", "Product added successfully");
      window.setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      showAlert("error", "Something went Wrong");
    }
  } catch (err) {
    showAlert("error", err);
  }
};

const minceOne = async (productId) => {
  try {
    const res = await fetch(
      "http://localhost:8000/api/v1/cart/mince-quantity",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
        }),
      }
    );
    console.log(await res.json());
    if (res.status === 201 || res.status === 200) {
      showAlert("success", "Product removed successfully");
      window.setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      showAlert("error", "Something went Wrong");
    }
  } catch (err) {
    showAlert("error", err);
  }
};

const removeAll = async (productId) => {
  try {
    const res = await fetch("http://localhost:8000/api/v1/cart/remove-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
      }),
    });
    console.log(await res.json());
    if (res.status === 201 || res.status === 200) {
      showAlert("success", "Product removed successfully");
      window.setTimeout(() => {
        window.location.reload();
      }, 500);
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

const plusBtns = document.getElementsByClassName("fa-plus-circle");
for (let i = 0; i < plusBtns.length; i++) {
  plusBtns.item(i).addEventListener("click", (e) => {
    e.preventDefault();
    addOne(plusBtns.item(i).attributes._id.value);
  });
}

const minceBtns = document.getElementsByClassName("fa-minus-circle");
for (let i = 0; i < minceBtns.length; i++) {
  minceBtns.item(i).addEventListener("click", (e) => {
    e.preventDefault();
    minceOne(minceBtns.item(i).attributes._id.value);
  });
}

const removeBtns = document.getElementsByClassName("fa-times");
for (let i = 0; i < removeBtns.length; i++) {
  removeBtns.item(i).addEventListener("click", (e) => {
    e.preventDefault();
    removeAll(removeBtns.item(i).attributes._id.value);
  });
}
