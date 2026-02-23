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
    PIERCING = "必中"    # 无视防御
    FRENZY = "疯狂"      # 可以攻击多次
    LETHAL = "致命"      # 有几率一击必杀
    SHIELD = "防御"      # 减少受到的伤害
    HEAL = "治疗"        # 回复生命值

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
    
    def __post_init__(self):
        if self.current_health is None:
            self.current_health = self.health
        if not self.description:
            self.description = f"{self.name} - {self.card_type.value}卡牌"
    
    def take_damage(self, damage: int) -> bool:
        """受到伤害，返回是否死亡"""
        if self.ability == Ability.SHIELD:
            damage = max(1, damage - 2)  # 防御减少2点伤害
        
        self.current_health -= damage
        return self.current_health <= 0
    
    def heal(self, amount: int):
        """治疗"""
        self.current_health = min(self.health, self.current_health + amount)
    
    def is_alive(self) -> bool:
        """是否存活"""
        return self.current_health > 0
    
    def get_display_info(self) -> str:
        """获取显示信息"""
        ability_str = f" [{self.ability.value}]" if self.ability != Ability.NONE else ""
        return f"【{self.name}】【{self.description}】【生命{self.current_health}/{self.health}，伤害{self.attack}】{ability_str}"
    
    def reset_health(self):
        """重置生命值"""
        self.current_health = self.health

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
    PlantCard("寒冰射手", 2, 1, 3, CardType.ATTACK, Ability.DOUBLE_HIT, "可以攻击两次"),
    PlantCard("樱桃炸弹", 4, 5, 1, CardType.ATTACK, Ability.LETHAL, "有几率一击必杀"),
    PlantCard("双发射手", 3, 3, 3, CardType.ATTACK, Ability.FRENZY, "疯狂攻击"),
    PlantCard("高坚果", 4, 1, 8, CardType.DEFENSE, Ability.SHIELD, "超高防御"),
    PlantCard("玉米投手", 3, 2, 4, CardType.ATTACK, Ability.PIERCING, "攻击必中"),
]

ZOMBIE_CARDS = [
    ZombieCard("普通僵尸", 1, 2, 3, CardType.NORMAL, Ability.NONE, "基础僵尸"),
    ZombieCard("路障僵尸", 2, 2, 5, CardType.DEFENSE, Ability.SHIELD, "有防护"),
    ZombieCard("铁桶僵尸", 3, 2, 7, CardType.DEFENSE, Ability.SHIELD, "重防护"),
    ZombieCard("橄榄球僵尸", 3, 3, 4, CardType.ATTACK, Ability.DOUBLE_HIT, "快速攻击"),
    ZombieCard("巨人僵尸", 5, 4, 8, CardType.ATTACK, Ability.LETHAL, "强力攻击"),
    ZombieCard("冰车僵尸", 4, 3, 3, CardType.ATTACK, Ability.PIERCING, "冰冻攻击必中"),
    ZombieCard("跳跳僵尸", 2, 3, 2, CardType.ATTACK, Ability.FRENZY, "跳跃攻击"),
    ZombieCard("僵王博士", 6, 5, 10, CardType.SPECIAL, Ability.DOUBLE_HIT, "最终BOSS"),
]
