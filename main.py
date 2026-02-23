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
    print("- 每回合根据法力值可以打出多张卡牌")
    print("- 法力值每回合增加1点，最多10点")
    print("- 卡牌会自动攻击对面的敌人")
    print("- 消灭对方所有卡牌且玩家生命值降至0即可获胜")
    print("\n特殊能力说明：")
    print("- 必中：无视防御，直接对生命值造成伤害")
    print("- 疯狂：击杀卡牌后可以再次攻击")
    print("- 致命：对无防御卡牌一击必杀")
    print("- 秒杀：无视一切防御，一击必杀")
    print("- 防御：减少2点受到的伤害")
    print("- 双击：每回合攻击两次")
    print("- 冻结：使目标无法攻击1回合")
    print("- 抽卡：打出时抽取一张牌")
    print("- 弹回：将击败的卡牌弹回对方手牌")
    print("- 移动：可以移动到其他空位置")
    print("- 治疗：每回合治疗相邻卡牌1点")
    
    input("\n按回车键开始游戏...")
    
    # 创建游戏实例
    game = Game()
    
    # 开始游戏主循环
    game.start_game()

if __name__ == "__main__":
    main()
