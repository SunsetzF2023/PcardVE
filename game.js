// 游戏核心逻辑
class GameState {
    constructor() {
        this.currentPlayer = null;
        this.opponent = null;
        this.currentTurn = 'plant';
        this.turnCount = 1;
        this.gameActive = false;
        this.selectedCard = null;
        this.selectedTarget = null;
    }
    
    initGame() {
        this.currentPlayer = new Player('植物玩家', 'plant');
        this.opponent = new Player('僵尸玩家', 'zombie');
        this.currentPlayer.initDeck();
        this.opponent.initDeck();
        this.currentPlayer.drawInitialHand();
        this.opponent.drawInitialHand();
        this.gameActive = true;
        this.currentTurn = 'plant';
        this.turnCount = 1;
    }
    
    startTurn() {
        const player = this.getCurrentPlayer();
        player.startTurn();
        this.updateUI();
        this.addBattleLog(`${player.team === 'plant' ? '植物队' : '僵尸队'} 回合 ${this.turnCount}`);
    }
    
    endTurn() {
        this.executeBattlePhase();
        this.switchTurn();
        this.turnCount++;
        this.startTurn();
    }
    
    getCurrentPlayer() {
        return this.currentTurn === 'plant' ? this.currentPlayer : this.opponent;
    }
    
    getOpponent() {
        return this.currentTurn === 'plant' ? this.opponent : this.currentPlayer;
    }
    
    switchTurn() {
        this.currentTurn = this.currentTurn === 'plant' ? 'zombie' : 'plant';
    }
    
    executeBattlePhase() {
        const attacker = this.getCurrentPlayer();
        const defender = this.getOpponent();
        
        // 执行攻击逻辑
        const attackerCards = attacker.getAliveCards();
        attackerCards.forEach(card => {
            if (card.canAttack()) {
                const target = this.findTarget(card, defender);
                if (target) {
                    this.performAttack(card, target, defender);
                } else {
                    // 直接攻击玩家
                    defender.takeDamage(card.attack);
                    this.addBattleLog(`${card.name} 直接攻击 ${defender.name}，造成 ${card.attack} 点伤害`);
                }
            }
        });
        
        // 移除死亡卡牌
        attacker.removeDeadCards();
        defender.removeDeadCards();
        
        // 检查游戏结束
        if (this.checkGameOver()) {
            this.endGame();
        }
    }
    
    findTarget(attacker, defender) {
        // 优先攻击同一位置的敌人
        const samePosition = defender.field[attacker.position];
        if (samePosition && samePosition.isAlive()) {
            return samePosition;
        }
        
        // 随机选择存活的敌人
        const aliveEnemies = defender.getAliveCards();
        if (aliveEnemies.length > 0) {
            return aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
        }
        
        return null;
    }
    
    performAttack(attacker, defender, defenderPlayer) {
        let damage = attacker.attack;
        let ignoreShield = false;
        
        // 处理特殊能力
        if (attacker.ability === 'piercing') {
            ignoreShield = true;
            this.addBattleLog(`${attacker.name} 的攻击必中，无视防御`);
        }
        
        if (attacker.ability === 'lethal' && defender.ability !== 'shield') {
            damage = defender.currentHealth;
            this.addBattleLog(`${attacker.name} 发动致命一击`);
        }
        
        if (attacker.ability === 'instantkill') {
            damage = defender.currentHealth;
            ignoreShield = true;
            this.addBattleLog(`${attacker.name} 发动秒杀效果`);
        }
        
        // 造成伤害
        const isDead = defender.takeDamage(damage, ignoreShield);
        
        if (isDead) {
            this.addBattleLog(`${defender.name} 被击败了`);
            
            // 处理弹回效果
            if (attacker.ability === 'bounce') {
                defenderPlayer.bounceCardToHand(defender);
                this.addBattleLog(`${defender.name} 被弹回手牌`);
            }
            
            // 处理疯狂效果
            if (attacker.ability === 'frenzy') {
                this.addBattleLog(`${attacker.name} 发动疯狂效果，可以再次攻击`);
                // 可以再次攻击的逻辑
            }
        } else {
            this.addBattleLog(`${defender.name} 剩余生命: ${defender.currentHealth}`);
        }
        
        // 处理冻结效果
        if (attacker.ability === 'freeze') {
            defender.freeze();
            this.addBattleLog(`${defender.name} 被冻结了`);
        }
        
        attacker.hasAttackedThisTurn = true;
    }
    
    checkGameOver() {
        if (!this.currentPlayer.isAlive() || !this.opponent.isAlive()) {
            return true;
        }
        
        const playerAlive = this.currentPlayer.getAliveCards().length > 0 || this.currentPlayer.hand.length > 0;
        const opponentAlive = this.opponent.getAliveCards().length > 0 || this.opponent.hand.length > 0;
        
        return !playerAlive || !opponentAlive;
    }
    
    endGame() {
        this.gameActive = false;
        const winner = this.currentPlayer.isAlive() ? this.currentPlayer : this.opponent;
        this.addBattleLog(`游戏结束！${winner.name} 获胜！`);
        
        setTimeout(() => {
            alert(`游戏结束！${winner.name} 获胜！`);
            showScreen('mainMenu');
        }, 1000);
    }
    
    addBattleLog(message) {
        const battleLog = document.getElementById('battleLog');
        const logEntry = document.createElement('div');
        logEntry.textContent = message;
        battleLog.appendChild(logEntry);
        battleLog.scrollTop = battleLog.scrollHeight;
    }
    
    updateUI() {
        // 更新玩家信息
        document.getElementById('playerHealth').textContent = this.currentPlayer.health;
        document.getElementById('playerMana').textContent = `${this.currentPlayer.mana}/${this.currentPlayer.maxMana}`;
        document.getElementById('opponentHealth').textContent = this.opponent.health;
        document.getElementById('opponentMana').textContent = `${this.opponent.mana}/${this.opponent.maxMana}`;
        
        // 更新回合信息
        document.getElementById('turnInfo').textContent = `回合 ${this.turnCount} - ${this.currentTurn === 'plant' ? '植物队' : '僵尸队'}`;
        
        // 更新战场
        this.updateBattlefield();
        this.updateHand();
    }
    
    updateBattlefield() {
        const playerField = document.getElementById('playerField');
        const opponentField = document.getElementById('opponentField');
        
        playerField.innerHTML = '';
        opponentField.innerHTML = '';
        
        // 显示玩家战场
        for (let i = 0; i < 5; i++) {
            const slot = document.createElement('div');
            slot.className = 'battlefield-slot';
            slot.dataset.position = i;
            
            const card = this.currentPlayer.field[i];
            if (card && card.isAlive()) {
                slot.appendChild(createCardElement(card));
                
                // 如果有组队联手，显示特殊标记
                if (card.ability === 'teamwork') {
                    const teamworkIcon = document.createElement('div');
                    teamworkIcon.className = 'teamwork-icon';
                    teamworkIcon.innerHTML = '🤝';
                    teamworkIcon.title = '组队联手：可放置第二个植物';
                    slot.appendChild(teamworkIcon);
                }
            }
            
            playerField.appendChild(slot);
        }
        
        // 显示对手战场
        for (let i = 0; i < 5; i++) {
            const slot = document.createElement('div');
            slot.className = 'battlefield-slot';
            slot.dataset.position = i;
            
            const card = this.opponent.field[i];
            if (card && card.isAlive()) {
                slot.appendChild(createCardElement(card));
                
                // 如果有组队联手，显示特殊标记
                if (card.ability === 'teamwork') {
                    const teamworkIcon = document.createElement('div');
                    teamworkIcon.className = 'teamwork-icon';
                    teamworkIcon.innerHTML = '🤝';
                    teamworkIcon.title = '组队联手：可放置第二个植物';
                    slot.appendChild(teamworkIcon);
                }
            }
            
            opponentField.appendChild(slot);
        }
    }
    
    updateHand() {
        const playerHand = document.getElementById('playerHand');
        playerHand.innerHTML = '';
        
        this.currentPlayer.hand.forEach((card, index) => {
            const cardElement = createCardElement(card);
            cardElement.dataset.handIndex = index;
            cardElement.addEventListener('click', () => this.selectCard(card, index));
            playerHand.appendChild(cardElement);
        });
    }
    
    selectCard(card, index) {
        if (this.currentTurn !== 'plant') return; // 只允许玩家操作
        
        this.selectedCard = { card, index };
        
        // 高亮选中的卡牌
        document.querySelectorAll('#playerHand .card').forEach(el => el.classList.remove('selected'));
        document.querySelector(`[data-hand-index="${index}"]`).classList.add('selected');
        
        // 显示可放置的位置
        this.showValidPositions(card);
    }
    
    showValidPositions(card) {
        if (this.currentPlayer.mana < card.cost) return;
        
        const slots = document.querySelectorAll('#playerField .battlefield-slot');
        slots.forEach((slot, index) => {
            const existingCard = this.currentPlayer.field[index];
            
            // 检查是否可以放置
            let canPlace = !existingCard;
            
            // 如果有组队联手卡牌，可以放置第二个
            if (existingCard && existingCard.ability === 'teamwork') {
                canPlace = true;
            }
            
            // 如果新卡牌有组队联手，也可以放置在有卡牌的位置
            if (existingCard && card.ability === 'teamwork') {
                canPlace = true;
            }
            
            if (canPlace) {
                slot.classList.add('valid-position');
                slot.addEventListener('click', () => this.playCard(card, index));
            }
        });
    }
    
    playCard(card, position) {
        if (this.currentPlayer.mana < card.cost) {
            this.addBattleLog('法力值不足！');
            return;
        }
        
        const existingCard = this.currentPlayer.field[position];
        
        // 检查是否可以放置
        let canPlace = !existingCard;
        
        // 如果有组队联手卡牌，可以放置第二个
        if (existingCard && existingCard.ability === 'teamwork') {
            canPlace = true;
        }
        
        // 如果新卡牌有组队联手，也可以放置在有卡牌的位置
        if (existingCard && card.ability === 'teamwork') {
            canPlace = true;
        }
        
        if (!canPlace) {
            this.addBattleLog('该位置已有卡牌！');
            return;
        }
        
        // 打出卡牌
        this.currentPlayer.field[position] = card;
        card.position = position;
        this.currentPlayer.mana -= card.cost;
        this.currentPlayer.hand.splice(this.selectedCard.index, 1);
        
        this.addBattleLog(`打出了 ${card.name}`);
        this.updateUI();
        
        // 处理抽卡效果
        if (card.ability === 'drawcard' || (card.id === 'sunshroom')) {
            this.currentPlayer.drawCard();
            this.addBattleLog(`${card.name} 发动抽卡效果`);
        }
        
        // 清除选择状态
        this.selectedCard = null;
        document.querySelectorAll('.valid-position').forEach(el => el.classList.remove('valid-position'));
    }
}

// 玩家类
class Player {
    constructor(name, team) {
        this.name = name;
        this.team = team;
        this.health = 20;
        this.mana = 1;
        this.maxMana = 1;
        this.hand = [];
        this.deck = [];
        this.field = new Array(5).fill(null);
    }
    
    initDeck() {
        // 使用默认卡组
        const allCards = [...CARDS.plants, ...CARDS.zombies];
        this.deck = allCards.slice(0, 40); // 简化，取前40张卡
        this.shuffleDeck();
    }
    
    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }
    
    drawCard() {
        if (this.deck.length === 0) return null;
        
        const card = this.deck.pop();
        const cardInstance = new Card(card);
        this.hand.push(cardInstance);
        return cardInstance;
    }
    
    drawInitialHand() {
        for (let i = 0; i < 3; i++) {
            this.drawCard();
        }
    }
    
    startTurn() {
        this.maxMana = Math.min(10, this.maxMana + 1);
        this.mana = this.maxMana;
        this.drawCard();
        
        // 重置卡牌状态
        this.field.forEach(card => {
            if (card) {
                card.resetTurnState();
            }
        });
    }
    
    playCard(handIndex, position) {
        if (handIndex < 0 || handIndex >= this.hand.length) return false;
        if (position < 0 || position >= 5) return false;
        if (this.field[position]) return false;
        
        const card = this.hand[handIndex];
        if (card.cost > this.mana) return false;
        
        // 打出卡牌
        this.field[position] = card;
        card.position = position;
        this.mana -= card.cost;
        this.hand.splice(handIndex, 1);
        
        return true;
    }
    
    takeDamage(damage) {
        this.health -= damage;
        if (this.health < 0) this.health = 0;
    }
    
    isAlive() {
        return this.health > 0;
    }
    
    getAliveCards() {
        return this.field.filter(card => card && card.isAlive());
    }
    
    removeDeadCards() {
        this.field = this.field.map(card => (card && card.isAlive()) ? card : null);
    }
    
    bounceCardToHand(card) {
        const index = this.field.indexOf(card);
        if (index !== -1) {
            this.field[index] = null;
            card.resetHealth();
            this.hand.push(card);
        }
    }
}

// 卡牌类
class Card {
    constructor(data) {
        Object.assign(this, data);
        this.currentHealth = this.health;
        this.position = -1;
        this.isFrozen = false;
        this.hasAttackedThisTurn = false;
    }
    
    takeDamage(damage, ignoreShield = false) {
        if (!ignoreShield && this.ability === 'shield') {
            damage = Math.max(1, damage - 2);
        }
        
        this.currentHealth -= damage;
        return this.currentHealth <= 0;
    }
    
    isAlive() {
        return this.currentHealth > 0;
    }
    
    canAttack() {
        return this.isAlive() && !this.isFrozen && !this.hasAttackedThisTurn;
    }
    
    resetTurnState() {
        this.isFrozen = false;
        this.hasAttackedThisTurn = false;
    }
    
    freeze() {
        this.isFrozen = true;
    }
    
    resetHealth() {
        this.currentHealth = this.health;
        this.isFrozen = false;
        this.hasAttackedThisTurn = false;
    }
}

// 创建卡牌元素
function createCardElement(card) {
    const cardDiv = document.createElement('div');
    cardDiv.className = `card ${card.team}`;
    
    cardDiv.innerHTML = `
        <div class="card-name">${card.name}</div>
        <div class="card-cost">${card.cost}</div>
        <div class="card-description">${card.description}</div>
        <div class="card-stats">
            <span>⚔️ ${card.attack}</span>
            <span>❤️ ${card.currentHealth}/${card.health}</span>
        </div>
        <div class="card-ability">${ABILITIES[card.ability].name}</div>
    `;
    
    return cardDiv;
}

// 全局游戏状态
let gameState = null;

// 初始化游戏
function initGame() {
    gameState = new GameState();
    gameState.initGame();
    gameState.startTurn();
}

// 结束回合
function endTurn() {
    if (!gameState || !gameState.gameActive) return;
    gameState.endTurn();
}
