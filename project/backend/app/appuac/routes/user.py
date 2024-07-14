from ninja import Router
from appuac.models.user import User
from ninja import Schema, ModelSchema

debug_router = Router()

class UserSchema(ModelSchema):
    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "date_joined", "id"]
        # exclude = ["password"]

router = Router()

@router.get(
    '/me/',
    response = {
        200: UserSchema,
    }
)
def get_me(request):
    user = request.auth.user
    return 200, user