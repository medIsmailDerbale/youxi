import { showAlert } from "./alert.js";
let globaleId;

const elements = document.getElementsByClassName("showProducts");
for (let i = 0; i < elements.length; i++) {
  elements[i].addEventListener("click", (e) => {
    e.preventDefault();
    importDataToShowOrderItems(elements[i].attributes._id.value);
  });
}

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
    //console.log(await res.json());
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
      //console.log(dataR);
      const { order } = dataR;
      const { status } = order;
      //console.log(status);
      //console.log(order.name);
      document.getElementById("mName").value = status;
    } else {
      showAlert("error", "Something went Wrong");
    }
  } catch (err) {
    showAlert("error", err);
    //console.log(err);
  }
};

const importDataToShowOrderItems = async (id) => {
  try {
    globaleId = id;
    let res = await fetch(`http://localhost:8000/api/v1/order/${id}`, {
      method: "GET",
    });
    res = await res.json();
    //console.log(res);
    if (res.status === "success") {
      showAlert("success", "Loading childs");
      const items = res.order.items;
      // get the table body for show delete childs
      document.getElementById("tableShowDeleteBody").innerHTML = "";
      for (let i = 0; i < items.length; i++) {
        let model = `<tr class="text-light">
                        <td>${items[i].title}</td>
                        <td>${items[i].qty}</td>
                        <td>${items[i].price} Da</td>
                      </tr>`;
        document
          .getElementById("tableShowDeleteBody")
          .insertAdjacentHTML("beforeend", model);
      }
      // add the listeners for the delete buttons AKA "deleteChildFromParentBtn"
      //...................
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
