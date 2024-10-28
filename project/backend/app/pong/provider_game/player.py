from pong.provider_game.paddle import Paddle

class Player:
    def __init__(self, id):
        self.paddle = None
        self.id = id
        self.allow_key = None
        self.as_player = None
        self.score = 0
        self.canvas_x = 1024
        self.canvas_y = 600

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
        self.score += 1

    def update_paddle_position(self):
        """
        Let paddle move itself
        """
        self.paddle.update_position(0, self.canvas_x, 0, self.canvas_y)