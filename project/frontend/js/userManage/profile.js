import * as constant from "../constants.js";
import { fetchAPI } from "./api.js";

const RED_CLR = '#B63A3A'
const GREEN_CLR = '#62E54C'


async function getProfile() {
  try {
    const profile = document.getElementById("my-profile");
    const response = await fetchAPI("GET", constant.API_MY_PROFILE, { auth: true, });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const profileValue = await response.json();

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

async function getFriendList() {
  try {
    const friendList = document.getElementById("friendList");
    const response = await fetchAPI("GET", constant.API_FRIEND_LIST, {
      auth: true,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const friendListValue = await response.json();

    friendListValue.forEach(friend => {
      const item = document.createElement("li");
      item.classList.add("friend-list-item");
      const clr = friend.is_online ? GREEN_CLR : RED_CLR
      item.innerHTML = `
        <div class="friend-item-picture">
          <img src="/api${friend.profile}" alt="profile picture">
        </div>
        <div class="d-flex align-items-center friend-item-name">
          <div class="online-status ms-0" style="background-color: ${clr};"></div>
          <p class="font-bs-bold fs-xl friend-name" data-bs-toggle="modal" data-bs-target="#profileModal" 
            onclick="getProfileById('${friend.id}')">
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