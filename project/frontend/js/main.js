import * as constant from "./constants.js"
import { fetchAPI } from "./api.js"
import { loadPage } from "./router.js";

async function getProfile() {
  try {
    const profile = document.getElementById("blockProfile");
    const profileValue = await fetchAPI("GET", constant.API_USER_PROFILE, {
      auth: false,
    }); // TODO: auth must be true

    profile.querySelector("#profilePicture").src = profileValue["image"];
    profile.querySelector("#profileName").innerHTML = profileValue["avatar_name"];
    
  } catch (error) {
    console.error("Failed to fetch API:", error);
  }
}

async function submitLogout() {
  try {
    await fetchAPI("POST", constant.API_LOGOUT, { auth: true });

    localStorage.removeItem("token");
    console.log("Logout success");
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