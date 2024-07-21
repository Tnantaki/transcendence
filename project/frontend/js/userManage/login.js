import * as constant from "../constants.js"
import { loadPage } from "../router.js";
import { fetchAPI } from "./api.js"

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
      const errMsg = loginForm.querySelector("#login-error");
      errMsg.previousElementSibling.style.marginBottom = "3px";
      errMsg.nextElementSibling.style.marginTop = "3px";
      errMsg.style.display = "block";
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    loadPage("/");
    console.log("Success:", data);
  } catch (error) {
    console.error(error.message);
    popOutText.style.display = "block";

    // Clear input
    event.target.querySelectorAll(".login-input").forEach((input) => {
      input.value = "";
    });
  }
});
