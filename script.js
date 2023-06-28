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

// Render shopping list
function renderList() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  let totalPrice = 0;
  let debtAmount = 0;

  shoppingList.forEach((item, index) => {
    const li = document.createElement("li");
    const productText = document.createElement("span");
    const productName = item.product.trim(); // Loại bỏ khoảng trắng ở đầu và cuối chuỗi
    productText.textContent = productName;
    if (productName === "Đang nợ") {
      productText.style.fontWeight = "bold";
    }
    li.appendChild(productText);

    const priceText = document.createElement("span");
    const price = item.price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    priceText.textContent = ` - ${price}`;
    li.appendChild(priceText);

    if (productName === "Đang nợ") {
      // Kiểm tra nếu "Đang nợ" đã tồn tại trong danh sách
      if (debtAmount !== 0) {
        // Nếu đã tồn tại, cộng số tiền đang nợ hiện tại với số tiền mới
        debtAmount += item.price;
      } else {
        // Nếu chưa tồn tại, gán số tiền đang nợ
        debtAmount = item.price;
      }
    } else {
      totalPrice += item.price;
    }

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Xoá";
    deleteButton.addEventListener("click", () => {
      deleteItem(index);
    });
    li.appendChild(deleteButton);

    list.appendChild(li);
  });


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
const deleteAllButton = document.createElement("button");
deleteAllButton.textContent = "Xoá tất cả";
deleteAllButton.addEventListener("click", () => {
  if (confirm("Bạn có chắc muốn xoá tất cả ?")) {
    deleteAll();
  }
});
document.body.appendChild(deleteAllButton);

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

    shoppingList.push({ product, price });

    productInput.value = "";
    priceInput.value = "";

    renderList();
  }
});

// Initial render
renderList();
