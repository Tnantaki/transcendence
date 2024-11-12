# รายการ Events ระหว่าง Server และ Client

## 1. การเชื่อมต่อและเตรียมเกม

### CONNECTED
เมื่อเชื่อมต่อกับเซิร์ฟเวอร์สำเร็จ
```json
{
    "code": 2000,
    "command": "CONNECTED",
    "sender": "SERVER",
    "data": {}
}
```

### ASSIGN_PLAYER
กำหนดหมายเลขและตำแหน่งผู้เล่น
- Player 1: ฝั่งซ้าย
- Player 2: ฝั่งขวา
```json
{
    "code": 2000,
    "command": "ASSIGN_PLAYER",
    "sender": "SERVER",
    "data": {
        "player": 1
    }
}
```

## 2. การเริ่มเกม

### COUNTDOWN
นับถอยหลังก่อนเริ่มเกม
```json
{
    "code": 2000,
    "command": "COUNTDOWN",
    "sender": "SERVER",
    "data": {
        "time": 3
    }
}
```

### GAME_START
เมื่อเกมเริ่มต้น
```json
{
    "code": 2000,
    "command": "GAME_START",
    "sender": "SERVER",
    "data": {}
}
```

## 3. ระหว่างการเล่น

### GAME_STATE
อัพเดทตำแหน่งลูกบอลและไม้ตีของผู้เล่น
```json
{
    "code": 2000,
    "command": "GAME_STATE",
    "sender": "SERVER",
    "data": {
        "ball_position": {
            "x": 512,
            "y": 300
        },
        "left_paddle": {
            "x": 24,
            "y": 300
        },
        "right_paddle": {
            "x": 1000,
            "y": 300
        }
    }
}
```

### UPDATE_SCORE
อัพเดทคะแนนของผู้เล่น
```json
{
    "code": 2000,
    "command": "UPDATE_SCORE",
    "sender": "SERVER",
    "data": {
        "left": 0,
        "right": 0
    }
}
```

### PLAYER_MOVE
รับคำสั่งการเคลื่อนที่จากผู้เล่น
```json
{
    "code": 2000,
    "command": "PLAYER_MOVE",
    "sender": "CLIENT",
    "data": {
        "key": 38,           // รหัสปุ่ม (38: ขึ้น, 40: ลง)
        "action": "PRESS"    // PRESS หรือ RELEASE
    }
}
```

## 4. การจบเกม

### GAME_FINISHED
เมื่อเกมจบ
```json
{
    "code": 2000,
    "command": "GAME_FINISHED",
    "sender": "SERVER",
    "data": {
        "winner": "player_id",
        "score": {
            "left": 5,
            "right": 3
        },
        "game_type": "VERSUS|TOURNAMENT",
        "redirect": "lobby|tournament",
        "tour_id": "tour_id_if_tournament"
    }
}
```

## 5. ข้อผิดพลาด

### ERROR
เมื่อเกิดข้อผิดพลาด
```json
{
    "code": 4000,
    "command": "ERROR",
    "sender": "SERVER",
    "data": {
        "message": "ข้อความแสดงข้อผิดพลาด"
    }
}
```