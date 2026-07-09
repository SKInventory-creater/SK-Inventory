/* ==========================
   SK Inventory Pro
   Common Functions
========================== */

// ---------- Money Format ----------
function formatMoney(value) {
    return Number(value || 0).toLocaleString("en-US") + " Ks";
}

// ---------- Save Local ----------
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// ---------- Load Local ----------
function loadData(key) {
    const data = localStorage.getItem(key);

    if (data) {
        return JSON.parse(data);
    }

    return [];
}

// ---------- Page Navigation ----------
function goTo(page) {
    location.href = page;
}

// ---------- Search Box ----------
function toggleSearch() {

    const box = document.getElementById("searchBox");

    if (!box) return;

    box.classList.toggle("hidden");

    if (!box.classList.contains("hidden")) {

        document.getElementById("searchInput").focus();

    }

}

// ---------- Generate Bundle Code ----------
function nextBundleCode() {

    const bundles = loadData("bundles");

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    return letters[bundles.length] || "Z";

}

// ---------- Generate Item Code ----------
function generateItemCode(bundle, number) {

    return bundle +
        String(number).padStart(3, "0");

}

// ---------- Today's Date ----------
function today() {

    return new Date().toISOString().split("T")[0];

}

// ---------- Current Time ----------
function nowTime() {

    return new Date().toLocaleTimeString();

}
