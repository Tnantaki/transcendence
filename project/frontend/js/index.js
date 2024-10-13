import * as constant from "./constants.js";
import { setSelectLanguage } from "./i18n.js";
import { loadPage } from "./router.js";
import { fetchAPI } from "./userManage/api.js";

let friend_id_delete_target = ""

// Button - Hide & Visible Password
function togglePassword(inputPassword) {
  const type = inputPassword.getAttribute('type') === 'password' ? 'text' : 'password';
  inputPassword.setAttribute('type', type);
}

// Notification Friends
document.getElementById('notificationModal').addEventListener('shown.bs.modal', function () {
  getFriendRequest()
});

// Friends accect & decline button
async function responseFriendRequest(reqId, isAccept) {
  const status = isAccept ? 'ACCEPT' : 'REJECT'
  try {
    const response = await fetchAPI("POST", constant.API_FRIEND_RES_REQ_BY_ID + reqId + "/", {
      auth: true,
      body: { status: status }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    await response.json();
    getFriendRequest()
    loadPage(location.pathname)
  } catch (error) {
    console.error(error.message);
  }
}

// Delete friend
async function deleteFriendById() {
  try {
    const response = await fetchAPI("DELETE", constant.API_FRIEND_DEL_BY_ID + friend_id_delete_target + "/", {
      auth: true,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    loadPage(location.pathname)
  } catch (error) {
    console.error(error.message);
  }
}

window.togglePassword = togglePassword;
window.getProfileById = getProfileById;
window.responseFriendRequest = responseFriendRequest;
window.deleteFriendById = deleteFriendById;

// For 2FA Popup
document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll(".input-box");

  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      if (input.value.length === 1) {
        if (index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      }
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && input.value.length === 0)
        if (index > 0) {
          inputs[index - 1].focus();
        }
    });
  });

});

// For Modal Profile
async function getProfileById(id) {
  try {
    const profile = document.getElementById("modal-friend-profile");
    const response = await fetchAPI("GET", constant.API_PROFILE_BY_ID + id + "/", { auth: true });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const profileValue = await response.json();

    friend_id_delete_target = profileValue["id"]
    const total = profileValue["wins"] + profileValue["losses"]
    profile.querySelector("#friendDisplayName").innerHTML = profileValue["display_name"] || "";
    profile.querySelector("#friendBio").innerHTML = profileValue["bio"] || "";
    profile.querySelector("#friendEmail").innerHTML = profileValue["email"] || "";
    profile.querySelector("#friendWinLose").innerHTML = profileValue["wins"] + ":" + profileValue["losses"];
    profile.querySelector("#friendTotalPlay").innerHTML = profileValue["total_games_play"] || total.toString();
    profile.querySelector("#friendTourWon").innerHTML = profileValue["tour_won"];
    profile.querySelector("#friendTourPlay").innerHTML = profileValue["tour_play"];
    profile.querySelector("#friendProfileImage").src = "/api" + profileValue["profile"]
      || "./static/svg/default-user-picture.svg";
  } catch (error) {
    console.error(error.message);
  }
}


async function getFriendRequest() {
  try {
    const notiList = document.getElementById("notiList");
    // to reset friend request when close modal
    notiList.innerHTML = ''
    const response = await fetchAPI("GET", constant.API_FRIEND_GET_REQ, {
      auth: true,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const friendReqValue = await response.json();

    friendReqValue.forEach(req => {
      if (req.status === 'PENDING') {
        const item = document.createElement("li");
        item.classList.add("noti-list-item");
        item.innerHTML = `
          <div class="d-flex align-items-center">
            <div class="noti-item-picture">
              <img alt="profile-picture" src="api/${req.user.profile}">
            </div>
            <div class="d-flex flex-column">
              <p class="font-bs fs-lg" style="color: #A2B1B5;">${req.user.display_name}</p>
              <p class="font-bs fs-md" style="color: #0946A6;">Wants to be your friend</p>
            </div>
          </div>
          <div class="d-flex justify-content-evenly align-items-center">
            <button type="button" class="font-bs-bold btn btn-secondary m-0 fs-md"
              data-i18n="decline" onclick="responseFriendRequest('${req.id}', false)"></button>
            <button type="button" class="font-bs-bold btn btn-primary m-0 fs-md"
              data-i18n="accept" onclick="responseFriendRequest('${req.id}', true)"></button>
          </div>
        `
        notiList.appendChild(item);
      }
    })
    setSelectLanguage()
  } catch (error) {
    console.error(error.message);
  }
}
