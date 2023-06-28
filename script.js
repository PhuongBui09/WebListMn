// Retrieve saved data from Local Storage
const savedData = localStorage.getItem("shoppingList");
const shoppingList = savedData ? JSON.parse(savedData) : [];

// Delete a specific item
function deleteItem(index) {
  shoppingList.splice(index, 1);
  renderList();
}

// Delete all items
function deleteAll() {
  shoppingList.length = 0;
  renderList();
}

// Render shopping list
function renderList() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  let totalPrice = 0;

  shoppingList.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.product} - $${item.price}`;

    totalPrice += item.price;

    // Add delete button for each item
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Xoá";
    deleteButton.addEventListener("click", () => {
      deleteItem(index);
    });
    li.appendChild(deleteButton);

    list.appendChild(li);
  });

  const totalPriceElement = document.getElementById("totalPrice");
  totalPriceElement.textContent = `Tổng tiền: $${totalPrice}`;

  // Save updated list to Local Storage
  localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
}

// Handle delete all button click
const deleteAllButton = document.createElement("button");
deleteAllButton.textContent = "Xoá tất cả";
deleteAllButton.addEventListener("click", () => {
  if (confirm("Bạn có chắc muốn xoá tất cả sản phẩm ?")) {
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
    shoppingList.push({ product, price });

    productInput.value = "";
    priceInput.value = "";

    renderList();
  }
});

// Initial render
renderList();
