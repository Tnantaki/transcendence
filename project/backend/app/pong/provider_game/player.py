from pong.provider_game.paddle import Paddle
from channels.db import database_sync_to_async
from appuac.models.user import User

class Player:
    LEFT_SIDE = 1
    RIGHT_SIDE = 0

    def __init__(self, id):
        self.paddle = None
        self.id = id
        self.allow_key = None
        self.as_player = None
        self.score = 0
        self.canvas_x = 1024
        self.canvas_y = 600
        self.block = False
        self.obj = None

    def set_id(self, id):
        if id:
            raise ValueError("id is already set")
        self.id = id

    def set_accept_key(self, key):
        self.allow_key = key

    def get_position(self):
        return self.paddle.get_position()

    def set_player_side(self, side):
        self.as_player = side

    def create_paddle(self, x, y):
        self.paddle = Paddle(self.id, x, y)

    def get_score(self):
        return self.score

    def increase_score(self):
        if self.block:
            return 
        self.score += 1
    
    def set_obj(self, obj):
        self.obj = obj

    def update_paddle_position(self):
        """
        Let paddle move itself
        """
        self.paddle.update_position(0, self.canvas_x, 0, self.canvas_y)
    
    def get_name(self):
        if self.obj.display_name != "":
            return self.obj.display_name
        return self.obj.username
    
    def set_block_inc(self, block=True):
        self.block = block
    
    @database_sync_to_async
    def refresh_user(self):
        self.obj = User.objects.get(id=self.obj.id)
        