// 植物大战僵尸：英雄 - 卡牌数据库
// 严格遵循原版游戏设计的卡牌数据

// 绿影英雄卡牌库
const GREEN_SHADOW_CARDS = [
    // 基础卡牌
    {
        id: 'peashooter',
        name: '豌豆射手',
        cost: 1,
        attack: 2,
        health: 3,
        team: Team.PLANT,
        cardType: CardType.MINION,
        abilities: [Ability.TEAM_UP],
        description: '基础攻击植物，具有团队协作能力',
        laneRestrictions: []
    },
    {
        id: 'threepeater',
        name: '三线射手',
        cost: 4,
        attack: 2,
        health: 3,
        team: Team.PLANT,
        cardType: CardType.MINION,
        abilities: [Ability.MULTI_LANE],
        description: '在相邻三条战道同时攻击',
        laneRestrictions: []
    },
    {
        id: 'blackeyedpea',
        name: '黑眼豌豆',
        cost: 2,
        attack: 2,
        health: 2,
        team: Team.PLANT,
        cardType: CardType.MINION,
        abilities: [Ability.TEAM_UP],
        description: '当僵尸使用锦囊时获得+1/+1',
        laneRestrictions: []
    },
    {
        id: 'sunflower',
        name: '向日葵',
        cost: 1,
        attack: 0,
        health: 3,
        team: Team.PLANT,
        cardType: CardType.MINION,
        abilities: [],
        description: '回合开始时获得1点阳光',
        laneRestrictions: []
    },
    {
        id: 'wallnut',
        name: '坚果墙',
        cost: 2,
        attack: 0,
        health: 5,
        team: Team.PLANT,
        cardType: CardType.MINION,
        abilities: [Ability.TEAM_UP],
        description: '高防御植物，具有团队协作',
        laneRestrictions: []
    },
    {
        id: 'bonkchoy',
        name: '菜问',
        cost: 3,
        attack: 3,
        health: 3,
        team: Team.PLANT,
        cardType: CardType.MINION,
        abilities: [Ability.COUNTER_ATTACK],
        description: '反击：受到攻击时对攻击者造成1点伤害',
        laneRestrictions: []
    },
    {
        id: 'snappdragon',
        name: '龙吸草',
        cost: 4,
        attack: 4,
        health: 2,
        team: Team.PLANT,
        cardType: CardType.MINION,
        abilities: [Ability.AMPHIBIOUS],
        description: '两栖植物，可以在水路战道使用',
        laneRestrictions: [],
        isAmphibious: true
    },
    {
        id: 'solarflare',
        name: '阳光菇',
        cost: 2,
        attack: 1,
        health: 2,
        team: Team.PLANT,
        cardType: CardType.MINION,
        abilities: [Ability.TEAM_UP],
        description: '打出时抽一张牌',
        laneRestrictions: []
    },
    // 植物法术
    {
        id: 'smash',
        name: '粉碎',
        cost: 2,
        attack: 0,
        health: 0,
        team: Team.PLANT,
        cardType: CardType.TRICK,
        abilities: [],
        description: '摧毁一个僵尸',
        laneRestrictions: []
    },
    {
        id: 'sunburn',
        name: '灼烧',
        cost: 3,
        attack: 0,
        health: 0,
        team: Team.PLANT,
        cardType: CardType.TRICK,
        abilities: [],
        description: '对所有僵尸造成2点伤害',
        laneRestrictions: []
    },
    {
        id: 'photosynthesis',
        name: '光合作用',
        cost: 1,
        attack: 0,
        health: 0,
        team: Team.PLANT,
        cardType: CardType.TRICK,
        abilities: [],
        description: '获得2点阳光',
        laneRestrictions: []
    }
];

// 超级脑袋英雄卡牌库
const SUPER_BRAINZ_CARDS = [
    // 基础卡牌
    {
        id: 'minininja',
        name: '迷你忍者',
        cost: 2,
        attack: 2,
        health: 2,
        team: Team.ZOMBIE,
        cardType: CardType.MINION,
        abilities: [Ability.ANTI_HERO],
        description: '反英雄：对植物英雄造成额外2点伤害',
        laneRestrictions: []
    },
    {
        id: 'electrician',
        name: '电工僵尸',
        cost: 3,
        attack: 2,
        health: 3,
        team: Team.ZOMBIE,
        cardType: CardType.MINION,
        abilities: [Ability.GRAVESTONE, Ability.BONUS_ATTACK],
        description: '墓碑：揭晓时使一个僵尸额外攻击',
        laneRestrictions: []
    },
    {
        id: 'headbanger',
        name: '摇滚僵尸',
        cost: 1,
        attack: 2,
        health: 2,
        team: Team.ZOMBIE,
        cardType: CardType.MINION,
        abilities: [],
        description: '基础攻击僵尸',
        laneRestrictions: []
    },
    {
        id: 'trickystunt',
        name: '特技僵尸',
        cost: 2,
        attack: 1,
        health: 3,
        team: Team.ZOMBIE,
        cardType: CardType.MINION,
        abilities: [],
        description: '可以移动到相邻战道',
        laneRestrictions: []
    },
    {
        id: 'backyardbounce',
        name: '后院弹跳',
        cost: 3,
        attack: 3,
        health: 3,
        team: Team.ZOMBIE,
        cardType: CardType.MINION,
        abilities: [],
        description: '可以在水路战道使用',
        laneRestrictions: [],
        isAmphibious: true
    },
    {
        id: 'sneakyimp',
        name: '鬼鬼祟祟的小鬼',
        cost: 1,
        attack: 1,
        health: 1,
        team: Team.ZOMBIE,
        cardType: CardType.MINION,
        abilities: [],
        description: '可以放置在任何战道',
        laneRestrictions: []
    },
    {
        id: 'zombot',
        name: '机器人僵尸',
        cost: 4,
        attack: 4,
        health: 4,
        team: Team.ZOMBIE,
        cardType: CardType.MINION,
        abilities: [],
        description: '高攻击力僵尸',
        laneRestrictions: []
    },
    {
        id: 'gravebuster',
        name: '墓碑破坏者',
        cost: 2,
        attack: 2,
        health: 2,
        team: Team.ZOMBIE,
        cardType: CardType.MINION,
        abilities: [],
        description: '摧毁一个植物环境卡牌',
        laneRestrictions: []
    },
    // 僵尸法术
    {
        id: 'trickshot',
        name: '诡计射击',
        cost: 2,
        attack: 0,
        health: 0,
        team: Team.ZOMBIE,
        cardType: CardType.TRICK,
        abilities: [],
        description: '对一个植物造成3点伤害',
        laneRestrictions: []
    },
    {
        id: 'totaldestruction',
        name: '完全破坏',
        cost: 4,
        attack: 0,
        health: 0,
        team: Team.ZOMBIE,
        cardType: CardType.TRICK,
        abilities: [],
        description: '摧毁所有植物',
        laneRestrictions: []
    },
    {
        id: 'raaaaaah',
        name: '啊啊啊啊',
        cost: 1,
        attack: 0,
        health: 0,
        team: Team.ZOMBIE,
        cardType: CardType.TRICK,
        abilities: [],
        description: '获得2点脑子',
        laneRestrictions: []
    }
];

// 环境卡牌
const ENVIRONMENT_CARDS = [
    {
        id: 'heightadvantage',
        name: '高地优势',
        cost: 2,
        attack: 0,
        health: 0,
        team: Team.PLANT,
        cardType: CardType.ENVIRONMENT,
        abilities: [],
        description: '高地战道的植物获得+1攻击力',
        laneRestrictions: [LaneType.HEIGHTS]
    },
    {
        id: 'poolparty',
        name: '泳池派对',
        cost: 2,
        attack: 0,
        health: 0,
        team: Team.ZOMBIE,
        cardType: CardType.ENVIRONMENT,
        abilities: [],
        description: '水路战道的僵尸获得+1生命值',
        laneRestrictions: [LaneType.WATER]
    }
];

// 超级技能卡牌
const SUPERPOWER_CARDS = [
    {
        id: 'precisionshot',
        name: '精准射击',
        cost: 0,
        attack: 0,
        health: 0,
        team: Team.PLANT,
        cardType: CardType.SUPERPOWER,
        abilities: [],
        description: '在中间战道造成5点伤害',
        laneRestrictions: []
    },
    {
        id: 'superstrike',
        name: '超级突击',
        cost: 0,
        attack: 0,
        health: 0,
        team: Team.ZOMBIE,
        cardType: CardType.SUPERPOWER,
        abilities: [],
        description: '移动一个僵尸并使其进行一次额外攻击',
        laneRestrictions: []
    }
];

// 卡牌数据库
const CARD_DATABASE = {
    [Team.PLANT]: [...GREEN_SHADOW_CARDS, ...ENVIRONMENT_CARDS.filter(c => c.team === Team.PLANT)],
    [Team.ZOMBIE]: [...SUPER_BRAINZ_CARDS, ...ENVIRONMENT_CARDS.filter(c => c.team === Team.ZOMBIE)]
};

// 获取英雄的初始卡组
function getHeroDeck(heroTeam) {
    const cards = CARD_DATABASE[heroTeam];
    const deck = [];
    
    // 创建标准卡组（每种卡牌2张）
    cards.forEach(cardData => {
        for (let i = 0; i < 2; i++) {
            deck.push(new Card(cardData));
        }
    });
    
    // 洗牌
    shuffleArray(deck);
    
    return deck;
}

// 洗牌算法
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 根据ID获取卡牌数据
function getCardDataById(cardId) {
    const allCards = [...GREEN_SHADOW_CARDS, ...SUPER_BRAINZ_CARDS, ...ENVIRONMENT_CARDS, ...SUPERPOWER_CARDS];
    return allCards.find(card => card.id === cardId);
}

// 导出卡牌数据
window.CardData = {
    GREEN_SHADOW_CARDS,
    SUPER_BRAINZ_CARDS,
    ENVIRONMENT_CARDS,
    SUPERPOWER_CARDS,
    CARD_DATABASE,
    getHeroDeck,
    getCardDataById
};
