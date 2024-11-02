from channels.db import DatabaseSyncToAsync
from rich import inspect

def create_query_param(obj):
    obj.param_tocheck = ['room_id', "token"]
    if not hasattr(obj, 'scope'):
        return None
    
    query_param = {
        k: v
        for (k,v) in [
            i.split("=") for i in obj.scope['query_string'].decode().split('&')
        ]
    }
    
    print(query_param.keys())
    missing_param = set(obj.param_tocheck) - query_param.keys()
    if missing_param:
        raise ValueError(f"Missing Query Param {','.join(missing_param)}")
    
    for k,v in query_param.items():
        if k in obj.param_tocheck:
            setattr(obj, k, v)
    return obj



async def connect(obj, scope):
    
    create_query_param(obj)
    
    
    
    