import json


class WebsocketHelperService:
    
    def __init__(self):
        pass
    
    async def set_exit_code(self, code, reason):
        self.exit_code = {"code": code, "reason": reason}
        await self.send(text_data=json.dumps(self.exit_code))
        await self.close()

    def create_textdata(message):
        return {"text_data": json.dumps(message)}

    def create_sever_textdata(message, data={}):
        return {
            "text_data": json.dumps(
                {"message": message, "sender": "SERVER", "data": data}
            )
        }

