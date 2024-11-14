import json

from channels.generic.websocket import AsyncWebsocketConsumer
from rich import inspect, print
from chat.provider_chat.service import connect

# Consider as controller /ws/tournament
class ChatConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    async def connect(self):
        await connect.connect(self)
        
        await self.accept()

    async def disconnect(self, close_code):
        ...

    async def receive(self, text_data):
        await user_message_handler(self, text_data)

    async def send_message(self, command,  message):
        ...
        

    async def consumer_talk(self, event):
        """
        สำหรับ handle event ระหว่าง consumer กับ consumer
        """
        ...
    
    async def user_newmessage(self, event):
        # m = { k:v for k, v in event.items() if k != 'type'}
        # print(m)ฃ
        event['type'] = "SERVER_MESSAGE"
        await self.send(text_data=json.dumps(event))


from functools import wraps

# type command data
def validate_usermessage(*args, **kwarg):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                message = json.loads(args[1])
            except json.JSONDecodeError as e:
                raise ValueError(f'Invalid JSON {e}')
            result = func(*args, **kwarg)
            return result
        return wrapper
    return decorator
                

@validate_usermessage()
async def user_message_handler(obj, message):
    m = json.loads(message)

    match m['command']:
        case 'REQUEST_CHAT_LIST':
            await list_chat_room(obj, m)
        case 'OPEN_CHAT':
            await open_chat(obj, m)
        case 'LIST_USER_MESSAGE':
            ...
        case 'INVITE_PLAY_VERSUS':
            ...
        case 'ANSWER_INVITE':
            ...
        case 'SENT_MESSAGE':
            await send_message_to_user(obj, m)

async def send_message_to_user(obj, message):
    client = obj.user_id
    other = message['data']['recipient']
    text = message['data']['message']
    await get_or_create_chat_room(obj, message)
    
    # real-time-chat
    r = await get_channel_layer().group_send(
        other,
        {
            "type": "user.newmessage",
            "commnad": "NEW_MESSAGE",
            "data": {
                "sender": client,
                "message": text
            }
        }
    )
    s = await get_channel_layer().group_send(
        client,
        {
            "type": "user.newmessage",
            "commnad": "NEW_MESSAGE",
            "data": {
                "sender": client,
                "message": text
            }
        }
    )

    # looking for other user channel if open notifi it just noti when found 

from channels.db import database_sync_to_async
from chat.models import ChatRoom, Message
from django.contrib.auth import get_user_model
from channels.layers import get_channel_layer

@database_sync_to_async
def get_or_create_chat_room(obj, message):
    # get or create chat room
    # append new message
    user1 = obj.user_id
    user2 = message['data']['recipient']
    text = message['data']['message']
    title = [user1+user2, user2+user1]
    users = get_user_model().objects.filter(id__in=[user1, user2])
    room = ChatRoom.objects.filter(title__in=title).first()
    if room is None:
        room = ChatRoom.objects.create(title=title[0])
        room.users.add(*users)    
    Message.objects.create(
        message=text,
        sender=obj.user,
        recipient=users.filter(id=user2).first(),
        room=room
    )


# List chat room
async def list_chat_room(obj, message):
    rooms = await get_chat_room(obj) 
    message = {
        'type': 'SERVER_MESSAGE',
        'command': 'LIST_MESSAGE_BOX',
        'data': rooms
    }
    await obj.send(text_data=json.dumps(message))

# เปิด chat ที่เคยคุย
async def open_chat(obj, message):
    """
    List unread 
    """
    client = obj.user_id
    other = message['data']['user_id']
    m = await get_message(client, other)
    # is_read convert to true
    await set_message_read(client, other)
    message = {
        'type': 'SERVER_MESSAGE',
        'command': 'LIST_USER_MESSAGE',
        'data': m
    }
    await obj.send(text_data=json.dumps(message))

@database_sync_to_async
def set_message_read(client, other):
    room_title = [client+other, other+client]
    message = Message.objects.filter(
        room__title__in=room_title,
        recipient_id=client,
    ).update(is_read=True)
    return message

@database_sync_to_async
def get_message(client, other):
    room_title = [client+other, other+client]
    message = Message.objects.filter(
        room__title__in=room_title
    ).order_by('created')
    return[{
        'sender': i.sender.get_display_dict(),
        'recipient': i.recipient.get_display_dict(),
        'message': i.message,
        'created':i.created.isoformat(),
        'is_read': i.is_read,
    } for i in message
    ]


    

@database_sync_to_async
def get_chat_room(obj):
    client = obj.user_id
    rooms = ChatRoom.objects.filter(
        title__contains = client
    )
    room_list = [{
        'title': room.title,
        'user': [u.get_display_dict() for u in room.users.all() if u.id != client],
        'is_read': room.message_set.filter(is_read=False).first() is None
    }   for room in rooms
    ]
    
    return room_list