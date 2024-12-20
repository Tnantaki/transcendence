

export const BACKEND_URL = "https://"+location.hostname+":4443/api";
export const FRONTEND_URL = "https://"+ location.hostname+":4443";
export const WS_URL = "wss://"+ location.hostname+":4443";

// API PROFILE
export const API_SIGNUP = BACKEND_URL + "/i/uac/register/";
export const API_LOGIN = BACKEND_URL + "/i/uac/login/";
export const API_LOGOUT = BACKEND_URL + "/i/uac/logout/";
export const API_MY_PROFILE = BACKEND_URL + "/i/uac/me/";
export const API_UPLOAD = BACKEND_URL + "/i/uac/me/profile/";
export const API_PROFILE_BY_ID = BACKEND_URL + "/i/uac/user/";

// API FRIEND
export const API_FRIEND_SENT_REQ = BACKEND_URL + "/i/uac/friend-request/";
export const API_FRIEND_GET_REQ = BACKEND_URL + "/i/uac/my-friend-request/";
export const API_FRIEND_LIST = BACKEND_URL + "/i/uac/friend/";
export const API_FRIEND_RES_REQ_BY_ID = BACKEND_URL + "/i/uac/accept-request/";
export const API_FRIEND_DEL_BY_ID = BACKEND_URL + "/i/uac/friend/";

// API HISTORY & LEADERBOARD
export const API_GET_LEADERBOARD = BACKEND_URL + "/i/game/leaderboard/";
export const API_GET_MATCH_HISTORY = BACKEND_URL + "/i/game/me/match-history/";

// API GAME
export const API_ROOM = BACKEND_URL + "/i/game/pong/room/";
export const API_CREATE_TOUR = BACKEND_URL + "/i/game/tournament/create/";
export const API_GET_TOUR = BACKEND_URL + "/i/game/tournament/";

// WEBSOCKET
export const WS_TOUR_ROOM = WS_URL + "/ws/tournament/";
export const WS_CHAT_ROOM = WS_URL + "/ws/chat/";

export const CONTAINER = {
  tourSocket: null
}