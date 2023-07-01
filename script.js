// JavaScript (app.js)
// Retrieve saved data from Local Storage
const savedData = localStorage.getItem("shoppingList");
const shoppingList = savedData ? JSON.parse(savedData) : [];

// Debt amount
let debtAmount = 0;

// Total price
let totalPrice = 0;

// Delete a specific item
function deleteItem(index) {
  const deletedItem = shoppingList[index];

  if (deletedItem.product === "Đang nợ") {
    debtAmount -= deletedItem.price;
  } else {
    totalPrice -= deletedItem.price;
  }

  shoppingList.splice(index, 1);
  renderList();
}

// Delete all items
function deleteAll() {
  shoppingList.length = 0;
  debtAmount = 0;
  totalPrice = 0;
  renderList();
}

// Handle edit button click
function editItem(index) {
  const editForm = document.getElementById("editForm");
  const editProductInput = document.getElementById("editProduct");
  const editPriceInput = document.getElementById("editPrice");
  const editDateInput = document.getElementById("editDate");

  // Hiển thị form chỉnh sửa và điền thông tin của mục vào form
  const itemToEdit = shoppingList[index];
  editProductInput.value = itemToEdit.product;
  editPriceInput.value = itemToEdit.price;
  editDateInput.value = itemToEdit.date;

  // Gắn sự kiện submit cho form chỉnh sửa
  editForm.onsubmit = function (event) {
    event.preventDefault();

    // Lấy thông tin đã chỉnh sửa từ form
    const editedProduct = editProductInput.value;
    const editedPrice = Number(editPriceInput.value);
    const editedDate = editDateInput.value;

    // Trừ tiền cũ của mục đã chỉnh sửa khỏi tổng tiền hoặc tổng nợ
    if (itemToEdit.product !== "Đang nợ") {
      totalPrice -= itemToEdit.price;
    } else {
      debtAmount -= itemToEdit.price;
    }

    // Cập nhật thông tin của mục trong danh sách
    itemToEdit.product = editedProduct;
    itemToEdit.price = editedPrice;
    itemToEdit.date = editedDate;

    // Cộng tiền mới của mục đã chỉnh sửa vào tổng tiền hoặc tổng nợ
    if (editedProduct !== "Đang nợ") {
      totalPrice += editedPrice;
    } else {
      // Nếu sản phẩm đã chỉnh sửa là "Đang nợ", cập nhật lại tổng nợ
      debtAmount += editedPrice - itemToEdit.price;
    }

    // Ẩn form chỉnh sửa và render lại danh sách
    hideEditForm();
    renderList();
  };

  // Hiển thị form chỉnh sửa
  const editFormContainer = document.getElementById("editFormContainer");
  editFormContainer.style.display = "block";
}

// Update item in the shopping list
function updateItem(index, product, price, date) {
  const editedItem = shoppingList[index];

  // Trừ tiền cũ của mục đã chỉnh sửa khỏi tổng tiền hoặc tổng nợ
  if (editedItem.product !== "Đang nợ") {
    totalPrice -= editedItem.price;
  } else {
    debtAmount -= editedItem.price;
  }

  // Cập nhật thông tin mới cho mục đã chỉnh sửa
  editedItem.product = product;
  editedItem.price = price;
  editedItem.date = date;

  // Cộng tiền mới của mục đã chỉnh sửa vào tổng tiền hoặc tổng nợ
  if (product !== "Đang nợ") {
    totalPrice += price;
  } else {
    debtAmount += price;
  }

  // Lưu danh sách đã cập nhật vào Local Storage
  localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
  // Reload Page sau khi lưu chỉnh sửa
  reloadPage();
}

// Hàm tải lại trang
function reloadPage() {
  window.location.reload();
}

// Ẩn form chỉnh sửa
function hideEditForm() {
  const editFormContainer = document.getElementById("editFormContainer");
  editFormContainer.style.display = "none";
}

// Render shopping list
function renderList() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  totalPrice = 0;

  // Create an object to store products grouped by date
  const productsByDate = {};

  shoppingList.forEach((item, index) => {
    const { product, price, date } = item;

    // Format date to "Ngày DD/MM/YYYY"
    const formattedDate = new Date(date).toLocaleDateString("vi-VN");

    // Group products by date
    if (productsByDate[formattedDate]) {
      productsByDate[formattedDate].push({ product, price, index });
    } else {
      productsByDate[formattedDate] = [{ product, price, index }];
    }

    if (product !== "Đang nợ") {
      totalPrice += price;
    }
  });

  // Loop through products grouped by date and display them on the page
  for (const date in productsByDate) {
    const productList = productsByDate[date];

    const dateHeader = document.createElement("h3");
    dateHeader.textContent = date;
    list.appendChild(dateHeader);

    productList.forEach((item) => {
      const li = document.createElement("li");
      const productText = document.createElement("span");
      const productName = item.product.trim();
      productText.textContent = productName;
      if (productName === "Đang nợ") {
        productText.classList.add("product-class");
      } else {
        productText.classList.add("product-class-all");
      }
      li.appendChild(productText);

      const priceText = document.createElement("span");
      const price = item.price.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
      priceText.textContent = ` + ${price}`;
      li.appendChild(priceText);

      if (productName === "Đang nợ") {
        // Check if "Đang nợ" already exists in the list
        if (debtAmount !== 0) {
          // If it exists, add the current debt amount to the new amount
          debtAmount += item.price;
        } else {
          // If it doesn't exist, set the debt amount
          debtAmount = item.price;
        }
      }

      const editButton = document.createElement("button");
      editButton.textContent = "Chỉnh sửa";
      editButton.classList.add("edit-button");
      editButton.addEventListener("click", () => {
        editItem(item.index);
      });
      li.appendChild(editButton);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Xoá";
      deleteButton.classList.add("delete-button");
      deleteButton.addEventListener("click", () => {
        deleteItem(item.index);
      });
      li.appendChild(deleteButton);

      list.appendChild(li);
    });
  }

  const totalPriceElement = document.getElementById("totalPrice");
  const totalAmount = totalPrice - debtAmount;
  const formattedTotalAmount = totalAmount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  totalPriceElement.textContent = `Tổng tiền: ${formattedTotalAmount}`;

  // Lưu danh sách đã cập nhật vào Local Storage
  localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
}

// Handle edit form cancel button click
const editFormCancelButton = document.getElementById("editFormCancelButton");
editFormCancelButton.addEventListener("click", () => {
  hideEditForm();
});

// Handle delete all button click
const deleteAllButton = document.getElementById("deleteAllButton");
deleteAllButton.addEventListener("click", () => {
  if (confirm("Bạn có chắc muốn xoá tất cả?")) {
    deleteAll();
  }
});

// Handle form submission
const form = document.getElementById("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const productInput = document.getElementById("productInput");
  const priceInput = document.getElementById("priceInput");

  const product = productInput.value;
  const price = Number(priceInput.value);

  if (product && price) {
    if (product === "Đang nợ") {
      // Update debt amount
      debtAmount += price;
    } else {
      // Update total price for other products
      totalPrice += price;
    }

    const currentDate = new Date().toISOString().slice(0, 10);
    shoppingList.push({ product, price, date: currentDate });

    productInput.value = "";
    priceInput.value = "";

    renderList();
  }
});

// Initial render
renderList();
