import * as constant from '../constants.js'
import { fetchData } from "../userManage/api.js";

function getMatchHistory() {
  const url = constant.API_GET_MATCH_HISTORY
  const option = { auth: true}

  return fetchData('GET', url, option)
}

function getLeaderboard() {
  const url = constant.API_GET_LEADERBOARD
  const option = { auth: true}

  return fetchData('GET', url, option)
}

export {
  getMatchHistory,
  getLeaderboard
}