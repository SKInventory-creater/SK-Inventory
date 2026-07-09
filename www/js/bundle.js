/* ==========================================
   SK Inventory Pro
   Bundle Page
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const costInput = document.getElementById("totalCost");

    if (costInput) {
        costInput.focus();
    }

});

// သိမ်းရန်
function saveBundle() {

    const totalCost = Number(
        document.getElementById("totalCost").value
    );

    const totalItems = Number(
        document.getElementById("totalItems").value
    );

    const note = document
        .getElementById("note")
        .value
        .trim();

    // စစ်ဆေးခြင်း
    if (totalCost <= 0) {
        alert("ဘေထုတ်ဝယ်ဈေး ထည့်ပါ။");
        return;
    }

    if (totalItems <= 0) {
        alert("အထည်အရေအတွက် ထည့်ပါ။");
        return;
    }

    // Bundle ဖန်တီး
    const bundle = createBundle(
        totalCost,
        totalItems,
        note
    );

    alert(
        `ဘေထုတ် ${bundle.code} ကို အောင်မြင်စွာ သိမ်းပြီးပါပြီ။`
    );

    // Dashboard သို့ပြန်
    goTo("index.html");

}
