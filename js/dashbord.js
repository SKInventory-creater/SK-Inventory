// ===============================
// SK Inventory Pro
// File: js/dashboard.js
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    refreshDashboard();

    document
        .getElementById("addBundleBtn")
        .addEventListener("click", addBundle);

    document
        .getElementById("searchBox")
        .addEventListener("input", searchBundles);
});

function refreshDashboard() {

    const bundles = getBundles();

    let itemCount = 0;
    let soldCount = 0;
    let totalCost = 0;
    let totalSale = 0;

    bundles.forEach(bundle => {

        itemCount += bundle.items.length;

        bundle.items.forEach(item => {

            totalCost += item.cost;

            if (item.sold) {
                soldCount++;
                totalSale += item.price;
            }

        });

    });

    document.getElementById("bundleCount").textContent = bundles.length;
    document.getElementById("itemCount").textContent = itemCount;
    document.getElementById("soldCount").textContent = soldCount;
    document.getElementById("remainCount").textContent = itemCount - soldCount;
    document.getElementById("totalCost").textContent = totalCost.toLocaleString();
    document.getElementById("totalSale").textContent = totalSale.toLocaleString();
    document.getElementById("totalProfit").textContent =
        (totalSale - totalCost).toLocaleString();

    renderBundles(bundles);
}

function renderBundles(bundles) {

    const list = document.getElementById("bundleList");
    list.innerHTML = "";

    if (bundles.length === 0) {
        list.innerHTML = `
            <li class="empty">
                Bundle မရှိသေးပါ။
            </li>
        `;
        return;
    }

    bundles.forEach(bundle => {

        const li = document.createElement("li");

        li.className = "bundle-card";

        li.innerHTML = `
            <strong>${bundle.name}</strong><br>
            Items : ${bundle.items.length}
            <br><br>

            <button onclick="openBundle('${bundle.id}')">
                Open
            </button>

            <button onclick="removeBundle('${bundle.id}')">
                Delete
            </button>
        `;

        list.appendChild(li);

    });

}

function addBundle() {

    const name = prompt("Bundle Name");

    if (!name) return;

    createBundle(name);

    refreshDashboard();

}

function removeBundle(id) {

    if (!confirm("ဒီ Bundle ကိုဖျက်မှာသေချာပါသလား?"))
        return;

    deleteBundle(id);

    refreshDashboard();

}

function openBundle(id) {

    location.href =
        "items.html?bundle=" + id;

}

function searchBundles() {

    const keyword =
        document
        .getElementById("searchBox")
        .value
        .toLowerCase();

    const bundles =
        getBundles().filter(bundle =>
            bundle.name
            .toLowerCase()
            .includes(keyword)
        );

    renderBundles(bundles);

}
