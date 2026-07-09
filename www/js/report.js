// ===============================
// SK Inventory Pro
// File: js/report.js
// ===============================

document.addEventListener("DOMContentLoaded", loadReport);

function loadReport() {

    const bundles = getBundles();

    let soldItems = 0;
    let totalCost = 0;
    let totalSales = 0;

    const tbody = document.getElementById("reportTable");
    tbody.innerHTML = "";

    bundles.forEach(bundle => {

        bundle.items.forEach(item => {

            if (!item.sold) return;

            soldItems++;

            totalCost += item.cost;
            totalSales += item.price;

            const profit = item.price - item.cost;

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${formatDate(item.soldDate)}</td>
                <td>${item.code}</td>
                <td>${item.cost.toLocaleString()}</td>
                <td>${item.price.toLocaleString()}</td>
                <td>${profit.toLocaleString()}</td>
            `;

            tbody.appendChild(tr);

        });

    });

    document.getElementById("soldItems").textContent = soldItems;
    document.getElementById("costAmount").textContent = totalCost.toLocaleString();
    document.getElementById("salesAmount").textContent = totalSales.toLocaleString();
    document.getElementById("profitAmount").textContent =
        (totalSales - totalCost).toLocaleString();
}

function formatDate(date) {

    if (!date) return "-";

    return new Date(date).toLocaleDateString();
}
