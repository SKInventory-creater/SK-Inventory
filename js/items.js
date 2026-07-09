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


