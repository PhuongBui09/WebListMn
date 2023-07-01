// Retrieve saved data from Local Storage
const savedData = localStorage.getItem("shoppingList");
const shoppingList = savedData ? JSON.parse(savedData) : [];

// Debt amount
let debtAmount = 0;

// Delete a specific item
function deleteItem(index) {
  const deletedItem = shoppingList[index];

  if (deletedItem.product === "Đang nợ") {
    debtAmount -= deletedItem.price;
  }

  shoppingList.splice(index, 1);
  renderList();
}

// Delete all items
function deleteAll() {
  shoppingList.length = 0;
  debtAmount = 0;
  renderList();
}

// Function to group products by date
function groupProductsByDate(list) {
  const productsByDate = {};
  list.forEach((item) => {
    const { product, price, date } = item;
    const formattedDate = new Date(date).toLocaleDateString("vi-VN");
    if (!productsByDate[formattedDate]) {
      productsByDate[formattedDate] = [];
    }
    productsByDate[formattedDate].push({ product, price, date }); // Thêm date vào để sử dụng sau này
  });
  return productsByDate;
}

// Function to calculate total amount
function calculateTotalAmount() {
  let totalPrice = 0;
  let debtAmount = 0;

  shoppingList.forEach((item) => {
    const { product, price } = item;
    if (product === "Đang nợ") {
      debtAmount += price;
    } else {
      totalPrice += price;
    }
  });

  return totalPrice - debtAmount;
}

// Render shopping list
function renderList() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  // Group products by date
  const productsByDate = groupProductsByDate(shoppingList);

  for (const date in productsByDate) {
    const productList = productsByDate[date];

    const dateHeader = document.createElement("h3");
    const formattedDate = new Date(date).toLocaleDateString("vi-VN");
    dateHeader.textContent = formattedDate; // Hiển thị ngày dưới định dạng "DD/MM/YYYY"
    list.appendChild(dateHeader);

    productList.forEach((item, index) => {
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

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Xoá";
      deleteButton.classList.add("delete-button");
      deleteButton.addEventListener("click", () => {
        deleteItem(index);
      });
      li.appendChild(deleteButton);

      list.appendChild(li);
    });
  }

  const totalPriceElement = document.getElementById("totalPrice");
  const totalAmount = calculateTotalAmount();
  const formattedTotalAmount = totalAmount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  totalPriceElement.textContent = `Tổng tiền: ${formattedTotalAmount}`;

  localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
}

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
    }

    const date = new Date().toISOString(); // Lấy ngày nhập hiện tại
    shoppingList.push({ product, price, date }); // Thêm ngày vào danh sách sản phẩm

    productInput.value = "";
    priceInput.value = "";

    renderList();
  }
});

// Initial render
renderList();
