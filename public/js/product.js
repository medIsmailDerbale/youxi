import { showAlert } from "./alert.js";
let globaleId;
const importData = async (id) => {
  try {
    globaleId = id;
    const res = await fetch(`http://localhost:8000/api/v1/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (await res.ok) {
      showAlert("success", "Product loaded successfully");
      const dataR = await res.json();
      console.log(dataR);
      const { data } = dataR;
      const { product } = data;
      console.log(product);
      document.getElementById("pName").value = product.name;
      document.getElementById("pPrice").value = product.price;
      document.getElementById("pDescription").value = product.description;
      document.getElementById("pQuantity").value = product.quantity;
    } else {
      showAlert("error", "Something went Wrong");
    }
  } catch (err) {
    showAlert("error", err);
    console.log(err);
  }
};

const addProduct = async (name, price, quantity, description, category) => {
  try {
    const res = await fetch("http://localhost:8000/api/v1/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        price,
        quantity,
        description,
        category,
      }),
    });
    if ((await res.status) === 201) {
      showAlert("success", "Product added successfully");
      window.setTimeout(() => {
        location.assign("/products");
      }, 1000);
    } else {
      showAlert("error", "Something went Wrong");
    }
  } catch (err) {
    showAlert("error", err);
  }
};

const deleteProduct = async (id) => {
  try {
    const res = await fetch(`http://localhost:8000/api/v1/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      showAlert("success", "Product deleted successfully");
      window.setTimeout(() => {
        location.assign("/products");
      }, 1000);
    } else {
      showAlert("error", "Something went Wrong");
    }
  } catch (err) {
    showAlert("error", err);
  }
};

const patchProduct = async (id, name, price, quantity, description) => {
  try {
    const res = await fetch(`http://localhost:8000/api/v1/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        price,
        quantity,
        description,
      }),
    });
    if (await res.ok) {
      showAlert("success", "Product updated successfully");
      window.setTimeout(() => {
        location.assign("/products");
      }, 1000);
    } else {
      showAlert("error", "Something went Wrong");
    }
  } catch (err) {
    showAlert("error", err);
  }
};

document.getElementById("patchBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const name = document.getElementById("pName").value;
  const price = document.getElementById("pPrice").value;
  const quantity = document.getElementById("pQuantity").value;
  const description = document.getElementById("pDescription").value;
  patchProduct(globaleId, name, price, quantity, description);
});

document.getElementById("addBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const price = document.getElementById("Price").value;
  const quantity = document.getElementById("Quantity").value;
  const description = document.getElementById("Description").value;
  const category = document.getElementById("Category").value;
  addProduct(name, price, quantity, description, category);
});

let deleteBtns = document.getElementsByClassName("deleteBtn");
for (let i = 0; i < deleteBtns.length; i++) {
  deleteBtns[i].addEventListener("click", () => {
    deleteProduct(deleteBtns[i].attributes._id.value);
  });
}

let patchBtns = document.getElementsByClassName("patchBtn");
for (let i = 0; i < patchBtns.length; i++) {
  patchBtns[i].addEventListener("click", () => {
    importData(patchBtns[i].attributes._id.value);
  });
}
