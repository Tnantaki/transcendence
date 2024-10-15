import * as constant from "../constants.js";
import { loadPage } from "../router.js";
import { fetchAPI } from "./api.js";

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const body = {
    username: formData.get("username"),
    password: formData.get("password"),
    remember: formData.get("remember") ? true : false,
  };

  try {
    const response = await fetchAPI("POST", constant.API_LOGIN, { body: body });

    if (!response.ok) {
      displayErr("#login-error", "error_login");
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Save token in browser cache
    localStorage.setItem("token", data.token);

    // Save my_id in browser cache
    const responseProfile = await fetchAPI("GET", constant.API_MY_PROFILE, { auth: true, });
    if (!responseProfile.ok) {
      throw new Error(`HTTP error! status: ${responseProfile.status}`);
    }
    const profileValue = await responseProfile.json();
    localStorage.setItem("my_id", profileValue.id);

    loadPage("/");
  } catch (error) {
    console.error(error.message);
    if (error.message === "Failed to fetch")
      displayErr("#login-error", "error_server");


    // Clear password input
    const inputPassword = loginForm.querySelector("#login-password");
    inputPassword.value = "";
  }
});

function displayErr(errId, error) {
  const errBlock = document.querySelector(errId);
  errBlock.previousElementSibling.style.marginBottom = "3px";
  errBlock.nextElementSibling.style.marginTop = "3px";

  const errMsg = errBlock.querySelector(`[data-i18n="${error}"]`);
  errMsg.style.display = "block";
}