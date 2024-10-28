import json
from rich import print
from channels.layers import get_channel_layer


async def server_send_message(
    obj,
    code: int = 2000,
    command: str = "NULL",
    sender: str = "SERVER",
    data: dict = {},
    *arg,
    **kwargs,
):
    if not hasattr(obj, "send"):
        raise Exception("Object must have send method")
    send_ret = await obj.send(
        text_data=json.dumps(
            {
                "code": code,
                "command": command,
                "sender": sender,
                "data": data,
                **kwargs,
            }
        )
    )
    return send_ret


async def server_send_message_to_group(
    obj,
    code: int = 2000,
    command: str = "NULL",
    sender: str = "SERVER",
    data: dict = {},
    message_type: str = "tour.boradcast",
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
