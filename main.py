#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
植物大战僵尸英雄 - 卡牌对战游戏
简化版文字卡牌游戏
"""

import random
import time
from enum import Enum
from dataclasses import dataclass
from typing import List, Optional, Dict
from card import Card, CardType, Team
from game import Game
from player import Player

def main():
    """游戏主函数"""
    print("=" * 50)
    print("🌻 植物大战僵尸英雄 - 卡牌对战 🧟")
    print("=" * 50)
    print("\n欢迎来到植物大战僵尸英雄的卡牌对战世界！")
    print("游戏规则：")
    print("- 植物队和僵尸队各有5个位置")
    print("- 每回合可以放置一张卡牌")
    print("- 卡牌会自动攻击对面的敌人")
    print("- 消灭对方所有卡牌即可获胜")
    print("\n特殊能力说明：")
    print("- 必中：无视防御，必定命中")
    print("- 疯狂：可以攻击多次")
    print("- 致命：有几率一击必杀")
    print("- 防御：减少受到的伤害")
    print("- 双击：每回合攻击两次")
    
    input("\n按回车键开始游戏...")
    
    # 创建游戏实例
    game = Game()
    
    # 开始游戏主循环
    game.start_game()

if __name__ == "__main__":
    main()
