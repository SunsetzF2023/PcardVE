#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
植物大战僵尸英雄 - 在线演示版本
如果本地Python安装失败，可以使用这个版本在在线环境中运行
"""

# 这是一个简化版本，可以在在线Python环境中运行
# 访问 https://replit.com/ 或 https://www.onlinegdb.com/online_python_compiler
# 复制这段代码并运行

def simple_card_game():
    """简化版卡牌游戏演示"""
    print("🌻 植物大战僵尸英雄 - 在线演示版本 🧟")
    print("=" * 50)
    
    # 简化的卡牌数据
    cards = {
        "植物": [
            {"name": "豌豆射手", "cost": 1, "attack": 2, "health": 3, "ability": "无"},
            {"name": "向日葵", "cost": 2, "attack": 0, "health": 4, "ability": "治疗"},
            {"name": "窝瓜", "cost": 2, "attack": 0, "health": 1, "ability": "秒杀"},
            {"name": "寒冰射手", "cost": 2, "attack": 1, "health": 3, "ability": "冻结"},
        ],
        "僵尸": [
            {"name": "普通僵尸", "cost": 1, "attack": 2, "health": 3, "ability": "无"},
            {"name": "路障僵尸", "cost": 2, "attack": 2, "health": 5, "ability": "防御"},
            {"name": "巨人僵尸", "cost": 5, "attack": 4, "health": 8, "ability": "致命"},
            {"name": "机甲巨人", "cost": 8, "attack": 6, "health": 12, "ability": "秒杀"},
        ]
    }
    
    print("\n📚 卡牌展示：")
    for team, team_cards in cards.items():
        print(f"\n{team}队卡牌：")
        for card in team_cards:
            print(f"  {card['name']} - 费用:{card['cost']} 攻击:{card['attack']} 生命:{card['health']} [{card['ability']}]")
    
    print("\n🎮 简单对战演示：")
    print("植物豌豆射手 VS 僵尸普通僵尸")
    
    plant = cards["植物"][0]
    zombie = cards["僵尸"][0]
    
    print(f"{plant['name']} (生命:{plant['health']}) VS {zombie['name']} (生命:{zombie['health']})")
    
    # 简单战斗模拟
    zombie_health = zombie['health']
    while zombie_health > 0:
        zombie_health -= plant['attack']
        print(f"{plant['name']} 攻击造成 {plant['attack']} 点伤害，僵尸剩余生命: {zombie_health}")
        if zombie_health <= 0:
            print(f"{zombie['name']} 被击败了！植物获胜！")
            break
    
    print("\n🎯 游戏特色：")
    print("• 完整版本包含30+种卡牌")
    print("• 10种特殊能力（必中、疯狂、致命、秒杀等）")
    print("• 卡组构建系统（40张卡组）")
    print("• 策略性战斗机制")
    print("• 卡牌图鉴和稀有度系统")
    
    print("\n🚀 如何运行完整版本：")
    print("1. 安装Python（推荐）")
    print("2. 或使用在线Python环境")
    print("3. 运行 main.py 文件")
    
    print("\n💡 在线运行方法：")
    print("• 访问 https://replit.com/")
    print("• 创建新的Python项目")
    print("• 上传游戏文件")
    print("• 点击运行按钮")

if __name__ == "__main__":
    simple_card_game()
