from channels.db import database_sync_to_async

@database_sync_to_async
def create(cls,*args, **kwargs):
    obj = cls.objects.create(*args, **kwargs)
    return obj