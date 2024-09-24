import * as constant from "./constants.js";

// Button - Hide & Visible Password
function togglePassword(inputPassword) {
  const type = inputPassword.getAttribute('type') === 'password' ? 'text' : 'password';
  inputPassword.setAttribute('type', type);
}

// function checkPassword() {
//   const password = document.getElementById("inputPassword");
//   const errMsg = document.getElementById("inputPasswordError");

//   errMsg.style.display = "block";
//   if (password.value.length < 8) {
//     errMsg.innerHTML = "Password must have at least 8 character";
//   } else {
//     errMsg.style.display = "none";
//   }
// }

// function checkConfirmPassword() {
//   const password = document.getElementById("inputPassword");
//   const confirmPassword = document.getElementById("inputConfirmPassword");
//   const errMsg = document.getElementById("inputConfirmPasswordError");

//   errMsg.style.display = "block";
//   if (password.value.length < 8) {
//     errMsg.innerHTML = "Password must have at least 8 character";
//   } else {
//     errMsg.style.display = "none";
//   }
// }
// Password must be the same!

window.togglePassword = togglePassword;
// window.checkPassword = checkPassword;

// For 2FA Popup
document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll(".input-box");

  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      if (input.value.length === 1) {
        if (index < inputs.length -1) {
          inputs[index + 1].focus();
        }
      }
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" && input.value.length === 0)
        if (index > 0) {
          inputs[index - 1].focus();
        }
    });
  });

});

// For Modal Profile
async function getProfileById(id) {
  try {
    const profile = document.getElementById("modal-friend-profile");
    const response = await fetchAPI("GET", constant.API_PROFILE_BY_ID + id);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const profileValue = await response.json();

    profile.querySelector("#friendDisplayName").innerHTML = profileValue["display_name"] || "";
    profile.querySelector("#friendBio").innerHTML = profileValue["bio"] || "";
    profile.querySelector("#friendEmail").innerHTML = profileValue["email"] || "";
    if (!profileValue["wins"] || !profileValue["losses"])
      profile.querySelector("#friendWinLose").innerHTML = "";
    else
      profile.querySelector("#friendWinLose").innerHTML = profileValue["wins"] + ":" + profileValue["losses"];
    profile.querySelector("#friendTotalPlay").innerHTML = profileValue["total_games_play"] || "";
    profile.querySelector("#friendTourWon").innerHTML = profileValue["tour_won"] || "";
    profile.querySelector("#friendTourPlay").innerHTML = profileValue["tour_play"] || "";
    profile.querySelector("#friendProfileImage").src = profileValue["image"]
      || "./static/svg/default-user-picture.svg";
  } catch (error) {
    console.error(error.message);
  }
}

window.getProfileById = getProfileById;