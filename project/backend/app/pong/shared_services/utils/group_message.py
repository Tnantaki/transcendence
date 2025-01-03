import json
from rich import print
from channels.layers import get_channel_layer


async def server_send_message_to_group(
    obj,
    code: int = 2000,
    command: str = "NULL",
    sender: str = "SERVER",
    data: dict = {},
    message_type: str = "consumer.talk",
    group: str | list[str] | None = None,
    *arg,
    **kwargs,
):
    if not hasattr(obj, "channel_layer"):
        raise Exception("Object must have channel_layer")

    if group is None:
        group = obj.room_group_name
    layer = get_channel_layer()
    send_ret = await layer.group_send(
        group,
        {
            "type": message_type,
            "code": code,
            "command": command,
            "sender": sender,
            "data": data,
            **kwargs,
        },
    )
    return send_ret
