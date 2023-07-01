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

// Render shopping list
function renderList() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  let totalPrice = 0;

  // Create an object to store products grouped by date
  const productsByDate = {};

  shoppingList.forEach((item) => {
    const { product, price, date } = item;

    // Format date to "Ngày DD/MM/YYYY"
    const formattedDate = new Date(date).toLocaleDateString("vi-VN");

    // Group products by date
    if (productsByDate[formattedDate]) {
      productsByDate[formattedDate].push({ product, price });
    } else {
      productsByDate[formattedDate] = [{ product, price }];
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
  const totalAmount = totalPrice - debtAmount;
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

    const currentDate = new Date().toISOString().slice(0, 10);
    shoppingList.push({ product, price, date: currentDate });

    productInput.value = "";
    priceInput.value = "";

    renderList();
  }
});

// Initial render
renderList();