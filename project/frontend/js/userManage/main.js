import * as constant from "../constants.js";
import { loadPage } from "../router.js";
import { fetchAPI } from "./api.js";

async function getProfile() {
  try {
    const profile = document.getElementById("blockProfile");
    const response = await fetchAPI("GET", constant.API_MY_PROFILE, {
      auth: true
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const profileValue = await response.json();

    profile.querySelector("#profilePicture").src = "api/" + profileValue["profile"]
      || "../static/svg/default-user-picture.svg";
    profile.querySelector("#profileName").innerHTML = profileValue["display_name"] || "";
    
  } catch (error) {
    console.error(error.message);
  }
}

async function submitLogout() {
  try {
    const response = await fetchAPI("POST", constant.API_LOGOUT, { auth: true });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    localStorage.removeItem("token");
    console.log("Remove Token, Logout success");
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