// 植物大战僵尸：英雄 - 游戏主逻辑
// 严格遵循原版TCG规则

class PvZHeroesGame {
    constructor() {
        this.game = null;
        this.currentPhase = Phase.ZOMBIE_PLAY;
        this.selectedCard = null;
        this.selectedLane = null;
        this.gameStartTime = null;
        this.isPlayerTurn = true;
        this.currentTeam = Team.ZOMBIE;
        
        this.initializeGame();
        this.setupEventListeners();
        this.startGameLoop();
    }

    // 初始化游戏
    initializeGame() {
        this.game = new Game();
        this.game.initializeGame();
        this.gameStartTime = Date.now();
        
        // 初始化UI
        this.updateUI();
        this.renderHand();
        this.renderBattlefield();
        this.addLogEntry('游戏开始！');
    }

    // 设置事件监听器
    setupEventListeners() {
        // 结束阶段按钮
        document.getElementById('endPhaseBtn').addEventListener('click', () => {
            this.endPhase();
        });

        // 超级技能按钮
        document.getElementById('superPowerBtn').addEventListener('click', () => {
            this.useSuperPower();
        });

        // 手牌点击事件
        document.getElementById('handCards').addEventListener('click', (e) => {
            this.handleCardClick(e);
        });

        // 战道点击事件
        document.querySelectorAll('.lane').forEach(lane => {
            lane.addEventListener('click', (e) => {
                this.handleLaneClick(e);
            });
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
    }

    // 开始游戏循环
    startGameLoop() {
        this.executeCurrentPhase();
    }

    // 执行当前阶段
    executeCurrentPhase() {
        switch (this.currentPhase) {
            case Phase.ZOMBIE_PLAY:
                this.executeZombiePlayPhase();
                break;
            case Phase.PLANT_PLAY:
                this.executePlantPlayPhase();
                break;
            case Phase.ZOMBIE_TRICKS:
                this.executeZombieTricksPhase();
                break;
            case Phase.FIGHT_PHASE:
                this.executeFightPhase();
                break;
        }
    }

    // 执行僵尸出牌阶段
    executeZombiePlayPhase() {
        this.addLogEntry('僵尸出牌阶段');
        this.updatePhaseIndicator('僵尸出牌阶段');
        
        // 如果是AI控制，自动出牌
        if (!this.isPlayerTurn || this.currentTeam === Team.ZOMBIE) {
            setTimeout(() => this.aiPlayCard(Team.ZOMBIE), 1000);
        }
    }

    // 执行植物出牌阶段
    executePlantPlayPhase() {
        this.addLogEntry('植物出牌阶段');
        this.updatePhaseIndicator('植物出牌阶段');
        
        // 如果是AI控制，自动出牌
        if (!this.isPlayerTurn || this.currentTeam === Team.PLANT) {
            setTimeout(() => this.aiPlayCard(Team.PLANT), 1000);
        }
    }

    // 执行僵尸锦囊阶段
    executeZombieTricksPhase() {
        this.addLogEntry('僵尸锦囊阶段');
        this.updatePhaseIndicator('僵尸锦囊阶段');
        
        // 揭示所有墓碑
        this.game.lanes.forEach(lane => {
            const entities = lane.getEntities();
            if (entities.gravestone && !entities.gravestone.isRevealed) {
                entities.gravestone.reveal();
                this.addLogEntry(`墓碑在战道${lane.id}揭晓！`);
            }
        });
        
        this.renderBattlefield();
        
        // AI自动使用锦囊
        if (!this.isPlayerTurn || this.currentTeam === Team.ZOMBIE) {
            setTimeout(() => this.aiPlayTrick(), 1000);
        }
    }

    // 执行战斗阶段
    executeFightPhase() {
        this.addLogEntry('战斗阶段');
        this.updatePhaseIndicator('战斗阶段');
        
        // 从左到右依次结算
        for (let lane of this.game.lanes) {
            const result = lane.resolveCombat();
            if (result) {
                this.handleCombatResult(result);
            }
        }
        
        this.renderBattlefield();
        this.updateUI();
        
        // 检查游戏结束
        if (this.checkGameOver()) {
            this.endGame();
            return;
        }
        
        // 进入下一个阶段
        setTimeout(() => {
            this.nextPhase();
        }, 2000);
    }

    // 处理战斗结果
    handleCombatResult(result) {
        if (result.target === 'plant_hero') {
            const damage = result.attacker.attack;
            const isDead = this.game.plantHero.takeDamage(damage);
            this.addLogEntry(`${result.attacker.card.name}攻击绿影，造成${damage}点伤害`);
            
            if (isDead) {
                this.addLogEntry('绿影被击败了！');
            }
        } else if (result.target === 'zombie_hero') {
            const damage = result.attacker.attack;
            const isDead = this.game.zombieHero.takeDamage(damage);
            this.addLogEntry(`${result.attacker.card.name}攻击超级脑袋，造成${damage}点伤害`);
            
            if (isDead) {
                this.addLogEntry('超级脑袋被击败了！');
            }
        }
    }

    // AI出牌逻辑
    aiPlayCard(team) {
        const hero = team === Team.ZOMBIE ? this.game.zombieHero : this.game.plantHero;
        const validCards = hero.hand.filter(card => {
            return this.game.lanes.some(lane => card.canPlay(hero, lane));
        });
        
        if (validCards.length > 0) {
            const card = validCards[Math.floor(Math.random() * validCards.length)];
            const validLanes = this.game.lanes.filter(lane => card.canPlay(hero, lane));
            const lane = validLanes[Math.floor(Math.random() * validLanes.length)];
            
            this.playCard(card, lane);
        } else {
            setTimeout(() => this.endPhase(), 1000);
        }
    }

    // AI使用锦囊逻辑
    aiPlayTrick() {
        const hero = this.game.zombieHero;
        const trickCards = hero.hand.filter(card => card.cardType === CardType.TRICK);
        
        if (trickCards.length > 0) {
            const card = trickCards[Math.floor(Math.random() * trickCards.length)];
            this.playTrick(card);
        } else {
            setTimeout(() => this.endPhase(), 1000);
        }
    }

    // 处理卡牌点击
    handleCardClick(e) {
        const cardElement = e.target.closest('.card');
        if (!cardElement) return;
        
        const cardIndex = parseInt(cardElement.dataset.cardIndex);
        const hero = this.currentTeam === Team.ZOMBIE ? this.game.zombieHero : this.game.plantHero;
        const card = hero.hand[cardIndex];
        
        if (!card) return;
        
        // 检查是否可以出牌
        if (this.currentPhase === Phase.ZOMBIE_PLAY && this.currentTeam === Team.ZOMBIE) {
            if (card.cardType === CardType.MINION) {
                this.selectedCard = card;
                this.highlightValidLanes(card);
                this.addLogEntry(`选择了${card.name}`);
            }
        } else if (this.currentPhase === Phase.PLANT_PLAY && this.currentTeam === Team.PLANT) {
            if (card.cardType === CardType.MINION || card.cardType === CardType.ENVIRONMENT) {
                this.selectedCard = card;
                this.highlightValidLanes(card);
                this.addLogEntry(`选择了${card.name}`);
            }
        } else if (this.currentPhase === Phase.ZOMBIE_TRICKS && this.currentTeam === Team.ZOMBIE) {
            if (card.cardType === CardType.TRICK) {
                this.playTrick(card);
            }
        }
    }

    // 处理战道点击
    handleLaneClick(e) {
        const laneElement = e.target.closest('.lane');
        if (!laneElement) return;
        
        const laneIndex = parseInt(laneElement.dataset.lane) - 1;
        const lane = this.game.lanes[laneIndex];
        
        if (this.selectedCard && this.isLaneHighlighted(lane)) {
            this.playCard(this.selectedCard, lane);
        }
    }

    // 高亮有效战道
    highlightValidLanes(card) {
        // 清除之前的高亮
        document.querySelectorAll('.lane').forEach(lane => {
            lane.classList.remove('highlight', 'invalidTarget');
        });
        
        const hero = this.currentTeam === Team.ZOMBIE ? this.game.zombieHero : this.game.plantHero;
        
        this.game.lanes.forEach(lane => {
            const laneElement = document.querySelector(`[data-lane="${lane.id}"]`);
            if (card.canPlay(hero, lane)) {
                laneElement.classList.add('highlight');
            } else {
                laneElement.classList.add('invalidTarget');
            }
        });
    }

    // 检查战道是否高亮
    isLaneHighlighted(lane) {
        const laneElement = document.querySelector(`[data-lane="${lane.id}"]`);
        return laneElement.classList.contains('highlight');
    }

    // 出牌
    playCard(card, lane) {
        const hero = this.currentTeam === Team.ZOMBIE ? this.game.zombieHero : this.game.plantHero;
        const cardIndex = hero.hand.indexOf(card);
        
        try {
            const entity = card.play(hero, lane, 0);
            this.addLogEntry(`${hero.name}在战道${lane.id}打出了${card.name}`);
            
            // 清除选择状态
            this.selectedCard = null;
            document.querySelectorAll('.lane').forEach(l => {
                l.classList.remove('highlight', 'invalidTarget');
            });
            
            this.renderHand();
            this.renderBattlefield();
            this.updateUI();
            
            // 如果是法术卡，立即结算效果
            if (card.cardType === CardType.TRICK) {
                this.resolveTrickEffect(card);
            }
            
        } catch (error) {
            this.addLogEntry('无法打出这张卡牌');
        }
    }

    // 使用锦囊
    playTrick(card) {
        const hero = this.game.zombieHero;
        const cardIndex = hero.hand.indexOf(card);
        
        if (hero.resources >= card.cost) {
            hero.resources -= card.cost;
            hero.hand.splice(cardIndex, 1);
            
            this.addLogEntry(`超级脑袋使用了锦囊：${card.name}`);
            this.resolveTrickEffect(card);
            
            this.renderHand();
            this.updateUI();
        }
    }

    // 结算法术效果
    resolveTrickEffect(card) {
        // 根据卡牌ID处理不同效果
        switch (card.id) {
            case 'smash':
                // 摧毁一个僵尸
                this.addLogEntry('粉碎效果：摧毁一个僵尸');
                break;
            case 'sunburn':
                // 对所有僵尸造成2点伤害
                this.game.lanes.forEach(lane => {
                    const entities = lane.getEntities();
                    if (entities.zombie) {
                        const isDead = entities.zombie.takeDamage(2);
                        if (isDead) {
                            lane.zombie = null;
                            this.addLogEntry(`${entities.zombie.card.name}被灼烧击败`);
                        }
                    }
                });
                this.renderBattlefield();
                break;
            case 'photosynthesis':
                // 获得2点阳光
                this.game.plantHero.resources += 2;
                this.addLogEntry('光合作用：获得2点阳光');
                this.updateUI();
                break;
            case 'trickshot':
                // 对一个植物造成3点伤害
                this.addLogEntry('诡计射击：对一个植物造成3点伤害');
                break;
            case 'totaldestruction':
                // 摧毁所有植物
                this.game.lanes.forEach(lane => {
                    if (lane.plant) {
                        this.addLogEntry(`${lane.plant.card.name}被完全破坏`);
                        lane.plant = null;
                    }
                });
                this.renderBattlefield();
                break;
            case 'raaaaaah':
                // 获得2点脑子
                this.game.zombieHero.resources += 2;
                this.addLogEntry('啊啊啊啊：获得2点脑子');
                this.updateUI();
                break;
        }
    }

    // 使用超级技能
    useSuperPower() {
        const hero = this.currentTeam === Team.ZOMBIE ? this.game.zombieHero : this.game.plantHero;
        
        if (hero.blockMeter >= 8) {
            hero.useSuperPower();
            this.addLogEntry(`${hero.name}使用了超级技能：${hero.superPower.name}`);
            this.updateUI();
        } else {
            this.addLogEntry('格挡值不足，无法使用超级技能');
        }
    }

    // 结束阶段
    endPhase() {
        this.addLogEntry(`结束${this.getPhaseName(this.currentPhase)}`);
        this.nextPhase();
    }

    // 进入下一个阶段
    nextPhase() {
        const phases = Object.values(Phase);
        const currentIndex = phases.indexOf(this.currentPhase);
        const nextIndex = (currentIndex + 1) % phases.length;
        
        this.currentPhase = phases[nextIndex];
        
        // 如果完成一个完整回合，增加回合数
        if (this.currentPhase === Phase.ZOMBIE_PLAY) {
            this.game.turnManager.turnCount++;
            
            // 开始新回合
            this.game.plantHero.startTurn();
            this.game.zombieHero.startTurn();
            this.renderHand();
            this.updateUI();
        }
        
        // 执行下一个阶段
        setTimeout(() => {
            this.executeCurrentPhase();
        }, 1000);
    }

    // 获取阶段名称
    getPhaseName(phase) {
        const phaseNames = {
            [Phase.ZOMBIE_PLAY]: '僵尸出牌阶段',
            [Phase.PLANT_PLAY]: '植物出牌阶段',
            [Phase.ZOMBIE_TRICKS]: '僵尸锦囊阶段',
            [Phase.FIGHT_PHASE]: '战斗阶段'
        };
        return phaseNames[phase] || '未知阶段';
    }

    // 更新阶段指示器
    updatePhaseIndicator(phaseName) {
        document.getElementById('currentPhaseText').textContent = phaseName;
        document.getElementById('turnCount').textContent = this.game.turnManager.turnCount;
    }

    // 更新UI
    updateUI() {
        // 更新植物英雄信息
        document.getElementById('plantHeroHealth').textContent = this.game.plantHero.health;
        document.getElementById('plantHeroResources').textContent = this.game.plantHero.resources;
        document.getElementById('plantBlockText').textContent = this.game.plantHero.blockMeter;
        document.getElementById('plantBlockMeter').style.width = `${(this.game.plantHero.blockMeter / 8) * 100}%`;
        
        // 更新僵尸英雄信息
        document.getElementById('zombieHeroHealth').textContent = this.game.zombieHero.health;
        document.getElementById('zombieHeroResources').textContent = this.game.zombieHero.resources;
        document.getElementById('zombieBlockText').textContent = this.game.zombieHero.blockMeter;
        document.getElementById('zombieBlockMeter').style.width = `${(this.game.zombieHero.blockMeter / 8) * 100}%`;
        
        // 更新回合数
        document.getElementById('turnCount').textContent = this.game.turnManager.turnCount;
    }

    // 渲染手牌
    renderHand() {
        const handContainer = document.getElementById('handCards');
        handContainer.innerHTML = '';
        
        const hero = this.currentTeam === Team.ZOMBIE ? this.game.zombieHero : this.game.plantHero;
        
        hero.hand.forEach((card, index) => {
            const cardElement = this.createCardElement(card);
            cardElement.dataset.cardIndex = index;
            handContainer.appendChild(cardElement);
        });
    }

    // 渲染战场
    renderBattlefield() {
        this.game.lanes.forEach(lane => {
            const laneElement = document.querySelector(`[data-lane="${lane.id}"]`);
            const zombieSlot = laneElement.querySelector('.zombieSlot');
            const plantSlot = laneElement.querySelector('.plantSlot');
            
            // 清空槽位
            zombieSlot.innerHTML = '';
            plantSlot.innerHTML = '';
            
            // 渲染僵尸
            const entities = lane.getEntities();
            if (entities.zombie) {
                zombieSlot.appendChild(this.createBattlefieldCard(entities.zombie));
            }
            
            // 渲染墓碑
            if (entities.gravestone) {
                zombieSlot.appendChild(this.createBattlefieldCard(entities.gravestone));
            }
            
            // 渲染植物
            if (entities.plant) {
                plantSlot.appendChild(this.createBattlefieldCard(entities.plant));
            }
        });
    }

    // 创建卡牌元素
    createCardElement(card) {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.team.toLowerCase()} ${card.cardType.toLowerCase()}`;
        
        cardElement.innerHTML = `
            <div class="cardName">${card.name}</div>
            <div class="cardCost">${card.cost}</div>
            <div class="cardStats">
                <span>${card.attack}</span>
                <span>${card.health}</span>
            </div>
            <div class="cardDescription">${card.description}</div>
        `;
        
        return cardElement;
    }

    // 创建战场卡牌元素
    createBattlefieldCard(entity) {
        const cardElement = document.createElement('div');
        const isGravestone = entity.isGravestone && !entity.isRevealed;
        
        cardElement.className = `card battlefieldCard ${entity.card.team.toLowerCase()} ${isGravestone ? 'gravestone' : ''}`;
        
        if (isGravestone) {
            cardElement.innerHTML = `<div class="cardName">墓碑</div>`;
        } else {
            cardElement.innerHTML = `
                <div class="cardName">${entity.card.name}</div>
                <div class="cardStats">
                    <span>${entity.attack}</span>
                    <span>${entity.currentHealth}/${entity.card.health}</span>
                </div>
            `;
        }
        
        return cardElement;
    }

    // 添加日志条目
    addLogEntry(message) {
        const logContent = document.getElementById('logContent');
        const logEntry = document.createElement('div');
        logEntry.className = 'logEntry';
        logEntry.textContent = `[${this.getPhaseName(this.currentPhase)}] ${message}`;
        
        logContent.appendChild(logEntry);
        logContent.scrollTop = logContent.scrollHeight;
        
        // 限制日志条目数量
        while (logContent.children.length > 50) {
            logContent.removeChild(logContent.firstChild);
        }
    }

    // 检查游戏结束
    checkGameOver() {
        return this.game.plantHero.health <= 0 || this.game.zombieHero.health <= 0;
    }

    // 结束游戏
    endGame() {
        const winner = this.game.plantHero.health > 0 ? this.game.plantHero : this.game.zombieHero;
        const duration = Date.now() - this.gameStartTime;
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);
        
        document.getElementById('winnerText').textContent = `${winner.name}获胜！`;
        document.getElementById('totalTurns').textContent = this.game.turnManager.turnCount;
        document.getElementById('gameDuration').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('gameOverModal').style.display = 'block';
    }

    // 重新开始游戏
    restartGame() {
        document.getElementById('gameOverModal').style.display = 'none';
        this.initializeGame();
    }

    // 返回菜单
    backToMenu() {
        document.getElementById('gameOverModal').style.display = 'none';
        // 这里可以返回主菜单
        window.location.href = 'index.html';
    }

    // 处理键盘快捷键
    handleKeyPress(e) {
        switch (e.key) {
            case 'Enter':
                this.endPhase();
                break;
            case ' ':
                this.useSuperPower();
                break;
            case 'Escape':
                this.selectedCard = null;
                document.querySelectorAll('.lane').forEach(l => {
                    l.classList.remove('highlight', 'invalidTarget');
                });
                break;
        }
    }
}

// 游戏初始化
document.addEventListener('DOMContentLoaded', () => {
    window.game = new PvZHeroesGame();
});

// 全局函数
window.restartGame = () => window.game.restartGame();
window.backToMenu = () => window.game.backToMenu();
