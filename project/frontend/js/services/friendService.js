import * as constant from '../constants.js'
import { fetchData } from "./api.js";

function getFriends() {
  const url = constant.API_FRIEND_LIST
  const option = { auth: true}

  return fetchData('GET', url, option)
}

function getFriend(id) {
  const url = constant.API_PROFILE_BY_ID + id + "/"
  const option = { auth: true}

  return fetchData('GET', url, option)
}

function getFriendRequests() {
  const url = constant.API_FRIEND_GET_REQ
  const option = { auth: true}

  return fetchData('GET', url, option)
}

function createFriendResponse(id,  data) {
  const url = constant.API_FRIEND_RES_REQ_BY_ID + id + "/"
  const option = { auth: true, body: data}

  return fetchData('POST', url, option)
}

function deleteFriend(id) {
  const url = constant.API_FRIEND_DEL_BY_ID + id + "/"
  const option = { auth: true }

  return fetchData('DELETE', url, option)
}

function createFriendRequest(data) {
  const url = constant.API_FRIEND_SENT_REQ
  const option = { auth: true, body: data}

  return fetchData('POST', url, option)
}

export {
  getFriends,
  getFriend,
  deleteFriend,
  getFriendRequests,
  createFriendRequest,
  createFriendResponse
}