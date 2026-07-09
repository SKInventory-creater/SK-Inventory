/* ==========================
   SK Inventory Pro
   Database Engine
========================== */

const BUNDLE_KEY = "bundles";
const ITEM_KEY = "items";

// =========================
// Bundle
// =========================

// Bundle အားလုံးယူရန်
function getBundles() {
    return loadData(BUNDLE_KEY);
}

// Bundle သိမ်းရန်
function saveBundles(data) {
    saveData(BUNDLE_KEY, data);
}

// Bundle အသစ်ဖန်တီးရန်
function createBundle(totalCost, totalItems, note = "") {

    const bundles = getBundles();

    const code = nextBundleCode();

    const costPerItem = Math.round(totalCost / totalItems);

    const bundle = {

        id: Date.now(),

        code,

        totalCost,

        totalItems,

        costPerItem,

        note,

        createdDate: today()

    };

    bundles.push(bundle);

    saveBundles(bundles);

    createItems(bundle);

    return bundle;

}

// =========================
// Items
// =========================

// Item အားလုံးယူရန်
function getItems() {
    return loadData(ITEM_KEY);
}

// Item သိမ်းရန်
function saveItems(data) {
    saveData(ITEM_KEY, data);
}

// Bundle ထဲက Item တွေဖန်တီးရန်
function createItems(bundle) {

    const items = getItems();

    for (let i = 1; i <= bundle.totalItems; i++) {

        items.push({

            id: Date.now() + i,

            bundle: bundle.code,

            code: generateItemCode(bundle.code, i),

            cost: bundle.costPerItem,

            salePrice: 0,

            profit: 0,

            status: false,

            image: "",

            note: "",

            soldDate: ""

        });

    }

    saveItems(items);

}

// Code နဲ့ Item ရှာရန်
function findItem(code) {

    return getItems().find(item => item.code === code);

}

// Bundle အလိုက် Item ယူရန်
function getBundleItems(bundleCode) {

    return getItems().filter(item => item.bundle === bundleCode);

}

// Item Update
function updateItem(updatedItem) {

    const items = getItems();

    const index = items.findIndex(i => i.id === updatedItem.id);

    if (index !== -1) {

        updatedItem.profit =
            updatedItem.salePrice - updatedItem.cost;

        items[index] = updatedItem;

        saveItems(items);

    }

}

// Item Delete
function deleteItem(id) {

    const items = getItems().filter(i => i.id !== id);

    saveItems(items);

}
