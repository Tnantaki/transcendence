### User at waiting room
USER_CONNECTED
USER_DISCONNECTD
USER_MESSAGE
TOURNAMENT_CAN_START


### Consumer - Client
```json
{
    "type": "SERVER_MESSAGE",
    "command": "COMMAND",
    "data": {}
}
```
- `TOURNAMENT_INFO`
```python
{
    'type': 'SERVER_MESSAGE',
    'command': 'TOURNAMENT_INFOMATION',
    'data': {
        'id': 'Tournament_GROUP_81pqnilcqm72jsi3rei5qb8r',
        'user_count': 2, 
        'user': [
            {
                'id': '_ErGHoeSEtpgs6VzIGAomq2v',
                'username': 'millerraymond',
                'is_owner': True, 'display_name': '',
                'profile': '/asset/img/default.jpg'
            },
            {
                'id': 'HwowLCHvXVjtoqSVz4G-vnBg',
                'username': 'harrisbrad',
                'is_owner': False,
                'display_name': '',
                'profile': '/asset/img/default.jpg'
            }
        ],
        'can_start': False
    }
}
```
- `ROUND_START`
```python
{
    'type': 'SERVER_MESSAGE',
    'command': 'ROUND_START',
    'data': [
        {
            'player1': {
                'id': '_ErGHoeSEtpgs6VzIGAomq2v',
                'username': 'millerraymond',
                'is_owner': True,
                'display_name': '',
                'profile': '/asset/img/default.jpg'
            },
            'player2': {
                'id': 'IdMHFPw7idOy8cSh_6-wjrFN',
                'username': 'ljones',
                'is_owner': False,
                'display_name': '',
                'profile': '/asset/img/default.jpg'
            },
            'status': 'WAITING',
            'winner': None,
            'room_id': 380
        },
        {
            'player1': {
                'id': '-WYMm0g6p-tFUIQZCIxb7m_Y',
                'username': 'stephaniegordon',
                'is_owner': False,
                'display_name': '',
                'profile': '/asset/img/default.jpg'
            },
            'player2': {
                'id': 'HwowLCHvXVjtoqSVz4G-vnBg',
                'username': 'harrisbrad',
                'is_owner': False,
                'display_name': '',
                'profile': '/asset/img/default.jpg'
            },
            'status': 'WAITING',
            'winner': None,
            'room_id': 381
        }
    ]
}
```



### consumer - consumer
- `TOURNAMENT_CAN_START` - message can start game
- `TOURNAMENT_CAN_NOT_START` - message can not start game


### client - consumer
- `START_GAME` - - lobby owner click start game
```json
{
    "type": "CLIENT_MESSAGE",
    "command": "START_GAME",
    "data": {}
}
```

