import { showAlert } from "./alert.js";
let globaleId;

const patchOrder = async (id, status) => {
  try {
    const res = await fetch(`http://localhost:8000/api/v1/order/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    });
    console.log(await res.json());
    if (await res.ok) {
      showAlert("success", "order updated successfully");
      window.setTimeout(() => {
        location.assign("/orders");
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
    const res = await fetch(`http://localhost:8000/api/v1/order/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (await res.ok) {
      showAlert("success", "Order Status successfully loaded");
      const dataR = await res.json();
      console.log(dataR);
      const { order } = dataR;
      const { status } = order;
      console.log(status);
      console.log(order.name);
      document.getElementById("mName").value = status;
    } else {
      showAlert("error", "Something went Wrong");
    }
  } catch (err) {
    showAlert("error", err);
    console.log(err);
  }
};

const importDataToShowOrderItems = async (id) => {
  try {
    globaleId = id;
    let res = await fetch(`http://localhost:8000/api/v1/order/${id}`, {
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
    importDataToShowOrderItems(showDeleteBtns[i].attributes._id.value);
  });
}

let modifyBtns = document.getElementsByClassName("patchBtn");
for (let i = 0; i < modifyBtns.length; i++) {
  modifyBtns[i].addEventListener("click", () => {
    importData(modifyBtns[i].attributes._id.value);
  });
}

// -------------------------------SIMPLE EVENT LISTENERS-----------------------------------

document.getElementById("confirmModifyBtn").addEventListener("click", (e) => {
  e.preventDefault();
  const name = document.getElementById("mName").value;
  patchOrder(globaleId, name);
});
