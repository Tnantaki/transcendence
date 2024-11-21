### รายการ Events สำหรับการแชท

- `SEND_MESSAGE` - ใช้สำหรับส่งข้อความไปยังผู้รับ
```json
{
    "type": "CLIENT_MESSAGE",      // ประเภทของข้อความ (ส่งจาก client)
    "command": "SENT_MESSAGE",     // คำสั่งที่ต้องการทำ
    "data": {
        "recipient": "_ErGHoeSEtpgs6VzIGAomq2v",  // ID ของผู้รับข้อความ
        "message": "message"       // เนื้อหาข้อความที่ต้องการส่ง
    }
}
```
```json
{
    "type": "CLIENT_MESSAGE",
    "command": "SENT_MESSAGE",
    "data": {
        "recipient": "_ErGHoeSEtpgs6VzIGAomq2v",
        "message": "message"
    }
}
```

- `OPEN_CHAT` - ใช้สำหรับเปิดหน้าต่างแชทกับผู้ใช้ที่ระบุ
```json
{
    "type": "CLIENT_MESSAGE",
    "command": "OPEN_CHAT",
    "data": {
        "user_id": "_ErGHoeSEtpgs6VzIGAomq2v"
    }
}
```


- `LIST_MESSAGE_BOX` - List chat room ที่เคย คุย
```json
{
    "type": "CLIENT_MESSAGE",
    "command": "LIST_MESSAGE_BOX",
    "data": {}
}
```


### หมายเหตุ:
- ทุก event จะต้องมี field `type` เป็น "CLIENT_MESSAGE" เพื่อระบุว่าเป็นข้อความที่ส่งจาก client
- `command` จะระบุประเภทของคำสั่งที่ต้องการทำ
- `data` จะเก็บข้อมูลที่จำเป็นสำหรับแต่ละคำสั่ง


- `INVITE_PLAY_VERSUS` - ชวนเล่นเกมส์
```json
{
    "type": "CLIENT_MESSAGE",
    "command": "INVITE_PLAY_VERSUS",
    "data": {
        "recipient": "_ErGHoeSEtpgs6VzIGAomq2v",
    }
}
```

- `GAME_INVITE` - ข้อความชวนเล่น
```json
{
    "type": "CLIENT_MESSAGE",
    "command": "GAME_INVITE",
    "data": {
        "sender": "_ErGHoeSEtpgs6VzIGAomq2v",
        "message": "Hello"
    }
}
```

- `GAME_CREATED_ROOM` - room ที่ให้เข้าเล่น
```json
{
    "type": "SERVER_MESSAGE",
    "command": "GAME_CREATED_ROOM",
    "data": {
        'id': 213
    }
}
```


- `ANSWER_INVITE` - ตอบรับคำชวน
```json
{
    "type": "CLIENT_MESSAGE",
    "command": "ANSWER_INVITE",
    "data": {
        "recipient": "_ErGHoeSEtpgs6VzIGAomq2v", 
        "answer": "YES" | "No",
    }
}
```
