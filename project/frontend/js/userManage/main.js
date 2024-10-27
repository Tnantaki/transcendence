import * as constant from "../constants.js";
import { loadPage } from "../router.js";
import { fetchAPI } from "./api.js";
import { getMyProfile } from "../services/profileService.js";

async function getProfile() {
  const profile = document.getElementById("blockProfile");
  const profileValue = await getMyProfile()

  profile.querySelector("#profilePicture").src = "api/" + profileValue["profile"]
    || "../static/svg/default-user-picture.svg";
  profile.querySelector("#profileName").innerHTML = profileValue["display_name"] || "";
}

async function submitLogout() {
  try {
    const response = await fetchAPI("POST", constant.API_LOGOUT, { auth: true });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Remove token and my_id in browser cache
    localStorage.removeItem("token");
    localStorage.removeItem("my_id");
  } catch (error) {
    console.error(error.message);
  }
  loadPage("/login");
}

const btnLogout = document.getElementById("submitLogout");

btnLogout.addEventListener('click', () => {
  submitLogout();
  const modal = bootstrap.Modal.getInstance(document.getElementById("logoutModal"));
  modal.hide();
});

getProfile();