from channels.db import database_sync_to_async
from pong.shared_services.utils.group_message import server_send_message_to_group

async def message_user_leave(obj):
    if hasattr(obj, "user") is False:
        return
    user_info = {
        "id": obj.user.id,
        "username": obj.user.username,
        "display_name": obj.user.display_name,
        "profile": obj.user.profile,
    }
    await server_send_message_to_group(
        obj,
        group=obj.room_group_name,
        command="USER_DISCONNECTED",
        data={"user": user_info},
    )


def user_leave_tour(obj):
    # Remove relationship from user and tour
    obj.tour.users.remove(obj.user)
    return obj


async def broadcast_onwer_leave(obj):
    await server_send_message_to_group(
        obj,
        group=obj.room_group_name,
        message_type="tournament.close",
        command="TOURNAMENT_CLOSED",
        data={
            'cause': 'OWNER_LEAVED'
        },
    )

async def tour_disconnect(obj):
    await message_user_leave(obj)
    if obj.is_owner:
        await broadcast_onwer_leave(obj)
    await obj.channel_layer.group_discard(obj.room_group_name, obj.channel_name)
    return obj
