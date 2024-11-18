import { getMyProfile } from "../services/profileService.js";
import { getFriends } from "../services/friendService.js";

async function getProfile() {
  const profile = document.getElementById("my-profile");
  const profileValue = await getMyProfile()

  profile.querySelector("#displayName").innerHTML = profileValue["display_name"] || "";
  profile.querySelector("#bio").innerHTML = profileValue["bio"] || "";
  profile.querySelector("#email").innerHTML = profileValue["email"] || "";
  profile.querySelector("#winLose").innerHTML = profileValue["wins"] + ":" + profileValue["losses"];
  profile.querySelector("#totalPlay").innerHTML = profileValue["wins"] + profileValue["losses"];
  profile.querySelector("#tourWon").innerHTML = profileValue["tour_won"];
  profile.querySelector("#tourPlay").innerHTML = profileValue["tour_play"];
  profile.querySelector("#profileImage").src = "/api" + profileValue["profile"];
}

async function getFriendList() {
  const RED_CLR = '#B63A3A'
  const GREEN_CLR = '#62E54C'
  const friendList = document.getElementById("friendList");
  const friendListValue = await getFriends()

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
        <div class="d-flex justify-content-center">
          <img id="notiMsgBtn" class="icon-menu ic-md btn-hover me-3 my-3"
            src="../static/svg/chat.svg" alt="chat button" onclick="openChat('${friend.id}')">
        </div>
        <div class="friend-item-background"></div>
      `
    friendList.appendChild(item);
  })
}

getProfile();
getFriendList();