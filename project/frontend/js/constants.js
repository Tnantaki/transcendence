export const BACKEND_URL = "http://localhost:8001/api";
export const FRONTEND_URL = "http://localhost:8001";
export const WS_URL = "ws://localhost:8001";

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

// WEBSOCKET
export const WS_TOUR_ROOM = WS_URL + "/room/tour";
// export const WS_CHAT_ROOM = WS_URL + "/room/chat";
export const WS_CHAT_ROOM = "ws://localhost:3000";

// MOCKUP API
export const MOCKUP_PROFILE = "./js/mock/mockProfile.json";
export const MOCKUP_FRIENDLIST = "./js/mock/mockFriendList.json";

// export const API_GET_USER_PROFILE = "../js/mock/mockProfiles.json";


