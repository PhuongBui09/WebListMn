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

  // Tạo một đối tượng để lưu trữ các sản phẩm theo ngày nhập
  const productsByDate = {};

  shoppingList.forEach((item) => {
    const { product, price, date } = item;

    // Nếu ngày nhập chưa tồn tại trong đối tượng productsByDate
    if (!productsByDate[date]) {
      productsByDate[date] = [];
    }

    productsByDate[date].push(item);
  });

  let totalPrice = 0;
  let totalDebtAmount = 0;

  // Duyệt qua từng ngày và hiển thị danh sách sản phẩm của từng ngày
  for (const date in productsByDate) {
    if (productsByDate.hasOwnProperty(date)) {
      const products = productsByDate[date];
      const dateHeading = document.createElement("h3");
      const formattedDate = formatDate(date); // Chuyển định dạng ngày
      dateHeading.textContent = `Ngày: ${formattedDate}`;
      list.appendChild(dateHeading);

      let debtAmount = 0;

      products.forEach((item, index) => {
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
        const priceFormatted = item.price.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });
        priceText.textContent = ` + ${priceFormatted}`;
        li.appendChild(priceText);

        if (productName === "Đang nợ") {
          debtAmount += item.price;
        } else {
          totalPrice += item.price;
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

      totalDebtAmount += debtAmount;
    }
  }

  function formatDate(dateString) {
    const dateParts = dateString.split("-");
    if (dateParts.length !== 3) {
      return dateString;
    }
    const [year, month, day] = dateParts;
    return `${day}/${month}/${year}`;
  }

  const totalPriceElement = document.getElementById("totalPrice");
  const totalAmount = totalPrice - totalDebtAmount;
  const formattedTotalAmount = totalAmount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  totalPriceElement.textContent = `Tổng tiền: ${formattedTotalAmount}`;

  // Lưu danh sách mua sắm vào Local Storage
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
    const currentDate = new Date(); // Lấy ngày hiện tại
    const formattedDate = currentDate.toISOString().split("T")[0]; // Định dạng ngày thành chuỗi yyyy-mm-dd

    if (product === "Đang nợ") {
      // Update debt amount
      debtAmount += price;
    }

    // Thêm trường ngày nhập vào đối tượng sản phẩm
    shoppingList.push({ product, price, date: formattedDate });

    productInput.value = "";
    priceInput.value = "";

    renderList();
  }
});

// Initial render
renderList();
