import * as constant from "./constants.js"
import { fetchAPI } from "./api.js"

console.log("Signup Page");

const signupForm = document.getElementById("signupForm");

function validateInput(input) {
  const returnValue = true;
  const regex = /^[a-zA-Z0-9_]{6,20}$/;

  if (!regex.test(input.username)) {
    const errMsg = signupForm.querySelector("#username-error");
    errMsg.previousElementSibling.style.marginBottom = "2px";
    errMsg.style.display = "block";
    errMsg.innerHTML = "Alphabet or number, At least 6 character";
    returnValue = false;
  }

  if (!regex.test(input.avatarName)) {
    const errMsg = signupForm.querySelector("#avatarName-error");
    errMsg.previousElementSibling.style.marginBottom = "2px";
    errMsg.style.display = "block";
    errMsg.innerHTML = "Alphabet or number, At least 6 character";
    returnValue = false;
  }

  if (input.password !== input.password2) {
    const errMsg = signupForm.querySelector("#password2-error");
    errMsg.previousElementSibling.style.marginBottom = "2px";
    errMsg.style.display = "block";
    errMsg.innerHTML = "Password must be the same!";
    returnValue = false;
  }
  return returnValue;
}

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);

  const input = {
    username: formData.get("username"),
    avatarName: formData.get("avatarName"),
    password: formData.get("password"),
    password2: formData.get("password2"),
  };

  if (!validateInput(input)) {
    console.error("Invalid input!");
    return ;
  }

  // Create JSON object
  const body = {
    username: input.username,
    password: input.password,
    avatarName: input.avatarName,
  };

  try {
    const data = await fetchAPI("POST", constant.API_SINGUP, {
      auth: false,
      body: body,
    });

    console.log("Signup Success:", result);
    window.location.href = "/login";
  } catch (error) {
    console.error("Failed to fetch API:", error);
  }
});
