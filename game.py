#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
游戏逻辑类
"""

import time
import random
from typing import Optional, List
from card import Card, Team, Ability
from player import Player

class Game:
    """游戏主类"""
    def __init__(self):
        self.plant_player: Optional[Player] = None
        self.zombie_player: Optional[Player] = None
        self.current_turn = Team.PLANT
        self.turn_count = 1
        self.game_over = False
        self.winner: Optional[Team] = None
    
    def start_game(self):
        """开始游戏"""
        # 创建玩家
        self.plant_player = Player("植物玩家", Team.PLANT)
        self.zombie_player = Player("僵尸玩家", Team.ZOMBIE)
        
        # 抽取初始手牌
        self.plant_player.draw_initial_hand()
        self.zombie_player.draw_initial_hand()
        
        print("\n游戏开始！")
        print(f"{self.plant_player.name} VS {self.zombie_player.name}")
        
        # 游戏主循环
        while not self.game_over:
            self.play_turn()
            
            # 检查游戏是否结束
            if self.check_game_over():
                break
            
            # 切换回合
            self.switch_turn()
            self.turn_count += 1
        
        self.display_game_result()
    
    def play_turn(self):
        """进行一个回合"""
        current_player = self.get_current_player()
        opponent = self.get_opponent()
        
        print(f"\n{'='*50}")
        print(f"第 {self.turn_count} 回合 - {current_player.team.value}的回合")
        print(f"{'='*50}")
        
        # 开始回合
        current_player.start_turn()
        
        # 显示游戏状态
        self.display_game_state()
        
        # 玩家行动阶段
        self.player_action_phase(current_player)
        
        # 战斗阶段
        self.battle_phase()
        
        # 回合结束阶段
        self.end_turn_phase()
    
    def player_action_phase(self, player: Player):
        """玩家行动阶段"""
        while True:
            print(f"\n{player.name}的行动阶段")
            print("1. 查看手牌")
            print("2. 打出卡牌")
            print("3. 移动卡牌 (仅限有移动能力的卡牌)")
            print("4. 结束回合")
            
            choice = input("请选择操作 (1-4): ").strip()
            
            if choice == "1":
                print(player.get_hand_display())
            
            elif choice == "2":
                self.play_card_action(player)
            
            elif choice == "3":
                self.move_card_action(player)
            
            elif choice == "4":
                print(f"{player.name}结束回合")
                break
            
            else:
                print("无效选择，请重新输入")
    
    def play_card_action(self, player: Player):
        """打出卡牌操作"""
        if not player.hand:
            print("手牌为空！")
            return
        
        print(player.get_hand_display())
        print(player.get_field_display())
        
        try:
            card_index = int(input("选择要打出的卡牌编号 (1-{}): ".format(len(player.hand)))) - 1
            position = int(input("选择放置位置 (1-5): ")) - 1
            
            if player.play_card(card_index, position):
                card = player.field[position]
                print(f"成功打出 {card.name} 到位置 {position + 1}!")
                time.sleep(1)
            else:
                print("无法打出该卡牌，请检查费用或位置!")
        
        except ValueError:
            print("输入无效，请输入数字")
    
    def battle_phase(self):
        """战斗阶段"""
        print("\n⚔️ 战斗阶段开始!")
        time.sleep(1)
        
        # 植物方攻击
        self.team_attack(self.plant_player, self.zombie_player)
        
        # 僵尸方攻击
        self.team_attack(self.zombie_player, self.plant_player)
        
        # 移除死亡卡牌
        self.plant_player.remove_dead_cards()
        self.zombie_player.remove_dead_cards()
        
        print("战斗阶段结束!")
        time.sleep(1)
    
    def move_card_action(self, player: Player):
        """移动卡牌操作"""
        print(player.get_field_display())
        
        try:
            from_pos = int(input("选择要移动的卡牌位置 (1-5): ")) - 1
            to_pos = int(input("选择目标位置 (1-5): ")) - 1
            
            if player.move_card(from_pos, to_pos):
                card = player.field[to_pos]
                print(f"成功将 {card.name} 从位置 {from_pos + 1} 移动到位置 {to_pos + 1}!")
                time.sleep(1)
            else:
                print("无法移动该卡牌，请检查位置或卡牌是否有移动能力!")
        
        except ValueError:
            print("输入无效，请输入数字")
    
    def team_attack(self, attacker: Player, defender: Player):
        """队伍攻击"""
        attacker_cards = [card for card in attacker.get_alive_cards() if card.can_attack()]
        
        if not attacker_cards:
            print(f"{attacker.team.value}没有可攻击的卡牌")
            return
        
        print(f"\n{attacker.team.value}方攻击:")
        
        for card in attacker_cards:
            # 寻找对面的目标
            target = self.find_target(card, defender)
            
            if target:
                killed = self.perform_attack(card, target)
                
                # 疯狂能力：如果击杀了目标，可以再次攻击
                if killed and card.ability == Ability.FRENZY:
                    print(f"{card.name} 发动疯狂效果，可以再次攻击!")
                    new_target = self.find_target(card, defender)
                    if new_target:
                        self.perform_attack(card, new_target)
            else:
                # 没有目标，直接攻击玩家
                damage = card.attack
                defender.take_damage(damage)
                print(f"{card.name} 直接攻击 {defender.name}，造成 {damage} 点伤害!")
            
            # 标记已攻击
            card.has_attacked_this_turn = True
    
    def find_target(self, attacker: Card, defender: Player) -> Optional[Card]:
        """寻找攻击目标"""
        # 优先攻击同一位置的敌人
        same_position = defender.field[attacker.position]
        if same_position and same_position.is_alive():
            return same_position
        
        # 如果同一位置没有敌人，随机选择一个存活的敌人
        alive_enemies = defender.get_alive_cards()
        if alive_enemies:
            return random.choice(alive_enemies)
        
        return None
    
    def perform_attack(self, attacker: Card, defender: Card) -> bool:
        """执行攻击，返回是否击杀目标"""
        damage = attacker.attack
        
        # 处理特殊能力
        attack_count = 1
        ignore_shield = False
        instant_kill = False
        
        if attacker.ability == Ability.DOUBLE_HIT:
            attack_count = 2
            print(f"{attacker.name} 发动双击!")
        
        # 执行多次攻击
        for i in range(attack_count):
            current_damage = damage
            
            # 必中能力：无视防御
            if attacker.ability == Ability.PIERCING:
                ignore_shield = True
                print(f"{attacker.name} 的攻击必中，无视防御!")
            
            # 致命能力：对无防御卡牌一击必杀
            if attacker.ability == Ability.LETHAL and defender.ability != Ability.SHIELD:
                current_damage = defender.current_health
                print(f"{attacker.name} 发动致命一击!")
            
            # 秒杀能力：无视一切防御
            elif attacker.ability == Ability.INSTANT_KILL:
                current_damage = defender.current_health
                ignore_shield = True
                print(f"{attacker.name} 发动秒杀效果!")
            
            print(f"{attacker.name} 攻击 {defender.name}，造成 {current_damage} 点伤害!")
            
            # 造成伤害
            is_dead = defender.take_damage(current_damage, ignore_shield)
            
            if is_dead:
                print(f"{defender.name} 被击败了!")
                
                # 弹回手牌效果
                if attacker.ability == Ability.BOUNCE:
                    defender_player = self.zombie_player if defender.team == Team.ZOMBIE else self.plant_player
                    for i, card in enumerate(defender_player.field):
                        if card == defender:
                            defender_player.bounce_card_to_hand(i)
                            print(f"{defender.name} 被弹回手牌!")
                            break
                
                time.sleep(0.5)
                return True
            else:
                print(f"{defender.name} 剩余生命: {defender.current_health}")
            
            # 冻结效果
            if attacker.ability == Ability.FREEZE:
                defender.freeze()
                print(f"{defender.name} 被冻结了!")
            
            time.sleep(0.5)
        
        return False
    
    def end_turn_phase(self):
        """回合结束阶段"""
        # 治疗能力处理
        self.process_healing_ability()
        
        # 显示当前状态
        self.display_game_state()
    
    def process_healing_ability(self):
        """处理治疗能力"""
        for player in [self.plant_player, self.zombie_player]:
            for card in player.field:
                if card and card.is_alive() and card.ability == Ability.HEAL:
                    # 治疗相邻的卡牌
                    for offset in [-1, 1]:
                        adjacent_pos = card.position + offset
                        if 0 <= adjacent_pos < 5:
                            adjacent_card = player.field[adjacent_pos]
                            if adjacent_card and adjacent_card.is_alive():
                                adjacent_card.heal(1)
                                print(f"{card.name} 治疗 {adjacent_card.name} 1点生命!")
    
    def check_game_over(self) -> bool:
        """检查游戏是否结束"""
        # 检查玩家生命值
        if not self.plant_player.is_alive():
            self.game_over = True
            self.winner = Team.ZOMBIE
            return True
        
        if not self.zombie_player.is_alive():
            self.game_over = True
            self.winner = Team.PLANT
            return True
        
        # 检查是否有一方没有卡牌且手牌为空
        plant_alive = len(self.plant_player.get_alive_cards()) > 0 or len(self.plant_player.hand) > 0
        zombie_alive = len(self.zombie_player.get_alive_cards()) > 0 or len(self.zombie_player.hand) > 0
        
        if not plant_alive:
            self.game_over = True
            self.winner = Team.ZOMBIE
            return True
        
        if not zombie_alive:
            self.game_over = True
            self.winner = Team.PLANT
            return True
        
        return False
    
    def switch_turn(self):
        """切换回合"""
        self.current_turn = Team.ZOMBIE if self.current_turn == Team.PLANT else Team.PLANT
    
    def get_current_player(self) -> Player:
        """获取当前玩家"""
        return self.plant_player if self.current_turn == Team.PLANT else self.zombie_player
    
    def get_opponent(self) -> Player:
        """获取对手"""
        return self.zombie_player if self.current_turn == Team.PLANT else self.plant_player
    
    def display_game_state(self):
        """显示游戏状态"""
        print(f"\n{self.plant_player.get_status_display()}")
        print(self.plant_player.get_field_display())
        
        print(f"\n{self.zombie_player.get_status_display()}")
        print(self.zombie_player.get_field_display())
    
    def display_game_result(self):
        """显示游戏结果"""
        print(f"\n{'='*50}")
        print("游戏结束!")
        print(f"{'='*50}")
        
        if self.winner == Team.PLANT:
            print("🌻 植物队获胜! 🌻")
        else:
            print("🧟 僵尸队获胜! 🧟")
        
        print(f"总回合数: {self.turn_count}")
        print(f"植物玩家剩余生命: {self.plant_player.health}")
        print(f"僵尸玩家剩余生命: {self.zombie_player.health}")
