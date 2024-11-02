from functools import wraps
from pong.provider_tournament.tournament_engine import broadcast_info, startRound

ALLOWED_EVENT_COMMAND = [
    'BROADCAST_INFO',
    'START_ROUND',
]


def tournament_event_handler_arg_check(*args, **kwargs):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            event = args[1]
            if hasattr(event, 'command'):
                raise ValueError(f'Invalid Event {event}')
            if (str(event['command']) not in ALLOWED_EVENT_COMMAND):
                raise ValueError(
                    f"Unknow Consumer-to-Consumer command {event['command']}")
            result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator


@tournament_event_handler_arg_check()
async def tournament_event_handler(obj, event):
    match event['command']:
        case 'BROADCAST_INFO':
            await broadcast_info(obj)
        case 'START_ROUND':
            await startRound(obj, event['data'])
        case _:
            raise ValueError(f"No case Support {event['command']}")
