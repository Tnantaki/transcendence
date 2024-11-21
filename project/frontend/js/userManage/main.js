import { loadPage } from "../router.js";
import { getMyProfile, logout } from "../services/profileService.js";
import { disconnetWebSocket } from "../liveChat/chatSocket.js";

renderMainProfile(document.getElementById("blockProfile"))
handlerLogout(document.getElementById("submitLogout"))

async function renderMainProfile(profileDOM) {
  const profile = await getMyProfile()
  if (!profile) return

  profileDOM.querySelector("#profilePicture").src = "api/" + profile["profile"]
    || "../static/svg/default-user-picture.svg";
  profileDOM.querySelector("#profileName").innerHTML = profile["display_name"] || "";
}

function handlerLogout(btnLogout) {
  btnLogout.addEventListener('click', async (event) => {
    if (event.target && event.target.id === 'submitLogout') {
      await logout()

      bootstrap.Modal.getInstance(document.getElementById("logoutModal")).hide()

      // Remove token and my_id in browser cache
      localStorage.removeItem("token");
      localStorage.removeItem("my_id");
      disconnetWebSocket()
      loadPage("/login");
    }
  }, { once: true });
}