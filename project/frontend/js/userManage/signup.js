import * as constant from "../constants.js";
import { loadPage } from "../router.js";
import { fetchAPI } from "./api.js";

console.log("Signup Page");

const signupForm = document.getElementById("signupForm");

function validateInput(input) {
  let returnValue = true;
  const regex = /^[a-zA-Z0-9_]{4,20}$/;

  if (!regex.test(input.username)) {
    displayErr("#username-error", "error_username_invalid");
    returnValue = false;
  }

  if (input.password !== input.password2) {
    displayErr("#password2-error", "error_confirm_password");
    returnValue = false;
  }
  return returnValue;
}

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearErrMsg(signupForm); // clear previous error message
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
    const response = await fetchAPI("POST", constant.API_SIGNUP, {
      body: body
    });

    if (!response.ok) {
      if (response.status === 409) { // data conflict
        displayErr("#username-error", "error_username_same");
      } else {
        hideErr("#username-error", "error_username_same");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    console.log("Signup Success");
    console.log(data);
    popupSuccess();
  } catch (error) {
    if (error.message === "Failed to fetch")
      displayErr("#password2-error", "error_server");
    console.error(error.message);
  }
});

function popupSuccess() {
  const modal = new bootstrap.Modal(document.getElementById("successCreateAccountModal"));
  modal.show();

  const btn = document.getElementById("btn-success");
  btn.addEventListener('click', () => {
    loadPage("/login");
  });
}

function displayErr(errId, error) {
  const errBlock = document.querySelector(errId);
  errBlock.previousElementSibling.style.marginBottom = "2px";

  const errMsg = errBlock.querySelector(`[data-i18n="${error}"]`);
  errMsg.style.display = "block";
}

function clearErrMsg(form) {
  const inputBlocks = form.querySelectorAll(".input-group-custom");
  inputBlocks.forEach(block => {
    block.style.marginBottom = "var(--mg-xl)";
    const errMsgs = block.nextElementSibling.querySelectorAll("p");
    errMsgs && errMsgs.forEach(errMsg => {
      errMsg.style.display = "none";
    });
  });
}