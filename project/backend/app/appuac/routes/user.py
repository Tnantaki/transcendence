from ninja import Router, Path
from ninja.errors import HttpError
from appuac.models.user import (
    User,
    FriendRequest,
    FileUpload,
)
from ninja import UploadedFile
from appuac.schema.user import (
    SimpleRespond,
    UserSchema,
    UserAddIsFriend,
    UserPatchIn,
    UserPathParam,
    RegisterPostIn,
    AcceptFriend,
    FormRequestPathParam,
    FriendRequestS,
    FriendReceiveBaseOut,
    FriendRequestorBaseOut,
)
from django.db.models import Q

debug_router = Router()


router = Router()
open_router = Router()


@router.get(
    "/me/",
    response={
        200: UserSchema,
    },
)
def get_me(request):
    user = request.auth.user
    return 200, user


@router.get(
    "/user/{user_id}/",
    response={
        200: UserAddIsFriend,
    },
)
def get_user_by_id(request, path_param: UserPathParam = Path(...)):
    requestor = request.auth.user
    res_user = path_param.user
    
    ask = Q(requestor=requestor) & Q(receiver=res_user)
    ans = Q(receiver=requestor) & Q(requestor=res_user)
    is_friend = FriendRequest.objects.filter(ask | ans ).first()
    if is_friend is not None:
        res_user.is_friend = is_friend.status
    else:
        res_user.is_friend = "NOT_FRIEND"
    if res_user.id == requestor.id:
        res_user.is_friend = "ITS_ME"
    res = res_user
    return 200, res


@open_router.post(
    "/register/",
    response={
        201: UserSchema,
    },
)
def post_create_user(request, payload: RegisterPostIn):
    """
    Post Create User
    """
    user = User.objects.create_user(**payload.dict())
    return 201, user


@router.patch(
    "/me/",
    response={
        200: UserSchema,
    },
)
def patch_user_by_id(request, payload: UserPatchIn):
    """
    User Patch him self
    """
    user = request.auth.user
    d_payload = payload.dict(exclude_unset=True, exclude_none=True)
    if hasattr(d_payload, "password"):
        new_password = d_payload.pop('password')
        user.set_password(new_password)

    for k, v in d_payload.items():
        setattr(user, k, v)
    user.save()

    return 200, user


@router.post(
    "/me/profile/",
    response={200: UserSchema},
)
def post_upload_file(request, file: UploadedFile):
    """
    Upload Profile for User
    ถ้า user มีรูปอยู่แล้วจะไปลบรูปเก่า
    """
    user = request.auth.user
    if user.profile == "/asset/img/default.jpg":
        f = FileUpload.objects.create(
            title=user.id,
            file_db=file,
        )
    else:
        f = FileUpload.objects.get(title=user.id)
        f.file_db.delete()
        f.delete()
        f = FileUpload.objects.create(
            user=user,
            title=user.id,
            file_db=file,
        )
    user.profile = str(f.file_db.url)
    user.save()

    return 200, user


@router.get(
    "/user/",
    response={
        200: list[UserSchema],
    },
)
def get_all_user(request):
    return User.objects.all()

##################### FRIEND #######################


@router.post(
    "/friend-request/",
    response={
        201: SimpleRespond,
    },
)
def post_request_friend(request, payload: FriendRequestS):
    """
    ส่ง ID user ที่จะขอเป็นเพื่อน มา
    """

    req = request.auth.user
    f = FriendRequest.objects.filter(requestor=req, **payload.dict())
    if f.exists():
        raise HttpError(409, "ALREADY_EXIST")
    f = FriendRequest.objects.create(
        requestor=req,
        status="PENDING",
        **payload.dict(),
    )

    return 201, {"message": "FRIEND_REQUEST_HAS_BEEN_CREATE"}


@router.get(
    "/friend-request/",
    response={200: list[FriendReceiveBaseOut]},
)
def get_request_friend(request):
    """
    เชค ว่า ขอใครไปบ้าง
    """
    req = request.auth.user
    qs = FriendRequest.objects.filter(requestor=req)
    return 200, qs


@router.get(
    "/my-friend-request/",
    response={200: list[FriendRequestorBaseOut]},
)
def get_my_request_friend(request):
    """
    เชค ว่า ถูกใครขอบ้าง
    """
    req = request.auth.user
    qs = FriendRequest.objects.filter(receiver=req)
    return 200, qs




@router.post(
    "/accept-request/{form_id}/",
    response={
        200: FriendReceiveBaseOut,
    },
)
def post_accept_friend_request(
    request,
    payload: AcceptFriend,
    path_param: FormRequestPathParam = Path(...),
):
    """
    # Allow Status
    "ACCEPT", "REJECT"
    """
    user = request.auth.user
    form = path_param.form

    if form.receiver != user:
        raise HttpError(400, "UNAUTH")
    if form.status != "PENDING":
        raise HttpError(409, "UNABLE_TO_UPDATE")
    form.status = payload.dict()["status"]
    form.save()

    if form.status == "ACCEPT":
        form.requestor.friend.add(form.receiver)
        form.receiver.friend.add(form.requestor)

    return 200, form


@router.get(
    "/friend/",
    response={
        200: list[UserSchema],
    },
)
def get_friend_list(request):
    user = request.auth.user
    return user.friend


@router.delete(
    "/friend/{friend_id}/",
    response={
        204: None,
    },
)
def delete_friend(request, friend_id: str):
    user = request.auth.user
    friend_obj = User.objects.filter(id=friend_id).first()
    if friend_obj is None:
        raise HttpError(404, "USER_NOT_FOUND")
    user.friend.remove(friend_obj)
    friend_obj.friend.remove(user)
    FriendRequest.objects.filter(
        Q(requestor=user) & Q(receiver=friend_obj)
        | Q(requestor=friend_obj) & Q(receiver=user)
    ).delete()

    return 204, None
