// 植物大战僵尸：英雄 - 核心游戏逻辑
// 严格遵循原版游戏规则的非对称TCG

// 游戏阶段枚举
const Phase = {
    ZOMBIE_PLAY: 'ZOMBIE_PLAY',
    PLANT_PLAY: 'PLANT_PLAY', 
    ZOMBIE_TRICKS: 'ZOMBIE_TRICKS',
    FIGHT_PHASE: 'FIGHT_PHASE'
};

// 队伍枚举
const Team = {
    PLANT: 'PLANT',
    ZOMBIE: 'ZOMBIE'
};

// 卡牌类型枚举
const CardType = {
    MINION: 'MINION',
    TRICK: 'TRICK',
    ENVIRONMENT: 'ENVIRONMENT',
    SUPERPOWER: 'SUPERPOWER'
};

// 战道类型枚举
const LaneType = {
    HEIGHTS: 'HEIGHTS',  // 高地战道
    LAND: 'LAND',        // 陆地战道
    WATER: 'WATER'        // 水路战道
};

// 特殊能力枚举
const Ability = {
    TEAM_UP: 'TEAM_UP',           // 团队协作
    COUNTER_ATTACK: 'COUNTER_ATTACK', // 反击
    MULTI_LANE: 'MULTI_LANE',       // 多线攻击
    ANTI_HERO: 'ANTI_HERO',         // 反英雄
    GRAVESTONE: 'GRAVESTONE',         // 墓碑
    BONUS_ATTACK: 'BONUS_ATTACK',     // 额外攻击
    AMPHIBIOUS: 'AMPHIBIOUS'         // 两栖
};

// 卡牌类
class Card {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.cost = data.cost;
        this.attack = data.attack;
        this.health = data.health;
        this.team = data.team;
        this.cardType = data.cardType;
        this.abilities = data.abilities || [];
        this.description = data.description;
        this.laneRestrictions = data.laneRestrictions || [];
        this.isAmphibious = data.isAmphibious || false;
    }

    // 检查是否可以在指定战道打出
    canPlay(hero, lane) {
        // 检查资源
        if (hero.resources < this.cost) return false;
        
        // 检查战道限制
        if (this.laneRestrictions.length > 0 && !this.laneRestrictions.includes(lane.type)) {
            return false;
        }
        
        // 检查两栖限制
        if (lane.type === LaneType.WATER && !this.isAmphibious) {
            return false;
        }
        
        return true;
    }

    // 打出卡牌
    play(hero, lane, position) {
        if (!this.canPlay(hero, lane)) {
            throw new Error('Cannot play this card');
        }
        
        hero.resources -= this.cost;
        this.onPlay(hero);
        
        // 创建实体并放置到战道
        const entity = new Entity(this, position);
        lane.placeEntity(entity);
        
        return entity;
    }

    // 卡牌打出时的效果
    onPlay(hero) {
        // 处理团队协作等能力
        if (this.abilities.includes(Ability.TEAM_UP)) {
            hero.triggerTeamUp(this);
        }
    }

    // 攻击时的效果
    onAttack(attacker, defender) {
        // 处理反英雄等能力
        if (this.abilities.includes(Ability.ANTI_HERO) && defender.isHero) {
            return this.attack + 2; // 反英雄额外伤害
        }
        return this.attack;
    }
}

// 实体类（战场上的单位）
class Entity {
    constructor(card, position) {
        this.card = card;
        this.currentHealth = card.health;
        this.attack = card.attack;
        this.position = position;
        this.isRevealed = card.team !== Team.ZOMBIE; // 僵尸默认隐藏
        this.hasAttacked = false;
        this.isGravestone = card.abilities.includes(Ability.GRAVESTONE);
    }

    // 受到伤害
    takeDamage(amount) {
        this.currentHealth -= amount;
        return this.currentHealth <= 0;
    }

    // 是否可以攻击
    canAttack() {
        return this.currentHealth > 0 && !this.hasAttacked && this.isRevealed;
    }

    // 攻击目标
    attack(target) {
        if (!this.canAttack()) return false;
        
        const damage = this.card.onAttack(this, target);
        const isDead = target.takeDamage(damage);
        
        this.hasAttacked = true;
        
        // 处理反击
        if (target.card.abilities.includes(Ability.COUNTER_ATTACK) && !isDead) {
            const counterDamage = Math.floor(target.attack / 2);
            this.takeDamage(counterDamage);
        }
        
        return isDead;
    }

    // 揭示墓碑
    reveal() {
        if (this.isGravestone) {
            this.isRevealed = true;
            this.isGravestone = false;
            this.card.onReveal();
        }
    }

    // 重置回合状态
    resetTurnState() {
        this.hasAttacked = false;
    }
}

// 英雄类
class Hero {
    constructor(data) {
        this.name = data.name;
        this.team = data.team;
        this.health = data.health;
        this.maxHealth = data.maxHealth;
        this.resources = data.resources;
        this.blockMeter = 0;
        this.deck = [];
        this.hand = [];
        this.superPower = data.superPower;
        this.teamUpActive = false;
    }

    // 受到伤害
    takeDamage(amount) {
        if (this.blockMeter > 0) {
            const blockUsed = Math.min(this.blockMeter, amount);
            this.blockMeter -= blockUsed;
            amount -= blockUsed;
        }
        
        this.health -= amount;
        if (this.health < 0) this.health = 0;
        
        // 增加格挡表
        this.gainBlock(Math.floor(Math.random() * 3) + 1);
        
        return this.health <= 0;
    }

    // 增加格挡
    gainBlock(amount) {
        this.blockMeter += amount;
        if (this.blockMeter >= 8) {
            this.triggerSuperBlock();
        }
    }

    // 触发超级格挡
    triggerSuperBlock() {
        this.blockMeter = 0;
        this.resources = Math.max(this.resources, 4); // 获得0费超级技能
        this.immuneNextDamage = true;
    }

    // 使用超级技能
    useSuperPower(target) {
        if (this.superPower.cost > this.resources) {
            throw new Error('Not enough resources for super power');
        }
        
        this.resources -= this.superPower.cost;
        this.superPower.effect(target);
    }

    // 触发团队协作
    triggerTeamUp(card) {
        this.teamUpActive = true;
        // 团队协作效果逻辑
    }

    // 抽牌
    drawCard() {
        if (this.deck.length === 0) return null;
        const card = this.deck.pop();
        this.hand.push(card);
        return card;
    }

    // 开始回合
    startTurn() {
        this.resources = Math.min(this.resources + 1, 10);
        this.drawCard();
        this.teamUpActive = false;
        this.immuneNextDamage = false;
    }
}

// 战道类
class Lane {
    constructor(id, type) {
        this.id = id; // 1-5
        this.type = type; // HEIGHTS, LAND, WATER
        this.plant = null;
        this.zombie = null;
        this.gravestone = null;
        this.hasHeightBonus = type === LaneType.HEIGHTS;
    }

    // 检查是否可以放置实体
    canPlaceEntity(entity) {
        // 检查战道限制
        if (entity.card.laneRestrictions.length > 0 && 
            !entity.card.laneRestrictions.includes(this.type)) {
            return false;
        }
        
        // 检查两栖限制
        if (this.type === LaneType.WATER && !entity.card.isAmphibious) {
            return false;
        }
        
        // 检查位置是否已有单位
        if (entity.card.team === Team.PLANT && this.plant) return false;
        if (entity.card.team === Team.ZOMBIE && this.zombie) return false;
        
        return true;
    }

    // 放置实体
    placeEntity(entity) {
        if (!this.canPlaceEntity(entity)) {
            throw new Error('Cannot place entity in this lane');
        }
        
        if (entity.card.team === Team.PLANT) {
            this.plant = entity;
        } else if (entity.card.team === Team.ZOMBIE) {
            if (entity.isGravestone) {
                this.gravestone = entity;
            } else {
                this.zombie = entity;
            }
        }
    }

    // 获取战道中的所有实体
    getEntities() {
        return {
            plant: this.plant,
            zombie: this.zombie,
            gravestone: this.gravestone
        };
    }

    // 结算战斗
    resolveCombat() {
        const entities = this.getEntities();
        
        // 揭示墓碑
        if (entities.gravestone && !entities.gravestone.isRevealed) {
            entities.gravestone.reveal();
            this.zombie = entities.gravestone;
            this.gravestone = null;
        }
        
        // 结算战斗
        if (entities.plant && entities.zombie) {
            // 双方都有单位，互相攻击
            const plantKilled = entities.zombie.attack(entities.plant);
            const zombieKilled = entities.plant.attack(entities.zombie);
            
            if (plantKilled) this.plant = null;
            if (zombieKilled) this.zombie = null;
        } else if (entities.plant) {
            // 只有植物，攻击僵尸英雄
            // 在游戏主循环中处理
            return { attacker: entities.plant, target: 'zombie_hero' };
        } else if (entities.zombie) {
            // 只有僵尸，攻击植物英雄
            return { attacker: entities.zombie, target: 'plant_hero' };
        }
        
        return null;
    }
}

// 回合管理器
class TurnManager {
    constructor() {
        this.currentPhase = Phase.ZOMBIE_PLAY;
        this.turnCount = 1;
        this.currentPlayer = Team.ZOMBIE;
    }

    // 执行当前阶段
    executePhase(game) {
        switch (this.currentPhase) {
            case Phase.ZOMBIE_PLAY:
                this.executeZombiePlayPhase(game);
                break;
            case Phase.PLANT_PLAY:
                this.executePlantPlayPhase(game);
                break;
            case Phase.ZOMBIE_TRICKS:
                this.executeZombieTricksPhase(game);
                break;
            case Phase.FIGHT_PHASE:
                this.executeFightPhase(game);
                break;
        }
        
        this.nextPhase();
    }

    // 执行僵尸出牌阶段
    executeZombiePlayPhase(game) {
        console.log('僵尸出牌阶段');
        // AI或玩家选择出牌
    }

    // 执行植物出牌阶段
    executePlantPlayPhase(game) {
        console.log('植物出牌阶段');
        // AI或玩家选择出牌
    }

    // 执行僵尸锦囊阶段
    executeZombieTricksPhase(game) {
        console.log('僵尸锦囊阶段');
        // 揭示所有墓碑
        game.lanes.forEach(lane => {
            const entities = lane.getEntities();
            if (entities.gravestone) {
                entities.gravestone.reveal();
            }
        });
    }

    // 执行战斗阶段
    executeFightPhase(game) {
        console.log('战斗阶段');
        // 从左到右依次结算
        for (let lane of game.lanes) {
            const result = lane.resolveCombat();
            if (result) {
                // 处理对英雄的攻击
                if (result.target === 'plant_hero') {
                    game.plantHero.takeDamage(result.attacker.attack);
                } else if (result.target === 'zombie_hero') {
                    game.zombieHero.takeDamage(result.attacker.attack);
                }
            }
        }
    }

    // 切换到下一个阶段
    nextPhase() {
        const phases = Object.values(Phase);
        const currentIndex = phases.indexOf(this.currentPhase);
        const nextIndex = (currentIndex + 1) % phases.length;
        
        this.currentPhase = phases[nextIndex];
        
        // 如果完成一个完整回合，增加回合数
        if (this.currentPhase === Phase.ZOMBIE_PLAY) {
            this.turnCount++;
        }
    }

    // 重置回合
    resetTurn() {
        this.currentPhase = Phase.ZOMBIE_PLAY;
        this.turnCount = 1;
        this.currentPlayer = Team.ZOMBIE;
    }
}

// 游戏主类
class Game {
    constructor() {
        this.plantHero = null;
        this.zombieHero = null;
        this.lanes = [];
        this.turnManager = new TurnManager();
        this.gameOver = false;
        this.winner = null;
    }

    // 初始化游戏
    initializeGame() {
        // 创建英雄
        this.plantHero = new Hero({
            name: 'Green Shadow',
            team: Team.PLANT,
            health: 20,
            maxHealth: 20,
            resources: 1,
            superPower: {
                name: '精准射击',
                cost: 0,
                description: '在中间战道造成5点伤害',
                effect: (target) => {
                    // 对中间战道造成5点伤害的逻辑
                    console.log('Green Shadow 使用精准射击');
                }
            }
        });

        this.zombieHero = new Hero({
            name: 'Super Brainz',
            team: Team.ZOMBIE,
            health: 20,
            maxHealth: 20,
            resources: 1,
            superPower: {
                name: '超级突击',
                cost: 0,
                description: '移动一个僵尸并使其进行一次额外攻击',
                effect: (target) => {
                    // 移动僵尸并额外攻击的逻辑
                    console.log('Super Brainz 使用超级突击');
                }
            }
        });

        // 创建战道
        this.lanes = [
            new Lane(1, LaneType.HEIGHTS),
            new Lane(2, LaneType.LAND),
            new Lane(3, LaneType.LAND),
            new Lane(4, LaneType.LAND),
            new Lane(5, LaneType.WATER)
        ];

        // 初始化卡组
        this.initializeDecks();
        
        // 双方英雄抽初始手牌
        for (let i = 0; i < 4; i++) {
            this.plantHero.drawCard();
            this.zombieHero.drawCard();
        }
    }

    // 初始化卡组
    initializeDecks() {
        // 这里将实现具体的卡牌数据
        // 暂时使用空数组
        this.plantHero.deck = [];
        this.zombieHero.deck = [];
    }

    // 开始游戏循环
    startGameLoop() {
        while (!this.gameOver) {
            this.turnManager.executePhase(this);
            
            // 检查游戏结束条件
            if (this.plantHero.health <= 0 || this.zombieHero.health <= 0) {
                this.gameOver = true;
                this.winner = this.plantHero.health > 0 ? this.plantHero : this.zombieHero;
            }
        }
    }
}

// 导出核心类
window.GameCore = {
    Game,
    Hero,
    Card,
    Entity,
    Lane,
    TurnManager,
    Phase,
    Team,
    CardType,
    LaneType,
    Ability
};
