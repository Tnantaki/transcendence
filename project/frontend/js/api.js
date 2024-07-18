import * as constant from "./constants.js"

export async function fetchUserProfile() {
  // const token = localStorage.getItem("token");
  // if (!token) {
  //   throw new Error("Error: Can't get token.")
  // }

  try {
    const response = await fetch(constant.API_USER_PROFILE, {
      method: "GET",
      // headers: {
      //   Authorization: "Bearer " + token,
      // },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error: fetching user profile", error);
    throw error;
  }
}

export async function fetchFriendList() {
  // const token = localStorage.getItem("token");
  // if (!token) {
  //   throw new Error("Error: Can't get token.")
  // }

  try {
    const response = await fetch(constant.API_FRIEND_LIST, {
      method: "GET",
      // headers: {
      //   Authorization: "Bearer " + token,
      // },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error: fetching user profile", error);
    throw error;
  }
}

export async function fetchProfileById(id) {
  try {
    const response = await fetch(constant.API_PROFILE_BY_ID + id, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error: fetching user profile", error);
    throw error;
  }
}