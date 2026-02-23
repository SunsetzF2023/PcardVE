#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
主菜单系统
"""

import os
from deck_builder import DeckBuilder, CardCollection
from card import Team
from game import Game

class MainMenu:
    """主菜单类"""
    def __init__(self):
        self.deck_builder = DeckBuilder()
        self.card_collection = CardCollection()
        self.current_deck_file = "current_deck.json"
        
    def run(self):
        """运行主菜单"""
        while True:
            self._display_main_menu()
            choice = input("请选择操作 (1-5): ").strip()
            
            if choice == "1":
                self._deck_builder_menu()
            elif choice == "2":
                self._card_collection_menu()
            elif choice == "3":
                self._load_deck_menu()
            elif choice == "4":
                self._start_game()
            elif choice == "5":
                print("感谢游玩，再见！")
                break
            else:
                print("无效选择，请重新输入")
    
    def _display_main_menu(self):
        """显示主菜单"""
        print("\n" + "="*50)
        print("🌻 植物大战僵尸英雄 - 主菜单 🧟")
        print("="*50)
        print("1. 🎴 卡组构建")
        print("2. 📚 卡牌图鉴")
        print("3. 📂 加载卡组")
        print("4. 🎮 开始游戏")
        print("5. 🚪 退出游戏")
        print("="*50)
    
    def _deck_builder_menu(self):
        """卡组构建菜单"""
        while True:
            print(f"\n=== 卡组构建 ({self.deck_builder.get_deck_size()}/40) ===")
            print("1. 查看当前卡组")
            print("2. 添加卡牌")
            print("3. 移除卡牌")
            print("4. 查看可用卡牌")
            print("5. 清空卡组")
            print("6. 保存卡组")
            print("7. 返回主菜单")
            
            choice = input("请选择操作 (1-7): ").strip()
            
            if choice == "1":
                self.deck_builder.display_deck()
            elif choice == "2":
                self._add_card_menu()
            elif choice == "3":
                self._remove_card_menu()
            elif choice == "4":
                self._view_available_cards_menu()
            elif choice == "5":
                self.deck_builder.clear_deck()
            elif choice == "6":
                self._save_deck_menu()
            elif choice == "7":
                break
            else:
                print("无效选择，请重新输入")
    
    def _add_card_menu(self):
        """添加卡牌菜单"""
        print("\n=== 添加卡牌 ===")
        print("1. 按队伍查看")
        print("2. 搜索卡牌")
        print("3. 返回")
        
        choice = input("请选择 (1-3): ").strip()
        
        if choice == "1":
            team_choice = input("选择队伍 (1.植物 2.僵尸): ").strip()
            if team_choice == "1":
                self.deck_builder.display_available_cards(Team.PLANT)
            elif team_choice == "2":
                self.deck_builder.display_available_cards(Team.ZOMBIE)
            else:
                print("无效选择")
                return
            
            card_name = input("输入要添加的卡牌名称: ").strip()
            self.deck_builder.add_card(card_name)
        
        elif choice == "2":
            keyword = input("输入搜索关键词: ").strip()
            results = self.card_collection.search_cards(keyword)
            
            if not results:
                print("没有找到匹配的卡牌")
                return
            
            print("\n搜索结果:")
            for i, card in enumerate(results, 1):
                print(f"{i}. {card.name} - {card.description}")
            
            try:
                card_index = int(input("选择卡牌编号: ")) - 1
                if 0 <= card_index < len(results):
                    card = results[card_index]
                    self.deck_builder.add_card(card.name)
                else:
                    print("无效编号")
            except ValueError:
                print("请输入数字")
    
    def _remove_card_menu(self):
        """移除卡牌菜单"""
        self.deck_builder.display_deck()
        if not self.deck_builder.deck_config:
            return
        
        card_name = input("输入要移除的卡牌名称: ").strip()
        self.deck_builder.remove_card(card_name)
    
    def _view_available_cards_menu(self):
        """查看可用卡牌菜单"""
        print("\n=== 查看可用卡牌 ===")
        print("1. 植物卡牌")
        print("2. 僵尸卡牌")
        print("3. 所有卡牌")
        
        choice = input("请选择 (1-3): ").strip()
        
        if choice == "1":
            self.deck_builder.display_available_cards(Team.PLANT)
        elif choice == "2":
            self.deck_builder.display_available_cards(Team.ZOMBIE)
        elif choice == "3":
            self.deck_builder.display_available_cards()
        else:
            print("无效选择")
    
    def _save_deck_menu(self):
        """保存卡组菜单"""
        if not self.deck_builder.is_deck_valid():
            print(f"卡组无效！当前 {self.deck_builder.get_deck_size()}/40 张卡牌")
            return
        
        filename = input("输入保存文件名 (默认: current_deck.json): ").strip()
        if not filename:
            filename = self.current_deck_file
        
        if not filename.endswith('.json'):
            filename += '.json'
        
        self.deck_builder.save_deck(filename)
    
    def _card_collection_menu(self):
        """卡牌图鉴菜单"""
        while True:
            print("\n=== 卡牌图鉴 ===")
            print("1. 查看所有卡牌")
            print("2. 按队伍查看")
            print("3. 搜索卡牌")
            print("4. 返回主菜单")
            
            choice = input("请选择操作 (1-4): ").strip()
            
            if choice == "1":
                self.card_collection.display_collection()
            elif choice == "2":
                team_choice = input("选择队伍 (1.植物 2.僵尸): ").strip()
                if team_choice == "1":
                    self.card_collection.display_collection(Team.PLANT)
                elif team_choice == "2":
                    self.card_collection.display_collection(Team.ZOMBIE)
                else:
                    print("无效选择")
            elif choice == "3":
                self._search_cards_menu()
            elif choice == "4":
                break
            else:
                print("无效选择，请重新输入")
    
    def _search_cards_menu(self):
        """搜索卡牌菜单"""
        keyword = input("输入搜索关键词: ").strip()
        results = self.card_collection.search_cards(keyword)
        
        if not results:
            print("没有找到匹配的卡牌")
            return
        
        print(f"\n找到 {len(results)} 张卡牌:")
        for card in results:
            print(f"\n{card.name} - {card.description}")
            print(f"费用:{card.cost} 攻击:{card.attack} 生命:{card.health}")
            print(f"队伍:{card.team.value} 能力:[{card.ability.value}]")
    
    def _load_deck_menu(self):
        """加载卡组菜单"""
        print("\n=== 加载卡组 ===")
        
        # 显示可用的卡组文件
        json_files = [f for f in os.listdir('.') if f.endswith('.json')]
        if not json_files:
            print("没有找到卡组文件")
            return
        
        print("可用的卡组文件:")
        for i, file in enumerate(json_files, 1):
            print(f"{i}. {file}")
        
        try:
            file_index = int(input("选择文件编号: ")) - 1
            if 0 <= file_index < len(json_files):
                filename = json_files[file_index]
                if self.deck_builder.load_deck(filename):
                    print(f"成功加载卡组: {filename}")
                    self.deck_builder.display_deck()
            else:
                print("无效编号")
        except ValueError:
            print("请输入数字")
    
    def _start_game(self):
        """开始游戏"""
        if not self.deck_builder.is_deck_valid():
            print("卡组无效！请先构建一个40张的卡组")
            return
        
        print("\n=== 游戏设置 ===")
        print("1. 植物队 vs AI僵尸队")
        print("2. 僵尸队 vs AI植物队")
        print("3. 返回主菜单")
        
        choice = input("请选择 (1-3): ").strip()
        
        if choice == "1":
            self._start_game_with_deck(Team.PLANT)
        elif choice == "2":
            self._start_game_with_deck(Team.ZOMBIE)
        elif choice == "3":
            return
        else:
            print("无效选择")
    
    def _start_game_with_deck(self, player_team: Team):
        """使用指定卡组开始游戏"""
        print(f"\n使用{player_team.value}队开始游戏...")
        
        # 创建游戏实例（需要修改Game类支持自定义卡组）
        game = Game()
        game.set_custom_deck(player_team, self.deck_builder.get_deck_list())
        game.start_game()

def main():
    """主函数"""
    menu = MainMenu()
    menu.run()

if __name__ == "__main__":
    main()
