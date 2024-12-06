from channels.db import database_sync_to_async
from pong.shared_services.utils.group_message import server_send_message_to_group
from pong.provider_tournament.service.connect import message_user_join

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
    obj.tour_engine.remove_instance(obj.user_id)
    obj.tour.users.remove(obj.user)
    return obj

async def set_new_owner(obj):
    if not hasattr(obj, 'tour'):
        return 
    has_new_owner = await obj.tour_engine.remove_instance(obj.user_id)
    if has_new_owner:
        await message_user_join(obj)
    
    return obj


async def tour_disconnect(obj):
    await set_new_owner(obj)
    await user_leave_tour(obj)
    await message_user_leave(obj)
    
    if not hasattr(obj, "is_init"):
        return obj
    
    await obj.channel_layer.group_discard(obj.room_group_name, obj.channel_name)
    return obj
