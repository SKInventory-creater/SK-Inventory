/* ==========================================
   SK Inventory Pro
   Dashboard
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadDashboard();

    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.addEventListener("input", searchItem);
    }

});

// Dashboard Load
function loadDashboard() {

    updateSummary();

    renderBundles();

}

// Summary
function updateSummary() {

    const bundles = getBundles();

    const items = getItems();

    let totalProfit = 0;

    items.forEach(item => {

        totalProfit += Number(item.profit || 0);

    });

    document.getElementById("summaryText").innerHTML =
        `ဘေထုတ် ${bundles.length} ခု • အထည် ${items.length} ထည်`;

    document.getElementById("totalProfit").innerHTML =
        formatMoney(totalProfit);

}

// Bundle Card
function renderBundles() {

    const list = document.getElementById("bundleList");

    list.innerHTML = "";

    const bundles = getBundles();

    bundles.forEach(bundle => {

        const bundleItems = getBundleItems(bundle.code);

        const sold = bundleItems.filter(i => i.status).length;

        const remain = bundleItems.length - sold;

        const profit = bundleItems.reduce((sum, i) => sum + Number(i.profit || 0), 0);

        list.innerHTML += `
        <div class="bundle-card"
             onclick="goTo('items.html?bundle=${bundle.code}')">

            <h3>📦 ဘေထုတ် ${bundle.code}</h3>

            <div class="bundle-row">
                <span>အထည်</span>
                <span>${bundle.totalItems} ထည်</span>
            </div>

            <div class="bundle-row">
                <span>ရောင်းပြီး</span>
                <span>${sold}</span>
            </div>

            <div class="bundle-row">
                <span>မရောင်းရသေး</span>
                <span>${remain}</span>
            </div>

            <div class="bundle-row">
                <span>အရင်း</span>
                <span>${formatMoney(bundle.totalCost)}</span>
            </div>

            <div class="bundle-row bundle-profit">
                <span>အမြတ်</span>
                <span>${formatMoney(profit)}</span>
            </div>

        </div>`;
    });

}

// Search
function searchItem() {

    const keyword = document
        .getElementById("searchInput")
        .value
        .trim()
        .toUpperCase();

    if (keyword === "") {

        renderBundles();

        return;

    }

    const item = findItem(keyword);

    const list = document.getElementById("bundleList");

    if (!item) {

        list.innerHTML = `
        <div class="bundle-card">

            <h3>မတွေ့ပါ</h3>

            <p>${keyword} မရှိပါ။</p>

        </div>`;

        return;

    }

    list.innerHTML = `
    <div class="bundle-card"
         onclick="goTo('items.html?bundle=${item.bundle}')">

        <h3>${item.code}</h3>

        <div class="bundle-row">
            <span>ဘေထုတ်</span>
            <span>${item.bundle}</span>
        </div>

        <div class="bundle-row">
            <span>အရင်း</span>
            <span>${formatMoney(item.cost)}</span>
        </div>

        <div class="bundle-row">
            <span>ရောင်းဈေး</span>
            <span>${formatMoney(item.salePrice)}</span>
        </div>

        <div class="bundle-row bundle-profit">
            <span>အမြတ်</span>
            <span>${formatMoney(item.profit)}</span>
        </div>

        <div class="bundle-row">
            <span>အခြေအနေ</span>
            <span>${item.status ? "✅ ရောင်းပြီး" : "⏳ မရောင်းရသေး"}</span>
        </div>

    </div>`;
}
