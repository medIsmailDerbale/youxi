import { showAlert } from "./alert.js";
let globaleId;

const DeleteItemFromCategory = async (id1, id2) => {
  try {
    let res = await fetch(
      `http://localhost:8000/api/v1/categories/${id1}/${id2}`,
      {
        method: "DELETE",
      }
    );
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

const AddItemToCategory = async (id1, id2) => {
  try {
    let res = await fetch(`http://localhost:8000/api/v1/categories/${id1}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: id2,
        categoryId: id2,
      }),
    });
    if (await res.ok) {
      showAlert("success", "Item added successfully");
      window.setTimeout(() => {
        location.assign("/categories");
      }, 1000);
    } else {
      res = await res.json();
      console.log(res);
      const { message } = res;
      showAlert("error", message);
    }
  } catch (err) {
    showAlert("error", err);
  }
};

const addListeners = (className) => {
  let btns = document.getElementsByClassName(className);
  for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", () => {
      AddItemToCategory(globaleId, btns[i].attributes._id.value);
    });
  }
};

const addListeners2 = (className) => {
  let btns = document.getElementsByClassName(className);
  for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", () => {
      DeleteItemFromCategory(globaleId, btns[i].attributes._id.value);
    });
  }
};

const importDataToAddChildModel = async (id) => {
  try {
    document.getElementById("addChildTableBody").innerHTML = "";
    globaleId = id;
    const res = await fetch(`http://localhost:8000/api/v1/categories/${id}`, {
      method: "GET",
    });
    if (await res.ok) {
      showAlert("success", "Loading");
      const dataR = await res.json();
      const { data } = dataR;
      const { category } = data;

      // if we are dealing with a subcategory
      if (category.subCategory) {
        let items = await fetch(`http://localhost:8000/api/v1/products?`, {
          method: "GET",
        });
        items = await items.json();
        const { data } = items;
        const { products } = data;
        items = products;
        console.log(items);

        for (let i = 0; i < items.length; i++) {
          let model = `<tr class="text-light">
        <td>${items[i].name}</td>
        <td>${items[i].price}</td>
        <td>${items[i].addedAt}</td>
        <td>
          <img
            id="dropdownMenuButton"
            src="img/DropDown.svg"
            type="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          />
          <div
            class="dropdown-menu"
            type="button"
            aria-labelledby="dropdownMenuButton"
          >
            <button _id="${items[i]._id}"
              class="dropdown-item btn addToCategoryBtn"
              data-bs-toggle="modal1"
            >
              Add To Category
            </button>
          </div>
        </td>
      </tr>
      `;
          document
            .getElementById("addChildTableBody")
            .insertAdjacentHTML("beforeend", model);
        }
        addListeners("addToCategoryBtn");
      }
      // if we are dealing with a category
      else {
        document.getElementById("addChildTableBody").innerHTML = "";
        let items = await fetch(
          `http://localhost:8000/api/v1/categories?_id[ne]=${id}&subCategory=true`,
          {
            method: "GET",
          }
        );
        items = await items.json();
        const { data } = items;
        const { categories } = data;
        items = categories;
        console.log(items);

        for (let i = 0; i < items.length; i++) {
          let model = `<tr class="text-light">
          <td>${items[i].name}</td>
          <td>${items[i].addedAt}</td>
          <td>
            <img
              id="dropdownMenuButton"
              src="img/DropDown.svg"
              type="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            />
            <div
              class="dropdown-menu"
              type="button"
              aria-labelledby="dropdownMenuButton"
            >
              <button _id="${items[i]._id}"
                class="dropdown-item btn addToCategoryBtn"
                data-bs-toggle="modal1"
              >
                Add To Category
              </button>
            </div>
          </td>
        </tr>
        `;
          document
            .getElementById("addChildTableBody")
            .insertAdjacentHTML("beforeend", model);
        }
        addListeners("addToCategoryBtn");
      }
    } else {
      showAlert("error", "Something went Wrong");
    }
  } catch (err) {
    showAlert("error", err);
    console.log(err);
  }
};

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

const importDataToShowDeleteChilds = async (id) => {
  try {
    globaleId = id;
    let res = await fetch(`http://localhost:8000/api/v1/categories/${id}`, {
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
        for (let i = 0; i < products.length; i++) {
          let model = `<tr class="text-light">
        <td>${products[i].name}</td>
        <td>${products[i].price}</td>
        <td>${products[i].addedAt}</td>
        <td>
          <img
            id="dropdownMenuButton"
            src="img/DropDown.svg"
            type="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          />
          <div
            class="dropdown-menu"
            type="button"
            aria-labelledby="dropdownMenuButton"
          >
            <button _id="${products[i]._id}"
              class="dropdown-item btn deleteChildFromParentBtn"
              data-bs-toggle="modal1"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
      `;
          document
            .getElementById("tableShowDeleteBody")
            .insertAdjacentHTML("beforeend", model);
        }
        // add the listeners for the delete buttons AKA "deleteChildFromParentBtn"
        //...................
        addListeners2("deleteChildFromParentBtn");
      }
      // if we have a category
      else {
        const { categories } = category;
        document.getElementById("tableShowDeleteBody").innerHTML = "";
        if (categories.length === 0)
          showAlert("error", "there is no childs in this category");
        for (let i = 0; i < categories.length; i++) {
          let model = `<tr class="text-light">
        <td>${categories[i].name}</td>
        <td>${categories[i].addedAt}</td>
        <td>
          <img
            id="dropdownMenuButton"
            src="img/DropDown.svg"
            type="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          />
          <div
            class="dropdown-menu"
            type="button"
            aria-labelledby="dropdownMenuButton"
          >
            <button _id="${categories[i]._id}"
              class="dropdown-item btn deleteChildFromParentBtn"
              data-bs-toggle="modal1"
            >
              Delete 
            </button>
          </div>
        </td>
      </tr>
      `;
          document
            .getElementById("tableShowDeleteBody")
            .insertAdjacentHTML("beforeend", model);
        }
        // add the listeners for the delete buttons AKA "deleteChildFromParentBtn"
        // .....................
        addListeners2("deleteChildFromParentBtn");
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
  createNewCategory(name, subCategory);
});
