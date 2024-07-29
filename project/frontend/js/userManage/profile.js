import * as constant from "../constants.js";
import { fetchAPI } from "./api.js";

async function getProfile() {
  try {
    const profile = document.getElementById("my-profile");
    const response = await fetchAPI("GET", constant.API_MY_PROFILE, { auth: true, });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const profileValue = await response.json();
    console.log("fetch profile success");

    profile.querySelector("#displayName").innerHTML = profileValue["display_name"] || "";
    profile.querySelector("#bio").innerHTML = profileValue["bio"] || "";
    profile.querySelector("#email").innerHTML = profileValue["email"] || "";
    profile.querySelector("#winLose").innerHTML = profileValue["wins"] + ":" + profileValue["losses"];
    profile.querySelector("#totalPlay").innerHTML = profileValue["wins"] + profileValue["losses"];
    profile.querySelector("#tourWon").innerHTML = profileValue["tour_won"];
    profile.querySelector("#tourPlay").innerHTML = profileValue["tour_play"];
    profile.querySelector("#profileImage").src = "/api" + profileValue["profile"];
  } catch (error) {
    console.error(error.message);
  }
}

async function getProfileById(id) {
  try {
    const profile = document.getElementById("friend-profile");
    const response = await fetchAPI("GET", constant.API_PROFILE_BY_ID + id);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const profileValue = await response.json();

    profile.querySelector("#friendDisplayName").innerHTML = profileValue["display_name"] || "";
    profile.querySelector("#friendBio").innerHTML = profileValue["bio"] || "";
    profile.querySelector("#friendEmail").innerHTML = profileValue["email"] || "";
    if (!profileValue["wins"] || !profileValue["losses"])
      profile.querySelector("#friendWinLose").innerHTML = "";
    else
      profile.querySelector("#friendWinLose").innerHTML = profileValue["wins"] + ":" + profileValue["losses"];
    profile.querySelector("#friendTotalPlay").innerHTML = profileValue["total_games_play"] || "";
    profile.querySelector("#friendTourWon").innerHTML = profileValue["tour_won"] || "";
    profile.querySelector("#friendTourPlay").innerHTML = profileValue["tour_play"] || "";
    profile.querySelector("#friendProfileImage").src = profileValue["image"]
      || "./static/svg/default-user-picture.svg";
  } catch (error) {
    console.error(error.message);
  }
}

async function getFriendList() {
  try {
    const friendList = document.getElementById("friendList");
    const response = await fetchAPI("GET", constant.MOCKUP_FRIENDLIST, {
      auth: false,
    }); // TODO: auth must be true

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const friendListValue = await response.json();

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
            onclick="getProfileById(${friend.id})">
            ${friend.display_name}
          </p>
        </div>
        <div class="friend-item-background"></div>
      `
      friendList.appendChild(item);
    })
  } catch (error) {
    console.error(error.message);
  }
}

getProfile();
getFriendList();
window.getProfileById = getProfileById;