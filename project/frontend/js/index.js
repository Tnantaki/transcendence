import { getProfile } from "./services/profileService.js";
import { setSelectLanguage } from "./i18n.js";
import { loadPage } from "./router.js";
import ChatRoom from "./liveChat/chatRoom.js";
import { createFriendRequest, createFriendResponse, deleteFriend, getFriendRequests } from "./services/friendService.js";

let friend_id_target = ""

window.togglePassword = togglePassword;
window.getProfileById = getProfileById;
window.responseFriendRequest = responseFriendRequest;
window.deleteFriendById = deleteFriendById;

// Button - Hide & Visible Password
function togglePassword(inputPassword) {
  const type = inputPassword.getAttribute('type') === 'password' ? 'text' : 'password';
  inputPassword.setAttribute('type', type);
}

// Notification Friends
document.getElementById('notificationModal').addEventListener('shown.bs.modal', function () {
  displayFriendRequests()
});
// Check noti Friend
export async function checkNofiFriend() {
  const notiBtn = document.getElementById("notiBtn");
  if (!notiBtn) return
  const friendReqValue = await getFriendRequests()

  const friendsPending = friendReqValue.filter(req => req.status === 'PENDING')
  if (friendsPending.length) {
    notiBtn.src = "../static/svg/noti-friend-have.svg"
  }
}


// Friends accect & decline button
async function responseFriendRequest(reqId, isAccept) {
  const status = isAccept ? 'ACCEPT' : 'REJECT'
  const data = { status: status }
  await createFriendResponse(reqId, data)
  displayFriendRequests()
  loadPage(location.pathname)
}

// Delete friend
async function deleteFriendById() {
  const id = friend_id_target
  await deleteFriend(id)
  loadPage(location.pathname)
}

// Add friend
async function addFriendById() {
  const data = { receiver_id: friend_id_target }
  await createFriendRequest(data)
  loadPage(location.pathname)
}

const addFriendBtn = document.getElementById('add-friend-btn')
addFriendBtn.addEventListener('click', addFriendById)

// For Modal Profile
async function getProfileById(id) {
  const profile = document.getElementById("modal-friend-profile");
  const profileValue = await getProfile(id)

  friend_id_target = profileValue["id"]
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

  const btnAdd = profile.querySelector('#add-friend-btn')
  const btnDel = profile.querySelector('#del-friend-btn')
  btnAdd.hidden = true
  btnDel.hidden = true
  if (profileValue.is_friend === 'ACCEPT') {
    btnDel.hidden = false
  } else if (profileValue.is_friend === 'NOT_FRIEND') {
    btnAdd.hidden = false
  }
}

async function displayFriendRequests() {
  const notiList = document.getElementById("notiList");
  // to reset friend request when close modal
  notiList.innerHTML = ''
  const friendReqValue = await getFriendRequests()

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
}
