// ========================================
// SK Inventory Pro
// File: js/db.js
// Version: 1.0
// ========================================

const DB_KEY = "sk_inventory_pro";

// ----------------------
// Load Database
// ----------------------
function loadDB() {

    const data = localStorage.getItem(DB_KEY);

    if (data) {
        return JSON.parse(data);
    }

    const db = {
        bundles: [],
        settings: {
            currency: "MMK",
            version: "1.0"
        }
    };

    saveDB(db);

    return db;
}

// ----------------------
// Save Database
// ----------------------
function saveDB(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// ----------------------
// Bundle Functions
// ----------------------

// Get All Bundles
function getBundles() {
    return loadDB().bundles;
}

// Get One Bundle
function getBundle(id) {

    return loadDB().bundles.find(
        bundle => bundle.id === id
    );

}

// Create Bundle
function createBundle(name) {

    const db = loadDB();

    const bundle = {

        id: Date.now().toString(),

        name: name.trim(),

        createdAt: new Date().toISOString(),

        items: []

    };

    db.bundles.push(bundle);

    saveDB(db);

    return bundle;

}

// Update Bundle
function updateBundle(id, data) {

    const db = loadDB();

    const bundle = db.bundles.find(
        b => b.id === id
    );

    if (!bundle)
        return false;

    Object.assign(bundle, data);

    saveDB(db);

    return true;

}

// Delete Bundle
function deleteBundle(id) {

    const db = loadDB();

    db.bundles =
        db.bundles.filter(
            b => b.id !== id
        );

    saveDB(db);

}

// ========================================
// Item Functions
// ========================================

// Get Items
function getItems(bundleId) {

    const bundle = getBundle(bundleId);

    if (!bundle)
        return [];

    return bundle.items;

}

// Get One Item
function getItem(bundleId, itemId) {

    const bundle = getBundle(bundleId);

    if (!bundle)
        return null;

    return bundle.items.find(
        item => item.id === itemId
    );

}

// Add Item
function addItem(bundleId, item) {

    const db = loadDB();

    const bundle =
        db.bundles.find(
            b => b.id === bundleId
        );

    if (!bundle)
        return false;

    // Duplicate Code Check
    if (
        bundle.items.some(
            i => i.code.toLowerCase() === item.code.toLowerCase()
        )
    ) {
        return false;
    }

    bundle.items.push({

        id: Date.now().toString(),

        code: item.code.trim(),

        cost: Number(item.cost),

        price: Number(item.price),

        sold: false,

        soldDate: null,

        createdAt: new Date().toISOString()

    });

    saveDB(db);

    return true;

}

// Update Item
function updateItem(bundleId, itemId, data) {

    const db = loadDB();

    const bundle =
        db.bundles.find(
            b => b.id === bundleId
        );

    if (!bundle)
        return false;

    const item =
        bundle.items.find(
            i => i.id === itemId
        );

    if (!item)
        return false;

    Object.assign(item, data);

    saveDB(db);

    return true;

}

// Delete Item
function deleteItem(bundleId, itemId) {

    const db = loadDB();

    const bundle =
        db.bundles.find(
            b => b.id === bundleId
        );

    if (!bundle)
        return false;

    bundle.items =
        bundle.items.filter(
            i => i.id !== itemId
        );

    saveDB(db);

    return true;

}

// Toggle Sold
function toggleSold(bundleId, itemId) {

    const db = loadDB();

    const bundle =
        db.bundles.find(
            b => b.id === bundleId
        );

    if (!bundle)
        return false;

    const item =
        bundle.items.find(
            i => i.id === itemId
        );

    if (!item)
        return false;

    item.sold = !item.sold;

    item.soldDate =
        item.sold
            ? new Date().toISOString()
            : null;

    saveDB(db);

    return true;

        }

// ========================================
// Search Functions
// ========================================

// Search Items
function searchItems(bundleId, keyword) {

    const items = getItems(bundleId);

    if (!keyword)
        return items;

    keyword = keyword.toLowerCase().trim();

    return items.filter(item =>
        item.code.toLowerCase().includes(keyword)
    );

}

// Filter Items
function filterItems(bundleId, status) {

    const items = getItems(bundleId);

    switch (status) {

        case "sold":
            return items.filter(item => item.sold);

        case "stock":
            return items.filter(item => !item.sold);

        default:
            return items;

    }

}

// ========================================
// Dashboard Statistics
// ========================================

function getDashboardStats() {

    const bundles = getBundles();

    let stats = {

        bundleCount: bundles.length,

        itemCount: 0,

        soldCount: 0,

        remainCount: 0,

        totalCost: 0,

        totalSale: 0,

        totalProfit: 0

    };

    bundles.forEach(bundle => {

        bundle.items.forEach(item => {

            stats.itemCount++;

            stats.totalCost += item.cost;

            if (item.sold) {

                stats.soldCount++;

                stats.totalSale += item.price;

            }

        });

    });

    stats.remainCount =
        stats.itemCount - stats.soldCount;

    stats.totalProfit =
        stats.totalSale - stats.totalCost;

    return stats;

}

// ========================================
// Bundle Statistics
// ========================================

function getBundleStats(bundleId) {

    const items = getItems(bundleId);

    let stats = {
        itemCount: items.length,
        soldCount: 0,
        remainCount: 0,
        totalCost: 0,
        totalSale: 0,
        totalProfit: 0
    };

    items.forEach(item => {

        stats.totalCost += item.cost;

        if (item.sold) {
            stats.soldCount++;
            stats.totalSale += item.price;
        }

    });

    stats.remainCount = stats.itemCount - stats.soldCount;
    stats.totalProfit = stats.totalSale - stats.totalCost;

    return stats;
}

// ========================================
// Sold Items
// ========================================

function getSoldItems() {

    const soldItems = [];

    getBundles().forEach(bundle => {

        bundle.items.forEach(item => {

            if (item.sold) {

                soldItems.push({
                    bundleId: bundle.id,
                    bundleName: bundle.name,
                    ...item
                });

            }

        });

    });

    return soldItems;
}

// ========================================
// Daily Report
// ========================================

function getDailyReport(date) {

    const target = new Date(date).toDateString();

    return getSoldItems().filter(item => {

        if (!item.soldDate) return false;

        return new Date(item.soldDate).toDateString() === target;

    });

}

// ========================================
// Monthly Report
// ========================================

function getMonthlyReport(year, month) {

    return getSoldItems().filter(item => {

        if (!item.soldDate) return false;

        const d = new Date(item.soldDate);

        return (
            d.getFullYear() === year &&
            (d.getMonth() + 1) === month
        );

    });

}

// ========================================
// Settings
// ========================================

function getSettings() {
    return loadDB().settings;
}

function saveSettings(settings) {

    const db = loadDB();

    db.settings = {
        ...db.settings,
        ...settings
    };

    saveDB(db);

    return true;
}

// ========================================
// Backup / Restore
// ========================================

// Export Database
function exportDatabase() {
    return JSON.stringify(loadDB(), null, 2);
}

// Import Database
function importDatabase(json) {

    try {

        const db =
            typeof json === "string"
                ? JSON.parse(json)
                : json;

        if (!db.bundles || !db.settings) {
            return false;
        }

        saveDB(db);

        return true;

    } catch (e) {

        console.error(e);

        return false;

    }

}

// ========================================
// Utilities
// ========================================

// Generate Next Item Code
function generateItemCode(bundleId, prefix = "A") {

    const items = getItems(bundleId);

    let max = 0;

    items.forEach(item => {

        const num = parseInt(
            item.code.replace(prefix, "")
        );

        if (!isNaN(num) && num > max)
            max = num;

    });

    return prefix +
        String(max + 1).padStart(3, "0");
}

// Check
