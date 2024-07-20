import * as constant from "./constants.js"
import { fetchAPI } from "./api.js"

async function getProfile() {
  try {
    const profile = document.getElementById("my-profile");
    const profileValue = await fetchAPI("GET", constant.API_USER_PROFILE, {
      auth: false,
    }); // TODO: auth must be true

    profile.querySelector("#avatarName").innerHTML = profileValue["avatar_name"];
    profile.querySelector("#bio").innerHTML = profileValue["bio"];
    profile.querySelector("#email").innerHTML = profileValue["email"];
    profile.querySelector("#winLose").innerHTML = profileValue["wins"] + ":" + profileValue["losses"];
    profile.querySelector("#totalPlay").innerHTML = profileValue["total_games_play"];
    profile.querySelector("#tourWon").innerHTML = profileValue["tour_won"];
    profile.querySelector("#tourPlay").innerHTML = profileValue["tour_play"];
    profile.querySelector("#profileImage").src = profileValue["image"];
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
  }
}

async function getProfileById(id) {
  try {
    const profile = document.getElementById("friend-profile");
    const profileValue = await fetchAPI("GET", constant.API_PROFILE_BY_ID + id);

    profile.querySelector("#friendAvatarName").innerHTML = profileValue["avatar_name"];
    profile.querySelector("#friendBio").innerHTML = profileValue["bio"];
    profile.querySelector("#friendEmail").innerHTML = profileValue["email"];
    profile.querySelector("#friendWinLose").innerHTML = profileValue["wins"] + ":" + profileValue["losses"];
    profile.querySelector("#friendTotalPlay").innerHTML = profileValue["total_games_play"];
    profile.querySelector("#friendTourWon").innerHTML = profileValue["tour_won"];
    profile.querySelector("#friendTourPlay").innerHTML = profileValue["tour_play"];
    profile.querySelector("#friendProfileImage").src = profileValue["image"];
  } catch (error) {
    console.error("Failed to fetch friend profile:", error);
  }
}

async function getFriendList() {
  try {
    const friendList = document.getElementById("friendList");
    const friendListValue = await fetchAPI("GET", constant.API_FRIEND_LIST, {
      auth: false,
    }); // TODO: auth must be true

    friendListValue.forEach(friend => {
      const item = document.createElement("li");
      item.classList.add("friend-list-item");
      item.innerHTML = `
        <div class="d-flex justify-content-center friend-item-picture ">
          <img src="${friend.image}" alt="profile picture">
        </div>
        <div class="d-flex align-items-center friend-item-name">
          <div class="online-status ms-0"></div>
          <p class="font-bs-bold fs-xl friend-name" data-bs-toggle="modal" data-bs-target="#profileModal" 
            onclick="getProfileById(${friend.friend_id})">
            ${friend.avatar_name}
          </p>
        </div>
        <div class="friend-item-background"></div>
      `
      friendList.appendChild(item);
    })
  } catch (error) {
    console.error("Failed to fetch friend list profile:", error);
  }
}

getProfile();
getFriendList();
window.getProfileById = getProfileById;