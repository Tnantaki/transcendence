### SERVER - CLIENT
- `CONNECTED`
```
{'code': 2000, 'command': 'CONNECTED', 'data': {}}
```
เชื่่อมต่อสำเร็จ


- `ASSIGN_PLAYER`
```
{
   "code":2000,
   "command":"ASSIGN_PLAYER",
   "sender":"SERVER",
   "data":{
      "player":1
   }
}
```

- `GAME_START`
```
{'code': 2000, 'command': 'ASSIGN_PLAYER', 'sender': 'SERVER', 'data': {'player': 2}}
```

- `ASSIGN_PLAYER`
```
{
   "code":2000,
   "command":"ASSIGN_PLAYER",
   "sender":"SERVER",
   "data":{
      "player":2
   }
}
```
- player อยู่จอ 
    1 : ซ้าย
    2 : ขวา



- `COUNTDOWN`
```

```

- `GAME_FINISHED`
```
{
   "code": 2000,
   "command": "GAME_FINISHED",
   "sender": "SERVER",
   "data": {
      "winner": "player_id",
      "score": "string",
      "redirect": "lobby or tour",
   }
}
```