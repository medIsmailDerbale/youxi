import { showAlert } from "./alert.js";

const addProduct = async (name, price, colors, description) => {
  try {
    const res = await fetch("http://localhost:8000/api/v1/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        price,
        colors,
        description,
      }),
    });
    if ((await res.status) === 201) {
      showAlert("success", "Product added successfully");
    } else {
      showAlert("error", "Something went Wrong");
    }
  } catch (err) {
    showAlert("error", err);
  }
};

document.querySelector(".modal").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const colors = document.getElementById("colors").value;
  const description = document.getElementById("description").value;

  addProduct(name, price, colors, description);
});

document.querySelector(".modal").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const colors = document.getElementById("colors").value;
  const description = document.getElementById("description").value;

  addProduct(name, price, colors, description);
});

const deleteProduct = async (id) => {
  try {
    const res = await fetch("http://localhost:8000/api/v1/products", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
      }),
    });
    if (await res.ok) {
      showAlert("success", "Product deleted successfully");
    } else {
      showAlert("error", "Something went Wrong");
    }
  } catch (err) {
    showAlert("error", err);
  }
};
