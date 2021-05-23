import { showAlert } from "./alert.js";
let globaleId;

const patchCategory = async (id, name) => {
  try {
    const res = await fetch(`http://localhost:8000/api/v1/categories/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    });
    console.log(await res.json());
    if (await res.ok) {
      showAlert("success", "category updated successfully");
      window.setTimeout(() => {
        location.assign("/categories");
      }, 1000);
    } else {
      showAlert("error", "Something went Wrong");
    }
  } catch (err) {
    showAlert("error", err);
  }
};

const importData = async (id) => {
  try {
    globaleId = id;
    const res = await fetch(`http://localhost:8000/api/v1/categories/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (await res.ok) {
      showAlert("success", "Category loaded successfully");
      const dataR = await res.json();
      console.log(dataR);
      const { data } = dataR;
      const { category } = data;
      console.log(category);
      document.getElementById("mName").value = category.name;
    } else {
      showAlert("error", "Something went Wrong");
    }
  } catch (err) {
    showAlert("error", err);
    console.log(err);
  }
};

const deleteCategory = async (id) => {
  try {
    const res = await fetch(`http://localhost:8000/api/v1/categories/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (await res.ok) {
      showAlert("success", "category deleted successfully");
      window.setTimeout(() => {
        location.assign("/categories");
      }, 1000);
    } else {
      showAlert("error", "Something went Wrong");
    }
  } catch (err) {
    showAlert("error", err);
  }
};

const createNewCategory = async (name, subCategory) => {
  try {
    const res = await fetch("http://localhost:8000/api/v1/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        subCategory,
      }),
    });
    if ((await res.status) === 201) {
      showAlert("success", "Category added successfully");
      window.setTimeout(() => {
        location.assign("/categories");
      }, 1000);
    } else {
      showAlert("error", "Something went Wrong");
    }
  } catch (err) {
    showAlert("error", err);
  }
};

let deleteBtns = document.getElementsByClassName("deleteBtn");
for (let i = 0; i < deleteBtns.length; i++) {
  deleteBtns[i].addEventListener("click", () => {
    globaleId = deleteBtns[i].attributes._id.value;
  });
}

let modifyBtns = document.getElementsByClassName("patchBtn");
for (let i = 0; i < modifyBtns.length; i++) {
  modifyBtns[i].addEventListener("click", () => {
    importData(modifyBtns[i].attributes._id.value);
  });
}

document.getElementById("confirmModifyBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const name = document.getElementById("mName").value;
  patchCategory(globaleId, name);
});

document.getElementById("confirmDeleteBtn").addEventListener("click", (e) => {
  e.preventDefault();
  deleteCategory(globaleId);
});

document.getElementById("addBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const name = document.getElementById("aName").value;
  const subCategory = document.getElementById("aSubCategory").checked;
  createNewCategory(name, subCategory);
});
