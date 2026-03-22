// ============================================================
// DATA
// ============================================================

const inventoryData = [
  { id: "BITCH-051", name: "Dark Choco Macchiato", stock: 31  },
  { id: "BITCH-201", name: "Matcha Overload",      stock: 314 },
  { id: "BITCH-501", name: "Mango Overload",       stock: 214 },
  { id: "BITCH-301", name: "Caramel Chocolate",    stock: 3   },
  { id: "BITCH-021", name: "Caramel Overload",     stock: 63  },
  { id: "FOOD-001",  name: "Cheese Bread",         stock: 0   },
];

const LOW_STOCK_THRESHOLD = 10;


// ============================================================
// LOGIC
// ============================================================

function getStatus(stock) {
  if (stock === 0)                    return { statusText: "Out of Stock", statusClass: "out", isDanger: true  };
  if (stock < LOW_STOCK_THRESHOLD)    return { statusText: "Low Stock",    statusClass: "low", isDanger: true  };
  return                                     { statusText: "In Stock",     statusClass: "",    isDanger: false };
}

function updateStock(index, value) {
  inventoryData[index].stock = value;
}

function getCurrentData() {
  const q = document.getElementById("searchInput").value.toLowerCase().trim();
  if (!q) return inventoryData;
  return inventoryData.filter(i =>
    i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q)
  );
}

function confirmLogout() {
  window.location.href = "login.html";
}


// ============================================================
// UI / RENDERING
// ============================================================

function showAlert(message) {
  const alertsContainer = document.getElementById("alertsContainer");
  if (!alertsContainer) return;

  const alertBox = document.createElement("div");
  alertBox.classList.add("alerts");

  const icon = document.createElement("img");
  icon.src = "svgs/AlertLogo.svg";
  icon.classList.add("alert-icon");

  const text = document.createElement("span");
  text.textContent = message;

  alertBox.appendChild(icon);
  alertBox.appendChild(text);
  alertsContainer.appendChild(alertBox);

  setTimeout(() => alertBox.remove(), 3500);
}

function renderTable(data) {
  const tbody = document.getElementById("inventoryTable");

  tbody.innerHTML = data.map(item => {
    const { statusText, statusClass, isDanger } = getStatus(item.stock);
    const realIndex = inventoryData.indexOf(item);
    return `
      <tr class="${isDanger ? "row-danger" : ""}" data-index="${realIndex}">
        <td>${item.name}</td>
        <td><span class="status ${statusClass}">${statusText}</span></td>
        <td class="stock">${item.stock}</td>
        <td>
          <div class="update-wrapper">
            <input type="number" class="update-input" placeholder="Upd qty" min="0" />
            <button class="update-btn" title="Save">
              <i data-lucide="save"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  bindUpdateButtons();
  lucide.createIcons();
}

function updateStats() {
  const data = getCurrentData();

  document.getElementById("totalItems").textContent = data.length;

  const lowCount = data.filter(i => i.stock < LOW_STOCK_THRESHOLD).length;
  document.getElementById("lowStock").textContent = lowCount;

  const box = document.getElementById("lowStockBox");
  box.classList.toggle("stat-danger", lowCount > 0);

  lucide.createIcons();
}


// ============================================================
// MODALS
// ============================================================

function openModal(id) {
  document.getElementById(id).style.display = "flex";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}


// ============================================================
// EVENT LISTENERS
// ============================================================

function bindUpdateButtons() {
  const tbody = document.getElementById("inventoryTable");

  tbody.querySelectorAll(".update-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const row   = btn.closest("tr");
      const idx   = parseInt(row.dataset.index);
      const input = row.querySelector(".update-input");
      const val   = parseInt(input.value);

      if (input.value === "") {
        showAlert("Please enter a quantity.");
        return;
      }

      if (isNaN(val) || val < 0) {
        showAlert("Stock cannot be negative!");
        input.value = "";
        return;
      }

      updateStock(idx, val);
      input.value = "";
      renderTable(getCurrentData());
      updateStats();
      lucide.createIcons();
    });
  });
}

document.getElementById("searchInput").addEventListener("input", () => {
  renderTable(getCurrentData());
  lucide.createIcons();
});


// ============================================================
// INIT
// ============================================================

renderTable(inventoryData);
updateStats();