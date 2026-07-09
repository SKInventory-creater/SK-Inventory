// ========================================
// SK Inventory Pro
// File: js/dashboard.js
// Version: 1.0
// ========================================

document.addEventListener("DOMContentLoaded", initDashboard);

function initDashboard() {
    bindEvents();
    refreshDashboard();
}

function bindEvents() {

    document
        .getElementById("addBundleBtn")
        .addEventListener("click", createNewBundle);

    document
        .getElementById("searchBox")
        .addEventListener("input", filterBundleList);

}

function refreshDashboard() {

    const stats = getDashboardStats();

    document.getElementById("bundleCount").textContent = stats.bundleCount;
    document.getElementById("itemCount").textContent = stats.itemCount;
    document.getElementById("soldCount").textContent = stats.soldCount;
    document.getElementById("remainCount").textContent = stats.remainCount;
    document.getElementById("totalCost").textContent = stats.totalCost.toLocaleString();
    document.getElementById("totalSale").textContent = stats.totalSale.toLocaleString();
    document.getElementById("totalProfit").textContent = stats.totalProfit.toLocaleString();

    renderBundles(getBundles());

}

function renderBundles(bundles) {

    const list = document.getElementById("bundleList");
    list.innerHTML = "";

    if (bundles.length === 0) {

        list.innerHTML = `
            <li class="empty">
                Bundle မရှိသေးပါ
            </li>
        `;

        return;
    }

    bundles.forEach(bundle => {

        const stat = getBundleStats(bundle.id);

        const li = document.createElement("li");

        li.className = "bundle-card";

        li.innerHTML = `
            <h3>${bundle.name}</h3>

            <p>Items : ${stat.itemCount}</p>

            <p>Sold : ${stat.soldCount}</p>

            <p>Remain : ${stat.remainCount}</p>

            <button onclick="openBundle('${bundle.id}')">
                Open
            </button>

            <button onclick="renameBundle('${bundle.id}')">
                Rename
            </button>

            <button onclick="removeBundle('${bundle.id}')">
                Delete
            </button>
        `;

        list.appendChild(li);

    });

}

function createNewBundle() {

    const name = prompt("Bundle Name");

    if (!name) return;

    if (bundleExists(name)) {

        alert("Bundle Name ရှိပြီးသားဖြစ်ပါတယ်။");

        return;
    }

    createBundle(name);

    refreshDashboard();

}

function renameBundle(id) {

    const bundle = getBundle(id);

    const name = prompt(
        "New Bundle Name",
        bundle.name
    );

    if (!name) return;

    updateBundle(id, {
        name: name.trim()
    });

    refreshDashboard();

}

function removeBundle(id) {

    if (!confirm("ဒီ Bundle ကို ဖျက်မှာ သေချာပါသလား?"))
        return;

    deleteBundle(id);

    refreshDashboard();

}

function openBundle(id) {

    location.href =
        "items.html?bundle=" + id;

}

function filterBundleList() {

    const keyword =
        document
            .getElementById("searchBox")
            .value
            .trim()
            .toLowerCase();

    const bundles = getBundles().filter(bundle =>
        bundle.name.toLowerCase().includes(keyword)
    );

    renderBundles(bundles);

}
