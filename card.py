#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
卡牌类定义
"""

from enum import Enum
from dataclasses import dataclass
from typing import List, Optional

class Team(Enum):
    """队伍枚举"""
    PLANT = "植物"
    ZOMBIE = "僵尸"

class CardType(Enum):
    """卡牌类型枚举"""
    NORMAL = "普通"
    DEFENSE = "防御"
    ATTACK = "攻击"
    SPECIAL = "特殊"

class Ability(Enum):
    """特殊能力枚举"""
    NONE = "无"
    DOUBLE_HIT = "双击"  # 每回合攻击两次
    PIERCING = "必中"    # 无视防御，直接对生命值造成伤害
    FRENZY = "疯狂"      # 击杀卡牌后可以再次攻击
    LETHAL = "致命"      # 对无防御卡牌一击必杀
    SHIELD = "防御"      # 减少受到的伤害
    HEAL = "治疗"        # 回复生命值
    FREEZE = "冻结"      # 冻结目标，使其无法攻击
    DRAW_CARD = "抽卡"   # 打出时抽一张牌
    BOUNCE = "弹回"      # 将目标弹回手牌
    MOVE = "移动"        # 可以移动到其他位置
    INSTANT_KILL = "秒杀" # 一击必杀，无视一切防御

@dataclass
class Card:
    """卡牌基类"""
    name: str
    cost: int  # 费用
    attack: int  # 攻击力
    health: int  # 生命值
    team: Team
    card_type: CardType
    ability: Ability = Ability.NONE
    description: str = ""
    current_health: int = None
    position: int = -1  # 在场上的位置
    is_frozen: bool = False  # 是否被冻结
    has_attacked_this_turn: bool = False  # 本回合是否已攻击
    
    def __post_init__(self):
        if self.current_health is None:
            self.current_health = self.health
        if not self.description:
            self.description = f"{self.name} - {self.card_type.value}卡牌"
    
    def take_damage(self, damage: int, ignore_shield: bool = False) -> bool:
        """受到伤害，返回是否死亡"""
        if not ignore_shield and self.ability == Ability.SHIELD:
            damage = max(1, damage - 2)  # 防御减少2点伤害
        
        self.current_health -= damage
        return self.current_health <= 0
    
    def heal(self, amount: int):
        """治疗"""
        self.current_health = min(self.health, self.current_health + amount)
    
    def is_alive(self) -> bool:
        """是否存活"""
        return self.current_health > 0
    
    def can_attack(self) -> bool:
        """是否可以攻击"""
        return self.is_alive() and not self.is_frozen and not self.has_attacked_this_turn
    
    def reset_turn_state(self):
        """重置回合状态"""
        self.is_frozen = False
        self.has_attacked_this_turn = False
    
    def freeze(self):
        """冻结"""
        self.is_frozen = True
    
    def get_display_info(self) -> str:
        """获取显示信息"""
        ability_str = f" [{self.ability.value}]" if self.ability != Ability.NONE else ""
        frozen_str = " ❄️" if self.is_frozen else ""
        return f"【{self.name}】【{self.description}】【生命{self.current_health}/{self.health}，伤害{self.attack}】{ability_str}{frozen_str}"
    
    def reset_health(self):
        """重置生命值"""
        self.current_health = self.health
        self.is_frozen = False
        self.has_attacked_this_turn = False

# 植物卡牌定义
class PlantCard(Card):
    """植物卡牌"""
    def __init__(self, name: str, cost: int, attack: int, health: int, 
                 card_type: CardType = CardType.NORMAL, ability: Ability = Ability.NONE, 
                 description: str = ""):
        super().__init__(name, cost, attack, health, Team.PLANT, card_type, ability, description)

# 僵尸卡牌定义
class ZombieCard(Card):
    """僵尸卡牌"""
    def __init__(self, name: str, cost: int, attack: int, health: int, 
                 card_type: CardType = CardType.NORMAL, ability: Ability = Ability.NONE, 
                 description: str = ""):
        super().__init__(name, cost, attack, health, Team.ZOMBIE, card_type, ability, description)

# 预定义卡牌
PLANT_CARDS = [
    PlantCard("豌豆射手", 1, 2, 3, CardType.ATTACK, Ability.NONE, "基础攻击植物"),
    PlantCard("向日葵", 2, 0, 4, CardType.SPECIAL, Ability.HEAL, "每回合治疗相邻植物1点"),
    PlantCard("坚果墙", 3, 0, 6, CardType.DEFENSE, Ability.SHIELD, "高防御植物"),
    PlantCard("寒冰射手", 2, 1, 3, CardType.ATTACK, Ability.FREEZE, "冻结攻击目标"),
    PlantCard("樱桃炸弹", 4, 5, 1, CardType.ATTACK, Ability.INSTANT_KILL, "一击必杀，无视防御"),
    PlantCard("双发射手", 3, 3, 3, CardType.ATTACK, Ability.DOUBLE_HIT, "每回合攻击两次"),
    PlantCard("高坚果", 4, 1, 8, CardType.DEFENSE, Ability.SHIELD, "超高防御"),
    PlantCard("玉米投手", 3, 2, 4, CardType.ATTACK, Ability.PIERCING, "攻击必中，无视防御"),
    PlantCard("窝瓜", 2, 0, 1, CardType.SPECIAL, Ability.INSTANT_KILL, "压扁一个敌人，一击必杀"),
    PlantCard("土豆地雷", 1, 0, 1, CardType.SPECIAL, Ability.INSTANT_KILL, "埋伏陷阱，一击必杀"),
    PlantCard("火龙草", 3, 2, 3, CardType.ATTACK, Ability.FRENZY, "击杀后可再次攻击"),
    PlantCard("阳光菇", 1, 0, 2, CardType.SPECIAL, Ability.DRAW_CARD, "打出时抽一张牌"),
    PlantCard("弹簧豆", 2, 2, 2, CardType.ATTACK, Ability.BOUNCE, "将目标弹回手牌"),
    PlantCard("移动蘑菇", 2, 1, 2, CardType.SPECIAL, Ability.MOVE, "可以移动到其他位置"),
    PlantCard("冰霜射手", 3, 1, 3, CardType.ATTACK, Ability.FREEZE, "冻结目标1回合"),
]

ZOMBIE_CARDS = [
    ZombieCard("普通僵尸", 1, 2, 3, CardType.NORMAL, Ability.NONE, "基础僵尸"),
    ZombieCard("路障僵尸", 2, 2, 5, CardType.DEFENSE, Ability.SHIELD, "有防护"),
    ZombieCard("铁桶僵尸", 3, 2, 7, CardType.DEFENSE, Ability.SHIELD, "重防护"),
    ZombieCard("橄榄球僵尸", 3, 3, 4, CardType.ATTACK, Ability.DOUBLE_HIT, "快速攻击"),
    ZombieCard("巨人僵尸", 5, 4, 8, CardType.ATTACK, Ability.LETHAL, "对无防御卡牌一击必杀"),
    ZombieCard("冰车僵尸", 4, 3, 3, CardType.ATTACK, Ability.FREEZE, "冰冻攻击目标"),
    ZombieCard("跳跳僵尸", 2, 3, 2, CardType.ATTACK, Ability.FRENZY, "击杀后可再次攻击"),
    ZombieCard("僵王博士", 6, 5, 10, CardType.SPECIAL, Ability.DOUBLE_HIT, "最终BOSS"),
    ZombieCard("小鬼僵尸", 1, 1, 1, CardType.ATTACK, Ability.DRAW_CARD, "打出时抽一张牌"),
    ZombieCard("海豚骑士僵尸", 3, 3, 3, CardType.ATTACK, Ability.MOVE, "可以移动位置"),
    ZombieCard("雪人僵尸", 3, 1, 5, CardType.DEFENSE, Ability.FREEZE, "冻结攻击者"),
    ZombieCard("气球僵尸", 2, 2, 2, CardType.ATTACK, Ability.PIERCING, "飞行攻击，必中"),
    ZombieCard("矿工僵尸", 4, 4, 4, CardType.ATTACK, Ability.LETHAL, "致命攻击"),
    ZombieCard("魔术师僵尸", 2, 1, 3, CardType.SPECIAL, Ability.BOUNCE, "将目标弹回手牌"),
    ZombieCard("机甲巨人僵尸", 8, 6, 12, CardType.ATTACK, Ability.INSTANT_KILL, "终极武器，一击必杀"),
]
