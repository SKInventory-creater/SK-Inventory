// ===============================
// SK Inventory Pro Database
// File: js/db.js
// ===============================

const DB_KEY = "sk_inventory_pro";

// Load database
function loadDB() {
    const data = localStorage.getItem(DB_KEY);

    if (!data) {
        return {
            bundles: [],
            settings: {
                currency: "MMK"
            }
        };
    }

    return JSON.parse(data);
}

// Save database
function saveDB(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// Create bundle
function createBundle(name) {
    const db = loadDB();

    const bundle = {
        id: Date.now().toString(),
        name: name,
        createdAt: new Date().toISOString(),
        items: []
    };

    db.bundles.push(bundle);
    saveDB(db);

    return bundle;
}

// Get all bundles
function getBundles() {
    return loadDB().bundles;
}

// Get bundle by id
function getBundle(id) {
    return loadDB().bundles.find(b => b.id === id);
}

// Delete bundle
function deleteBundle(id) {
    const db = loadDB();
    db.bundles = db.bundles.filter(b => b.id !== id);
    saveDB(db);
}

// Add item
function addItem(bundleId, item) {
    const db = loadDB();

    const bundle = db.bundles.find(b => b.id === bundleId);

    if (!bundle) return false;

    // Duplicate code check
    if (bundle.items.some(i => i.code === item.code)) {
        return false;
    }

    bundle.items.push({
        id: Date.now().toString(),
        code: item.code,
        cost: Number(item.cost),
        price: Number(item.price),
        sold: false,
        soldDate: null
    });

    saveDB(db);

    return true;
}

// Update sold status
function toggleSold(bundleId, itemId) {

    const db = loadDB();

    const bundle = db.bundles.find(b => b.id === bundleId);

    if (!bundle) return;

    const item = bundle.items.find(i => i.id === itemId);

    if (!item) return;

    item.sold = !item.sold;
    item.soldDate = item.sold ? new Date().toISOString() : null;

    saveDB(db);
}

// Delete item
function deleteItem(bundleId, itemId) {

    const db = loadDB();

    const bundle = db.bundles.find(b => b.id === bundleId);

    if (!bundle) return;

    bundle.items = bundle.items.filter(i => i.id !== itemId);

    saveDB(db);
}

// Reset database
function resetDatabase() {
    localStorage.removeItem(DB_KEY);
}
