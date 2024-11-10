import * as constant from '../constants.js'
import { fetchData, fetchUploadFile } from "../userManage/api.js";

function getProfile(id) {
  const url = constant.API_PROFILE_BY_ID + id + "/"
  const option = { auth: true}

  return fetchData('GET', url, option)
}

function getMyProfile() {
  const url = constant.API_MY_PROFILE
  const option = { auth: true}

  return fetchData('GET', url, option)
}

async function createProfilePicture(data) {
  try {
    const response = await fetchUploadFile("POST", constant.API_UPLOAD, {
      auth: true,
      body: data,
    });

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
  getMyProfile,
  createProfilePicture
}