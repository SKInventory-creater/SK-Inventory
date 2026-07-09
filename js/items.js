// ===============================
// SK Inventory Pro
// File: js/items.js
// ===============================

const params = new URLSearchParams(window.location.search);
const bundleId = params.get("bundle");

document.addEventListener("DOMContentLoaded", () => {
    loadBundle();

    document
        .getElementById("saveItemBtn")
        .addEventListener("click", saveItem);
});

function loadBundle() {

    const bundle = getBundle(bundleId);

    if (!bundle) {
        alert("Bundle not found.");
        location.href = "index.html";
        return;
    }

    document.getElementById("bundleTitle").textContent = bundle.name;

    renderItems(bundle);
}

function renderItems(bundle) {

    const tbody = document.getElementById("itemTable");
    tbody.innerHTML = "";

    bundle.items.forEach(item => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${item.code}</td>
            <td>${item.cost.toLocaleString()}</td>
            <td>${item.price.toLocaleString()}</td>
            <td>${item.sold ? "✅ Sold" : "📦 Stock"}</td>
            <td>
                <button onclick="toggleItemSold('${item.id}')">
                    ${item.sold ? "Undo" : "Sold"}
                </button>

                <button onclick="removeItem('${item.id}')">
                    Delete
                </button>
            </td>
        `;

        tbody.appendChild(tr);

    });

}

function saveItem() {

    const code = document.getElementById("code").value.trim();
    const cost = document.getElementById("cost").value;
    const price = document.getElementById("price").value;

    if (!code || !cost || !price) {
        alert("အချက်အလက်အားလုံး ဖြည့်ပါ။");
        return;
    }

    const ok = addItem(bundleId, {
        code,
        cost,
        price
    });

    if (!ok) {
        alert("Item Code ထပ်နေပါသည်။");
        return;
    }

    document.getElementById("code").value = "";
    document.getElementById("cost").value = "";
    document.getElementById("price").value = "";

    loadBundle();
}

function toggleItemSold(itemId) {
    toggleSold(bundleId, itemId);
    loadBundle();
}

function removeItem(itemId) {

    if (!confirm("ဒီ Item ကို ဖျက်မှာသေချာပါသလား?"))
        return;

    deleteItem(bundleId, itemId);

    loadBundle();
}</div>

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
