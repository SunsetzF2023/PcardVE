#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
卡组构建系统
"""

import json
import os
from typing import List, Dict
from card import Card, Team, PLANT_CARDS, ZOMBIE_CARDS

class DeckBuilder:
    """卡组构建器"""
    def __init__(self):
        self.all_cards = PLANT_CARDS + ZOMBIE_CARDS
        self.deck_config: Dict[str, int] = {}  # 卡牌名称 -> 数量
        self.max_deck_size = 40
        self.max_copies_per_card = 4
        
    def add_card(self, card_name: str) -> bool:
        """添加卡牌到卡组"""
        if card_name not in [card.name for card in self.all_cards]:
            print(f"错误：找不到卡牌 {card_name}")
            return False
        
        current_count = self.deck_config.get(card_name, 0)
        total_cards = sum(self.deck_config.values())
        
        if current_count >= self.max_copies_per_card:
            print(f"错误：{card_name} 已达到最大数量 {self.max_copies_per_card}")
            return False
        
        if total_cards >= self.max_deck_size:
            print(f"错误：卡组已满，最多 {self.max_deck_size} 张卡牌")
            return False
        
        self.deck_config[card_name] = current_count + 1
        print(f"成功添加 {card_name} ({self.deck_config[card_name]}/{self.max_copies_per_card})")
        return True
    
    def remove_card(self, card_name: str) -> bool:
        """从卡组移除卡牌"""
        if card_name not in self.deck_config:
            print(f"错误：卡组中没有 {card_name}")
            return False
        
        self.deck_config[card_name] -= 1
        if self.deck_config[card_name] == 0:
            del self.deck_config[card_name]
        
        print(f"成功移除 {card_name}")
        return True
    
    def clear_deck(self):
        """清空卡组"""
        self.deck_config.clear()
        print("卡组已清空")
    
    def get_deck_size(self) -> int:
        """获取卡组大小"""
        return sum(self.deck_config.values())
    
    def is_deck_valid(self) -> bool:
        """检查卡组是否有效"""
        return self.get_deck_size() == self.max_deck_size
    
    def get_deck_list(self) -> List[Card]:
        """获取卡组中的卡牌列表"""
        deck = []
        for card_name, count in self.deck_config.items():
            for card in self.all_cards:
                if card.name == card_name:
                    for _ in range(count):
                        # 创建卡牌副本
                        card_copy = Card(
                            name=card.name,
                            cost=card.cost,
                            attack=card.attack,
                            health=card.health,
                            team=card.team,
                            card_type=card.card_type,
                            ability=card.ability,
                            description=card.description
                        )
                        deck.append(card_copy)
                    break
        return deck
    
    def display_deck(self):
        """显示当前卡组"""
        print(f"\n=== 当前卡组 ({self.get_deck_size()}/{self.max_deck_size}) ===")
        if not self.deck_config:
            print("卡组为空")
            return
        
        # 按费用排序显示
        sorted_cards = sorted(self.deck_config.items(), key=lambda x: self._get_card_cost(x[0]))
        
        for card_name, count in sorted_cards:
            card = self._get_card_by_name(card_name)
            if card:
                print(f"{card.name} x{count} - {card.description} [{card.ability.value}]")
    
    def display_available_cards(self, team: Team = None):
        """显示可用卡牌"""
        print(f"\n=== 可用卡牌 ===")
        
        cards_to_show = self.all_cards
        if team:
            cards_to_show = [card for card in self.all_cards if card.team == team]
        
        # 按费用分组显示
        cards_by_cost = {}
        for card in cards_to_show:
            cost = card.cost
            if cost not in cards_by_cost:
                cards_by_cost[cost] = []
            cards_by_cost[cost].append(card)
        
        for cost in sorted(cards_by_cost.keys()):
            print(f"\n{cost}费卡牌:")
            for card in cards_by_cost[cost]:
                current_count = self.deck_config.get(card.name, 0)
                status = f"({current_count}/{self.max_copies_per_card})"
                print(f"  {card.name} {status} - {card.description} [{card.ability.value}]")
    
    def _get_card_by_name(self, name: str) -> Card:
        """根据名称获取卡牌"""
        for card in self.all_cards:
            if card.name == name:
                return card
        return None
    
    def _get_card_cost(self, name: str) -> int:
        """获取卡牌费用"""
        card = self._get_card_by_name(name)
        return card.cost if card else 0
    
    def save_deck(self, filename: str) -> bool:
        """保存卡组配置"""
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(self.deck_config, f, ensure_ascii=False, indent=2)
            print(f"卡组已保存到 {filename}")
            return True
        except Exception as e:
            print(f"保存失败：{e}")
            return False
    
    def load_deck(self, filename: str) -> bool:
        """加载卡组配置"""
        try:
            if not os.path.exists(filename):
                print(f"文件不存在：{filename}")
                return False
            
            with open(filename, 'r', encoding='utf-8') as f:
                loaded_config = json.load(f)
            
            # 验证加载的配置
            temp_config = self.deck_config
            self.deck_config = loaded_config
            
            if not self.is_deck_valid():
                print("加载的卡组无效，恢复原卡组")
                self.deck_config = temp_config
                return False
            
            print(f"卡组已从 {filename} 加载")
            return True
        except Exception as e:
            print(f"加载失败：{e}")
            return False

class CardCollection:
    """卡牌收藏/图鉴系统"""
    def __init__(self):
        self.all_cards = PLANT_CARDS + ZOMBIE_CARDS
        self.owned_cards: Dict[str, int] = {}  # 卡牌名称 -> 拥有数量
        self._initialize_collection()
    
    def _initialize_collection(self):
        """初始化收藏（默认拥有所有卡牌）"""
        for card in self.all_cards:
            self.owned_cards[card.name] = 4  # 默认每种卡牌有4张
    
    def display_collection(self, team: Team = None, show_unowned: bool = False):
        """显示卡牌收藏"""
        print(f"\n=== 卡牌图鉴 ===")
        
        cards_to_show = self.all_cards
        if team:
            cards_to_show = [card for card in self.all_cards if card.team == team]
        
        # 按队伍和费用分组
        plant_cards = [card for card in cards_to_show if card.team == Team.PLANT]
        zombie_cards = [card for card in cards_to_show if card.team == Team.ZOMBIE]
        
        if not team or team == Team.PLANT:
            self._display_team_cards(plant_cards, "🌻 植物卡牌")
        
        if not team or team == Team.ZOMBIE:
            self._display_team_cards(zombie_cards, "🧟 僵尸卡牌")
    
    def _display_team_cards(self, cards: List[Card], title: str):
        """显示队伍卡牌"""
        print(f"\n{title}")
        print("-" * len(title))
        
        # 按费用分组
        cards_by_cost = {}
        for card in cards:
            cost = card.cost
            if cost not in cards_by_cost:
                cards_by_cost[cost] = []
            cards_by_cost[cost].append(card)
        
        for cost in sorted(cards_by_cost.keys()):
            print(f"\n{cost}费:")
            for card in cards_by_cost[cost]:
                owned = self.owned_cards.get(card.name, 0)
                rarity = self._get_rarity(card)
                print(f"  {card.name} - {card.description}")
                print(f"    费用:{card.cost} 攻击:{card.attack} 生命:{card.health} [{card.ability.value}]")
                print(f"    稀有度:{rarity} 拥有:{owned}/4")
    
    def _get_rarity(self, card: Card) -> str:
        """获取卡牌稀有度"""
        if card.ability.value in ["秒杀", "弹回"]:
            return "传说"
        elif card.ability.value in ["疯狂", "致命", "移动"]:
            return "史诗"
        elif card.ability.value in ["双击", "冻结", "必中"]:
            return "稀有"
        elif card.ability.value in ["防御", "治疗", "抽卡"]:
            return "普通"
        else:
            return "基础"
    
    def search_cards(self, keyword: str) -> List[Card]:
        """搜索卡牌"""
        results = []
        keyword = keyword.lower()
        
        for card in self.all_cards:
            if (keyword in card.name.lower() or 
                keyword in card.description.lower() or
                keyword in card.ability.value.lower()):
                results.append(card)
        
        return results
