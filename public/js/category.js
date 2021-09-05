import { showAlert } from "./alert.js";
let globaleId;

const DeleteItemFromCategory = async (id1, id2) => {
  try {
    let res = await fetch(`/api/v1/categories/${id1}/${id2}`, {
      method: "DELETE",
    });
    res = await res.json();
    if ((await res.status) === "success") {
      showAlert("success", "Child deleted successfully");
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

const patchCategory = async (id, name) => {
  try {
    const res = await fetch(`/api/v1/categories/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    });
    //console.log(await res.json());
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
    const res = await fetch(`/api/v1/categories/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (await res.ok) {
      showAlert("success", "Category loaded successfully");
      const dataR = await res.json();
      //console.log(dataR);
      const { data } = dataR;
      const { category } = data;
      //console.log(category);
      document.getElementById("mName").value = category.name;
    } else {
      showAlert("error", "Something went Wrong");
    }
  } catch (err) {
    showAlert("error", err);
    //console.log(err);
  }
};

const deleteCategory = async (id) => {
  try {
    const res = await fetch(`/api/v1/categories/${id}`, {
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

const createNewCategory = async (name, subCategory, parentCategory) => {
  try {
    const res = await fetch("/api/v1/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        subCategory,
        parentCategory,
      }),
    });
    //console.log(await res.json());
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

const importDataToShowDeleteChilds = async (id) => {
  try {
    globaleId = id;
    let res = await fetch(`/api/v1/categories/${id}`, {
      method: "GET",
    });
    res = await res.json();
    if (res.status === "success") {
      showAlert("success", "Loading childs");
      const { data } = res;
      const { category } = data;
      // check if we have a category or sub category
      if (category.subCategory) {
        // treating subCategory case
        const { products } = category;
        // get the table body for show delete childs
        if (products.length === 0)
          showAlert("error", "there is no childs in this category");
        document.getElementById("tableShowDeleteBody").innerHTML = "";
        document.getElementById("tableShow").querySelector("thead").innerHTML =
          "";
        for (let i = 0; i < products.length; i++) {
          let model = `<tr class="text-light">
        <td>${products[i].name}</td>
        <td>${products[i].price} Da</td>
        <td>${products[i].quantity}</td>
        <td>${products[i].addedAt}</td>
      </tr>
      `;
          document
            .getElementById("tableShowDeleteBody")
            .insertAdjacentHTML("beforeend", model);
        }
        document
          .getElementById("tableShow")
          .querySelector("thead")
          .insertAdjacentHTML(
            "afterbegin",
            '<tr class="bg-light"><th>Name</th><th>Price</th><th>Available</th><th>Added At</th></tr>'
          );
      }
      // if we have a category
      else {
        const { categories } = category;
        document.getElementById("tableShowDeleteBody").innerHTML = "";
        document.getElementById("tableShow").querySelector("thead").innerHTML =
          "";
        if (categories.length === 0)
          showAlert("error", "there is no childs in this category");
        for (let i = 0; i < categories.length; i++) {
          let model = `<tr class="text-light">
        <td>${categories[i].name}</td>
        <td>${categories[i].addedAt}</td>
      </tr>
      `;
          document
            .getElementById("tableShowDeleteBody")
            .insertAdjacentHTML("beforeend", model);
        }
        document
          .getElementById("tableShow")
          .querySelector("thead")
          .insertAdjacentHTML(
            "afterbegin",
            '<tr class="bg-light"><th>Name</th><th>Added At</th></tr>'
          );
      }
    }
    // if the operation wasnt successfull
    else {
      showAlert("error", "Something went Wrong");
    }
  } catch (err) {
    showAlert("error", err);
  }
};

let showDeleteBtns = document.getElementsByClassName("showDeleteChilds");
for (let i = 0; i < showDeleteBtns.length; i++) {
  showDeleteBtns[i].addEventListener("click", () => {
    importDataToShowDeleteChilds(showDeleteBtns[i].attributes._id.value);
  });
}

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

let addChildBtns = document.getElementsByClassName("addToCategory");
for (let i = 0; i < addChildBtns.length; i++) {
  addChildBtns[i].addEventListener("click", () => {
    importDataToAddChildModel(addChildBtns[i].attributes._id.value);
  });
}

// -------------------------------SIMPLE EVENT LISTENERS-----------------------------------

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
  const parentId = document.getElementById("Category").value;
  createNewCategory(name, subCategory, parentId);
});

document.getElementById("aSubCategory").addEventListener("change", (e) => {
  e.preventDefault();
  if (document.getElementById("aSubCategory").checked) {
    document.getElementById("parentCategory").classList.remove("d-none");
  } else {
    document.getElementById("parentCategory").classList.add("d-none");
  }
});
