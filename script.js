// 遊戲初始數據
let gameState = {
    money: 0,
    fame: 0,
    mechanics: 0,
    repairIncome: 100,
    famePerRepair: 1,
    repairTime: 3000, // 毫秒
    isRepairing: false
};

// 升級清單
const upgrades = [
    { id: 'filter', name: '高流量濾棉', cost: 200, type: 'fame', value: 2 },
    { id: 'transmission', name: '傳動組優化', cost: 500, type: 'speed', value: 0.8 },
    { id: 'mechanic', name: '雇用專業技師', cost: 1000, type: 'auto', value: 5 }
];

// DOM 元素
const moneyEl = document.getElementById('money');
const fameEl = document.getElementById('fame');
const mechanicsEl = document.getElementById('mechanics');
const repairBtn = document.getElementById('repair-btn');
const progressBar = document.getElementById('progress-bar');
const upgradeList = document.getElementById('upgrade-list');

// 初始化升級選單
function initShop() {
    upgradeList.innerHTML = '';
    upgrades.forEach(upg => {
        const div = document.createElement('div');
        div.className = 'upgrade-item';
        div.innerHTML = `
            <span>${upg.name} ($${upg.cost})</span>
            <button class="upgrade-btn" onclick="buyUpgrade('${upg.id}')">購買</button>
        `;
        upgradeList.appendChild(div);
    });
}

// 維修邏輯
repairBtn.addEventListener('click', () => {
    if (gameState.isRepairing) return;
    
    gameState.isRepairing = true;
    repairBtn.disabled = true;
    let start = null;
    
    function animate(timestamp) {
        if (!start) start = timestamp;
        let progress = timestamp - start;
        let percent = Math.min((progress / gameState.repairTime) * 100, 100);
        progressBar.style.width = percent + '%';
        
        if (progress < gameState.repairTime) {
            requestAnimationFrame(animate);
        } else {
            finishRepair();
        }
    }
    requestAnimationFrame(animate);
});

function finishRepair() {
    gameState.money += gameState.repairIncome;
    gameState.fame += gameState.famePerRepair;
    gameState.isRepairing = false;
    repairBtn.disabled = false;
    progressBar.style.width = '0%';
    updateUI();
}

// 購買升級
window.buyUpgrade = function(id) {
    const upg = upgrades.find(u => u.id === id);
    if (gameState.money >= upg.cost) {
        gameState.money -= upg.cost;
        if (upg.type === 'fame') gameState.famePerRepair += upg.value;
        if (upg.type === 'speed') gameState.repairTime *= upg.value;
        if (upg.type === 'auto') gameState.mechanics += 1;
        
        upg.cost = Math.floor(upg.cost * 1.5); // 漲價
        initShop();
        updateUI();
    } else {
        alert('資金不足！');
    }
};

// 自動化收入 (技師)
setInterval(() => {
    if (gameState.mechanics > 0) {
        gameState.money += gameState.mechanics * 5;
        updateUI();
    }
}, 1000);

function updateUI() {
    moneyEl.innerText = gameState.money;
    fameEl.innerText = gameState.fame;
    mechanicsEl.innerText = gameState.mechanics;
}

initShop();
updateUI();