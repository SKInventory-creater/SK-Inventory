// ========================================
// SK Inventory Pro
// File: js/items.js
// Version: 1.0
// ========================================

let bundleId = null;
let currentBundle = null;
let currentFilter = "all";
let currentSearch = "";

document.addEventListener("DOMContentLoaded", initPage);

// ----------------------
// Initialize
// ----------------------

function initPage() {

    const params = new URLSearchParams(window.location.search);

    bundleId = params.get("bundle");

    if (!bundleId) {

        alert("Bundle မတွေ့ပါ");

        location.href = "index.html";

        return;

    }

    bindEvents();

    refreshPage();

}

// ----------------------
// Bind Events
// ----------------------

function bindEvents() {

    document
        .getElementById("saveItemBtn")
        .addEventListener("click", addNewItem);

    const search = document.getElementById("searchBox");

    if (search) {

        search.addEventListener("input", function () {

            currentSearch = this.value;

            renderItemList();

        });

    }

}

// ----------------------
// Refresh Page
// ----------------------

function refreshPage() {

    currentBundle = getBundle(bundleId);

    if (!currentBundle) {

        alert("Bundle မရှိတော့ပါ");

        location.href = "index.html";

        return;

    }

    document.getElementById("bundleTitle").textContent =
        currentBundle.name;

    updateSummary();

    renderItemList();

}

// ----------------------
// Summary
// ----------------------

function updateSummary() {

    const stats =
        getBundleStats(bundleId);

    const itemCount =
        document.getElementById("itemCount");

    const soldCount =
        document.getElementById("soldCount");

    const remainCount =
        document.getElementById("remainCount");

    const totalCost =
        document.getElementById("totalCost");

    const totalSale =
        document.getElementById("totalSale");

    const totalProfit =
        document.getElementById("totalProfit");

    if (itemCount) itemCount.textContent = stats.itemCount;
    if (soldCount) soldCount.textContent = stats.soldCount;
    if (remainCount) remainCount.textContent = stats.remainCount;
    if (totalCost) totalCost.textContent = stats.totalCost.toLocaleString();
    if (totalSale) totalSale.textContent = stats.totalSale.toLocaleString();
    if (totalProfit) totalProfit.textContent = stats.totalProfit.toLocaleString();

}

// ========================================
// Add Item
// ========================================

function addNewItem() {

    const codeInput = document.getElementById("code");
    const costInput = document.getElementById("cost");
    const priceInput = document.getElementById("price");

    let code = codeInput.value.trim();

    if (code === "") {
        code = generateItemCode(bundleId);
    }

    const cost = Number(costInput.value);
    const price = Number(priceInput.value);

    if (cost <= 0 || price <= 0) {
        alert("Cost နှင့် Price ကို မှန်ကန်စွာ ဖြည့်ပါ။");
        return;
    }

    const success = addItem(bundleId, {
        code,
        cost,
        price
    });

    if (!success) {
        alert("Item Code ရှိပြီးသား ဖြစ်နေပါတယ်။");
        return;
    }

    clearForm();

    refreshPage();

}

// ========================================
// Clear Form
// ========================================

function clearForm() {

    document.getElementById("code").value = "";
    document.getElementById("cost").value = "";
    document.getElementById("price").value = "";

    document.getElementById("cost").focus();

}

// ========================================
// Toggle Sold
// ========================================

function toggleItemSold(itemId) {

    toggleSold(bundleId, itemId);

    refreshPage();

}

// ========================================
// Delete Item
// ========================================

function removeItem(itemId) {

    const item = getItem(bundleId, itemId);

    if (!item)
        return;

    if (!confirm(`Delete Item ${item.code} ?`))
        return;

    deleteItem(bundleId, itemId);

    refreshPage();

}

// ========================================
// Edit Item
// ========================================

function editItem(itemId) {

    const item = getItem(bundleId, itemId);

    if (!item)
        return;

    const code = prompt("Item Code", item.code);

    if (code === null)
        return;

    const cost = prompt("Cost Price", item.cost);

    if (cost === null)
        return;

    const price = prompt("Selling Price", item.price);

    if (price === null)
        return;

    updateItem(bundleId, itemId, {

        code: code.trim(),

        cost: Number(cost),

        price: Number(price)

    });

    refreshPage();

}

// ========================================
// Render Item List
// ========================================

function renderItemList() {

    let items = getItems(bundleId);

    // Search
    if (currentSearch.trim() !== "") {
        items = searchItems(bundleId, currentSearch);
    }

    // Filter
    if (currentFilter !== "all") {
        items = items.filter(item =>
            currentFilter === "sold"
                ? item.sold
                : !item.sold
        );
    }

    const tbody = document.getElementById("itemTable");
    tbody.innerHTML = "";

    if (items.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    Item မရှိသေးပါ
                </td>
            </tr>
        `;

        return;
    }

    items.forEach(item => {

        const tr = document.createElement("tr");

        tr.innerHTML = `

        <td>${item.code}</td>

        <td>${item.cost.toLocaleString()}</td>

        <td>${item.price.toLocaleString()}</td>

        <td>
            ${item.sold ? "✅ Sold" : "📦 Stock"}
        </td>

        <td>

            <button onclick="editItem('${item.id}')">
                ✏️
            </button>

            <button onclick="toggleItemSold('${item.id}')">
                ${item.sold ? "↩️" : "✔"}
            </button>

            <button onclick="removeItem('${item.id}')">
                🗑
            </button>

        </td>

        `;

        tbody.appendChild(tr);

    });

}

// ========================================
// Change Filter
// ========================================

function changeFilter(status) {

    currentFilter = status;

    renderItemList();

}
