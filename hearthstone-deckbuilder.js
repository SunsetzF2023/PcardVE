// 炉石风格卡组构建器 - 拖拽操作

class HearthstoneDeckBuilder {
    constructor() {
        this.currentDeck = [];
        this.maxDeckSize = 40;
        this.maxCopiesPerCard = 4;
        this.allCards = [];
        this.filteredCards = [];
        this.selectedCard = null;
        
        this.initializeCards();
        this.setupEventListeners();
        this.renderCardCollection();
        this.updateDeckDisplay();
    }

    // 初始化卡牌数据
    initializeCards() {
        // 使用现有的卡牌数据
        this.allCards = getAllCards();
        this.filteredCards = [...this.allCards];
    }

    // 设置事件监听器
    setupEventListeners() {
        // 搜索和过滤
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterCards();
        });

        document.getElementById('teamFilter').addEventListener('change', () => {
            this.filterCards();
        });

        document.getElementById('costFilter').addEventListener('change', () => {
            this.filterCards();
        });

        // 操作按钮
        document.getElementById('clearDeck').addEventListener('click', () => {
            this.clearDeck();
        });

        document.getElementById('saveDeck').addEventListener('click', () => {
            this.saveDeck();
        });

        document.getElementById('backToMenu').addEventListener('click', () => {
            window.location.href = 'index.html';
        });

        // 模态框关闭
        document.querySelector('.close-btn').addEventListener('click', () => {
            this.closeCardModal();
        });

        // 点击模态框外部关闭
        document.getElementById('cardModal').addEventListener('click', (e) => {
            if (e.target.id === 'cardModal') {
                this.closeCardModal();
            }
        });

        // 设置拖拽区域
        this.setupDragAndDrop();
    }

    // 设置拖拽功能
    setupDragAndDrop() {
        const deckDropZone = document.getElementById('deckDropZone');
        
        // 防止默认拖拽行为
        deckDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            deckDropZone.classList.add('drag-over');
        });

        deckDropZone.addEventListener('dragleave', () => {
            deckDropZone.classList.remove('drag-over');
        });

        deckDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            deckDropZone.classList.remove('drag-over');
            
            const cardData = JSON.parse(e.dataTransfer.getData('text/plain'));
            this.addCardToDeck(cardData);
        });
    }

    // 过滤卡牌
    filterCards() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const teamFilter = document.getElementById('teamFilter').value;
        const costFilter = document.getElementById('costFilter').value;

        this.filteredCards = this.allCards.filter(card => {
            // 搜索过滤
            const matchesSearch = !searchTerm || 
                card.name.toLowerCase().includes(searchTerm) ||
                card.description.toLowerCase().includes(searchTerm);

            // 队伍过滤
            const matchesTeam = !teamFilter || card.team === teamFilter;

            // 费用过滤
            let matchesCost = true;
            if (costFilter) {
                if (costFilter === '6+') {
                    matchesCost = card.cost >= 6;
                } else {
                    matchesCost = card.cost == costFilter;
                }
            }

            return matchesSearch && matchesTeam && matchesCost;
        });

        this.renderCardCollection();
    }

    // 渲染卡牌收藏
    renderCardCollection() {
        const cardGrid = document.getElementById('cardGrid');
        cardGrid.innerHTML = '';

        this.filteredCards.forEach(card => {
            const cardElement = this.createCollectionCard(card);
            cardGrid.appendChild(cardElement);
        });
    }

    // 创建收藏中的卡牌元素
    createCollectionCard(card) {
        const cardDiv = document.createElement('div');
        cardDiv.className = `card ${card.team}`;
        cardDiv.draggable = true;
        
        cardDiv.innerHTML = `
            <div class="card-name">${card.name}</div>
            <div class="card-cost">${card.cost}</div>
            <div class="card-stats">
                <span>⚔️ ${card.attack}</span>
                <span>❤️ ${card.health}</span>
            </div>
            <div class="card-description">${card.description}</div>
            <div class="card-abilities">
                ${this.getAbilityTags(card)}
            </div>
        `;

        // 拖拽事件
        cardDiv.addEventListener('dragstart', (e) => {
            cardDiv.classList.add('dragging');
            e.dataTransfer.setData('text/plain', JSON.stringify(card));
            
            // 创建拖拽预览
            const dragPreview = cardDiv.cloneNode(true);
            dragPreview.classList.add('drag-preview');
            dragPreview.style.position = 'fixed';
            dragPreview.style.top = '-1000px';
            dragPreview.style.left = '-1000px';
            document.body.appendChild(dragPreview);
            e.dataTransfer.setDragImage(dragPreview, 0, 0);
            
            setTimeout(() => {
                document.body.removeChild(dragPreview);
            }, 0);
        });

        cardDiv.addEventListener('dragend', () => {
            cardDiv.classList.remove('dragging');
        });

        // 点击事件 - 显示详情
        cardDiv.addEventListener('click', () => {
            this.showCardModal(card);
        });

        return cardDiv;
    }

    // 获取能力标签
    getAbilityTags(card) {
        const abilityNames = {
            none: '无',
            piercing: '必中',
            frenzy: '疯狂',
            lethal: '致命',
            instantkill: '秒杀',
            shield: '防御',
            doublehit: '双击',
            freeze: '冻结',
            drawcard: '抽卡',
            bounce: '弹回',
            move: '移动',
            heal: '治疗',
            teamwork: '组队联手'
        };

        if (card.ability && card.ability !== 'none') {
            const abilityName = abilityNames[card.ability] || card.ability;
            return `<span class="ability-tag">${abilityName}</span>`;
        }
        return '';
    }

    // 显示卡牌详情模态框
    showCardModal(card) {
        this.selectedCard = card;
        const modal = document.getElementById('cardModal');
        
        // 更新模态框内容
        document.getElementById('modalCardName').textContent = card.name;
        document.getElementById('modalCardCost').textContent = card.cost;
        document.getElementById('modalCardAttack').textContent = card.attack;
        document.getElementById('modalCardHealth').textContent = card.health;
        document.getElementById('modalCardDescription').textContent = card.description;
        document.getElementById('modalCardAbilities').innerHTML = this.getAbilityTags(card);
        
        // 更新计数
        const currentCount = this.getCardCountInDeck(card.id);
        document.getElementById('modalCardCount').textContent = currentCount;
        
        // 更新按钮状态
        const addBtn = document.getElementById('addToDeckBtn');
        if (currentCount >= this.maxCopiesPerCard) {
            addBtn.disabled = true;
            addBtn.textContent = '已达上限';
            addBtn.classList.add('disabled');
        } else if (this.currentDeck.length >= this.maxDeckSize) {
            addBtn.disabled = true;
            addBtn.textContent = '卡组已满';
            addBtn.classList.add('disabled');
        } else {
            addBtn.disabled = false;
            addBtn.innerHTML = '<i class="fas fa-plus"></i> 添加到卡组';
            addBtn.classList.remove('disabled');
        }
        
        modal.style.display = 'block';
    }

    // 关闭卡牌模态框
    closeCardModal() {
        document.getElementById('cardModal').style.display = 'none';
        this.selectedCard = null;
    }

    // 添加卡牌到卡组
    addCardToDeck(card) {
        const currentCount = this.getCardCountInDeck(card.id);
        
        if (currentCount >= this.maxCopiesPerCard) {
            this.showToast(`${card.name} 已达到最大数量 ${this.maxCopiesPerCard}`);
            return;
        }
        
        if (this.currentDeck.length >= this.maxDeckSize) {
            this.showToast('卡组已满！');
            return;
        }
        
        this.currentDeck.push({...card});
        this.updateDeckDisplay();
        this.showToast(`已添加 ${card.name} 到卡组`);
        
        // 如果模态框开着，更新它
        if (document.getElementById('cardModal').style.display === 'block') {
            this.showCardModal(card);
        }
    }

    // 从卡组移除卡牌
    removeCardFromDeck(index) {
        const removedCard = this.currentDeck[index];
        this.currentDeck.splice(index, 1);
        this.updateDeckDisplay();
        this.showToast(`已移除 ${removedCard.name}`);
    }

    // 获取卡牌在卡组中的数量
    getCardCountInDeck(cardId) {
        return this.currentDeck.filter(card => card.id === cardId).length;
    }

    // 更新卡组显示
    updateDeckDisplay() {
        const deckContent = document.getElementById('deckContent');
        const placeholder = document.querySelector('.deck-placeholder');
        const totalCards = document.getElementById('totalCards');
        const avgCost = document.getElementById('avgCost');
        const cardCount = document.getElementById('cardCount');
        
        // 更新统计
        totalCards.textContent = this.currentDeck.length;
        cardCount.textContent = `${this.currentDeck.length}/${this.maxDeckSize}`;
        
        if (this.currentDeck.length > 0) {
            const totalCost = this.currentDeck.reduce((sum, card) => sum + card.cost, 0);
            avgCost.textContent = (totalCost / this.currentDeck.length).toFixed(1);
            
            // 显示卡组内容，隐藏占位符
            deckContent.classList.add('has-cards');
            placeholder.style.display = 'none';
            
            // 渲染卡组中的卡牌
            deckContent.innerHTML = '';
            this.currentDeck.forEach((card, index) => {
                const deckCardElement = this.createDeckCard(card, index);
                deckContent.appendChild(deckCardElement);
            });
            
            this.updateDeckStats();
        } else {
            // 显示占位符，隐藏卡组内容
            deckContent.classList.remove('has-cards');
            placeholder.style.display = 'flex';
            avgCost.textContent = '0.0';
            
            // 清空统计
            document.getElementById('costCurve').innerHTML = '';
            document.getElementById('cardTypeStats').innerHTML = '';
        }
    }

    // 创建卡组中的卡牌元素
    createDeckCard(card, index) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'deck-card';
        
        const count = this.getCardCountInDeck(card.id);
        
        cardDiv.innerHTML = `
            <div class="card-info">
                <span class="card-name">${card.name}</span>
                <span class="card-cost">${card.cost}</span>
            </div>
            <span class="card-count">${count}</span>
            <button class="remove-btn" onclick="deckBuilder.removeCardFromDeck(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        return cardDiv;
    }

    // 更新卡组统计
    updateDeckStats() {
        // 费用曲线
        const costCurve = {};
        for (let i = 1; i <= 7; i++) {
            costCurve[i] = 0;
        }
        costCurve[8] = 0; // 8费以上
        
        this.currentDeck.forEach(card => {
            const cost = Math.min(card.cost, 8);
            costCurve[cost]++;
        });
        
        const costCurveHtml = Object.entries(costCurve).map(([cost, count]) => {
            const percentage = this.currentDeck.length > 0 ? (count / this.currentDeck.length * 100) : 0;
            return `
                <div class="cost-bar">
                    <div class="cost-bar-fill" style="width: ${percentage}%"></div>
                    <div class="cost-bar-label">${cost}费</div>
                </div>
            `;
        }).join('');
        
        document.getElementById('costCurve').innerHTML = costCurveHtml;
        
        // 卡牌类型统计
        const typeStats = {
            plant: 0,
            zombie: 0
        };
        
        this.currentDeck.forEach(card => {
            typeStats[card.team]++;
        });
        
        const typeStatsHtml = `
            <div class="type-stat">
                <div class="label">植物</div>
                <div class="value">${typeStats.plant}</div>
            </div>
            <div class="type-stat">
                <div class="label">僵尸</div>
                <div class="value">${typeStats.zombie}</div>
            </div>
        `;
        
        document.getElementById('cardTypeStats').innerHTML = typeStatsHtml;
    }

    // 清空卡组
    clearDeck() {
        if (this.currentDeck.length === 0) {
            this.showToast('卡组已经是空的');
            return;
        }
        
        if (confirm('确定要清空整个卡组吗？')) {
            this.currentDeck = [];
            this.updateDeckDisplay();
            this.showToast('卡组已清空');
        }
    }

    // 保存卡组
    saveDeck() {
        if (this.currentDeck.length !== this.maxDeckSize) {
            this.showToast(`卡组需要正好 ${this.maxDeckSize} 张卡牌，当前 ${this.currentDeck.length} 张`);
            return;
        }
        
        localStorage.setItem('customDeck', JSON.stringify(this.currentDeck));
        this.showToast('卡组保存成功！');
    }

    // 加载卡组
    loadDeck() {
        const saved = localStorage.getItem('customDeck');
        if (saved) {
            this.currentDeck = JSON.parse(saved);
            this.updateDeckDisplay();
            this.showToast('卡组加载成功！');
        }
    }

    // 显示提示信息
    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// 初始化卡组构建器
let deckBuilder;

document.addEventListener('DOMContentLoaded', () => {
    deckBuilder = new HearthstoneDeckBuilder();
    
    // 尝试加载保存的卡组
    deckBuilder.loadDeck();
});

// 全局函数
window.removeCardFromDeck = (index) => {
    deckBuilder.removeCardFromDeck(index);
};
