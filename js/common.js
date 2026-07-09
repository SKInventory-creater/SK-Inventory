// Number Format
function formatMoney(amount) {
    return Number(amount || 0).toLocaleString("en-US") + " Ks";
}

// Save Data
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Load Data
function loadData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

// Generate Bundle Code
function getNextBundleCode() {

    const bundles = loadData("bundles");

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    return alphabet[bundles.length] || "Z";
}

// Generate Item Code
function generateItemCode(bundleCode, index) {

    return bundleCode +
        String(index + 1).padStart(3, "0");
}

// Page Navigation
function goTo(page) {
    window.location.href = page;
}

// Search Toggle
function toggleSearch() {

    const box = document.getElementById("searchBox");

    if (!box) return;

    box.classList.toggle("hidden");

    const input = document.getElementById("searchInput");

    if (input) input.focus();
}
