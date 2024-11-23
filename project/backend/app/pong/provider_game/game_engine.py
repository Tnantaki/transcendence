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
import math

KEY_STATE = {"RELASE": 0, "PRESS": 1}

PADDLE_BASE_VELO = 5
KEY_VALUE = {
    38: {"code": "UP", "value": -PADDLE_BASE_VELO, "STATE": KEY_STATE["RELASE"]},
    40: {"code": "DOWN", "value": PADDLE_BASE_VELO, "STATE": KEY_STATE["RELASE"]},
    37: {"code": "LEFT", "value": -PADDLE_BASE_VELO, "STATE": KEY_STATE["RELASE"]},
    39: {"code": "RIGHT", "value": PADDLE_BASE_VELO, "STATE": KEY_STATE["RELASE"]},
    87: {"code": "W", "value": -PADDLE_BASE_VELO, "STATE": KEY_STATE["RELASE"]},
    65: {"code": "A", "value": PADDLE_BASE_VELO, "STATE": KEY_STATE["RELASE"]},
    83: {"code": "S", "value": PADDLE_BASE_VELO, "STATE": KEY_STATE["RELASE"]},
    68: {"code": "D", "value": PADDLE_BASE_VELO, "STATE": KEY_STATE["RELASE"]},
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
        """ """
        if hasattr(self, "_is_init"):
            return None
        self.MAX_VELOCITY_SIZE = 40
        self.START_POSTSITION = {"x": 512, "y": 300}
        self.INIT_BALL_DIRECTION = {"x": 1, "y": 0}
        self.INIT_BALL_SPEED = 10
        self.BALL_SPEED_INCS = 1
        self.TIME_PER_FRAME = 0.016  # 1 sec / 60 FRAME
        self.PADDLE_SIZE = 10  # px
        self.CANVA_WIDTH = 1024  # px
        self.CANVA_HEIGHT = 600  # px
        self.LEFT_PADDLE_START_POSITION = {"x": 24, "y": 250}
        self.RIGHT_PADDLE_START_POSITION = {"x": 1000, "y": 250}
        self.BALL_RADIUS = 10
        # CANVA boundary
        self.TOP_BOUNDARY = self.CANVA_HEIGHT
        self.BOTTOM_BOUNDARY = 0
        self.RIGHT_BOUNDARY = self.CANVA_WIDTH
        self.LEFT_BOUNDARY = 0

        self.ball_position = self.START_POSTSITION
        self.ball_velocity = self.get_speed_vector(
            self.INIT_BALL_DIRECTION, self.INIT_BALL_SPEED
        )
        self.player: list[Player] = []
        self.room_id = room_id

        self.channels = get_channel_layer()
        self.id = id
        self.score_to_win = 1
        self._running = asyncio.Event()
        self.speed_size = self.INIT_BALL_SPEED
        self.hit = 0

        self.key_value = deepcopy(KEY_VALUE)
        self._is_init = True
        self.game_type = "VERSUS"
        self.LOG = []
        self.MAINTAIN_LOG = {}

    def __str__(self):
        return f"game_engine_for_group:{self.id}"

    def push_log(self, msg):
        # self.LOG.append(msg)
        # if len(self.LOG) > 30:
        #     self.LOG.pop(0)
        # print(msg)
        ...

    def save_log(self):
        self.MAINTAIN_LOG[len(self.MAINTAIN_LOG)] = deepcopy(self.LOG)
        self.LOG = []

    def get_speed_vector(self, direction, size):
        norm = math.sqrt(direction["x"] ** 2 + direction["y"] ** 2) / size
        direct = {"x": direction["x"] / norm, "y": direction["y"] / norm}
        return direct

    async def cale_ball_position(self):
        left_paddle = self.player[0].paddle
        right_paddle = self.player[1].paddle

        ball_prev_x = self.ball_position["x"]
        ball_prev_y = self.ball_position["y"]
        ball_next_x = self.ball_position["x"] + self.ball_velocity["x"]
        ball_next_y = self.ball_position["y"] + self.ball_velocity["y"]


        # Check ball pass paddle or not
        if (
            ball_prev_x <= right_paddle.x <= ball_next_x
            or ball_next_x <= left_paddle.x <= ball_prev_x
        ):
            try:
                ball_m = (ball_next_x - ball_prev_x) / (ball_next_y - ball_prev_y)
            except ZeroDivisionError:
                ball_m = 0
            ball_const = ball_m * ball_next_x - ball_next_y

            # ball at y = m * X + b
            # if x = 24 lenght y_min < |Y| < y_max
            # if ball_prev_x < |x_focus|  < ball_next_x
            ball_will_hit_l_at_y = abs(ball_m * left_paddle.x + ball_const)
            ball_will_hit_r_at_y = abs(ball_m * right_paddle.x + ball_const)
            self.ball_position["x"] = ball_next_x
            if (
                left_paddle.y
                < ball_will_hit_l_at_y
                < left_paddle.y + left_paddle.height
                and self.ball_velocity["x"] < 0
            ):
                # HIT Paddle
                self.ball_position["x"] = left_paddle.x + left_paddle.width + self.BALL_RADIUS / 2
                self.ball_velocity["x"] = abs(self.ball_velocity["x"])
            elif (
                right_paddle.y
                < ball_will_hit_r_at_y
                < right_paddle.y + right_paddle.height
                and self.ball_velocity["x"] > 0
            ):
                # HIT Paddle
                self.ball_position["x"] = right_paddle.x - self.BALL_RADIUS / 2
                self.ball_velocity["x"] = -abs(self.ball_velocity["x"])

        # IF NOT HIIT
        else:
            self.ball_position["x"] = ball_next_x
            if self.ball_position["y"] >= 600 or self.ball_position["y"] <= 0:
                self.ball_velocity["y"] = -1 * self.ball_velocity["y"]

        self.ball_position["y"] = ball_next_y

        

    async def update_game_state(self):
        game_state = {
            "ball_position": self.ball_position,
            "left_paddle": self.player[0].get_position(),
            "right_paddle": self.player[1].get_position(),
        }
        await self.channels.group_send(
            self.id, {"type": "game.state", "game_state": game_state}
        )

    def run(self, loop):
        if not self._running.is_set():
            self._running.set()
            self.task = loop.create_task(self.start())

    async def start(self):
        await asyncio.sleep(0.5)
        while self._running.is_set():
            await self.cale_ball_position()
            await self.update_player_paddle()
            await self.check_ball_score()
            await self.update_game_state()
            await self.check_winner()
            await asyncio.sleep(self.TIME_PER_FRAME)

    async def check_ball_score(self):
        if self.ball_position["x"] > 1025:
            prepost = self.ball_position
            prevelo = self.ball_velocity
            self.reset()
            self.hit = 0
            self.speed_size = 1
            self.player[0].increase_score()
            self.player[0].set_block_inc(True)
            await self.broadcase_score(prepost, prevelo)
            self.player[0].set_block_inc(False)
            self.reset()
            await self.delay_game()

        if self.ball_position["x"] < 0:
            prepost = self.ball_position
            prevelo = self.ball_velocity
            self.reset()
            self.hit = 0
            self.speed_size = 1
            self.player[1].increase_score()
            self.player[1].set_block_inc(True)
            await self.broadcase_score(prepost, prevelo)
            self.player[1].set_block_inc(False)
            self.reset()
            await self.delay_game()

    def increse_velocity(self, size):
        x = self.ball_velocity["x"]
        y = self.ball_velocity["y"]
        norm = (x * x + y * y) ** 0.5
        new_x = (x / norm) * size
        new_y = (y / norm) * size
        self.ball_velocity = {"x": new_x, "y": new_y}

    async def check_winner(self):
        if len(self.player) != 2:
            print("error Player != 2")

        for p in self.player:
            if p.get_score() >= self.score_to_win:
                self.reset()
                self._running.clear()
                res = await create_history(self, p)
                await self.channels.group_send(
                    self.id,
                    {
                        "type": "game.finish",
                        "winner": {
                            "name": p.get_name(),
                            # set game type ที่ comsumer
                        },
                    },
                )

    async def delay_game(self):
        await asyncio.sleep(0.3)

    def random_ball_velocity(self):
        # สุ่มความเร็วระหว่าง 3-5
        speed_x = random.uniform(3, 5)
        speed_y = random.uniform(3, 5)
        self.norm = (speed_x * speed_x + speed_y * speed_y) ** 0.5
        # สุ่มทิศทาง (ซ้าย/ขวา)
        direction_x = random.choice([-1, 1])
        direction_y = random.choice([-1, 1])

        speed_x = speed_x / self.norm * self.speed_size
        speed_y = speed_y / self.norm * self.speed_size

        return {"x": speed_x * direction_x, "y": speed_y * direction_y}

    async def reset(self):
        self.ball_position = {"x": 512, "y": 300}
        # self.ball_velocity = self.random_ball_velocity()
        self.ball_velocity = {"x": 1, "y": 0}

    async def broadcase_score(self, pos, velo):
        await self.channels.group_send(
            self.id,
            {
                "type": "game.score",
                "command": "UPDATE_SCORE",
                "data": {
                    "left": self.player[0].get_score(),
                    "right": self.player[1].get_score(),
                    "ball_position": pos,
                    "ball_velocity": velo,
                },
            },
        )

    def stop(self):
        self._running.clear()
        if self.task:
            self.task.cancel()
            self.task = None

    @property
    def running(self):
        return self._running.is_set()

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
        if state == KEY_STATE["PRESS"]:
            player.paddle.set_dy(self.key_value[key]["value"])
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
            player.create_paddle(**self.LEFT_PADDLE_START_POSITION)
        else:
            player.create_paddle(**self.RIGHT_PADDLE_START_POSITION)

    async def check(self):
        prepost = self.ball_position
        prevelo = self.ball_velocity
        # Debug purpose
        self.check_player_paddle()
        # self.player[0].increase_score()
        # self.player[1].increase_score()
        await self.update_player_paddle()
        await self.broadcase_score(prepost, prevelo)

    def check_player_paddle(self):
        for player in self.player:
            if player.paddle is None:
                raise ValueError("Player paddle is not set")

    async def update_player_paddle(self):
        for player in self.player:
            player.update_paddle_position()

    def handle_message(self, message):
        user = self.get_player(message["sender"])
        data = message.get("data", None)
        if user is None:
            return
        match message["command"]:
            case "PRESS":
                self.set_player_paddle_state(
                    user.id, data["key_code"], KEY_STATE["PRESS"]
                )
            case "RELEASE":
                self.set_player_paddle_state(
                    user.id, data["key_code"], KEY_STATE["RELASE"]
                )
            case _:
                pass
