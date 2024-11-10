class Paddle:
    def __init__(self, id, x, y):
        self.id = id
        self.x = x
        self.y = y
        self.dx = 0
        self.dy = 0
        self.width = 24
        self.height = 100

    def update_position(self, x_min, x_max, y_min, y_max):
        """
        canvas 
        min_x is left
        min_y is top
        """
        if self.x + self.dx >= x_min and self.x + self.dx <= x_max:
            self.x += self.dx
        if self.y + self.dy >= y_min and self.y + self.dy <= y_max - self.height:
            self.y += self.dy

    def set_dx(self, dx):
        self.dx = dx

    def set_dy(self, dy):
        self.dy = dy

    def get_position(self):
        return {
            'x': self.x,
            'y': self.y,
        }
    
    def hit_area(self):
        return {
            'min_x': self.x,
            'max_x': self.x + self.width,
            'min_y': self.y,
            'max_y': self.y + self.height
        }

