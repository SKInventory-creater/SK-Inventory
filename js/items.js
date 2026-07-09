/* ==========================================
   SK Inventory Pro
   Items Page
========================================== */

let currentBundle = "";

document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);

    currentBundle = params.get("bundle");

    if (!currentBundle) {
        goTo("index.html");
        return;
    }

    loadItems();

    document
        .getElementById("searchItem")
        .addEventListener("input", searchItems);

});

// =====================
// Load Items
// =====================

function loadItems() {

    const items = getBundleItems(currentBundle);

    document.getElementById("bundleTitle").innerHTML =
        "ဘေထုတ် " + currentBundle;

    document.getElementById("bundleSummary").innerHTML =
        "အထည် " + items.length + " ထည်";

    renderItems(items);

}

// =====================
// Render
// =====================

function renderItems(items) {

    const list = document.getElementById("itemList");

    list.innerHTML = "";

    items.forEach(item => {

        list.innerHTML += `

<div class="item-card">

<h3>${item.code}</h3>

<div class="row">
<label>အရင်း</label>
<span>${formatMoney(item.cost)}</span>
</div>

<div class="row">

<label>ရောင်းဈေး</label>

<input
type="number"
value="${item.salePrice}"
onchange="changePrice(${item.id},this.value)">

</div>

<div class="row">

<label>အမြတ်</label>

<span>${formatMoney(item.profit)}</span>

</div>

<div class="row">

<label>ရောင်းပြီး</label>

<input
type="checkbox"
${item.status ? "checked" : ""}
onchange="changeStatus(${item.id},this.checked)">

</div>

<div class="row">

<label>မှတ်ချက်</label>

<input
type="text"
value="${item.note}"
onchange="changeNote(${item.id},this.value)">

</div>

</div>

`;

    });

}

// =====================
// Search
// =====================

function searchItems() {

    const keyword = document
        .getElementById("searchItem")
        .value
        .trim()
        .toUpperCase();

    const items = getBundleItems(currentBundle);

    if (keyword == "") {

        renderItems(items);

        return;

    }

    renderItems(

        items.filter(i =>
            i.code.includes(keyword)
        )

    );

}

// =====================
// Change Sale Price
// =====================

function changePrice(id, value) {

    const items = getItems();

    const item = items.find(i => i.id == id);

    if (!item) return;

    item.salePrice = Number(value);

    item.profit = item.salePrice - item.cost;

    updateItem(item);

    loadItems();

}

// =====================
// Change Status
// =====================

function changeStatus(id, status) {

    const items = getItems();

    const item = items.find(i => i.id == id);

    if (!item) return;

    item.status = status;

    updateItem(item);

}

// =====================
// Change Note
// =====================

function changeNote(id, note) {

    const items = getItems();

    const item = items.find(i => i.id == id);

    if (!item) return;

    item.note = note;

    updateItem(item);

}
