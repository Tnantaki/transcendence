from functools import wraps
import json
from pong.provider_tournament.tournament_engine import broadcast_info


ALLOWED_EVENT_COMMAND = [
    'START_GAME',
]


def user_tournament_event_handler_arg_check(*args, **kwargs):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                eve = json.loads(args[1])
                print(eve)
            except json.JSONDecodeError as e:
                raise ValueError(f'Invalid JSON {e}')
            if 'command' not in eve:
                raise ValueError(f'Invalid Event {e}')
            if (eve['command'] not in ALLOWED_EVENT_COMMAND):
                raise ValueError(
                    f"Unknow Client-to-Server command {eve['command']}")
            result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@user_tournament_event_handler_arg_check()
async def user_tournament_event_handler(obj, event):
    """
    ```
    {
        "type": "CLIENT_MESSAGE",
        "command": "COMMAND",
        "data": {}
    }
 ```
 ```
{"type": "CLIENT_MESSAGE","START_GAME": "COMMAND","data": {}}
 ```
    """
    message = json.loads(event)
    
    match message['command']:
        case 'START_GAME':
            # {"type": "CLIENT_MESSAGE","command": "START_GAME","data": {}}
            await obj.tour_engine.start_tournament(obj.user_id)