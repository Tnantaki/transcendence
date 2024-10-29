import * as constant from '../constants.js'
import { fetchAPI } from "../userManage/api.js";

async function getProfile(id) {
  try {
    const response = await fetchAPI("GET", constant.API_PROFILE_BY_ID + id + "/", { auth: true });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error.message);
  }
}

async function getMyProfile() {
  try {
    const response = await fetchAPI("GET", constant.API_MY_PROFILE, { auth: true, });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error.message);
  }
}

export {
  getProfile,
  getMyProfile
}