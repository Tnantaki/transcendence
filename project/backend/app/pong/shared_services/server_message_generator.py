from typing import Any
import json

def server_message_generator(
    command: str,
    data: Any,
):
    return json.dumps({
        'type': 'SERVER_MESSAGE',
        'command': command,
        'data': data
    })
