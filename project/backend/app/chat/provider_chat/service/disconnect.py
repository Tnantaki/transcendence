from channels.db import database_sync_to_async
from pong.shared_services.utils.group_message import server_send_message_to_group

async def message_user_leave(obj):
    await server_send_message_to_group(
        obj,
        command="BROADCAST_INFO",
        message_type='consumer.talk',
    )

@database_sync_to_async
def user_leave_tour(obj):
    # Remove relationship from user and tour
    if not hasattr(obj, 'tour'):
        return 
    obj.tour.users.remove(obj.user)
    return obj


async def disconnect(obj):
    
    await obj.channel_layer.group_discard(obj.room_group_name, obj.channel_name)
    return obj
