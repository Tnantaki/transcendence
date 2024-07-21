import * as constant from "../constants.js"
import { fetchAPI } from "./api.js"
import { loadPage } from "../router.js";
import { translatePage } from "../i18n.js";

console.log("Signup Page");

const signupForm = document.getElementById("signupForm");

function validateInput(input) {
  const returnValue = true;
  const regex = /^[a-zA-Z0-9_]{6,20}$/;

  if (!regex.test(input.username)) {
    const errMsg = signupForm.querySelector("#username-error");
    errMsg.previousElementSibling.style.marginBottom = "2px";
    errMsg.style.display = "block";
    errMsg.setAttribute("data-i18n", "error_username_invalid");
    translatePage();
    returnValue = false;
  }

  if (input.password !== input.password2) {
    const errMsg = signupForm.querySelector("#password2-error");
    errMsg.previousElementSibling.style.marginBottom = "2px";
    errMsg.style.display = "block";
    returnValue = false;
  }
  return returnValue;
}

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);

  const input = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    password2: formData.get("password2"),
  };

  if (!validateInput(input)) {
    console.error("Invalid input!");
    return ;
  }

  const body = {
    username: input.username,
    password: input.password,
    email: input.email,
  };

  try {
    const response = await fetchAPI("POST", constant.API_SIGNUP, { body: body });

    if (!response.ok) {
      if (response.status === 409) { // data conflict
        const errMsg = signupForm.querySelector("#username-error");
        errMsg.previousElementSibling.style.marginBottom = "2px";
        errMsg.style.display = "block";
        errMsg.setAttribute("data-i18n", "error_username_same");
        translatePage();
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    console.log("Signup Success");
    console.log(data);
    loadPage("/login");
  } catch (error) {
    console.error(error.message);
  }
});
