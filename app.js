// 应用程序主逻辑
let currentDeck = [];
let maxDeckSize = 40;
let maxCopiesPerCard = 4;

// 屏幕切换
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    
    // 初始化对应屏幕
    if (screenId === 'deckBuilder') {
        initDeckBuilder();
    } else if (screenId === 'cardCollection') {
        initCardCollection();
    } else if (screenId === 'game') {
        initGame();
    }
}

// 显示帮助
function showHelp() {
    document.getElementById('helpScreen').style.display = 'block';
}

// 关闭帮助
function closeHelp() {
    document.getElementById('helpScreen').style.display = 'none';
}

// 卡组构建
function initDeckBuilder() {
    displayAvailableCards();
    updateDeckDisplay();
}

function displayAvailableCards() {
    const container = document.getElementById('availableCards');
    container.innerHTML = '';
    
    const allCards = getAllCards();
    allCards.forEach(card => {
        const cardElement = createDeckCardElement(card);
        container.appendChild(cardElement);
    });
}

function createDeckCardElement(card) {
    const cardDiv = document.createElement('div');
    cardDiv.className = `card ${card.team}`;
    cardDiv.dataset.cardId = card.id;
    
    const count = getCardCountInDeck(card.id);
    const canAdd = count < maxCopiesPerCard && currentDeck.length < maxDeckSize;
    
    cardDiv.innerHTML = `
        <div class="card-name">${card.name}</div>
        <div class="card-cost">${card.cost}</div>
        <div class="card-description">${card.description}</div>
        <div class="card-stats">
            <span>⚔️ ${card.attack}</span>
            <span>❤️ ${card.health}</span>
        </div>
        <div class="card-ability">${ABILITIES[card.ability].name}</div>
        <div class="card-count">${count}/${maxCopiesPerCard}</div>
    `;
    
    if (canAdd) {
        cardDiv.addEventListener('click', () => addCardToDeck(card));
        cardDiv.style.cursor = 'pointer';
    } else {
        cardDiv.style.opacity = '0.6';
        cardDiv.style.cursor = 'not-allowed';
    }
    
    return cardDiv;
}

function addCardToDeck(card) {
    const count = getCardCountInDeck(card.id);
    
    if (count >= maxCopiesPerCard) {
        alert(`${card.name} 已达到最大数量 ${maxCopiesPerCard}`);
        return;
    }
    
    if (currentDeck.length >= maxDeckSize) {
        alert(`卡组已满，最多 ${maxDeckSize} 张卡牌`);
        return;
    }
    
    currentDeck.push({...card});
    updateDeckDisplay();
    displayAvailableCards();
}

function removeCardFromDeck(index) {
    currentDeck.splice(index, 1);
    updateDeckDisplay();
    displayAvailableCards();
}

function getCardCountInDeck(cardId) {
    return currentDeck.filter(card => card.id === cardId).length;
}

function updateDeckDisplay() {
    const container = document.getElementById('currentDeck');
    const countElement = document.getElementById('deckCount');
    
    countElement.textContent = `${currentDeck.length}/${maxDeckSize}`;
    container.innerHTML = '';
    
    currentDeck.forEach((card, index) => {
        const cardElement = createDeckCardElement(card);
        cardElement.addEventListener('click', () => removeCardFromDeck(index));
        cardElement.style.cursor = 'pointer';
        container.appendChild(cardElement);
    });
}

function clearDeck() {
    if (confirm('确定要清空卡组吗？')) {
        currentDeck = [];
        updateDeckDisplay();
        displayAvailableCards();
    }
}

function saveDeck() {
    if (currentDeck.length !== maxDeckSize) {
        alert(`卡组需要正好 ${maxDeckSize} 张卡牌，当前 ${currentDeck.length} 张`);
        return;
    }
    
    localStorage.setItem('customDeck', JSON.stringify(currentDeck));
    alert('卡组保存成功！');
}

function loadDeck() {
    const saved = localStorage.getItem('customDeck');
    if (saved) {
        currentDeck = JSON.parse(saved);
        updateDeckDisplay();
        displayAvailableCards();
        alert('卡组加载成功！');
    }
}

// 卡牌过滤
function filterCards() {
    const searchTerm = document.getElementById('cardSearch').value.toLowerCase();
    const teamFilter = document.getElementById('teamFilter').value;
    const costFilter = document.getElementById('costFilter').value;
    
    const allCards = getAllCards();
    const filteredCards = allCards.filter(card => {
        const matchesSearch = card.name.toLowerCase().includes(searchTerm) || 
                            card.description.toLowerCase().includes(searchTerm);
        const matchesTeam = !teamFilter || card.team === teamFilter;
        const matchesCost = !costFilter || 
                           (costFilter === '6+' ? card.cost >= 6 : card.cost == costFilter);
        
        return matchesSearch && matchesTeam && matchesCost;
    });
    
    const container = document.getElementById('availableCards');
    container.innerHTML = '';
    
    filteredCards.forEach(card => {
        const cardElement = createDeckCardElement(card);
        container.appendChild(cardElement);
    });
}

// 卡牌图鉴
function initCardCollection() {
    displayCollectionCards('all');
}

function showCollectionTab(tab) {
    // 更新标签状态
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // 显示对应卡牌
    displayCollectionCards(tab);
}

function displayCollectionCards(team) {
    const container = document.getElementById('collectionCards');
    container.innerHTML = '';
    
    let cardsToShow;
    if (team === 'plant') {
        cardsToShow = CARDS.plants;
    } else if (team === 'zombie') {
        cardsToShow = CARDS.zombies;
    } else {
        cardsToShow = getAllCards();
    }
    
    cardsToShow.forEach(card => {
        const cardElement = createCollectionCardElement(card);
        container.appendChild(cardElement);
    });
}

function createCollectionCardElement(card) {
    const cardDiv = document.createElement('div');
    cardDiv.className = `card ${card.team}`;
    
    const rarityColor = RARITY[card.rarity].color;
    
    cardDiv.innerHTML = `
        <div class="card-name">${card.name}</div>
        <div class="card-cost">${card.cost}</div>
        <div class="card-description">${card.description}</div>
        <div class="card-stats">
            <span>⚔️ ${card.attack}</span>
            <span>❤️ ${card.health}</span>
        </div>
        <div class="card-ability">${ABILITIES[card.ability].name}</div>
        <div class="card-rarity" style="color: ${rarityColor}">${RARITY[card.rarity].name}</div>
    `;
    
    return cardDiv;
}

function filterCollection() {
    const searchTerm = event.target.value.toLowerCase();
    const container = document.getElementById('collectionCards');
    const cards = container.querySelectorAll('.card');
    
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 加载保存的卡组
    loadDeck();
    
    // 添加键盘快捷键
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeHelp();
        }
    });
    
    // 添加触摸支持
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
});

// 导出函数供HTML使用
window.showScreen = showScreen;
window.showHelp = showHelp;
window.closeHelp = closeHelp;
window.addCardToDeck = addCardToDeck;
window.removeCardFromDeck = removeCardFromDeck;
window.clearDeck = clearDeck;
window.saveDeck = saveDeck;
window.loadDeck = loadDeck;
window.filterCards = filterCards;
window.showCollectionTab = showCollectionTab;
window.filterCollection = filterCollection;
window.endTurn = endTurn;
window.initGame = initGame;
