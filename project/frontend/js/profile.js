import { fetchFriendList, fetchProfileById, fetchUserProfile } from "./api.js";

console.log("Viewing Profile page.");

// match history
  // player1_id: int
  // player2_id: int
  // win_id: int
  // score1: int
  // score2: int
  // start_date: str
  // duration: int

// take id as parameter
// async function fetchMyProfile() {
//   const res = await fetch(constant.API_GET_MY_PROFILE);
// }

async function getProfile() {
  try {
    const profileValue = await fetchUserProfile();
    const profile = document.getElementById("my-profile");

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
    const profileValue = await fetchProfileById(id);
    const profile = document.getElementById("friend-profile");

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
    console.log("fetching Friend list data");
    const friendListValue = await fetchFriendList();
    const friendList = document.getElementById("friendList");

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

// window.profileFriend = profileFriend;