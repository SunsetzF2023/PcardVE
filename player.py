#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
玩家类定义
"""

import random
from typing import List, Optional
from card import Card, Team, PLANT_CARDS, ZOMBIE_CARDS

class Player:
    """玩家类"""
    def __init__(self, name: str, team: Team):
        self.name = name
        self.team = team
        self.health = 20  # 玩家生命值
        self.hand: List[Card] = []  # 手牌
        self.deck: List[Card] = []  # 牌库
        self.field: List[Optional[Card]] = [None] * 5  # 战场，最多5个位置
        self.mana = 1  # 当前法力值
        self.max_mana = 1  # 最大法力值
        
        # 初始化牌库
        self._init_deck()
    
    def _init_deck(self):
        """初始化牌库"""
        if self.team == Team.PLANT:
            card_templates = PLANT_CARDS
        else:
            card_templates = ZOMBIE_CARDS
        
        # 每种卡牌复制2张，组成20张牌库
        for template in card_templates:
            for _ in range(2):
                # 创建卡牌副本
                card = Card(
                    name=template.name,
                    cost=template.cost,
                    attack=template.attack,
                    health=template.health,
                    team=template.team,
                    card_type=template.card_type,
                    ability=template.ability,
                    description=template.description
                )
                self.deck.append(card)
        
        # 洗牌
        random.shuffle(self.deck)
    
    def draw_card(self) -> Optional[Card]:
        """抽一张牌"""
        if not self.deck:
            return None
        
        card = self.deck.pop()
        card.reset_health()  # 重置生命值
        self.hand.append(card)
        return card
    
    def draw_initial_hand(self):
        """抽取初始手牌"""
        for _ in range(3):
            self.draw_card()
    
    def play_card(self, card_index: int, position: int) -> bool:
        """打出卡牌"""
        if card_index < 0 or card_index >= len(self.hand):
            return False
        
        if position < 0 or position >= 5:
            return False
        
        if self.field[position] is not None:
            return False
        
        card = self.hand[card_index]
        
        if card.cost > self.mana:
            return False
        
        # 打出卡牌
        self.field[position] = card
        card.position = position
        self.mana -= card.cost
        self.hand.pop(card_index)
        
        # 处理打出时的特殊能力
        self._on_card_played(card)
        
        return True
    
    def _on_card_played(self, card):
        """处理打出卡牌时的特殊能力"""
        if card.ability == Ability.DRAW_CARD:
            self.draw_card()
            print(f"{card.name} 发动抽卡效果，抽取一张牌!")
    
    def start_turn(self):
        """开始回合"""
        self.max_mana = min(10, self.max_mana + 1)
        self.mana = self.max_mana
        self.draw_card()
        
        # 重置所有卡牌的回合状态
        for card in self.field:
            if card:
                card.reset_turn_state()
    
    def take_damage(self, damage: int):
        """玩家受到伤害"""
        self.health -= damage
        if self.health < 0:
            self.health = 0
    
    def is_alive(self) -> bool:
        """玩家是否存活"""
        return self.health > 0
    
    def move_card(self, from_position: int, to_position: int) -> bool:
        """移动卡牌位置"""
        if from_position < 0 or from_position >= 5 or to_position < 0 or to_position >= 5:
            return False
        
        if from_position == to_position:
            return False
        
        from_card = self.field[from_position]
        to_card = self.field[to_position]
        
        if not from_card:
            return False
        
        if to_card is not None:
            return False
        
        # 检查卡牌是否有移动能力
        if from_card.ability != Ability.MOVE:
            return False
        
        # 执行移动
        self.field[to_position] = from_card
        self.field[from_position] = None
        from_card.position = to_position
        
        return True
    
    def bounce_card_to_hand(self, position: int) -> bool:
        """将场上的卡牌弹回手牌"""
        if position < 0 or position >= 5:
            return False
        
        card = self.field[position]
        if not card:
            return False
        
        # 移回手牌
        card.reset_health()
        self.hand.append(card)
        self.field[position] = None
        
        return True
    
    def get_alive_cards(self) -> List[Card]:
        """获取场上存活的卡牌"""
        return [card for card in self.field if card and card.is_alive()]
    
    def remove_dead_cards(self):
        """移除死亡的卡牌"""
        for i in range(len(self.field)):
            if self.field[i] and not self.field[i].is_alive():
                self.field[i] = None
    
    def get_hand_display(self) -> str:
        """获取手牌显示"""
        if not self.hand:
            return "手牌：空"
        
        hand_str = "手牌：\n"
        for i, card in enumerate(self.hand):
            hand_str += f"  {i+1}. {card.get_display_info()}\n"
        return hand_str
    
    def get_field_display(self) -> str:
        """获取战场显示"""
        field_str = "战场：\n"
        for i, card in enumerate(self.field):
            if card:
                field_str += f"  位置{i+1}: {card.get_display_info()}\n"
            else:
                field_str += f"  位置{i+1}: [空]\n"
        return field_str
    
    def get_status_display(self) -> str:
        """获取状态显示"""
        return f"{self.name} ({self.team.value}) - 生命: {self.health} | 法力: {self.mana}/{self.max_mana}"
