# game/game_engine.py
import asyncio
import random
from channels.layers import get_channel_layer
from copy import deepcopy
from pong.provider_game.player import Player
from pong.models import Room
from rich import inspect, print
from pong.provider_game.services.create_game_history import create_history
from channels.db import database_sync_to_async

KEY_STATE = {"RELASE": 0, "PRESS": 1}
KEY_VALUE = {
    38: {
        'code': 'UP',
        'value': -1,
        'STATE': KEY_STATE['RELASE']
    },
    40: {
        'code': 'DOWN',
        'value': 1,
        'STATE': KEY_STATE['RELASE']
    },
    37: {
        'code': 'LEFT',
        'value': -1,
        'STATE': KEY_STATE['RELASE']
    },
    39: {
        'code': 'RIGHT',
        'value': 1,
        'STATE': KEY_STATE['RELASE']
    },
    87: {
        'code': 'W',
        'value': -1,
        'STATE': KEY_STATE['RELASE']
    },
    65: {
        'code': 'A',
        'value': 1,
        'STATE': KEY_STATE['RELASE']
    },
    83: {
        'code': 'S',
        'value': 1,
        'STATE': KEY_STATE['RELASE']
    },
    68: {
        'code': 'D',
        'value': 1,
        'STATE': KEY_STATE['RELASE']
    },
}


class GameEngine:

    GameEnginInstance = {}

    def __new__(cls, id, *arg, **kwarg):
        game_obj = cls.GameEnginInstance.get(id, None)
        if game_obj:
            return game_obj
        instance = super().__new__(cls)
        cls.GameEnginInstance[id] = instance
        instance.task = None
        return instance

    def __init__(self, id, room_id, *arg, **kwarg):
        """
        """
        if hasattr(self, '_is_init'):
            return None
        self.ball_position = {'x': 512, 'y': 300}
        self.ball_velocity = {'x': 1, 'y': 1}
        self.player: list[Player] = []
        self.room_id = room_id
        self.canvas_size = {
            'player1': {
                'x': 800,
                'y': 800,
            }
        }
        self.channels = get_channel_layer()
        self.id = id
        self.score_to_win = 1
        self._running = False

        self.key_value = deepcopy(KEY_VALUE)
        self._is_init = True
        self.game_type = "VERSUS"
        
    def __str__(self):
        return f'game_engine_for_group:{self.id}'

    async def cale_ball_position(self):
        self.ball_position['x'] += self.ball_velocity['x']
        self.ball_position['y'] += self.ball_velocity['y']
        if self.ball_position['y'] > 600 or self.ball_position['y'] < 0:
            self.ball_velocity['y'] = -1 * self.ball_velocity['y']

    async def update_game_state(self):
        game_state = {
            'ball_position': self.ball_position,
            'left_paddle': self.player[0].get_position(),
            'right_paddle': self.player[1].get_position()
        }
        await self.channels.group_send(
            self.id,
            {
                'type': 'game.state',
                'game_state': game_state
            }
        )

    def run(self, loop):
        if not self._running:
            self._running = True
            self.task = loop.create_task(self.start())

    async def start(self):
        asyncio.sleep(0.5);
        while self._running:
            await self.cale_ball_position()
            await self.update_player_paddle()
            await self.check_ball_hit_paddle()
            await self.check_ball_score()
            await self.update_game_state()
            await self.check_winner()
            asyncio.sleep(0.05)


    async def check_ball_hit_paddle(self):
        left_paddle = self.player[0].paddle
        right_paddle = self.player[1].paddle
        # left_paddle.y = ยอดของ paddle น้อยสุด = 0
        # Check Left Paddle
        if self.ball_position['x'] <= left_paddle.x + left_paddle.width and (\
                self.ball_position['y'] <= left_paddle.y + left_paddle.height and \
                    self.ball_position['y'] > left_paddle.y):
            self.ball_velocity['x'] = -1 * self.ball_velocity['x']
        # Check Right Paddle
        if self.ball_position['x'] >= right_paddle.x and \
               (self.ball_position['y'] <= right_paddle.y + right_paddle.height and \
                    self.ball_position['y'] >= right_paddle.y):
            self.ball_velocity['x'] = -1 * self.ball_velocity['x']

    async def check_ball_score(self):
        if self.ball_position['x'] > 1030:
            self.ball_position = {'x': 512, 'y': 300}
            self.ball_velocity = {'x': 1, 'y': 1}
            self.player[0].increase_score()
            self.player[0].set_block_inc(True)
            await self.broadcase_score()
            self.player[0].set_block_inc(False)
            self.reset()
            await self.delay_game()

        if self.ball_position['x'] < -5:
            self.ball_position = {'x': 512, 'y': 300}
            self.ball_velocity = {'x': 1, 'y': 1}
            self.player[1].increase_score()
            self.player[1].set_block_inc(True)
            await self.broadcase_score()
            self.player[1].set_block_inc(False)

            self.reset()
            await self.delay_game()
    
            
    async def check_winner(self):
        if len(self.player) != 2:
            print("error Player != 2")
            
        for p in self.player:
            if p.get_score() >= self.score_to_win:
                self.reset()
                self._running = False
                res = await create_history(self, p)
                await self.channels.group_send(
                    self.id,
                    {
                        'type': 'game.finish',
                        'winner': {
                            "name": p.get_name(),
                            # set game type ที่ comsumer
                        }
                    }
                )
    

    async def delay_game(self):
        await asyncio.sleep(0.3)

    async def reset(self):
        self.ball_position = {'x': 512, 'y': 300}
        self.ball_velocity = {'x': 1, 'y': 1}
        
    async def broadcase_score(self):
        await self.channels.group_send(
            self.id,
            {
                'type': 'game.score',
                'command': 'UPDATE_SCORE',
                'data': {
                    'left': self.player[0].get_score(),
                    'right': self.player[1].get_score()
                }
            }
        )

    def stop(self):
        self._running = False
        if self.task:
            self.task.cancel()
            self.task = None

    @property
    def running(self):
        return self._running


    def add_user(self, id):
        player_instance = Player(id)
        self.player.append(player_instance)

    def get_player(self, id) -> Player:
        try:
            player = [i for i in self.player if i.id == id][0]
        except IndexError:
            return None
        return player

    def set_player_paddle_state(self, id, key, state):
        """
        key = 38, 40, 37, 39, 87, 65, 83, 68
        """
        player = self.get_player(id)
        if not player:
            return
        if state == KEY_STATE['PRESS']:
            player.paddle.set_dy(self.key_value[key]['value'])
        else:
            player.paddle.set_dy(0)

    async def update_player_paddle(self):
        for player in self.player:
            player.update_paddle_position()

    def set_player(self, id, player_side, obj):
        player = self.get_player(id)
        if not player:
            return
        player.set_player_side(player_side)
        player.set_obj(obj)
        

        # Set Paddle
        if player.as_player == 1:
            player.create_paddle(24, 300)
        else:
            player.create_paddle(1000, 300)

    # All Check Code

    async def check(self):
        # Debug purpose
        self.check_player_paddle()
        # self.player[0].increase_score()
        # self.player[1].increase_score()
        await self.update_player_paddle()
        await self.broadcase_score()

    def check_player_paddle(self):
        for player in self.player:
            if player.paddle is None:
                raise ValueError("Player paddle is not set")

    async def update_player_paddle(self):
        for player in self.player:
            player.update_paddle_position()

    def handle_message(self, message):
        user = self.get_player(message['sender'])
        data = message.get('data', None)
        if user is None:
            return
        match message['command']:
            case 'PRESS':
                self.set_player_paddle_state(
                    user.id, data['key_code'], KEY_STATE['PRESS'])
            case 'RELEASE':
                self.set_player_paddle_state(
                    user.id, data['key_code'], KEY_STATE['RELASE'])
            case _:
                pass
