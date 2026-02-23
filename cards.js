// 卡牌数据定义
const CARDS = {
    // 植物卡牌
    plants: [
        {
            id: 'peashooter',
            name: '豌豆射手',
            cost: 1,
            attack: 2,
            health: 3,
            team: 'plant',
            ability: 'none',
            description: '基础攻击植物',
            rarity: 'basic'
        },
        {
            id: 'sunflower',
            name: '向日葵',
            cost: 2,
            attack: 0,
            health: 4,
            team: 'plant',
            ability: 'heal',
            description: '每回合治疗相邻植物1点',
            rarity: 'common'
        },
        {
            id: 'wallnut',
            name: '坚果墙',
            cost: 3,
            attack: 0,
            health: 6,
            team: 'plant',
            ability: 'shield',
            description: '高防御植物',
            rarity: 'common'
        },
        {
            id: 'iceshooter',
            name: '寒冰射手',
            cost: 2,
            attack: 1,
            health: 3,
            team: 'plant',
            ability: 'freeze',
            description: '冻结攻击目标',
            rarity: 'rare'
        },
        {
            id: 'cherrybomb',
            name: '樱桃炸弹',
            cost: 4,
            attack: 5,
            health: 1,
            team: 'plant',
            ability: 'instantkill',
            description: '一击必杀，无视防御',
            rarity: 'legendary'
        },
        {
            id: 'doubleshot',
            name: '双发射手',
            cost: 3,
            attack: 3,
            health: 3,
            team: 'plant',
            ability: 'doublehit',
            description: '每回合攻击两次',
            rarity: 'rare'
        },
        {
            id: 'tallnut',
            name: '高坚果',
            cost: 4,
            attack: 1,
            health: 8,
            team: 'plant',
            ability: 'shield',
            description: '超高防御',
            rarity: 'common'
        },
        {
            id: 'cornshooter',
            name: '玉米投手',
            cost: 3,
            attack: 2,
            health: 4,
            team: 'plant',
            ability: 'piercing',
            description: '攻击必中，无视防御',
            rarity: 'rare'
        },
        {
            id: 'squash',
            name: '窝瓜',
            cost: 2,
            attack: 0,
            health: 1,
            team: 'plant',
            ability: 'instantkill',
            description: '压扁一个敌人，一击必杀',
            rarity: 'legendary'
        },
        {
            id: 'potatomine',
            name: '土豆地雷',
            cost: 1,
            attack: 0,
            health: 1,
            team: 'plant',
            ability: 'instantkill',
            description: '埋伏陷阱，一击必杀',
            rarity: 'legendary'
        },
        {
            id: 'firepea',
            name: '火龙草',
            cost: 3,
            attack: 2,
            health: 3,
            team: 'plant',
            ability: 'frenzy',
            description: '击杀后可再次攻击',
            rarity: 'epic'
        },
        {
            id: 'sunshroom',
            name: '阳光菇',
            cost: 1,
            attack: 0,
            health: 2,
            team: 'plant',
            ability: 'drawcard',
            description: '打出时抽一张牌',
            rarity: 'common'
        },
        {
            id: 'springbean',
            name: '弹簧豆',
            cost: 2,
            attack: 2,
            health: 2,
            team: 'plant',
            ability: 'bounce',
            description: '将目标弹回手牌',
            rarity: 'legendary'
        },
        {
            id: 'movemushroom',
            name: '移动蘑菇',
            cost: 2,
            attack: 1,
            health: 2,
            team: 'plant',
            ability: 'move',
            description: '可以移动到其他位置',
            rarity: 'epic'
        },
        {
            id: 'frozenshooter',
            name: '冰霜射手',
            cost: 3,
            attack: 1,
            health: 3,
            team: 'plant',
            ability: 'freeze',
            description: '冻结目标1回合',
            rarity: 'rare'
        }
    ],
    
    // 僵尸卡牌
    zombies: [
        {
            id: 'basiczombie',
            name: '普通僵尸',
            cost: 1,
            attack: 2,
            health: 3,
            team: 'zombie',
            ability: 'none',
            description: '基础僵尸',
            rarity: 'basic'
        },
        {
            id: 'conehead',
            name: '路障僵尸',
            cost: 2,
            attack: 2,
            health: 5,
            team: 'zombie',
            ability: 'shield',
            description: '有防护',
            rarity: 'common'
        },
        {
            id: 'buckethead',
            name: '铁桶僵尸',
            cost: 3,
            attack: 2,
            health: 7,
            team: 'zombie',
            ability: 'shield',
            description: '重防护',
            rarity: 'common'
        },
        {
            id: 'football',
            name: '橄榄球僵尸',
            cost: 3,
            attack: 3,
            health: 4,
            team: 'zombie',
            ability: 'doublehit',
            description: '快速攻击',
            rarity: 'rare'
        },
        {
            id: 'giant',
            name: '巨人僵尸',
            cost: 5,
            attack: 4,
            health: 8,
            team: 'zombie',
            ability: 'lethal',
            description: '对无防御卡牌一击必杀',
            rarity: 'epic'
        },
        {
            id: 'zamboni',
            name: '冰车僵尸',
            cost: 4,
            attack: 3,
            health: 3,
            team: 'zombie',
            ability: 'freeze',
            description: '冰冻攻击目标',
            rarity: 'rare'
        },
        {
            id: 'pogo',
            name: '跳跳僵尸',
            cost: 2,
            attack: 3,
            health: 2,
            team: 'zombie',
            ability: 'frenzy',
            description: '击杀后可再次攻击',
            rarity: 'epic'
        },
        {
            id: 'zomboss',
            name: '僵王博士',
            cost: 6,
            attack: 5,
            health: 10,
            team: 'zombie',
            ability: 'doublehit',
            description: '最终BOSS',
            rarity: 'rare'
        },
        {
            id: 'imp',
            name: '小鬼僵尸',
            cost: 1,
            attack: 1,
            health: 1,
            team: 'zombie',
            ability: 'drawcard',
            description: '打出时抽一张牌',
            rarity: 'common'
        },
        {
            id: 'dolphin',
            name: '海豚骑士僵尸',
            cost: 3,
            attack: 3,
            health: 3,
            team: 'zombie',
            ability: 'move',
            description: '可以移动位置',
            rarity: 'epic'
        },
        {
            id: 'yeti',
            name: '雪人僵尸',
            cost: 3,
            attack: 1,
            health: 5,
            team: 'zombie',
            ability: 'freeze',
            description: '冻结攻击者',
            rarity: 'rare'
        },
        {
            id: 'balloon',
            name: '气球僵尸',
            cost: 2,
            attack: 2,
            health: 2,
            team: 'zombie',
            ability: 'piercing',
            description: '飞行攻击，必中',
            rarity: 'rare'
        },
        {
            id: 'miner',
            name: '矿工僵尸',
            cost: 4,
            attack: 4,
            health: 4,
            team: 'zombie',
            ability: 'lethal',
            description: '致命攻击',
            rarity: 'epic'
        },
        {
            id: 'magician',
            name: '魔术师僵尸',
            cost: 2,
            attack: 1,
            health: 3,
            team: 'zombie',
            ability: 'bounce',
            description: '将目标弹回手牌',
            rarity: 'legendary'
        },
        {
            id: 'mechagiant',
            name: '机甲巨人僵尸',
            cost: 8,
            attack: 6,
            health: 12,
            team: 'zombie',
            ability: 'instantkill',
            description: '终极武器，一击必杀',
            rarity: 'legendary'
        }
    ]
};

// 特殊能力定义
const ABILITIES = {
    none: { name: '无', description: '无特殊能力' },
    piercing: { name: '必中', description: '无视防御，直接对生命值造成伤害' },
    frenzy: { name: '疯狂', description: '击杀卡牌后可以再次攻击' },
    lethal: { name: '致命', description: '对无防御卡牌一击必杀' },
    instantkill: { name: '秒杀', description: '无视一切防御，一击必杀' },
    shield: { name: '防御', description: '减少2点受到的伤害' },
    doublehit: { name: '双击', description: '每回合攻击两次' },
    freeze: { name: '冻结', description: '使目标无法攻击1回合' },
    drawcard: { name: '抽卡', description: '打出时抽取一张牌' },
    bounce: { name: '弹回', description: '将击败的卡牌弹回对方手牌' },
    move: { name: '移动', description: '可以移动到其他空位置' },
    heal: { name: '治疗', description: '每回合治疗相邻卡牌1点' }
};

// 稀有度定义
const RARITY = {
    basic: { name: '基础', color: '#9E9E9E' },
    common: { name: '普通', color: '#4CAF50' },
    rare: { name: '稀有', color: '#2196F3' },
    epic: { name: '史诗', color: '#9C27B0' },
    legendary: { name: '传说', color: '#FF9800' }
};

// 获取所有卡牌
function getAllCards() {
    return [...CARDS.plants, ...CARDS.zombies];
}

// 根据队伍获取卡牌
function getCardsByTeam(team) {
    if (team === 'plant') return CARDS.plants;
    if (team === 'zombie') return CARDS.zombies;
    return getAllCards();
}

// 根据ID获取卡牌
function getCardById(id) {
    return getAllCards().find(card => card.id === id);
}

// 搜索卡牌
function searchCards(keyword) {
    const allCards = getAllCards();
    const lowerKeyword = keyword.toLowerCase();
    
    return allCards.filter(card => 
        card.name.toLowerCase().includes(lowerKeyword) ||
        card.description.toLowerCase().includes(lowerKeyword) ||
        ABILITIES[card.ability].name.toLowerCase().includes(lowerKeyword)
    );
}
